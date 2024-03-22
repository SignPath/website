---
main_header: Crypto Providers
sub_header: GPG
layout: resources
toc: true
show_toc: 3
description: Creating GPG signatures with SignPath
datasource: tables/crypto-providers
---

## General Instructions

This section provides information to use SignPath with any tool that uses GPG for signing.

### Overview

GnuPG does not directly support PKCS #11/Cryptoki but offers a ["Smart Card" interface](https://wiki.gnupg.org/SmartCard), normally used to access smart card or USB token based HSMs.

Here the [gnupg-pkcs11-scd](https://github.com/alonbl/gnupg-pkcs11-scd/) project comes into play, which uses the GnuPG smart card interface to adapt to a PKCS #11 Crypto Provider. This tool runs as a GnuPG smart card daemon which we use to connect GnuPG to the SignPath PKCS #11/Cryptoki Crypto Provider as shown in the following figure.

![Figure: GPG signing flow](/assets/img/resources/documentation_crypto_providers-GpgSigningFlow.svg)

### Setup

#### Configuring GnuPG {#configure-gnupg}

Both GnuPG (`gpg-agent.conf`) and gnupg-pkcs11-scd (`gnupg-pkcs11-scd.conf`) need to be set up to use the [SignPath Cryptoki Crypto Provider](/documentation/crypto-providers/cryptoki). See also the general [Crypto Provider configuration](/documentation/crypto-providers#crypto-provider-configuration) for more details.

For details how these files need to be configured and about the necessary dependencies, see `samples/Scenarios/Gpg` in the [Linux container samples](/documentation/crypto-providers#linux-docker-samples).

#### GPG Key Generation {#gpg-key-generation}

GPG has an own key format and therefore SignPath's X.509 certificates cannot be directly used. Instead you have to generate a GPG key which _references_ a SignPath certificate. This means creating a new GPG key which includes the RSA public key of a SignPath certificate and "links" the RSA private key (which resides in SignPath's HSMs). This is possible via a ["shadowed private key"](https://github.com/gpg/gnupg/blob/STABLE-BRANCH-2-2/agent/keyformat.txt#shadowed-private-key-format) stored within `$GNUPGHOME/private-keys-v1.d/<KeyGrip>.key` which basically references a SignPath project and signing policy slug within.

Although the RSA key is used from the SignPath certificate, GPG keys hold their own metadata like name, email and expiration date which need to be specified during the GPG key generation. As defaults we use `"SignPath <ProjectSlug> / <SigningPolicySlug>` for the full name,  `"<SigningPolicySlug>@<ProjectSlug>` as email and 1 year expiration.

As the SignPath X.509 certificate's issuer and validity time range is not used, you can use a separate self-signed certificate in SignPath with an arbitrary validity time range. Alternatively, you could also use your existing (public-trusted) code signing certificates.

The [Linux container samples](/documentation/crypto-providers#linux-docker-samples) contain scripts to generate a GPG key via `.\RunScenario.ps1 ... -Scenario GenerateGpgKey`. See `GenerateGpgKey.ps1` for details how the different commands are parametrized. In the same script the GPG key metadata defaults can be overridden.

The outcome of `GenerateGpgKey` is a GPG key, which is exported to `samples/Scenarios/Gpg/Keys` including the public key and a corresponding revocation certificate in the `openpgp-revocs.d` subdirectory.
The public key (`<Email>.public.pgp` file) needs to be transported to the system which should later perform the GPG signing operations.
Note that the shadowed private key file does not need to be transported as it can be restored by running the `SCD LEARN` command via `gpg-connect-agent` (see `FetchGpgKeyInfos` function in the Linux container samples).

During the GPG key generation two SignPath hash signing operations happen: One to self-sign the key and one to sign the revocation certificate.

#### Preparation

1. After configuring GnuPG, copy the generated public GPG key (`<Email>.public.pgp`) to the target system.
2. To restore the shadowed keys, `SCD LEARN` needs to be executed. For details, see the `UseSignPathCryptokiGpgConfiguration` function in the GPG scenario of the [Linux container samples](/documentation/crypto-providers#linux-docker-samples).
3. The GPG key needs to be imported. See the `ImportGpgKeys` function in the GPG scenario of the [Linux container samples](/documentation/crypto-providers#linux-docker-samples).

## GPG File Signing {#gpg-file-signing}

The [Linux container samples](/documentation/crypto-providers#linux-docker-samples) contain a full example to sign and verify a file with a detached signature (including the mentioned preparation steps) in `.\RunScenario.ps1 ... -Scenario GpgSignFile`. The used GPG key is referenced via its email address.

During `gpg --sign`, SignPath is called to perform a hash based signing operation with the _Project_ / _Signing Policy_ referenced in the shadowed private key. Note that the _OrganizationId_ and the _ApiToken_ still need to be passed to the SignPath Crypto Provider to authenticate the request.

## RPM Signing (Linux)

The [Linux container samples](/documentation/crypto-providers#linux-docker-samples) contain a full example to sign and verify a RPM file in `.\RunScenario.ps1 ... -Scenario SignRpm`. The used GPG key is referenced via its email address. See `SignRpm.ps1` for details.

During `rpm --addsign`, SignPath is called to perform a hash based signing operation with the _Project_ / _Signing Policy_ referenced in the shadowed private key. Note that the _OrganizationId_ and the _ApiToken_ still need to be passed to the SignPath Crypto Provider to authenticate the request.

## DEB Signing via dpkg-sig (Linux)

The [Linux container samples](/documentation/crypto-providers#linux-docker-samples) contain a full example to sign and verify a DEB file using _[dpkg-sig](https://manpages.debian.org/bullseye/dpkg-sig/dpkg-sig.1.en.html)_ in `.\RunScenario.ps1 ... -Scenario SignDeb`. The used GPG key is referenced via its email address. Note the passed default "sign role" value of `"builder"`.

During `dpkg-sig --sign`, SignPath is called to perform a hash based signing operation with the project / signing policy referenced in the shadowed private key. Note that OrganizationId and the ApiToken still need to be passed to the SignPath Crypto Provider to authenticate the request.

## Maven Artifact Signing (Linux)

The [Linux container samples](/documentation/crypto-providers#linux-docker-samples) contain a full example to build, sign and verify Maven artifacts using the _[Apache maven-gpg-plugin](https://maven.apache.org/plugins/maven-gpg-plugin/)_ in `.\RunScenario.ps1 ... -Scenario SignMaven`. The used GPG key is referenced via its email address.

During `mvn install`, SignPath is called to perform a hash based signing operations with the _Project_ / _Signing Policy_ referenced in the shadowed private key. Note that the _OrganizationId_ and the _ApiToken_ still need to be passed to the SignPath Crypto Provider to authenticate the request.
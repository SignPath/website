---
main_header: Crypto Providers
sub_header: GPG
layout: resources
toc: true
show_toc: 3
description: Creating GPG signatures with SignPath
---

## General Instructions

[Gnu Privacy Guard](https://gnupg.org/), also known as GPG or GnuPG, is an Open Source implementation of the OpenPGP standard. This section provides information about using GPG with SignPath, as well as some code signing tools that build on GPG.

### Overview

GnuPG does not directly support the PKCS #11/Cryptoki interface. The [gnupg-pkcs11-scd](https://github.com/alonbl/gnupg-pkcs11-scd/) project adds this capability as a daemon for the GnuPG ["Smartcard"](https://wiki.gnupg.org/SmartCard) interface.

![Figure: GPG signing flow](/assets/img/resources/documentation/crypto-providers/gpg-signing-flow.svg)

### Setup

#### Configuring GnuPG {#configure-gnupg}

Configure the [SignPath Cryptoki provider](/documentation/crypto-providers/cryptoki) for
* GnuPG in `gpg-agent.conf`
* gnupg-pkcs11-scd in `gnupg-pkcs11-scd.conf`

For more details see
* [Crypto Provider configuration](/documentation/crypto-providers#crypto-provider-configuration) documentation
* `samples/Scenarios/Gpg` in the [Linux container samples] (details about configuration and necessary dependencies)

#### Error logs {#gpg-error-logs}

In case you experience errors in the SignPath Cryptoki provider or `gnupg-pkcs11-scd`, you won't see any details in the console output (just generic error messages).

In this case you can inspect the following log file locations:
* SignPath Cryptoki logs: `samples/Scenarios/temp/SignPathLogs/*.log`
* `gnupg-pkcs11` logs: `samples/Scenarios/temp/gnupg-pkcs11-scd.log`
* GPG logs: `samples/Scenarios/temp/gpg-agent.log`

#### GPG Key Generation {#gpg-key-generation}

{:.panel.info}
> **GPG terminology: public keys**
>
> GPG uses the term _public key_ for a specific file format that includes the actual public key key, the holder's identity (name, email address), expiration, and other data. It is therefore more similar to a certificate than just a public key.
>
> This sometimes creates confusion about whether the term public key refers to just the public part of the cryptographic key pair, or an entire GPG public key.

To use GPG with SignPath, you need to create an X.509 certificate for the cryptographic key pair, and a separate GPG public key on your computer. The GPG public key will _contain_ the cryptographic public key from the certificate and _reference_ the private key, which will remain with SignPath.

The reference is implemented as a ["shadowed private key"](https://github.com/gpg/gnupg/blob/STABLE-BRANCH-2-2/agent/keyformat.txt#shadowed-private-key-format) and references a SignPath _project_ slug and _signing policy_ slug. (It is stored in `$GNUPGHOME/private-keys-v1.d/$KeyGrip.key` and can be restored from the GPG public key.)

{:.panel.tip}
> **Tip: Create a self-signed certificate in SignPath**
>
> We recommend that you create a self-signed certificate in SignPath for each GPG public key. While the certificate's metadata is not used, you might want to use similar values as for the GPG public key for clarity.
>
> However, technically you can use any code signing certificate, including those issued by Certificate Authorities, with arbitrary metadata

{:.panel.tip}
> **Sample code to create a GPG public key**
> 
> The [Linux container samples] contain scripts to generate a GPG key.
> 
> Usage: `.\RunScenario.ps1 ... -Scenario GenerateGpgKey`
> 
> The following defaults are used:
> * full name: `"SignPath $ProjectSlug / $SigningPolicySlug`
> * email: `"$SigningPolicySlug@$ProjectSlug`
> * expiration: 1 year
> 
> See `GenerateGpgKey.ps1` for details how the different commands are parameterized and to change defaults.
> 
> Result: 
> * A GPG key exported to `samples/Scenarios/Gpg/Keys` including the public key 
> * A corresponding revocation certificate in the `openpgp-revocs.d` subdirectory
> 
> GPG key generation causes two SignPath hash signing operations: 
> * self-sign the key 
> * sign the revocation certificate
>
> In case errors appear, check out the [error logs](#gpg-error-logs).

#### Prepare for signing

1. Copy the generated public GPG key (`$Email.public.pgp`) to the target system.
2. Execute `SCD LEARN` to restore the shadowed keys. For details, see the `UseSignPathCryptokiGpgConfiguration` function in the GPG scenario of the [Linux container samples].
3. Import the GPG key . See the `ImportGpgKeys` function in the GPG scenario of the [Linux container samples].

## Signing code with GPG

### GPG File Signing {#gpg-file-signing}

The [Linux container samples] contain a full example to sign and verify a file with a detached signature (including the mentioned preparation steps) in `.\RunScenario.ps1 ... -Scenario GpgSignFile`. The used GPG key is referenced via its email address.

During `gpg --sign`, SignPath is called to perform a hash based signing operation with the _Project_ / _Signing Policy_ referenced in the shadowed private key. Note that the _OrganizationId_ and the _ApiToken_ still need to be passed to the SignPath Crypto Provider to authenticate the request.

### RPM Signing (Linux)

The [Linux container samples] contain a full example to sign and verify a RPM file in `.\RunScenario.ps1 ... -Scenario SignRpm`. The used GPG key is referenced via its email address. See `SignRpm.ps1` for details.

During `rpm --addsign`, SignPath is called to perform a hash based signing operation with the _Project_ / _Signing Policy_ referenced in the shadowed private key. Note that the _OrganizationId_ and the _ApiToken_ still need to be passed to the SignPath Crypto Provider to authenticate the request.

### DEB Signing via dpkg-sig (Linux)

The [Linux container samples] contain a full example to sign and verify a DEB file using _[dpkg-sig](https://manpages.debian.org/bullseye/dpkg-sig/dpkg-sig.1.en.html)_ in `.\RunScenario.ps1 ... -Scenario SignDeb`. The used GPG key is referenced via its email address. Note the passed default "sign role" value of `"builder"`.

During `dpkg-sig --sign`, SignPath is called to perform a hash based signing operation with the project / signing policy referenced in the shadowed private key. Note that OrganizationId and the ApiToken still need to be passed to the SignPath Crypto Provider to authenticate the request.

### Maven Artifact Signing (Linux)

The [Linux container samples] contain a full example to build, sign and verify Maven artifacts using the _[Apache maven-gpg-plugin](https://maven.apache.org/plugins/maven-gpg-plugin/)_ in `.\RunScenario.ps1 ... -Scenario SignMaven`. The used GPG key is referenced via its email address.

During `mvn install`, SignPath is called to perform a hash based signing operations with the _Project_ / _Signing Policy_ referenced in the shadowed private key. Note that the _OrganizationId_ and the _ApiToken_ still need to be passed to the SignPath Crypto Provider to authenticate the request.

[Linux container samples]: /documentation/crypto-providers#linux-docker-samples
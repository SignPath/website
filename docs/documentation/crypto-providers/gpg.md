---
header: GPG
layout: resources
toc: true
show_toc: 3
description: Creating GPG signatures with SignPath
---

## Overview

[GNU Privacy Guard](https://gnupg.org/), also known as GPG or GnuPG, is an Open Source implementation of the OpenPGP standard. This section provides information about using GPG with SignPath, as well as some code signing tools that build on GPG.

### Using GnuPG with PKCS #11

GnuPG does not directly support the PKCS #11/Cryptoki interface. The [gnupg-pkcs11-scd](https://github.com/alonbl/gnupg-pkcs11-scd/) project adds this capability as a daemon for the GnuPG ["Smartcard"](https://wiki.gnupg.org/SmartCard) interface.

![Figure: GPG signing flow](/assets/img/resources/documentation/crypto-providers/gpg-signing-flow.svg)

## Setup

### Configuring GnuPG {#configure-gnupg}

Configure GnuPG to perform hash signing via SignPath:

* Configure the [SignPath Crypto Provider](/documentation/crypto-providers#crypto-provider-configuration)
* Configure `gnupg-pkcs11-scd` via `gnupg-pkcs11-scd.conf`
* Configure GnuPG (`gpg-agent`) to use `gnupg-pkcs11-scd`

These steps are performed by the `InitializeSignPathCryptoProviderGpgConfiguration` function in the `Samples/Scenarios/SignPathCryptoProviderHelpers.sh` script in the [Linux container samples].

### Error logs {#gpg-error-logs}

For `gnupg-pkcs11-scd`, `stdout` console output must be disabled. Use the log files for troubleshooting.

For the [Linux container samples], the following log file locations are configured:

* SignPath Cryptoki logs: `Samples/Scenarios/Work/Logs/SignPathLogs/*.log`
* `gnupg-pkcs11-scd` logs: `Samples/Scenarios/Work/Logs/gnupg-pkcs11-scd.log`
* GPG logs: `Samples/Scenarios/Work/Logs/gpg-agent.log`

### Prepare for signing {#prepare-signing}

1. Create a [GPG key in SignPath](/documentation/managing-certificates).
2. Create a [hash signing project and signing policy](/documentation/crypto-providers/#signpath-project-configuration) in SignPath.
3. Initialize GPG hash signing using the helper functions of `Samples/Scenarios/SignPathCryptoProviderHelpers.sh` of the [Linux container samples]:
    1. Use the `InitializeSignPathCryptoProviderGpgConfiguration` function to configure GPG and fetch the private key references.
    2. Import a specific key into the GPG key chain via the `ImportSignPathGpgPublicKey` function. This function returns the GPG key ID, which you can use to select the key in the later signing commands.

> **CI user ↔ signing policy assignment**
>
> We strongly recommend to use an **isolated CI user** for GPG signing, which is **assigned to exactly one signing policy as submitter**. Else the SignPath project / signing policy could not be determined unambiguously and GPG signing commands may fail with "signing failed: No secret key" errors.
>
> Background: When performing a GPG signing operation (e.g. `gpg --sign -u my-gpg-key@example.com`), a GPG _public key_ is selected. Internally (via `gnupg-pkcs11`), the corresponding SignPath project / signing policy is selected via the GPG key's _public key hash_ (a "keygrip" in the [GnuPG lingo](https://www.gnupg.org/documentation/manuals/gnupg/Glossary.html)). This means that when two or more signing policies are referencing _the same GPG key_, the signing policy cannot not be determined unambiguously and `gnupg-pkcs11` would just filter out these signing policies, resulting in "missing key" errors.
{:.panel.warning}

## Signing code with GPG

### GPG File Signing {#gpg-file-signing}

The [Linux container samples] contain a full example to sign and verify a file with a detached signature (including the mentioned preparation steps) within `Scenarios/Gpg/GpgSignFile.ps1`.

During `gpg --sign`, SignPath is called to perform a hash based signing operation. Note that the _OrganizationId_ and the _ApiToken_ still need to be passed to the SignPath Crypto Provider to authenticate the request.

### RPM Signing (Linux)

The [Linux container samples] contain a full example to sign and verify a RPM file within `Scenarios/RpmPackages/SignRpm.ps1`.

During `rpm --addsign`, SignPath is called to perform a hash based signing operation. Note that the _OrganizationId_ and the _ApiToken_ still need to be passed to the SignPath Crypto Provider to authenticate the request.

### DEB Signing via dpkg-sig (Linux)

The [Linux container samples] contain a full example to sign and verify a DEB file using _[dpkg-sig](https://manpages.debian.org/bullseye/dpkg-sig/dpkg-sig.1.en.html)_ within `Scenarios/DebPackages/SignDeb.ps1`. Note the passed default "sign role" value of `"builder"`.

During `dpkg-sig --sign`, SignPath is called to perform a hash based signing operation. Note that OrganizationId and the ApiToken still need to be passed to the SignPath Crypto Provider to authenticate the request.

### Maven Artifact Signing (Linux)

The [Linux container samples] contain a full example to build, sign and verify Maven artifacts using the _[Apache maven-gpg-plugin](https://maven.apache.org/plugins/maven-gpg-plugin/)_ within `Scenarios/Maven/SignMaven.ps1`. The used GPG key is referenced via its email address.

During `mvn install`, SignPath is called to perform a hash based signing operations. Note that the _OrganizationId_ and the _ApiToken_ still need to be passed to the SignPath Crypto Provider to authenticate the request.

[Linux container samples]: /documentation/crypto-providers#linux-docker-samples

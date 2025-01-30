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

## Setup {#prepare-signing}

### SignPath configuration

1. Create a [GPG key](/documentation/managing-certificates)
2. Create a [hash signing project and signing policy](/documentation/crypto-providers/#signpath-project-configuration) in SignPath

### Configure GPG for signing {#configure-gnupg}

Initialize GPG hash signing using the helper functions of `Samples/Scenarios/SignPathCryptoProviderHelpers.sh` of the [Linux samples]:

1. Call the `InitializeSignPathCryptoProviderGpgSigning` function to configure GPG and fetch the private key references
  * Configures the [SignPath Crypto Provider](/documentation/crypto-providers#crypto-provider-configuration)
  * Configures `gnupg-pkcs11-scd` via `gnupg-pkcs11-scd.conf`
  * Configures GnuPG (`gpg-agent`) to use `gnupg-pkcs11-scd`
2. Import a specific key into the GPG key chain via the `ImportSignPathGpgPublicKey` function (returns the GPG key ID for subsequent use in signing commands)

{:.panel.warning}
> **Use a dedicated CI user for each signing policy**
>
> We strongly recommend to use dedicated CI users for GPG signing, each **assigned to exactly one signing policy as submitter**. Otherwise the SignPath project and signing policy may not be determined unambiguously and GPG signing commands may fail with "signing failed: No secret key" errors.
>
> Background: When performing a GPG signing operation (e.g. `gpg --sign -u my-gpg-key@example.com`), a GPG _public key_ is selected. Internally (via `gnupg-pkcs11`), the corresponding SignPath project and signing policy are selected via the GPG key's _public key hash_ (a "keygrip" in [GnuPG lingo](https://www.gnupg.org/documentation/manuals/gnupg/Glossary.html)). This means that when two or more signing policies are referencing _the same GPG key_, the signing policy cannot not be determined unambiguously and `gnupg-pkcs11` would just filter out these signing policies, resulting in "missing key" errors.

## Signing code with GPG

The [Linux samples] contain complete example scripts (including all preparation steps) to sign and verify files using the following formats and tools:

| Format                  | Signing invocation     | Sample script                        | Note
|-------------------------|------------------------|--------------------------------------|---------
| GPG detached signature  | `gpg --sign`           | `Scenarios/Gpg/GpgSignFile.sh`     
| RPM (RedHat package)    | `rpmsign --resign`     | `Scenarios/RpmPackages/SignRpm.sh`  
| DEB (Debian package)    | [`dpkg-sig`]` --sign`  | `Scenarios/DebPackages/SignDeb.sh`   | "builder" is used as _sign role_
| Maven artifact          | `mvn install`          | `Scenarios/Maven/SignMaven.sh`       | Requires the [Maven GPG plugin]

While executing each signing tool, SignPath is called to perform a hash-based signing operation. Note that _OrganizationId_ and _ApiToken_ must be passed to the SignPath Crypto Provider to authenticate the request.

### Error logs {#gpg-error-logs}

For `gnupg-pkcs11-scd`, `stdout` console output must be disabled. Use the log files for troubleshooting.

For the [Linux samples], the following log file locations are configured:

* SignPath Cryptoki logs: `Samples/Scenarios/Work/Logs/SignPathLogs/*.log`
* `gnupg-pkcs11-scd` logs: `Samples/Scenarios/Work/Logs/gnupg-pkcs11-scd.log`
* GPG logs: `Samples/Scenarios/Work/Logs/gpg-agent.log`

[Linux samples]: /documentation/crypto-providers#linux-docker-samples
[`dpkg-sig`]: https://manpages.debian.org/bullseye/dpkg-sig/dpkg-sig.1.en.html
[Maven GPG plugin]: https://maven.apache.org/plugins/maven-gpg-plugin/
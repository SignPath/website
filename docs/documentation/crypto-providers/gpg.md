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

Initialize GPG hash signing using the helper function `InitializeSignPathCryptoProviderGpgSigning` of `Samples/Scenarios/SignPathCryptoProviderHelpers.sh` of the [Linux samples].

This function internally:
  * Configures the SignPath Crypto Provider with the given organization ID, API token, ...
  * Isolates GnuPG's home dir (`GNUPGHOME` env var) into a temp directory (=> isolates GnuPG configuration and key store).
  * Configure GPG and `gnupg-pkcs11-scd` and fetches the private key reference for the given project / signing policy.
  * Downloads and GPG public key for the given project and signing policy from SignPath.
  * Imports the GPG key and exposes its key ID as `GPG_KEY_ID` env var which can be used for later GPG invocations like, e.g. using `gpg -u "$GPG_KEY_ID" ...`
  * Installs a Bash EXIT trap which cleans up the isolated GPG configuration.

See [SignPath Crypto Providers](/documentation/crypto-providers/#crypto-provider-configuration) for additional configuration options like logging settings.

## Signing code with GPG

The [Linux samples] contain complete example scripts (including all preparation steps) to sign and verify files using the following formats and tools:

| Format                  | Signing invocation     | Sample script                        | Note
|-------------------------|------------------------|--------------------------------------|---------
| GPG detached signature  | `gpg --sign`           | `Scenarios/Gpg/GpgSignFile.sh`       |
| RPM (RedHat package)    | `rpmsign --resign`     | `Scenarios/RpmPackages/SignRpm.sh`   |
| DEB (Debian package)    | [`dpkg-sig`]` --sign`  | `Scenarios/DebPackages/SignDeb.sh`   | "builder" is used as _sign role_
| Maven artifact          | `mvn install`          | `Scenarios/Maven/SignMaven.sh`       | Requires the [Maven GPG plugin]

While executing each signing tool, SignPath is called to perform a hash-based signing operation. Note that _OrganizationId_ and _ApiToken_ must be passed to the SignPath Crypto Provider to authenticate the request.

### Error logs {#gpg-error-logs}

For `gnupg-pkcs11-scd`, `stdout` console output must be disabled. Use the log files for troubleshooting.

The [`InitializeSignPathCryptoProviderGpgSigning` helper function](/documentation/crypto-providers/gpg#configure-gnupg) uses the following logging directories:

* SignPath Cryptoki logs: `/tmp/SignPathLogs/<timestamp>.log`
* `gnupg-pkcs11-scd` logs: `/tmp/SignPathLogs/gnupg-pkcs11-scd.log`
* GPG logs: `/tmp/SignPathLogs/gpg-agent.log`

When using the [Linux samples], the `/tmp/SignPathLogs` is container volume mounted to `Samples/SignPathLogs`.

[Linux samples]: /documentation/crypto-providers#linux-docker-samples
[`dpkg-sig`]: https://manpages.debian.org/bullseye/dpkg-sig/dpkg-sig.1.en.html
[Maven GPG plugin]: https://maven.apache.org/plugins/maven-gpg-plugin/
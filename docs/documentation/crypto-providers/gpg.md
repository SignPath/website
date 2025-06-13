---
header: GPG
layout: resources
toc: true
show_toc: 3
description: Creating GPG signatures with SignPath
---

## Overview

[GNU Privacy Guard](https://gnupg.org/), also known as GPG or GnuPG, is an Open Source implementation of the OpenPGP standard. This section provides information about using GPG with SignPath, as well as some code signing tools that build on GPG.

## Terminology

GPG uses various terms for certificates. We use the term **_GPG key_** in our GPG documentation, but keep in mind that other parts of the SignPath documentation will use the general term _certificate_. See [Managing Certificates](/documentation/managing-certificates#certificate-types) for more information.

### Using GnuPG with PKCS #11

GnuPG does not directly support the PKCS #11/Cryptoki interface. The [gnupg-pkcs11-scd](https://github.com/alonbl/gnupg-pkcs11-scd/) project adds this capability as a daemon for the GnuPG ["Smartcard"](https://wiki.gnupg.org/SmartCard) interface.

![Figure: GPG signing flow](/assets/img/resources/documentation/crypto-providers/gpg-signing-flow.svg)

## Setup {#prepare-signing}

### SignPath configuration

1. Create a [GPG key](/documentation/managing-certificates)
2. Create a [hash signing project and signing policy](/documentation/crypto-providers/#signpath-project-configuration) in SignPath

### Configure GPG for signing {#configure-gnupg}

Initialize GPG hash signing using the helper function `InitializeSignPathCryptoProviderGpgSigning` of `Samples/Scenarios/SignPathCryptoProviderHelpers.sh` of the [Linux samples].

This function sets up GPG using the specified parameters:
  * Configures the SignPath Crypto Provider
  * Sets GnuPG's home dir (`GNUPGHOME` environment variable) to a temporary directory to isolate GnuPG configuration and key store changes
  * Configures GPG and `gnupg-pkcs11-scd` and fetches the private key reference
  * Downloads the transferable GPG public key 
  * Sets the `SIGNPATH_PROJECT_SLUG` and `SIGNPATH_SIGNING_POLICY_SLUG` environment variables to avoid ambiguities in the PKCS #11/Cryptoki provider (see [Configuration](index/#crypto-provider-config-values-signingpolicy))
  * Imports the GPG key and exposes its key ID via the `GPG_KEY_ID` environment variable
  * Installs a Bash EXIT trap which cleans up the isolated GPG configuration

{.panel.tip}
> **Use $GPG_KEY_ID to reference the public key**
>
> While you can use any key attribute supported by GPG, we recommend using the `GPG_KEY_ID` environment variable provided by SignPath. This will make your scripts robust in case you select another Signing Policy or the policy is assigned another GPG key. Example: `gpg --sign -u "$GPG_KEY_ID" ...`

See [SignPath Crypto Providers](/documentation/crypto-providers/#crypto-provider-configuration) for additional configuration options including logging.

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
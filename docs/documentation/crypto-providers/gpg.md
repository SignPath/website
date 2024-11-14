---
main_header: Crypto Providers
sub_header: GPG
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

To configure GnuPG to perform hash signing via SignPath you need to:
* Configure the [SignPath Crypto Provider](/documentation/crypto-providers#crypto-provider-configuration)
* Configure `gnupg-pkcs11-scd` via `gnupg-pkcs11-scd.conf`
* Configure GnuPG (`gpg-agent`) to use `gnupg-pkcs11-scd`

For more details and necessary dependencies see `samples/Scenarios/Gpg` in the [Linux container samples].

### Error logs {#gpg-error-logs}

For `gnupg-pkcs11-scd`, `stdout` console output must be disabled. Use the log files for troubleshooting.

For the [Linux container samples], the following log file locations are configured:

* SignPath Cryptoki logs: `samples/Scenarios/temp/SignPathLogs/*.log`
* `gnupg-pkcs11` logs: `samples/Scenarios/temp/gnupg-pkcs11-scd.log`
* GPG logs: `samples/Scenarios/temp/gpg-agent.log`

### Prepare for signing

1. Create a [GPG key in SignPath](/documentation/managing-certificates), download the GPG public key file and copy it into the `samples/Scenarios/Gpg/Keys` directory.
1. Create a [hash signing project and signing policy](/documentation/crypto-providers#signpath-project-configuration) in SignPath.
1. Execute `SCD LEARN` to fetch the private key references. For details, see the `UseSignPathCryptokiGpgConfiguration` function in the GPG scenario of the [Linux container samples].
1. Import the key into the GPG key chain with `gpg --import` . See the `ImportGpgKeys` function in the GPG scenario of the [Linux container samples].

For referencing a specific GPG key in the later signing commands (`-GpgKeyId` parameter), you can use the GPG key's fingerprint, key ID, the full user ID, or the email address.

## Signing code with GPG

### GPG File Signing {#gpg-file-signing}

The [Linux container samples] contain a full example to sign and verify a file with a detached signature (including the mentioned preparation steps) in `run_scenario.sh ... -Scenario GpgSignFile -GpgKeyId "<gpg-signing@example.com>"`.

During `gpg --sign`, SignPath is called to perform a hash based signing operation. Note that the _OrganizationId_ and the _ApiToken_ still need to be passed to the SignPath Crypto Provider to authenticate the request.

### RPM Signing (Linux)

The [Linux container samples] contain a full example to sign and verify a RPM file in `run_scenario.sh ... -Scenario SignRpm -GpgKeyId "<gpg-signing@example.com>"`. See `SignRpm.ps1` for details.

During `rpm --addsign`, SignPath is called to perform a hash based signing operation. Note that the _OrganizationId_ and the _ApiToken_ still need to be passed to the SignPath Crypto Provider to authenticate the request.

### DEB Signing via dpkg-sig (Linux)

The [Linux container samples] contain a full example to sign and verify a DEB file using _[dpkg-sig](https://manpages.debian.org/bullseye/dpkg-sig/dpkg-sig.1.en.html)_ in `run_scenario.sh ... -Scenario SignDeb -GpgKeyId "<gpg-signing@example.com>"`. Note the passed default "sign role" value of `"builder"`.

During `dpkg-sig --sign`, SignPath is called to perform a hash based signing operation. Note that OrganizationId and the ApiToken still need to be passed to the SignPath Crypto Provider to authenticate the request.

### Maven Artifact Signing (Linux)

The [Linux container samples] contain a full example to build, sign and verify Maven artifacts using the _[Apache maven-gpg-plugin](https://maven.apache.org/plugins/maven-gpg-plugin/)_ in `run_scenario.sh ... -Scenario SignMaven -GpgKeyId "<gpg-signing@example.com>"`. The used GPG key is referenced via its email address.

During `mvn install`, SignPath is called to perform a hash based signing operations. Note that the _OrganizationId_ and the _ApiToken_ still need to be passed to the SignPath Crypto Provider to authenticate the request.

[Linux container samples]: /documentation/crypto-providers#linux-docker-samples

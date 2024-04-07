---
main_header: Crypto Providers
sub_header: macOS CryptoTokenKit
layout: resources
toc: true
show_toc: 3
description: SignPath macOS CryptoTokenKit Crypto Provider
datasource: tables/crypto-providers
---

## General instructions

This section provides information to use SignPath with any tool that supports macOS CryptoTokenKit.

### Supported versions

macOS 11.0 or higher

### Installation

Simply copy-deploy the `SignPathCryptoTokenKit.app` application to the target system.

### Background

macOS allows CryptoTokenKit extensions to be registered in the system. Through these extensions, key material and certificates can be provided. An extension is only available while the application that provides the extension is running. Therefore, before calling signing tools like `codesign`, the `SignPathCryptoTokenKit.app` needs to be started.

### Usage

The `SignPathCryptoTokenKit.app` application loads all available certificates for the given parameters and makes them avaialble in the macOS keychain through a CryptoTokenKit extension. The application supports the following parameters (all of them are optional):

| Parameter          | Value                                   | Description
|--------------------|-----------------------------------------|---------------------------------
| `-config`          | `/path/to/config/file.json`             | Path to config file
| `-s`               | `$SigningPolicySlug`                    | If not specified, the certificates from all available signing policies will be loaded
| `-p`               | `$ProjectSlug`                          | If not specified, the certificates from all available projects will be loaded
| `-u`               | `$ApiUrl`                               | The base URL of the SignPath API, e.g. `https://app.signpath.io/Api`
| `-o`               | `$OrganizationId`                       | The id of the organization to use
| `-t`               | `$ApiToken`                             | The API token for a CI or Interactive User (can be created in the "Users and Groups" UI)

> **Keys are not specified directly**
>
> When using a file-based [configuration](/documentation/crypto-providers#crypto-provider-configuration), the macOS CryptoTokenKit Crypto Provider requires the config file to be
> * named `config.json` and placed in the same directory as the `SignPathCryptoTokenKit.app` application or
> * its path to be specified via the `-config` parameter
{: .panel .info }

Example call starting the application:

~~~bash
export SIGNPATH_ORGANIZATION_ID=...
export SIGNPATH_API_TOKEN=...
open "SignPathCryptoTokenKit.app" --args -p MyProject -s release-signing -u https://app.signpath.io/Api
~~~

### Troubleshooting

The following commands are helpful to make sure the setup is correct:

Using the `security` command, the registered smart cards can be listed. This list should contain an entry `io.signpath.apps.SignPathCryptoTokenKit.ctk:<identifier>`
~~~bash
security list-smartcard
~~~

Using the `pluginkit` tool, the registration of the token driver can be verified. The command lists all registered tokens and should also list `io.signpath.apps.CryptoTokenKit($Version)`.

~~~bash
pluginkit -m -v -p com.apple.ctk-tokens
~~~

## codesign {#codesign}

_[codesign]_ is a command line tool by Apple.

_codesign_ requires the following parameter to find the correct certificate:

| Parameter          | Value                                   | Description
|--------------------|-----------------------------------------|---------------------------------
| `-s`               | `$SigningIdentity`                      | A descriptor of the code signing identity that is stored in the keychain by the SignPath CryptoTokenKit. Provide the common name (or a substring) of the certificate.

Sample: sign `MyApp.app`

~~~powershell
codesign -s MyCertificateSubjectName MyApp.app
~~~

> **Warning: Produce correct timestamps**
> 
> When using codesign (or any other signing tool) directly, you are responsible for correct time stamping. See [Timestamps](/documentation/crypto-providers#timestamps)
{: .panel .warning }

[codesign]: https://developer.apple.com/library/archive/documentation/Security/Conceptual/CodeSigningGuide/Procedures/Procedures.html
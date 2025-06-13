---
header: macOS CryptoTokenKit
layout: resources
toc: true
show_toc: 3
description: SignPath macOS CryptoTokenKit Crypto Provider
---

## General instructions

This section provides information to use SignPath with any tool that supports macOS CryptoTokenKit.

### Supported versions

macOS 12.0 or higher

### Installation

Simply copy-deploy the `SignPathCryptoTokenKit.app` application to the target system.

### Configuration

See [SignPath Crypto Providers](/documentation/crypto-providers/#crypto-provider-configuration) for general configuration options.

### Background

macOS allows CryptoTokenKit extensions to be registered in the system. Through these extensions, key material and certificates can be provided. An extension is only available while the application that provides the extension is running. Therefore, before calling signing tools like `codesign`, the `SignPathCryptoTokenKit.app` needs to be started.

### Usage

The `SignPathCryptoTokenKit.app` application loads all available certificates for the given parameters and makes them avaialble in the macOS keychain through a CryptoTokenKit extension. The application supports the following parameters (all of them are optional):

| Parameter               | Value                        | Default                       | Description
|-------------------------|------------------------------|-------------------------------|---------------------------------------
| `--config`              | `path/to/configfile.json`    |                               | Path to SignPath [configuration file](index#crypto-provider-configuration)
| `--api-url`             | `$ApiUrl`                    | `https://app.signpath.io/Api` | Base URL of the SignPath API
| `--project-slug`        | `$ProjectSlug`               |                               | Slug of the SignPath _Project_
| `--signing-policy-slug` | `$SigningPolicySlug`         |                               | Slug of the SignPath _Signing Policy_
| `--organization-id`     | `$OrganizationId`            |                               | ID of the SignPath _Organization_
| `--api-token`           | `$ApiToken`                  |                               | API token for a SignPath _User_

{:.panel.info}
> **Use _Project_ and _Signing Policy_ slugs to specify a key**
>
> Identify a specific _Signing Policy_ by specifying _Project_ and _Signing Policy_ slugs. The SignPath CryptoTokenKit Crypto Provider will select the certificate of that Signing Policy for the signing operations.
>
> When you specify neither, SignPath will load all certificates available for the _API Token_'s user. When you specify only the _Project_, SignPath will load the certificates of all available _Signing Policies_ for the specified project.
>
> If a loaded certificate is referenced by more than one available _Signing Policy_, using it will result in an ambiguous reference error.

Example call starting the application:

~~~bash
export SIGNPATH_API_TOKEN=...
open SignPathCryptoTokenKit.app --args \
  --project-slug MyProject \
  --signing-policy-slug release-signing \
  --organization-id 0241f767-69c8-448d-ad5e-8bd453916068
~~~

### Troubleshooting

Loading the certificates and making them available in the macOS keychain can take up to 20 seconds.

#### Logs

Unless specified otherwise, the log files are stored in `~/Library/Logs/SignPathCryptoTokenKit/` and `~/Library/Containers/io.signpath.apps.CryptoTokenKit/Data/Library/Logs/ctk/` respectively.

#### Useful commands:

The following commands are helpful to make sure the setup is correct:

Using the `security` command, the registered smart cards can be listed. This list should contain an entry `io.signpath.apps.SignPathCryptoTokenKit.ctk:<identifier>`
~~~bash
security list-smartcard
~~~

Using the `pluginkit` tool, the registration of the token driver can be verified. The command lists all registered tokens and should also list `io.signpath.apps.CryptoTokenKit($Version)`.

~~~bash
pluginkit -m -v -p com.apple.ctk-tokens
~~~

The smartcard service on macOS sometimes has issues. If the certificates cannot be loaded, the service can be restarted by running the following command:

~~~bash
killall ctkd
~~~

{:.panel.info}
> **Info: Updated intermediate certificate**
> 
> When creating a certificate in the Apple Developer portal, the intermediate certificate can be selected. On some machines, the new intermediate certificate is still missing. You can download it [here](https://www.apple.com/certificateauthority/DeveloperIDG2CA.cer).

{:.panel.warning}
> **Warning: Produce correct timestamps**
> 
> When using codesign (or any other signing tool) directly, you are responsible for correct time stamping. See [Timestamps](/documentation/crypto-providers#timestamps)

[codesign]: https://developer.apple.com/library/archive/documentation/Security/Conceptual/CodeSigningGuide/Procedures/Procedures.html

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

{:.panel.info}
> **Info: Using the right certificate**
> 
> `codesign` requires an "Apple Developer Application" certificate.

## productsign {#productsign}

_productsign_ is a command line tool by Apple.

_productsign_ requires the following parameter to find the correct certificate:

| Parameter          | Value                                   | Description
|--------------------|-----------------------------------------|---------------------------------
| `--sign`           | `$SigningIdentity`                      | A descriptor of the code signing identity that is stored in the keychain by the SignPath CryptoTokenKit. Provide the common name (or a substring) of the certificate.

Sample: sign `MyInstaller.pkg`

~~~powershell
productsign --timestamp --sign "XX6NBJ3UUF" MyInstaller.pkg MyInstaller-signed.pkg
~~~

{:.panel.info}
> **Info: Using the right certificate**
> 
> `productsign` requires an "Apple Developer Installer" certificate.

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

{%- assign table = site.data.tables.crypto-providers.macos-application-parameters -%}
{%- include render-table.html -%}

<div class="panel info" markdown="1">
<div class="panel-header">Keys are not specified directly</div>

When using a file-based [configuration](/documentation/crypto-providers#crypto-provider-configuration), the macOS CryptoTokenKit Crypto Provider requires the config file to be
* located in the same directory as the `SignPathCryptoTokenKit.app` application or
* its path to be specified via the `-config` parameter

</div>

Example call starting the application:

~~~bash
open "SignPathCryptoTokenKit.app" --args -p MyProject -s release-signing -config /path/to/config.json
~~~

### Troubleshooting

The following commands are helpful to make sure the setup is correct:

Using the `security` command, the registered smart cards can be listed. This list should contain an entry **TODO**
~~~bash
security list-smartcard
~~~

Using the `pluginkit` tool, the registration of the token driver can be verified. **TODO**

~~~bash
pluginkit -m -v -p com.apple.ctk-tokens
~~~

## codesign {#codesign}

_[codesign]_ is a command line tool by Apple.

_codesign_ requires the following parameter to find the correct certificate:

{%- assign table = site.data.tables.crypto-providers.macos-codesign-parameters -%}
{%- include render-table.html -%}

Sample: sign `MyApp.app`

~~~powershell
codesign -s MyCertificateSubjectName MyApp.app
~~~

<div class="panel warning" markdown="1">
<div class="panel-header">Warning: Produce correct timestamps</div>

When using codesign (or any other signing tool) directly, you are responsible for correct time stamping. See [Timestamps](/documentation/crypto-providers#timestamps)

</div>

[codesign]: https://developer.apple.com/library/archive/documentation/Security/Conceptual/CodeSigningGuide/Procedures/Procedures.html
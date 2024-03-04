---
main_header: Documentation
sub_header: Crypto Providers
layout: resources
toc: true
show_toc: 3
description: SignPath Crypto Providers (CSP, KSP, Cryptoki)
datasource: tables/crypto-providers
---

Available for Enterprise subscriptions
{: .badge.icon-signpath}

## Overview

The SignPath Crypto Providers allow signing tools such as [SignTool.exe](/documentation/crypto-providers/windows#signtool), [OpenSSL](/documentation/crypto-providers/cryptoki#openssl) or [jarsigner](/documentation/crypto-providers/cryptoki#jarsigner) to sign files locally using keys or certificates stored and managed by SignPath. 

Crypto Providers are generally used to provide a device-independent API for using secure key storage devices such as USB key tokens or Hardware Security Modules (HSMs). You may think of them as device drivers for crypto hardware. Most software tools used for code signing support one Crypto Provider technology, such as Microsoft KSP/CSP or PKCS #11 Cryptoki.

The SignPath Crypto Providers do not access the crypto hardware directly. Instead, they implement these interfaces to provide access to SignPath _Projects_ and _Signing Policies_. During the entire operation, the private key will remain on the HSM.

<div class="panel info" markdown="1">
<div class="panel-header">Version info</div>

This documentation contains information about the latest version of the CryptoProviders. See the [changelog](/documentation/changelog?component=crypto_providers) for updates.
</div>

### Crypto Providers

The following Crypto Providers are available for SignPath:

{%- assign table = site.data.tables.crypto-providers.overview-crypto-providers -%}
{%- include render-table.html -%}

#### Supported Linux distributions

{%- assign table = site.data.tables.crypto-providers.overview-supported-linux-distributions -%}
{%- include render-table.html -%}

<div class="panel warning" markdown="1">
<div class="panel-header">OpenSSL 3.0.0 - 3.0.8 incompatibility</div>


Distributions with an OpenSSL version between 3.0.0 and 3.0.8 (including) don't support the the [OpenSSL](/documentation/crypto-providers/cryptoki#openssl) and [osslsigncode](/documentation/crypto-providers/cryptoki#osslsigncode) scenarios.
The reason is an [OpenSSL bug](https://github.com/openssl/openssl/issues/20161) which has been fixed in OpenSSL 3.0.9.
The issue expresses in _"http_exception occurred (error code= generic:168296454): Error in SSL handshake"_ errors.

The workaround is to either replace the system's OpenSSL version with >= 3.0.9 or to use an isolated OpenSSL installation.
</div>

### Signing flow {#flow}

This diagram describes how the various components work together to create a signature.

![Figure: Signing flow overview](/assets/img/resources/documentation_crypto_providers-CryptoProvidersSigningFlow.svg)

With small platform-specific variations, the general flow of a signing operations is as follows:

1. The **user** invokes the **signing tool**.
   * The command line usually specifies a key reference. In SignPath this is the _Project_ and _Signing Policy_.
   * The credentials are passed using the command line or environment variables.
2. The **signing tool** reads the file and calculates a **hash digest**.
   * Depending on the tool, this might be the hash digest of the entire file, or just a of a specific part of the file.
   * For Authenticode, this step is performed by a Windows API using a format-specific SIP (Subject Interface Package).
3. The **signing tool** calls a **System API** (Windows) or an **engine** (PKCS#11) to get a signature block.
4. This API or engine calls the **SignPath Crypto Provider**.
5. The SignPath Crypto Provider calls the **SignPath REST API** over HTTPS/REST.
6. **SignPath**
   * **verifies** the user's **credentials and permissions** for the specified _Project_ and _Signing Policy_,
   * **selects the key pair or certificate** for this operation,
   * **uses the HSM to sign** the digest using the specified algorithm,
   * _and_ writes the entire operation to the audit log.
7. The resulting **signature block is returned** up the entire call chain.
8. The **signing tool writes the signature**
   * by inserting it into the signed file,
   * by wrapping the file into a signed envelope,
   * _or_ by creating a _detached signature_ file that must be shipped along the original file.
   Again, for Authenticode this is actually performed by the SIP.

As always, the private key does not leave the boundaries of the HSM.

### Linux Docker container samples {#linux-docker-samples}

For the supported Linux distributions we provide Docker container based example scripts to demonstrate the different signing tool scenarios, their configuration and the required dependencies.

See the `samples` directory in the Linux Crypto Provider package. It contains a `README.md` file with further information.

All of the provided scripts can also be executed outside of a Docker container. However, we recommend to perform the signing operations in a container to keep the dependencies in one manageable place, especially for GPG based signing tools.

### Timestamps {#timestamps}

When using SignTool.exe (or any other signing tool) directly, you are responsible for correct time stamping. Here are a few hints:

* You may use the timestamp authority (TSA) provided by the certificate authority that issued your code signing certificate or any other CA that provides a free public TSA.
* TSAs may impose quota limits, and free TSAs usually don't provide any SLA level.
* TSAs may ignore the parameters you provide, e.g. the hashing algorithm. This may result in invalid timestamps. Depending on the platform, that might only lead to problems after the certificate becomes invalid.
* TSAs may use certificates with a short lifetime. Some platforms, such as Authenticode, accept expired TSA certificates. For other platforms, your signatures might become invalid after the TSA certificate has expired. A good TSA certificate should have a remaining lifetime of about 10 years or more.

Always check your signatures and timestamps to ensure that they will be valid after your certificate expires or gets revoked. Otherwise, your signatures may become invalid. Another problem is that revocation for compromised certificates becomes a much harder decision if you cannot rely on timestamps.

If you use the file-based signing method of SignPath, timestamps will be managed automatically.

## Installation and usage

Depending on the signing tool you're using, the corresponding Crypto Provider needs to be installed (on all build nodes). See the respective pages:

* [SignPath KSP and CSP](/documentation/crypto-providers/windows) for _SignTool.exe_ and most native Windows tools
* [SignPath Cryptoki](/documentation/crypto-providers/cryptoki) for _OpenSSL_, _jarsigner_, and many other Open Source tools
* [GPG-based tools](/documentation/crypto-providers/gpg), such as _gpg_, _rpm_, or _dkpg-sig_ use the [SignPath Cryptoki Crypto Provider](/documentation/crypto-providers/cryptoki) but require additional configuration steps
* Instead of using a CryptoProvider, it is also possible to [sign hashes directly using the REST API](/documentation/crypto-providers/rest-api)

## Crypto Provider configuration {#crypto-provider-configuration}

### Setting configuration values {#crypto-provider-config-values}

This section describes how to specify configuration settings for all Crypto Providers.

You can either use a JSON configuration file and specify the JSON file path via the `SIGNPATH_CONFIG_FILE` environment variable, or use individual configuration environment variables per setting.
Note that environment variables take precedence over the corresponding JSON settings.

{%- assign table = site.data.tables.crypto-providers.config-values -%}
{%- include render-table.html -%}

Supported log levels: `none`, `fatal`, `error`, `warning`, `info`, `debug`, `verbose`.

Sample configuration file:

~~~json
{
    "ApiUrl": "https://app.signpath.io/Api",
    "OrganizationId": "<OrganizationId>",
    "ApiToken": "<ApiToken>",
    "Log": {
        "Console": {
            "Level": "warning"
        },
        "File": {
            "Level": "info",
            "Directory": "C:\\SignPath\\Logs"
        }
    }
}
~~~

### Options for providing the API token {#api-token-options}

The `ApiToken` value can contain the API token in one of the following variants:

{%- assign table = site.data.tables.crypto-providers.config-api-token-options -%}
{%- include render-table.html -%}

In order to encrypt the token, you can use the following PowerShell snippet:

~~~powershell
$ApiToken = "..."

# Encrypt ApiToken with DPAPI and encode it in Base64 format
Add-Type -AssemblyName System.Security
$ApiTokenBytes = [System.Text.Encoding]::UTF8.GetBytes($ApiToken)
$EncryptedApiToken = [Security.Cryptography.ProtectedData]::Protect($ApiTokenBytes, $null, [System.Security.Cryptography.DataProtectionScope]::CurrentUser)

$EncryptedBase64EncodedApiToken = [System.Convert]::ToBase64String($EncryptedApiToken)

~~~

To store the encrypted token in the Windows registry, you can use the following snippet:

~~~powershell
$ApiTokenRegistryValueName = "MyEncryptedApiToken"

# Write encrypted & encoded ApiToken to registry
New-Item -Path "HKCU:\SOFTWARE\" -Name SignPath
New-ItemProperty -Path "HKCU:\SOFTWARE\SignPath" -Name "$ApiTokenRegistryValueName" -Value "$EncryptedBase64EncodedApiToken" -PropertyType "String"
~~~

### HTTP Proxy configuration {#http-proxy-config}

Optionally an HTTP web proxy can be used for the outgoing API requests.

On Windows by default the WinINet ("Internet Options") proxy settings are respected.

Alternatively, a proxy server can be specified in the [configuration](#crypto-provider-config-values) (Windows and Linux) using the following value formats:

* `$ProxyHost:$ProxyPort`
* `http://$ProxyHost:$ProxyPort`

In case this configuration value is set, it overrides the system's proxy settings on Windows.

### SignPath Project configuration {#signpath-project-configuration}

In order to perform hash-based signing with the Crypto Providers, perform the following steps in the SignPath UI:

1. Create a new _Project_ with an _Artifact Configuration_ of type _Hash signing data_ and remember the _Project slug_.
<!-- TODO must be default artifact configuration? -->
1. Create an dedicated CI User (recommended) or generate an API Token for your own Interactive User and remember the API token.
1. Create a _Signing Policy_ for the _Project_ and add a _the CI or Interactive User_ as a _Submitter_. Remember _Signing Policy slug_.


[PKCS #11]: https://docs.oasis-open.org/pkcs11/pkcs11-base/v2.40/os/pkcs11-base-v2.40-os.html
[CNG]: https://docs.microsoft.com/en-us/windows/win32/seccng/key-storage-and-retrieval
[CAPI]: https://docs.microsoft.com/en-us/windows/win32/seccrypto/cryptographic-service-providers
---
header: Crypto Providers
layout: resources
toc: true
show_toc: 3
description: SignPath Crypto Providers (Cryptoki, KSP, CSP, CryptoTokenKit)
---

{% include editions.md feature="hash_based_signing.rest_api" %}

## Overview

The SignPath Crypto Providers allow signing tools such as [SignTool.exe](/documentation/crypto-providers/windows#signtool), [OpenSSL](/documentation/crypto-providers/cryptoki#openssl) or [jarsigner](/documentation/crypto-providers/cryptoki#jarsigner) to sign files locally using keys or certificates stored and managed by SignPath. 

Crypto Providers are generally used to provide a device-independent API for using secure key storage devices such as USB key tokens or Hardware Security Modules (HSMs). You may think of them as device drivers for crypto hardware. Most software tools used for code signing support one Crypto Provider technology, such as Microsoft KSP/CSP or PKCS #11 Cryptoki.

The SignPath Crypto Providers do not access the crypto hardware directly. Instead, they implement these interfaces to provide access to SignPath _Projects_ and _Signing Policies_. During the entire operation, the private key will remain on the HSM.

{:.panel.info}
> **Version info**
>
> This documentation contains information about the latest version of the CryptoProviders. See the [CryptoProvider changelog](/documentation/changelog?component=crypto_providers) or the [macOS CryptoTokenKit changelog](/documentation/changelog?component=macos_cryptotokenkit) for updates.

### Crypto Providers

The following Crypto Providers are available for SignPath:

| Crypto Provider                               | Technology                                    | Supported platforms | Description
|-----------------------------------------------|-----------------------------------------------|---------------------|--------------
| **Cryptoki** (Cryptographic Token Interface)  | [PKCS #11] version 2.40                       | Windows, Linux
| **KSP** (Key Storage Provider)                | [CNG] (Cryptographic API: Next Generation)    | Windows
| **CSP** (Cryptographic Service Provider)      | [CAPI] (CryptoAPI)                            | Windows             | This API is deprecated, most tools now use KSP/CNG
| **CTK** (CryptoTokenKit)                      | [CTK extension]                               | macOS

[PKCS #11]: https://docs.oasis-open.org/pkcs11/pkcs11-base/v2.40/os/pkcs11-base-v2.40-os.html
[CNG]: https://docs.microsoft.com/en-us/windows/win32/seccng/key-storage-and-retrieval
[CAPI]: https://docs.microsoft.com/en-us/windows/win32/seccrypto/cryptographic-service-providers
[CTK extension]: https://developer.apple.com/documentation/cryptotokenkit/

### Signing flow {#flow}

This diagram describes how the various components work together to create a signature.

![Figure: Signing flow overview](/assets/img/resources/documentation/crypto-providers/signing-flow.svg)

With small platform-specific variations, the general flow of a signing operations is as follows:

1. The **user** invokes the **signing tool**.
   * The command line usually specifies a key reference. In SignPath this is the _Project_ and _Signing Policy_.
   * The credentials are passed using the command line or environment variables.
2. The **signing tool** reads the file and calculates a **hash digest**.
   * Depending on the tool, this might be the hash digest of the entire file, or just a of a specific part of the file.
   * For Authenticode, this step is performed by a Windows API using a format-specific SIP (Subject Interface Package).
3. The **signing tool** calls a **System API** (Windows) or an **engine** (PKCS #11) to get a signature block.
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

## Installation and usage

Depending on the signing tool you're using, the corresponding Crypto Provider needs to be installed (on all build nodes). See the respective pages:

* [SignPath KSP and CSP](/documentation/crypto-providers/windows) for _SignTool.exe_ and most native Windows tools
* [SignPath Cryptoki](/documentation/crypto-providers/cryptoki) for _OpenSSL_, _jarsigner_, and many other Open Source tools
* [GPG-based tools](/documentation/crypto-providers/gpg), such as _gpg_, _rpm_, or _dkpg-sig_ use the [SignPath Cryptoki Crypto Provider](/documentation/crypto-providers/cryptoki) but require additional configuration steps
* [SignPath CryptoTokenKit](/documentation/crypto-providers/macos) for macOS _codesign_
* Instead of using a CryptoProvider, it is also possible to [sign hashes directly using the REST API](/documentation/crypto-providers/rest-api)

## Configuration {#crypto-provider-configuration}

### Values {#crypto-provider-config-values}

This section describes how to specify configuration values for all Crypto Providers.

You can specify values via individual environment variables or a JSON config file specified in `SIGNPATH_CONFIG_FILE`. If you specify both, environment variables take precedence.

#### General configuration settings {#crypto-provider-config-values-general}

| JSON setting                            | Environment variable                                   | Supported platforms | Default Value    | Description
|-----------------------------------------|--------------------------------------------------------|---------------------|------------------|--------------------------
|  n/a                                    | `SIGNPATH_CONFIG_FILE`                                 |                     |                  | Path to the JSON configuration file
| `OrganizationId`                        | `SIGNPATH_ORGANIZATION_ID`                             |                     |                  | ID of SignPath Organization
| `ApiToken`                              | `SIGNPATH_API_TOKEN`                                   |                     |                  | API token for a SignPath User (CI or Interactive User; see [below](#api-token-options) for options)
| `TlsClientCertificate`                  | `SIGNPATH_TLS_CLIENT_CERTIFICATE`                      | Windows             | (optional)       | Reference to a TLS/SSL client authentication certificate in the format `thumbprint:$HexThumbprint`
| `ApiUrl`                                | `SIGNPATH_API_URL`                                     |        | `https://app.signpath.io/Api` | SignPath API endpoint to use. Needs to be set if for self-hosted SignPath installations   
| `HttpProxy`                             | `http_proxy`                                           | Windows, Linux      | (optional)       | Address of an [HTTP (web) proxy](#http-proxy-config) 
| `Cryptoki.DoNotFailOnReadWriteSessions` | `SIGNPATH_CRYPTOKI_DO_NOT_FAIL_ON_READ_WRITE_SESSIONS` |                     | `false`          | Enables compatibility with Cryptoki/PKCS #11 clients that open sessions with read/write option 
| `IncludeDummyX509CertificateForGpgKeys` | `SIGNPATH_INCLUDE_DUMMY_X509CERTIFICATE_FOR_GPG_KEYS`  |                     | `false`          | Enables compatibility with clients that require X.509 objects (required for [GPG hash signing](/documentation/crypto-providers/gpg) due to `gnupg-pkcs11-scd` X.509-based key discovery)
{: .break-code}

The [MSI installer](/documentation/crypto-providers/windows#installation) for Windows creates a skeleton JSON file `%ProgramFiles%\SignPath\CryptoProviders\CryptoProvidersConfig.json` you can use to provide your own (default) values and sets `SIGNPATH_CONFIG_FILE` accordingly.

#### Project and signing policy settings {#crypto-provider-config-values-project-signingpolicy}

You will usually specifiy the Project and Signing Policy and let SignPath select the matching certificate.

The following values
* should be provieded for other [PKCS #11/Cryptoki](cryptoki) signing tools that don't accept a _key ID_ parameter
* are internally used for GPG signing via PKCS #11 (see [GPG](gpg#configure-gnupg))
* can be provided for macOS CryptoTokenKit as default values (see [macOS](macos#usage-project-signing-policy))

| JSON setting                            | Environment variable                                   | Description
|-----------------------------------------|--------------------------------------------------------|--------------------------
| `ProjectSlug`                           | `SIGNPATH_PROJECT_SLUG`                                | Slug of the SignPath _Project_
| `SigningPolicySlug`                     | `SIGNPATH_SIGNING_POLICY_SLUG`                         | Slug of the SignPath _Signing Policy_

#### Logging settings {#crypto-provider-config-values-logging}

| JSON setting                | Environment variable                  | Default Value     | Description
|-----------------------------|---------------------------------------|-------------------|----------------------
| `Log.Console.Level`         | `SIGNPATH_LOG_CONSOLE_LEVEL`          | `none`            | Log level used for console logging (not available on macOS)
| `Log.Console.OutputStream`  | `SIGNPATH_LOG_CONSOLE_OUTPUT_STREAM`  | `stderr`          | Console stream to use (either `stderr` or `stdout`) (not available on macOS)
| `Log.File.Level`            | `SIGNPATH_LOG_FILE_LEVEL`             | `info`            | Log level used for file logging 
| `Log.File.Directory`        | `SIGNPATH_LOG_FILE_DIRECTORY`         | Windows: `%TEMP%\SignPathLogs`, Linux: `/tmp/SignPathLogs` | Path to the folder to store log files

Supported log levels: `none`, `fatal`, `error`, `warning`, `info`, `debug`, `verbose`.

#### Timeout settings

| JSON setting                | Environment variable                  | Default Value     | Description
|-----------------------------|---------------------------------------|-------------------|-------------------------
| `Timeouts.HttpRequest`      | `SIGNPATH_TIMEOUTS_HTTP_REQUEST`      | `30`              | Timeout for HTTP calls in seconds per attempt
| `Timeouts.FirstRetryDelay`  | `SIGNPATH_TIMEOUTS_FIRST_RETRY_DELAY` | `1.16`            | Initial delay in seconds in case of failed API HTTP requests
| `Timeouts.RetryCount`       | `SIGNPATH_TIMEOUTS_RETRY_COUNT`       | `10`              | Maximum number of retries in case of failed API HTTP requests
{: .break-column-2}

HTTP timeouts and 5xx server errors (e.g. 503 Service Unavailable errors) are treated as failed requests.

The delay between retries increases exponentially. For the default values this sums up to a total delay time of 10 minutes.

**Sample configuration file:**
{: #sample-configuration-file}

~~~json
{
    "ApiUrl": "https://app.signpath.io/Api",
    "OrganizationId": "$OrganizationId",
    "ApiToken": "$ApiToken",
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

### API token options {#api-token-options}

The `ApiToken` value can contain the API token in one of the following variants:

| Value                                                 | Example
|-------------------------------------------------------|-----------------------------
| Unencrpyted token                                     | `AIk/65sl23lA1nVV/pgSqk96SvHFsSw3xitmp5Qhr+F/`
| DPAPI-encrypted token (Windows only)                  | `encrypted:AQAAANCMnd8BFdERjHoAwE/Cl+sBAAA...`
| Registry path to DPAPI-encrypted token (Windows only) | `registry:HKEY_CURRENT_USER\\SOFTWARE\\SignPath\\MyEncryptedApiToken`
{: .break-column-2}


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
New-ItemProperty -Path "HKCU:\SOFTWARE\SignPath" -Name $ApiTokenRegistryValueName -Value $EncryptedBase64EncodedApiToken -PropertyType "String"
~~~

### HTTP Proxy {#http-proxy-config}

Optionally an HTTP web proxy can be used for the outgoing API requests.

On Windows by default the WinINet ("Internet Options") proxy settings are respected.

Alternatively, a proxy server can be specified in the [configuration](#crypto-provider-config-values) (Windows and Linux) using the following value formats:

* `$ProxyHost:$ProxyPort`
* `http://$ProxyHost:$ProxyPort`

In case this configuration value is set, it overrides the system's proxy settings on Windows.

### SignPath Project {#signpath-project-configuration}

In order to perform hash-based signing with the Crypto Providers, perform the following steps in the SignPath UI:

1. Create or open a _Project_ 
   * Add an _Artifact Configuration_ of type _Hash signing data_ 
   * Set this _Artifact Configuration_ as _Default_
   * Remember the _Project slug_
2. Create an dedicated CI User (recommended) or generate an API Token for your own Interactive User 
   * Remember the API token
3. Create or open a _Signing Policy_ for the _Project_ 
   * Add the _CI User_ or _Interactive User_ as a _Submitter_
   * Remember the _Signing Policy slug_

### Linux samples {#linux-docker-samples}

The Crypto Provider package contains Linux sample scripts that demonstrate the use of different signing tools, their configuration, and the required dependencies in the `Scenarios` directory. See the `README.md` for the full list. 

For supported Linux distributions, you can execute the samples using the provided Docker container configurations. See the `Linux/Samples` directory in the Crypto Provider package. See `README.md` for further information and details how to use the `RunScenario.sh` and `RunScenario.ps1` entry point scripts to invoke samples.

In order to execute scripts directly, see the `Dockerfile` in `Samples/DebianBased/` or `Samples/RedHat/` respectively for prerequisites. (Not all prerequisites are required for all tools.)

### Timestamps {#timestamps}

When using SignTool.exe (or any other signing tool) directly, you are responsible for correct time stamping. Here are a few hints:

* You may use the timestamp authority (TSA) provided by the certificate authority that issued your code signing certificate or any other CA that provides a free public TSA.
* TSAs may impose quota limits, and free TSAs usually don't provide any SLA level.
* TSAs may ignore the parameters you provide, e.g. the hashing algorithm. This may result in invalid timestamps. Depending on the platform, that might only lead to problems after the certificate becomes invalid.
* TSAs may use certificates with a short lifetime. Some platforms, such as Authenticode, accept expired TSA certificates. For other platforms, your signatures might become invalid after the TSA certificate has expired. A good TSA certificate should have a remaining lifetime of about 10 years or more.

Always check your signatures and timestamps to ensure that they will be valid after your certificate expires or gets revoked. Otherwise, your signatures may become invalid. Another problem is that revocation for compromised certificates becomes a much harder decision if you cannot rely on timestamps.

If you use the file-based signing method of SignPath, timestamps will be managed automatically.

[PKCS #11]: https://docs.oasis-open.org/pkcs11/pkcs11-base/v2.40/os/pkcs11-base-v2.40-os.html
[CNG]: https://docs.microsoft.com/en-us/windows/win32/seccng/key-storage-and-retrieval
[CAPI]: https://docs.microsoft.com/en-us/windows/win32/seccrypto/cryptographic-service-providers

---
main_header: Documentation
sub_header: Crypto Providers
layout: resources
toc: true
show_toc: 3
description: SignPath Crypto Providers (CSP, KSP, Cryptoki)
datasource: tables/crypto-providers
---

## Overview

The SignPath Crypto Providers allow signing tools such as _SignTool.exe_, _OpenSSL_ or _jarsigner_ to sign files locally using keys or certificates stored and managed by SignPath. 

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


Distributions with an OpenSSL version between 3.0.0 and 3.0.8 (including) don't support the the [OpenSSL](#openssl) and [osslsigncode](#osslsigncode) scenarios.
The reason is an [OpenSSL bug](https://github.com/openssl/openssl/issues/20161) which has been fixed in OpenSSL 3.0.9.
The issue expresses in _"http_exception occurred (error code= generic:168296454): Error in SSL handshake"_ errors.

The workaround is to either replace the system's OpenSSL version with >= 3.0.9 or to use an isolated OpenSSL installation.
</div>

### Linux Docker container samples {#linux-docker-samples}

For the supported Linux distributions we provide Docker container based example scripts to demonstrate the different signing tool scenarios, their configuration and the required dependencies.

See the `samples` directory in the Linux Crypto Provider package. It contains a `README.md` file with further information.

All of the provided scripts can also be executed outside of a Docker container. However, we recommend to perform the signing operations in a container to keep the dependencies in one manageable place, especially for GPG based signing tools.

## Installation

Depending on the signing tool you're using, the corresponding Crypto Provider needs to be installed (on all build nodes).

* **SignPath KSP or CSP** for [SignTool.exe](#signtool) and most native Windows tools
* **SignPath Cryptoki** for [OpenSSL](#openssl), [jarsigner](#jarsigner), and many other Open Source tools

### CSP/KSP installation (Windows) {#csp-ksp-installation}

To install both CSP and KSP,

1. Copy the contents of the `Windows` directory of the Crypto Providers ZIP archive to the target system.

1. Run the following command with Administrator privileges in the destination directory:

   ~~~powershell
   powershell -ExecutionPolicy RemoteSigned .\InstallCspKsp.ps1
   ~~~


1. Continue with the [configuration](#crypto-provider-configuration).

Alternatively, you can also run `.\InstallCspKsp.ps1` within a PowerShell or PowerShell Core session.

<div class="panel info" markdown="1">
<div class="panel-header">Verification</div>

To verify the successful registration of the CSP and KSP, you can use the following command:

~~~powershell
certutil -csplist
~~~

It should contain two entries:

   * `Provider Name: SignPathCSP`
   * `Provider Name: SignPathKSP`

</div>

CSPs [are deprecated by Microsoft](https://learn.microsoft.com/en-us/windows/win32/seccrypto/cryptographic-service-providers) and therefore most tools only require a KSP. In case you only want to install the KSP, use the following command:

~~~powershell
powershell -ExecutionPolicy RemoteSigned .\InstallCspKsp.ps1 -InstallParts KSP
~~~

### Update to a new version

Installing a new version will overwrite the existing installation.

### Uninstallation

Run the following command with Administrator privileges in the installation directory:

~~~powershell
powershell -ExecutionPolicy RemoteSigned .\InstallCspKsp.ps1 Uninstall
~~~

This removes both the CSP and KSP version (in case they are installed).

### Cryptoki

Simply copy-deploy the `Windows\SignPath.Cryptoki.dll` (Windows) resp. `Linux/libSignPath.Cryptoki/`&#8203;`<OpenSslVersion>/`&#8203;`libSignPath.Cryptoki.so` (Linux) library file of the Crypto Providers ZIP archive. To choose the right OpenSSL version, check the output of `openssl version` on your target system.

The various [signing tools](#cryptoki-signing-tools) require the target system's file path of the library file in their configurations.

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

## SignPath Project configuration {#signpath-project-configuration}

In order to perform hash-based signing with the Crypto Providers, perform the following steps in the SignPath UI:

1. Create a new _Project_ with an _Artifact Configuration_ of type _Hash signing data_ and remember the _Project slug_.
<!-- TODO must be default artifact configuration? -->
1. Create an dedicated CI User (recommended) or generate an API Token for your own Interactive User and remember the API token.
1. Create a _Signing Policy_ for the _Project_ and add a _the CI or Interactive User_ as a _Submitter_. Remember _Signing Policy slug_.

## Signing tools based on Windows KSP or CSP Crypto Provider {#windows-ksp-csp-signing-tools}

### General instructions

This section provides information to use SignPath with any tool that supports KSP or CSP providers. Below this section you will find instructions for specific tools.

Specify the following values using the parameters provided by your signing tool:

{%- assign table = site.data.tables.crypto-providers.csp-ksp-general-params -%}
{%- include render-table.html -%}

<div class="panel info" markdown="1">
<div class="panel-header">Keys are not specified directly</div>

The KSP and CSP interfaces expect you to identify a key, but SignPath requires you to specify _Project_ and _Signing Policy_. SignPath will select the correct key or certificate based on the _Project_ and _Signing Policy_ you specify.

</div>

### Error return values for KSP and CSP functions

The following table shows the KSP `HRESULT` result codes for the different error situations when calling the SignPath REST API.
Note that the CSP error code has to be retrieved via [`GetLastError()`](https://learn.microsoft.com/en-us/windows/win32/api/errhandlingapi/nf-errhandlingapi-getlasterror).

{%- assign table = site.data.tables.crypto-providers.csp-ksp-errors -%}
{%- include render-table.html -%}

### SignTool.exe {#signtool}

_[SignTool.exe]_ is a command line tool by Microsoft. _SignTool.exe_ can use both the SignPath CSP and the SignPath KSP. We recommend using the SignPath KSP whenever possible.

<div class="panel warning" markdown="1">
<div class="panel-header">Important</div>

Only the 64-bit version of _SignTool.exe_ is supported.

</div>

#### Invocation

_SignTool.exe_ requires the following parameters:

{%- assign table = site.data.tables.crypto-providers.signtool-parameters -%}
{%- include render-table.html -%}

Sample: sign `MyApp.exe`

~~~powershell
signtool.exe sign /csp SignPathKSP /kc "$ProjectSlug/$SigningPolicySlug" /fd SHA256 /f "certificate.cer" "MyApp.exe"
~~~

<div class="panel tip" markdown="1">
<div class="panel-header">Tip: Diagnostics</div>

Specify `/v` to enable verbose output.

</div>

<div class="panel warning" markdown="1">
<div class="panel-header">Warning: Produce correct timestamps</div>

When using SignTool.exe (or any other signing tool) directly, you are responsible for correct time stamping. See [Timestamps](#timestamps)

</div>

## Signing tools based on Cryptoki/PKCS #11 (Windows and Linux) {#cryptoki-signing-tools}

### General instructions

This section provides information how to use the SignPath Cryptoki library with any tool that supports Cryptoki. Below this section you will find instructions for specific tools.

#### Parameters {#cryptoki-parameters}

Cryptoki-enabled tools usually provide the following parameters:

{%- assign table = site.data.tables.crypto-providers.cryptoki-parameters -%}
{%- include render-table.html -%}

<div class="panel info" markdown="1">
<div class="panel-header">Keys are not specified directly</div>

The Cryptoki API expects you to identify a key, but SignPath requires you to specify a _Project_ and a _Signing Policy_. SignPath will select the correct key or certificate based on the _Project_ and _Signing Policy_ you specify.

</div>

How these parameters can be specified depends on the tool being used. Since not all tools support Cryptoki directly, parameters are sometimes passed indirectly or using a specific syntax for an existing tool parameter (see the next section).

#### Integration with signing tools

For Cryptoki-based signing, tool setup can be complex. Unlike the KSP/CSP provider architecture of Windows, Cryptoki is not a system API. As a consequence, support for Cryptoki libraries varies significantly between tools:

* A tool might directly support Cryptoki (and will provide a parameter or configuration option to specify the Cryptoki library and key identifier)
* A tool might support different engines. If it doesn't come with a Cryptoki engine, you need to get it from another source and install it. In this case you need to 
  * specify the engine in the tool's configuration or parameter list,
  * _and_ specify the SignPath Cryptoki library in the engine's configuration
* A tool might internally call another tool such as OpenSSL or GPG to create the signature

If your signing tool does not provide guidance for using Cryptoki libraries, you probably need a solid understanding of the specific tool chain to configure it. For better results, please also refer to [signing flow](#flow).

#### Error return values for Cryptoki/PKCS #11 functions

The following table shows the [PKCS #11] Cryptoki function return values for the different error situations when calling the SignPath REST API.

{%- assign table = site.data.tables.crypto-providers.cryptoki-errors -%}
{%- include render-table.html -%}

### OpenSSL {#openssl}

_[OpenSSL]_ is a toolkit that provides a range of cryptographic operations, including signing. This section describes how to use OpenSSL with the SignPath Cryptoki library.

<div class="panel warning" markdown="1">
<div class="panel-header">Important</div>

Only latest OpenSSL 1.1 and 3.x versions are supported. For Linux, see also the notes in [supported Linux distributions](#supported-linux-distributions).
</div>

### Prerequisites

_OpenSSL_ cannot directly communicate with a Cryptoki library. Instead, the [OpenSC pkcs11 OpenSSL engine](https://github.com/OpenSC/libp11) can be used as adapter between OpenSSL and the SignPath Cryptoki/PKCS #11 library.

**Windows:** Download `libp11-...-windows.zip ` from [OpenSC libp11 Releases](https://github.com/OpenSC/libp11/releases) and copy-deploy `pkcs11.dll` (x64 version).

**Linux:** Install the OpenSC pkcs11 engine via your package manager (e.g. `apt-get install libengine-pkcs11-openssl` in Ubuntu).

Sample: `openssl-signpath.cnf`

~~~ ini
config_diagnostics = 1
openssl_conf = openssl_init

[openssl_init]
engines = engines_section

[engines_section]
pkcs11 = pkcs11_section

[pkcs11_section]
engine_id = pkcs11
dynamic_path = /path/to/libpkcs11.so
MODULE_PATH = /path/to/libSignPath.Cryptoki.so
default_algorithms = ALL
init = 0
PIN = CONFIG
~~~


<div class="panel info" markdown="1">
<div class="panel-header">Default installation paths of libp11</div>

Note that Linux distributions have different default installation paths for `libpkcs11.so`:

{%- assign table = site.data.tables.crypto-providers.openssl-libp11-installation-paths -%}
{%- include render-table.html -%}

</div>

For Windows use .dll paths respectively (note the double backslashes):

~~~ ini
dynamic_path = C:\\path\\to\\pkcs11.dll
MODULE_PATH = C:\\path\\to\\SignPath.Cryptoki.dll
~~~

Also set the following environment variable:

{%- assign table = site.data.tables.crypto-providers.openssl-env -%}
{%- include render-table.html -%}

#### Invocation

_OpenSSL_ provides a variety of commands that can be used for signing. In this section, a few of them are outlined.

<div class="panel tip" markdown="1">
<div class="panel-header">Tip</div>

For *Linux*, configuration, signing invocation and verification examples are provided in the Docker container samples via `.\RunScenario.ps1 ... -Scenario OpenSSL`. See [Linux container samples](#linux-docker-samples).

</div>

Generally, all commands require the following parameters to work with the SignPath Cryptoki library:

{%- assign table = site.data.tables.crypto-providers.openssl-invocation-params -%}
{%- include render-table.html -%}

<div class="panel info" markdown="1">
<div class="panel-header">Keys are not specified directly</div>

The Cryptoki API expects you to identify a key, but SignPath requires you to specify a _Project_ and a _Signing Policy_. SignPath will select the correct key or certificate based on the _Project_ and _Signing Policy_ you specify.
</div>

#### openssl dgst

The _[dgst][openssl-dsgt]_ command calculates digests of files, but can also be used to create and verify signatures.

Sample: sign `artifact.bin` and write the signature to `artifact.sig`.

~~~ powershell
openssl dgst -engine pkcs11 -keyform engine -sign "pkcs11:id=$ProjectSlug/$SigningPolicySlug;type=private" -sha256 -out "artifact.sig" "artifact.bin"
~~~ 

<div class="panel info" markdown="1">
<div class="panel-header">Supported digests</div>

The following digests are supported: `sha256`, `sha384`, `sha512`
</div>

#### openssl pkeyutl

The _[pkeyutl][openssl-pkeyutl]_ command performs low-level cryptographic operations, such as signing.

<!-- todo omit?-->
<div class="panel info" markdown="1">
<div class="panel-header">Note: provide binary hash digest</div>

The command does hash the input data but will use the data directly as an input for the signature algorithm. To create the hash of a file, you can use the following snippet:

~~~ powershell
$ArtifactHash = Get-FileHash "artifact.bin" -Algorithm "SHA256" # SHA1, SHA256, SHA384 and SHA512 are supported
$ArtifactHashBytes = [byte[]] -split ($ArtifactHash.Hash -replace '..', '0x$& ')
[IO.File]::WriteAllBytes("artifact.hash.bin", $ArtifactHashBytes)
~~~
</div>

Sample: sign the hash code in `artifact.hash.bin` using PKCS1 padding, write the signature to `artifact.sig`

~~~ powershell
openssl pkeyutl -engine pkcs11 -keyform engine -inkey "pkcs11:id=$ProjectSlug/$SigningPolicySlug;type=private" -sign -in "artifact.hash.bin" -out "artifact.sig" -pkeyopt digest:sha256 -pkeyopt rsa_padding_mode:pkcs1
~~~

Sample: sign the hash code in `artifact.hash.bin` using PSS padding, write the signature to `artifact.sig`

~~~ powershell
openssl pkeyutl -engine pkcs11 -keyform engine -inkey "pkcs11:id=$ProjectSlug/$SigningPolicySlug;type=private" -sign -in "artifact.hash.bin" -out "artifact.sig" -pkeyopt digest:sha256 -pkeyopt rsa_padding_mode:pss -pkeyopt rsa_pss_saltlen:-1 -pkeyopt rsa_mgf1_md:sha256
~~~

#### openssl cms

The _[cms][openssl-cms]_ command can be used to create embedded S/MIME or detached PEM/DER signatures. It uses the Cryptographic Message Syntax format (CMS, formerly known as PKCS#7).

`openssl cms` requires the X.509 certificate corresponding to the SignPath Project and Signing Policy to be downloaded from SignPath and converted to _PEM format_. You can convert the certificate using OpenSSL via the following example.

~~~ powershell
openssl x509 -inform DER -in "certificate.cer" -outform PEM -out "certificate.pem"
~~~

Sample: sign the file `artifact.bin` using `certificate.pem`, write the detached signature to `artifact.sig` in PEM format

~~~ powershell
openssl cms -engine pkcs11 -signer "certificate.pem" -inkey "pkcs11:id=$ProjectSlug/$SigningPolicySlug;type=private" -keyform engine -sign -binary -in "artifact.bin" -noattr -out "artifact.sig" -outform PEM
~~~


<div class="panel warning" markdown="1">
<div class="panel-header">Important</div>

_OpenSSL_ fails to verify signatures that were created using X.509 certificates with the Extended Key Usage Code Signing (1.3.6.1.5.5.7.3.3).
</div>


### osslsigncode {#osslsigncode}

_[osslsigncode]_ is a tool that allows applying Windows Authenticode signatures on Linux systems using [OpenSSL](#openssl).

<div class="panel warning" markdown="1">
<div class="panel-header">Important</div>

Only osslsigncode 2.x or higher is supported. Also see the notes in [supported Linux distributions](#supported-linux-distributions) regarding the supported OpenSSL versions.
</div>

#### Prerequisites

As [osslsigncode] uses [OpenSSL](#openssl), it also requires an [OpenSC pkcs11 OpenSSL engine](https://github.com/OpenSC/libp11) installation.

#### Invocation

<div class="panel tip" markdown="1">
<div class="panel-header">Tip</div>

The following invocation examples are also provided in the Docker container samples via `.\RunScenario.ps1 ... -Scenario osslsigncode`. See [Linux container samples](#linux-docker-samples).
</div>

`osslsigncode` requires the X.509 certificate corresponding to the SignPath Project and Signing Policy to be downloaded from SignPath and converted to _PEM format_. You can convert the certificate using OpenSSL via the following example.

~~~ powershell
openssl x509 -inform DER -in "certificate.cer" -outform PEM -out "certificate.pem"
~~~

##### Signing an .exe file

~~~ powershell
osslsigncode sign `
   -pkcs11module $LibSignPathCryptokiPath `
   -key "pkcs11:id=$ProjectSlug/$SigningPolicySlug;type=private;pin-value=CONFIG" `
   -certs "certificate.pem" `
   -in "sample.exe" -out "sample.signed.exe"
~~~

{%- assign table = site.data.tables.crypto-providers.osslsigncode-invocation-params -%}
{%- include render-table.html -%}

### OpenSC pkcs11-tool (Linux)

The [OpenSC](https://github.com/OpenSC/OpenSC) [`pkcs11-tool`](https://linux.die.net/man/1/pkcs11-tool) utility can be used to troubleshoot PKCS #11 modules (e.g. listing all available objects or supported algorithms) but also can be used to read certificates/public keys and to perform signing operations.

#### Prerequisites

Before version 0.23, `pkcs11-tool` always opened the Cryptoki session in a read/write mode (see [GitHub issue #2182](https://github.com/OpenSC/OpenSC/issues/2182)) and therefore fails with a _"PKCS11 function C_OpenSession failed: rv = CKR_TOKEN_WRITE_PROTECTED"_ error. To enable compatibility with these earlier versions you need to set the `Cryptoki.DoNotFailOnReadWriteSessions` value in the SignPath [Crypto Provider configuration](#crypto-provider-config-values).

#### Invocation

<div class="panel tip" markdown="1">
<div class="panel-header">Tip</div>

The following invocation examples are also provided in the Docker container samples via `.\RunScenario.ps1 ... -Scenario Pkcs11Tool`. See [Linux container samples](#linux-docker-samples).
</div>

##### Common parameters

~~~ powershell
pkcs11-tool --module $LibSignPathCryptokiPath --pin CONFIG ...
~~~

{%- assign table = site.data.tables.crypto-providers.pkcs11-tool-invocation-common-parameters -%}
{%- include render-table.html -%}

##### Listing of the available PKCS #11 objects

The following command lists available objects, which corresponds to the list of signing policies for which the authenticated user has _Submitter_ permissions.

~~~ powershell
pkcs11-tool --module $LibSignPathCryptokiPath --pin CONFIG --list-objects
~~~

#### Signing operation

The following sample call shows an RSA signing operation using PSS padding and SHA-256.

~~~ powershell
pkcs11-tool --module $LibSignPathCryptokiPath --pin CONFIG `
   --sign --mechanism "RSA-PKCS-PSS" --hash-algorithm "SHA256" --label "$ProjectSlug/$SigningPolicySlug" `
   --input-file "artifact.hash.bin" --output-file "artifact.sig"
~~~

{%- assign table = site.data.tables.crypto-providers.pkcs11-tool-invocation-signing-parameters -%}
{%- include render-table.html -%}

### Java jarsigner {#jarsigner}

The [`jarsigner`](https://docs.oracle.com/en/java/javase/17/docs/specs/man/jarsigner.html) command signs and verifies Java archives (e.g. JAR, WAR, EAR). It is included with the Java Development Kit (JDK).

#### Prerequisites

1. Configure the SunPKCS11 Provider
   * OpenJDK: the provider is configured automatically
   * Oracle JDK: see [Oracle PKCS#11 Reference Guide][oracle-install]
2. Register the SignPath Cryptoki library for the SunPKCS11 Provider 

Sample `pkcs11.config`

~~~ ini
name=SignPath.Cryptoki
library=<path>\SignPath.Cryptoki.dll
slot=1
~~~

#### Invocation

<div class="panel tip" markdown="1">
<div class="panel-header">Tip</div>

For *Linux*, configuration and invocation examples are provided in the Docker container samples via `.\RunScenario.ps1 ... -Scenario JarSigner`. See [Linux container samples](#linux-docker-samples).

</div>

Synopsis for _jarsigner_ when using the SignPath Cryptoki library:

~~~
jarsigner <parameters> <jar-files> <keystore-alias>
~~~

{%- assign table = site.data.tables.crypto-providers.jarsigner-invocation-parameters -%}
{%- include render-table.html -%}

Sample: sign `myapp.jar`

~~~ powershell
jarsigner -keystore NONE -storetype PKCS11 -providerClass "sun.security.pkcs11.SunPKCS11" -providerArg pkcs11.config -sigalg "SHA256withRSA" -storepass "CONFIG" myapp.jar "$ProjectSlug/$SigningPolicySlug" 
~~~

<div class="panel warning" markdown="1">
<div class="panel-header">Warning: Produce correct timestamps</div>

When using jarsigner (or any other signing tool) directly, you are responsible for correct time stamping. See [Timestamps](#timestamps)

</div>

### GPG Signing with GnuPG (Linux) {#gpg-signing}

GnuPG does not directly support PKCS #11/Cryptoki but offers a ["Smart Card" interface](https://wiki.gnupg.org/SmartCard), normally used to access smart card or USB token based HSMs.

Here the [gnupg-pkcs11-scd](https://github.com/alonbl/gnupg-pkcs11-scd/) project comes into play, which uses the GnuPG smart card interface to adapt to a PKCS #11 Crypto Provider. This tool runs as a GnuPG smart card daemon which we use to connect GnuPG to the SignPath PKCS #11/Cryptoki Crypto Provider as shown in the following figure.

![Figure: GPG signing flow](/assets/img/resources/documentation_crypto_providers-GpgSigningFlow.svg)

#### Configuring GnuPG {#configure-gnupg}

Both GnuPG (`gpg-agent.conf`) and gnupg-pkcs11-scd (`gnupg-pkcs11-scd.conf`) need to be set up to use the SignPath Cryptoki Crypto Provider.

For details how these files need to be configured and about the necessary dependencies, see `samples/Scenarios/Gpg` and the `UseSignPathCryptokiGpgConfiguration` function in the [Linux container samples](#linux-docker-samples).

#### GPG Key Generation {#gpg-key-generation}

GPG has an own key format and therefore SignPath's X.509 certificates cannot be directly used. Instead you have to generate a GPG key which _references_ a SignPath certificate. This means creating a new GPG key which includes the RSA public key of a SignPath certificate and "links" the RSA private key (which resides in SignPath's HSMs). This is possible via a ["shadowed private key"](https://github.com/gpg/gnupg/blob/STABLE-BRANCH-2-2/agent/keyformat.txt#shadowed-private-key-format) stored within `$GNUPGHOME/private-keys-v1.d/<KeyGrip>.key` which basically references a SignPath project and signing policy slug within.

Although the RSA key is used from the SignPath certificate, GPG keys hold their own metadata like name, email and expiration date which need to be specified during the GPG key generation. As defaults we use `"SignPath <ProjectSlug> / <SigningPolicySlug>` for the full name,  `"<SigningPolicySlug>@<ProjectSlug>` as email and 1 year expiration.

As the SignPath X.509 certificate's issuer and validity time range is not used, you can use a separate self-signed certificate in SignPath with an arbitrary validity time range. Alternatively, you could also use your existing (public-trusted) code signing certificates.

The [Linux container samples](#linux-docker-samples) contain scripts to generate a GPG key via `.\RunScenario.ps1 ... -Scenario GenerateGpgKey`. See `GenerateGpgKey.ps1` for details how the different commands are parametrized. In the same script the GPG key metadata defaults can be overridden.

The outcome of `GenerateGpgKey` is a GPG key, which is exported to `samples/Scenarios/Gpg/Keys` including the public key and a corresponding revocation certificate in the `openpgp-revocs.d` subdirectory.
The public key (`<Email>.public.pgp` file) needs to be transported to the system which should later perform the GPG signing operations.
Note that the shadowed private key file does not need to be transported as it can be restored by running the `SCD LEARN` command via `gpg-connect-agent` (see `FetchGpgKeyInfos` function in the Linux container samples).

During the GPG key generation two SignPath hash signing operations happen: One to self-sign the key and one to sign the revocation certificate.

#### GPG File Signing {#gpg-file-signing}

**Preparation**: Before running a GPG signing operation via `gpg --sign ...`, the following steps are necessary.

1. [Generate a GPG key](#gpg-key-generation)
1. Copy the generated public GPG key (`<Email>.public.pgp`) to the target system
1. [Configure GPG](#configure-gnupg) (After the `SCD LEARN` command, all keys which are available for the ApiToken are restored as shadowed private keys and therefore can be used by the corresponding GPG keys, see `UseSignPathCryptoki`&#8203;`GpgConfiguration` function in the Linux container samples)
1. Import the GPG key (see `ImportGpgKeys` function in the Linux container samples)

The [Linux container samples](#linux-docker-samples) contain a full example to sign and verify a file with a detached signature (including the mentioned preparation steps) in `.\RunScenario.ps1 ... -Scenario GpgSignFile`. The used GPG key is referenced via its email address.

During `gpg --sign`, SignPath is called to perform a hash based signing operation with the _Project_ / _Signing Policy_ referenced in the shadowed private key. Note that the _OrganizationId_ and the _ApiToken_ still need to be passed to the SignPath Crypto Provider to authenticate the request.

### RPM Signing (Linux)

RPM signing is based on [GPG signing](#gpg-signing). Therefore the preparation steps mentioned in [GPG File Signing](#gpg-file-signing) are necessary before signing via `rpm --addsign`.

The [Linux container samples](#linux-docker-samples) contain a full example to sign and verify a RPM file (including the mentioned preparation steps) in `.\RunScenario.ps1 ... -Scenario SignRpm`. The used GPG key is referenced via its email address. See `SignRpm.ps1` for details.

During `rpm --addsign`, SignPath is called to perform a hash based signing operation with the _Project_ / _Signing Policy_ referenced in the shadowed private key. Note that the _OrganizationId_ and the _ApiToken_ still need to be passed to the SignPath Crypto Provider to authenticate the request.

### DEB Signing via dpkg-sig (Linux)

Debian package signing via [dpkg-sig](https://manpages.debian.org/bullseye/dpkg-sig/dpkg-sig.1.en.html) signing is based on [GPG signing](#gpg-signing). Therefore the preparation steps mentioned in [GPG File Signing](#gpg-file-signing) are necessary before signing via _dpkg-sig_.

The [Linux container samples](#linux-docker-samples) contain a full example to sign and verify a DEB file (including the mentioned preparation steps) in `.\RunScenario.ps1 ... -Scenario SignDeb`. The used GPG key is referenced via its email address. Note the passed default "sign role" value of `"builder"`.

During `dpkg-sig --sign`, SignPath is called to perform a hash based signing operation with the project / signing policy referenced in the shadowed private key. Note that OrganizationId and the ApiToken still need to be passed to the SignPath Crypto Provider to authenticate the request.

### Maven Artifact Signing (Linux)

Maven artifacts can be signed with the [Apache maven-gpg-plugin](https://maven.apache.org/plugins/maven-gpg-plugin/) which uses [GPG](#gpg-signing) commands to sign the different artifact files (e.g. .JAR files). Therefore, the preparation steps mentioned in [GPG File Signing](#gpg-file-signing) are necessary before signing.

The [Linux container samples](#linux-docker-samples) contain a full example to build, sign and verify Maven artifacts (including the mentioned preparation steps) in `.\RunScenario.ps1 ... -Scenario SignMaven`. The used GPG key is referenced via its email address.

During `mvn install`, SignPath is called to perform a hash based signing operations with the _Project_ / _Signing Policy_ referenced in the shadowed private key. Note that the _OrganizationId_ and the _ApiToken_ still need to be passed to the SignPath Crypto Provider to authenticate the request.

## Direct usage of the SignPath REST API

As an alternative to using a Crypto Provider client, signing requests to a ["Hash signing data"](#signpath-project-configuration) project can also be performed directly via SignPath's REST API.

All API requests require the following parameters:

{%- assign table = site.data.tables.crypto-providers.rest-api-parameters -%}
{%- include render-table.html -%}

### Signing Request

The signing request (which contains the hash to sign and metadata) is an HTTP POST request to `$ApiUrl/v1/$OrganizationId/`&#8203;`SigningRequests` with the following `multipart/form-data` fields:

{%- assign table = site.data.tables.crypto-providers.rest-api-signing-request-fields -%}
{%- include render-table.html -%}

Example request:

~~~ powershell
$FormBoundary = New-Guid

$Response = Invoke-WebRequest -Method Post -Uri "$ApiUrl/v1/$OrganizationId/SigningRequests" `
    -ContentType "multipart/form-data; boundary=$FormBoundary" `
    -Headers @{ Authorization = "Bearer $ApiToken" } -Body @"
--$FormBoundary
Content-Disposition: form-data; name="ProjectSlug"

$ProjectSlug
--$FormBoundary
Content-Disposition: form-data; name="SigningPolicySlug"

$SigningPolicySlug
--$FormBoundary
Content-Disposition: form-data; name="IsFastSigningRequest"

true
--$FormBoundary
Content-Disposition: form-data; name="Artifact"; filename="payload.json"
Content-Type: application/json

{
    "SignatureAlgorithm": "RsaPkcs1",
    "RsaHashAlgorithm": "2.16.840.1.101.3.4.2.1",
    "Base64EncodedHash": "GJShnIW6FTrL90OsTkP8AEyJFgSyb4xp4eg+oq/HxI8=",

    "Metadata":
    {
        "CreatingProcess": { "CommandLine": "SampleCommand -SampleArgument", "User": "SampleUser" }
    }
}
--$FormBoundary--
"@
~~~

#### payload.json format {#hash-signing-payload-json}

{%- assign table = site.data.tables.crypto-providers.rest-api-payload-json -%}
{%- include render-table.html -%}

<div class="panel info" markdown="1">
<div class="panel-header">Key length</div>

The used key length and therefore the length of the resulting `Signature` in the response depends on the key length of the used certificate referenced in the signing policy. For ECDSA signatures also the used curve is determined by the certificate.

</div>

#### Response {#signing-request-response}


The response contains a JSON body with the following content depending on the request's `IsFastSigningRequest` value.

* If `IsFastSigningRequest` was `true`: The Base64-encoded signature in the `Signature` property and the repeated incoming JSON properties.

   Example response:

   ~~~ JSON
   {
      "SignatureAlgorithm": "RsaPkcs1",
      "RsaHashAlgorithm": "2.16.840.1.101.3.4.2.1",
      "Base64EncodedHash": "GJShnIW6FTrL90OsTkP8AEyJFgSyb4xp4eg+oq/HxI8=",
      "Metadata": { ... },
      "Signature": "wGI2oiHHVSVGHR1rtjv83Pir1SEVLmnLNGuJD4..."
   }
   ~~~

* If `IsFastSigningRequest` was `false`: Only a `SigningRequestId` property. The actual signing operation will be performed asynchronously and can be retrieved via following `GET $ApiUrl/v1/$OrganizationId/`&#8203;`SigningRequests/$SigningRequestId` requests to check the status and retrieve the signature value.

## Retrieve Signing Policy details {#retrieve-signing-policy-details}

Via `GET $ApiUrl/v1/$OrganizationId/`&#8203;`Cryptoki/MySigningPolicies` all signing policies with the user referenced by the API token assigned as _Submitter_ can be queried. With optional `?projectSlug=$ProjectSlug&`&#8203;`signingPolicySlug=$SigningPolicySlug` query parameters the returned signing policies can be restricted (to exactly one if the project / signing policy exists).

The response contains signing policy details like the `signingPolicyId`, the RSA key parameters or the referenced X.509 certificate (`certificateBytes`).

Example response:

~~~ JSON
{
    "signingPolicies": [
        {
            "signingPolicySlug": "test-signing",
            "projectSlug": "hash-signing-test",
            "keySizeInBits": 2048,
            "rsaParameters": {
                "publicExponent": "AQAB",
                "modulus": "2e4JTm..."
            },
            "signingPolicyId": "eacd4b78-6038-4450-9eec-4acd1c7ba6f1",
            "certificateBytes": "MIIC5zCC...",
            "keyType": "Rsa",
            "publicKeyBytes": "MIIBCgKC..."
        },
        ... in case multiple signing policies match
    ]
}
~~~~

# Timestamps {#timestamps}

When using SignTool.exe (or any other signing tool) directly, you are responsible for correct time stamping. Here are a few hints:

* You may use the timestamp authority (TSA) provided by the certificate authority that issued your code signing certificate or any other CA that provides a free public TSA.
* TSAs may impose quota limits, and free TSAs usually don't provide any SLA level.
* TSAs may ignore the parameters you provide, e.g. the hashing algorithm. This may result in invalid timestamps. Depending on the platform, that might only lead to problems after the certificate becomes invalid.
* TSAs may use certificates with a short lifetime. Some platforms, such as Authenticode, accept expired TSA certificates. For other platforms, your signatures might become invalid after the TSA certificate has expired. A good TSA certificate should have a remaining lifetime of about 10 years or more.

Always check your signatures and timestamps to ensure that they will be valid after your certificate expires or gets revoked. Otherwise, your signatures may become invalid. Another problem is that revocation for compromised certificates becomes a much harder decision if you cannot rely on timestamps.

If you use the file-based signing method of SignPath, timestamps will be managed automatically.

# Signing flow {#flow}

This section describes how the various components work together to create a signature.

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

[PKCS #11]: https://docs.oasis-open.org/pkcs11/pkcs11-base/v2.40/os/pkcs11-base-v2.40-os.html
[CNG]: https://docs.microsoft.com/en-us/windows/win32/seccng/key-storage-and-retrieval
[CAPI]: https://docs.microsoft.com/en-us/windows/win32/seccrypto/cryptographic-service-providers
[SignTool.exe]: https://docs.microsoft.com/en-us/dotnet/framework/tools/signtool-exe
[OpenSSL]: https://www.openssl.org/
[openssl-dsgt]: https://www.openssl.org/docs/man1.1.1/man1/dgst.html
[openssl-pkeyutl]: https://www.openssl.org/docs/man1.1.1/man1/pkeyutl.html
[openssl-cms]: https://www.openssl.org/docs/man1.1.1/man1/cms.html
[oracle-install]: https://docs.oracle.com/en/java/javase/14/security/pkcs11-reference-guide1.html#GUID-C4ABFACB-B2C9-4E71-A313-79F881488BB9
[osslsigncode]: https://github.com/mtrojnar/osslsigncode
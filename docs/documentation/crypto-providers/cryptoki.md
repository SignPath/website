---
main_header: Crypto Providers
sub_header: Cryptoki/PKCS#11
layout: resources
toc: true
show_toc: 3
description: SignPath Cryptoki Crypto Providers
datasource: tables/crypto-providers
---

## General instructions

This section provides information how to use the SignPath Cryptoki library with any tool that supports Cryptoki. Below this section you will find instructions for specific tools.

### Installation

Simply copy-deploy the `Windows\SignPath.Cryptoki.dll` (Windows) resp. `Linux/libSignPath.Cryptoki/`&#8203;`<OpenSslVersion>/`&#8203;`libSignPath.Cryptoki.so` (Linux) library file of the Crypto Providers ZIP archive. To choose the right OpenSSL version, check the output of `openssl version` on your target system.

The various signing tools require the target system's file path of the library file in their configurations.

### Parameters {#cryptoki-parameters}

Additionally to the general [Crypto Provider configuration](/documentation/crypto-providers#crypto-provider-configuration), Cryptoki-enabled tools usually provide the following parameters:

{%- assign table = site.data.tables.crypto-providers.cryptoki-parameters -%}
{%- include render-table.html -%}

<div class="panel info" markdown="1">
<div class="panel-header">Keys are not specified directly</div>

The Cryptoki API expects you to identify a key, but SignPath requires you to specify a _Project_ and a _Signing Policy_. SignPath will select the correct key or certificate based on the _Project_ and _Signing Policy_ you specify.

</div>

How these parameters can be specified depends on the tool being used. Since not all tools support Cryptoki directly, parameters are sometimes passed indirectly or using a specific syntax for an existing tool parameter (see below).

### Error return values for Cryptoki/PKCS #11 functions

The following table shows the [PKCS #11] Cryptoki function return values for the different error situations when calling the SignPath REST API.

{%- assign table = site.data.tables.crypto-providers.cryptoki-errors -%}
{%- include render-table.html -%}

### Integration with signing tools

For Cryptoki-based signing, tool setup can be complex. Unlike the KSP/CSP provider architecture of Windows, Cryptoki is not a system API. As a consequence, support for Cryptoki libraries varies significantly between tools:

* A tool might directly support Cryptoki (and will provide a parameter or configuration option to specify the Cryptoki library and key identifier)
* A tool might support different engines. If it doesn't come with a Cryptoki engine, you need to get it from another source and install it. In this case you need to 
  * specify the engine in the tool's configuration or parameter list,
  * _and_ specify the SignPath Cryptoki library in the engine's configuration
* A tool might internally call another tool such as OpenSSL or GPG to create the signature

If your signing tool does not provide guidance for using Cryptoki libraries, you probably need a solid understanding of the specific tool chain to configure it. For better results, please also refer to [signing flow](/documentation/crypto-providers#flow).

## OpenSSL {#openssl}

_[OpenSSL]_ is a toolkit that provides a range of cryptographic operations, including signing.

<div class="panel warning" markdown="1">
<div class="panel-header">Important</div>

Only latest OpenSSL 1.1 and 3.x versions are supported. For Linux, see also the notes in [supported Linux distributions](/documentation/crypto-providers#supported-linux-distributions).
</div>

### Setup

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

### Invocation

_OpenSSL_ provides a variety of commands that can be used for signing. In this section, a few of them are outlined.

<div class="panel tip" markdown="1">
<div class="panel-header">Tip</div>

For *Linux*, configuration, signing invocation and verification examples are provided in the Docker container samples via `.\RunScenario.ps1 ... -Scenario OpenSSL`. See [Linux container samples](#linux-docker-samples).

</div>

Generally, all commands require the following parameters to work with the SignPath Cryptoki library:

{%- assign table = site.data.tables.crypto-providers.openssl-invocation-params -%}
{%- include render-table.html -%}

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


## osslsigncode {#osslsigncode}

_[osslsigncode]_ is a tool that allows applying Windows Authenticode signatures on Linux systems using OpenSSL. Accordingly, it also requires an OpenSC pkcs11 OpenSSL engine installation. See the [OpenSSL](#openssl) section for details.

<div class="panel warning" markdown="1">
<div class="panel-header">Important</div>

Only osslsigncode 2.x or higher is supported. Also see the notes in [supported Linux distributions](/documentation/crypto-providers#supported-linux-distributions) regarding the supported OpenSSL versions.
</div>

### Setup

`osslsigncode` requires the X.509 certificate corresponding to the SignPath Project and Signing Policy to be downloaded from SignPath and converted to _PEM format_. You can convert the certificate using OpenSSL via the following example.

~~~ powershell
openssl x509 -inform DER -in "certificate.cer" -outform PEM -out "certificate.pem"
~~~

### Invocation

~~~ powershell
osslsigncode sign `
   -pkcs11module $LibSignPathCryptokiPath `
   -key "pkcs11:id=$ProjectSlug/$SigningPolicySlug;type=private;pin-value=CONFIG" `
   -certs "certificate.pem" `
   -in "sample.exe" -out "sample.signed.exe"
~~~

{%- assign table = site.data.tables.crypto-providers.osslsigncode-invocation-params -%}
{%- include render-table.html -%}

<div class="panel tip" markdown="1">
<div class="panel-header">Tip</div>

This invocation example is also provided in the Docker container samples via `.\RunScenario.ps1 ... -Scenario osslsigncode`. See [Linux container samples](/documentation/crypto-providers#linux-docker-samples).
</div>

## OpenSC pkcs11-tool (Linux)

The [OpenSC](https://github.com/OpenSC/OpenSC) [`pkcs11-tool`](https://linux.die.net/man/1/pkcs11-tool) utility can be used to troubleshoot PKCS #11 modules (e.g. listing all available objects or supported algorithms) but also can be used to read certificates/public keys and to perform signing operations.

### Setup

Before version 0.23, `pkcs11-tool` always opened the Cryptoki session in a read/write mode (see [GitHub issue #2182](https://github.com/OpenSC/OpenSC/issues/2182)) and therefore fails with a _"PKCS11 function C_OpenSession failed: rv = CKR_TOKEN_WRITE_PROTECTED"_ error. To enable compatibility with these earlier versions you need to set the `Cryptoki.DoNotFailOnReadWriteSessions` value in the SignPath [Crypto Provider configuration](/documentation/crypto-providers#crypto-provider-config-values).

### Invocation

<div class="panel tip" markdown="1">
<div class="panel-header">Tip</div>

The following invocation examples are also provided in the Docker container samples via `.\RunScenario.ps1 ... -Scenario Pkcs11Tool`. See [Linux container samples](/documentation/crypto-providers#linux-docker-samples).
</div>

#### Common parameters

~~~ powershell
pkcs11-tool --module $LibSignPathCryptokiPath --pin CONFIG ...
~~~

{%- assign table = site.data.tables.crypto-providers.pkcs11-tool-invocation-common-parameters -%}
{%- include render-table.html -%}

#### Listing of the available PKCS #11 objects

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

## Java jarsigner {#jarsigner}

The [`jarsigner`](https://docs.oracle.com/en/java/javase/17/docs/specs/man/jarsigner.html) command signs and verifies Java archives (e.g. JAR, WAR, EAR). It is included with the Java Development Kit (JDK).

### Setup

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

### Invocation

<div class="panel tip" markdown="1">
<div class="panel-header">Tip</div>

For *Linux*, configuration and invocation examples are provided in the Docker container samples via `.\RunScenario.ps1 ... -Scenario JarSigner`. See [Linux container samples](/documentation/crypto-providers#linux-docker-samples).

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

When using jarsigner (or any other signing tool) directly, you are responsible for correct time stamping. See [Timestamps](/documentation/crypto-providers#timestamps)

</div>

[OpenSSL]: https://www.openssl.org/
[openssl-dsgt]: https://www.openssl.org/docs/man1.1.1/man1/dgst.html
[openssl-pkeyutl]: https://www.openssl.org/docs/man1.1.1/man1/pkeyutl.html
[openssl-cms]: https://www.openssl.org/docs/man1.1.1/man1/cms.html
[oracle-install]: https://docs.oracle.com/en/java/javase/14/security/pkcs11-reference-guide1.html#GUID-C4ABFACB-B2C9-4E71-A313-79F881488BB9
[osslsigncode]: https://github.com/mtrojnar/osslsigncode
---
header: Cryptoki/PKCS #11
layout: resources
toc: true
show_toc: 3
description: SignPath Cryptoki Crypto Providers
---

## General instructions

The SignPath Cryptoki library is used to enable code signing using tools that support the Cryptoki/PKCS #11 standard.

{:.panel.info #about-cryptoki}
> **Cryptoki and PKCS #11** 
>
> Cryptoki is the _Cryptographic Token Interface_ [defined](https://docs.oasis-open.org/pkcs11/pkcs11-base/v2.40/os/pkcs11-base-v2.40-os.html) by the PKCS #11 standard. 
> It is used by cryotographic software to access encryption and signing keys that are not stored on disks. 
>
> Cryptoki/PKCS #11 is primarily used in the Open Source ecosystem, e.g. Linux tools and their ports to other platforms including Windows. 
> Some tools support it indirectly through their own provider ecosystem, e.g. [Java via SunPKCS11](#jarsigner) and [GPG via gnupg-pkcs11-scd](gpg).

This section provides general information about using the SignPath Cryptoki library with code signing tools. Subsequent sections provide instructions for specific tools.

### Supported Linux distributions {#supported-linux-distributions}

| Distribution | Version            | Comment
|--------------|--------------------|------------------------
| Debian       | 11 "bullseye"
| Debian       | 12 "bookworm"
| Ubuntu       | 20.04              | Except [osslsigncode](#osslsigncode)
| Ubuntu       | 22.04              |
| Ubuntu       | 24.04              |
| RedHat       | 8 (latest minor)
| RedHat       | 9 (latest minor)

> **OpenSSL 3.0.0 - 3.0.8 incompatibility**
>
> Distributions with an OpenSSL version between 3.0.0 and 3.0.8 (including) don't support the the [OpenSSL](#openssl) and [osslsigncode](#osslsigncode) scenarios.
> The reason is an [OpenSSL bug](https://github.com/openssl/openssl/issues/20161) which has been fixed in OpenSSL 3.0.9.
> The issue results in _"http_exception occurred (error code= generic:168296454): Error in SSL handshake"_ errors.
>
> You need to replace the system's OpenSSL version with >= 3.0.9 or use an isolated OpenSSL installation.
{:.panel.warning}

### Installation

#### Windows

The Cryptoki library is installed to `%ProgramFiles%\SignPath\CryptoProviders\SignPath.Cryptoki.dll` by the [MSI installer](/documentation/crypto-providers/windows#installation).

Alternatively, you can copy-deploy `Windows\SignPath.Cryptoki.dll` from the Crypto Providers ZIP archive to your target system.

#### Linux

Copy-deploy the Cryptoki library `Linux/libSignPath.Cryptoki/$OpenSslVersion/libSignPath.Cryptoki.so` from the Crypto Providers ZIP archive to your target system.

Check the output of `openssl version` on your target system to select the correct OpenSSL version.

### Parameters {#cryptoki-parameters}

Signing tools with Cryptoki support usually provide _PIN_ and _key ID_ parameters. These are passed to the respective Cryptoki provider. For SignPath, provide the following values:

| Tool parameter | Value (using SignPath provider)         | Description
|----------------|-----------------------------------------|------------------------------------------
| _PIN_          | `$OrganizationId:$ApiToken` or `CONFIG` | SignPath _Organization_ and _Submitter_ API token, separated by a colon. Specify `CONFIG` to use the values definded in [the configuration file or environment variables](/documentation/crypto-providers#crypto-provider-config-values)
| _key ID_       | `$ProjectSlug/$SigningPolicySlug`       | SignPath _Project_ and _Signing Policy_ slugs, separated by a forward slash

Name and synopsis for these parameters depend on the tool. For tools that support Cryptoki only [indirectly](#about-cryptoki), parameters may also be passed indirectly or using a specific syntax for an existing tool parameter (see below).

{:.panel.info}
> **Keys are not specified directly**
>
> The Cryptoki API expects you to identify a _key_, but SignPath requires you to specify a _Project_ and a _Signing Policy_. SignPath will select the key or certificate of the specified _Signing Policy_.

### Error handling

The following table shows the [PKCS #11] Cryptoki function return values for the different error situations when calling the SignPath REST API.

| Situation                                                          | PKCS #11 error code
|--------------------------------------------------------------------|--------------------------
| Transient errors like HTTP timeouts or 503                         | `CKR_FUNCTION_FAILED`
| Non-transient service errors (e.g. 500 Internal Server Error)      | `CKR_DEVICE_ERROR`
| User errors detected by service (4xx returned)                     | `CKR_ARGUMENTS_BAD`
| Other unspecified errors (fall back)                               | `CKR_GENERAL_ERROR`

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

{:.panel.warning}
> **Important**
>
> Only latest OpenSSL 1.1 and 3.x versions are supported. For Linux, see also the notes in [supported Linux distributions](#supported-linux-distributions).

#### Setup

_OpenSSL_ cannot directly communicate with a Cryptoki library. Instead, the [OpenSC pkcs11 OpenSSL engine](https://github.com/OpenSC/libp11) can be used as adapter between OpenSSL and the SignPath Cryptoki library.

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

{:.panel.info}
> **Default installation paths of libp11**
>
> Note that Linux distributions have different default installation paths for `libpkcs11.so`:
>
> | Distribution                  | Default path 
> |-------------------------------|--------------
> | Debian/Ubuntu w/ OpenSSL 1.1  | `/usr/lib/x86_64-linux-gnu/engines-1.1/libpkcs11.so`
> | Debian/Ubuntu w/ OpenSSL 3.x  | `/usr/lib/x86_64-linux-gnu/engines-3/libpkcs11.so`
> | RedHat w/ OpenSSL 1.1         | `/usr/lib64/engines-1.1/libpkcs11.so`
> | RedHat w/ OpenSSL 3.x         | `/usr/lib64/engines-3/libpkcs11.so`

For Windows use .dll paths respectively (note the double backslashes):

~~~ ini
dynamic_path = C:\\path\\to\\pkcs11.dll
MODULE_PATH = C:\\path\\to\\SignPath.Cryptoki.dll
~~~

Also set the following environment variable:

| Environment variable | Value                               | Description
|----------------------|-------------------------------------|-------------------------
| `OPENSSL_CONF`"      | Path to `openssl-signpath.cnf` file | This variable tells OpenSSL to load the custom configuration file

#### Invocation

_OpenSSL_ provides a variety of commands that can be used for signing. In this section, a few of them are outlined.

{:.panel.tip}
> **Tip**
>
> For *Linux*, configuration, signing invocation and verification examples are provided in the [Linux container samples] within `Scenarios/OpenSSL/OpenSSL.ps1`. Sample invocation:
> 
> ```bash
> ./RunScenario.sh -Scenario OpenSSL -OrganizationId "$OrganizationId" -ApiToken "$ApiToken" -ProjectSlug "hash-signing" -SigningPolicySlug "test-signing" -OpenSslDgst
> ```
> 

Generally, all commands require the following parameters to work with the SignPath Cryptoki library:

| Parameter    | Value                                                     | Description
|--------------|-----------------------------------------------------------|----------------------------
| `-keyform`   | `engine`                                                  | Use the specified engine to access the key.
| `-engine`    | `pkcs11`                                                  | Use the _libp11_ engine specified in the `openssl-signpath.cnf` file.
| `-inkey`     | `pkcs11:id=$ProjectSlug/$SigningPolicySlug;type=private`  | A PKCS #11 URI including _Project_ and _Signing Policy_ slug, see also [Cryptoki parameters](#cryptoki-parameters).
{: .break-column-2 }

##### openssl dgst

The _[dgst][openssl-dsgt]_ command calculates digests of files, but can also be used to create and verify signatures.

Sample: sign `artifact.bin` and write the signature to `artifact.sig`.

~~~ powershell
openssl dgst -engine pkcs11 -keyform engine -sign "pkcs11:id=$ProjectSlug/$SigningPolicySlug;type=private" -sha256 -out "artifact.sig" "artifact.bin"
~~~ 

{:.panel.info}
> **Supported digests**
>
> The following digests are supported: `sha256`, `sha384`, `sha512`

##### openssl pkeyutl

The _[pkeyutl][openssl-pkeyutl]_ command performs low-level cryptographic operations, such as signing.

<!-- todo omit?-->
{:.panel.info}
> **Note: provide binary hash digest**
>
> The command does hash the input data but will use the data directly as an input for the signature algorithm. To create the hash of a file, you can use the following snippet:
> 
> ~~~ powershell
> $ArtifactHash = Get-FileHash "artifact.bin" -Algorithm "SHA256" # SHA1, SHA256, SHA384 and SHA512 are supported
> $ArtifactHashBytes = [byte[]] -split ($ArtifactHash.Hash -replace '..', '0x$& ')
> [IO.File]::WriteAllBytes("artifact.hash.bin", $ArtifactHashBytes)
> ~~~

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

## osslsigncode {#osslsigncode}

_[osslsigncode]_ is a tool that allows applying Windows Authenticode signatures on Linux systems using OpenSSL. Accordingly, it also requires an OpenSC pkcs11 OpenSSL engine installation. See the [OpenSSL](#openssl) section for details.

{:.panel.warning}
> **Important**
>
> Only osslsigncode 2.x or higher is supported. Also see the notes in [supported Linux distributions](#supported-linux-distributions) regarding the supported OpenSSL versions.

#### Setup

`osslsigncode` requires the X.509 certificate corresponding to the SignPath Project and Signing Policy to be downloaded from SignPath and converted to _PEM format_. You can convert the certificate using OpenSSL via the following example.

~~~ powershell
openssl x509 -inform DER -in "certificate.cer" -outform PEM -out "certificate.pem"
~~~

#### Invocation

~~~ powershell
osslsigncode sign `
   -pkcs11module $LibSignPathCryptokiPath `
   -key "pkcs11:id=$ProjectSlug/$SigningPolicySlug;type=private;pin-value=CONFIG" `
   -certs "certificate.pem" `
   -in "sample.exe" -out "sample.signed.exe"
~~~

| Parameter          | Value                              | Description
|--------------------|------------------------------------|-----------------------------
| `--pkcs11module`   | `/path/to/libSignPath.Cryptoki.so` | Path to the SignPath Cryptoki library
| `--key`            | `pkcs11:id=...`                    | A PKCS #11 URI as shown in the example above including _Project_ and _Signing Policy_ slugs and the "pin" value (see also [Cryptoki parameters](#cryptoki-parameters))
| `--certs`          | `certificate.pem`                  | Certificate of the used signing policy in PEM format

{:.panel.tip}
> **Tip**
>
> This invocation is also provided in the [Linux container samples] within `Scenarios/osslsigncode/osslsigncode.ps1`. Sample invocation:
> 
> ```bash
> ./RunScenario.sh -Scenario osslsigncode -OrganizationId "$OrganizationId" -ApiToken "$ApiToken" -ProjectSlug "hash-signing" -SigningPolicySlug "test-signing"
> ```

## OpenSC pkcs11-tool (Linux)

The [OpenSC](https://github.com/OpenSC/OpenSC) [`pkcs11-tool`](https://linux.die.net/man/1/pkcs11-tool) utility can be used to troubleshoot PKCS #11 modules (e.g. listing all available objects or supported algorithms) but also can be used to read certificates/public keys and to perform signing operations.

#### Setup

{:.panel.info}
> **`pkcs11-tool` before version 0.23**
>
> Set `Cryptoki.DoNotFailOnReadWriteSessions` to `true` in the SignPath [Crypto Provider configuration](/documentation/crypto-providers#crypto-provider-config-values).
>
> _Background: `pkcs11-tool` used to open the Cryptoki session in a read/write mode (see [GitHub issue #2182](https://github.com/OpenSC/OpenSC/issues/2182)) and therefore fails with `PKCS11 function C_OpenSession failed: rv = CKR_TOKEN_WRITE_PROTECTED`. This flag enables compatibility with these earlier versions._

#### Invocation

{:.panel.tip}
> **Tip**
>
> The following invocation examples are also provided in the [Linux container samples] within `Scenarios/Pkcs11Tool/Pkcs11Tool.ps1`. Sample invocation:
> 
> ```bash
> ./RunScenario.sh -Scenario Pkcs11Tool -OrganizationId "$OrganizationId" -ApiToken "$ApiToken" -ProjectSlug "hash-signing" -SigningPolicySlug "test-signing"
> ```
> 

##### Common parameters

~~~ powershell
pkcs11-tool --module $LibSignPathCryptokiPath --pin CONFIG ...
~~~

| Parameter          | Value                                   | Description
|--------------------|-----------------------------------------|--------------------------------------------
| `--module`         | `/path/to/libSignPath.Cryptoki.so`      | Path to the SignPath Cryptoki library
| `--pin`            | `CONFIG` or `$OrganizationId:$ApiToken` | See [PIN parameter](#cryptoki-parameters)

##### Listing of the available PKCS #11 objects

The following command lists available objects, which corresponds to the list of signing policies for which the authenticated user has _Submitter_ permissions.

~~~ powershell
pkcs11-tool --module $LibSignPathCryptokiPath --pin CONFIG --list-objects
~~~

##### Signing operation

The following sample call shows an RSA signing operation using PSS padding and SHA-256.

~~~ powershell
pkcs11-tool --module $LibSignPathCryptokiPath --pin CONFIG `
   --sign --mechanism "RSA-PKCS-PSS" --hash-algorithm "SHA256" --label "$ProjectSlug/$SigningPolicySlug" `
   --input-file "artifact.hash.bin" --output-file "artifact.sig"
~~~

| Parameter          | Value                             | Description
|--------------------|-----------------------------------|--------------------------------------------
| `--mechanism`      | e.g. `RSA-PKCS-PSS`               | Use the `--list-mechanisms` argument to list all available mechanisms
| `--hash-algorithm` | e.g. `SHA256`                     | Only necessary for `RSA-PKCS-PSS` mechanism
| `--label`          | `$ProjectSlug/$SigningPolicySlug` | _Project_ and _Signing Policy_ slugs, separated by a forward slash
| `--input-file`     | `/path/to/hash.bin`               | File containing a hash in _binary_ form

## Java jarsigner {#jarsigner}

The [`jarsigner`](https://docs.oracle.com/en/java/javase/17/docs/specs/man/jarsigner.html) command signs and verifies Java archives (e.g. JAR, WAR, EAR). It is included with the Java Development Kit (JDK).

#### Setup

1. Configure the SunPKCS11 Provider
   * OpenJDK: the provider is configured automatically
   * Oracle JDK: see [Oracle PKCS #11 Reference Guide][oracle-install]
2. Register the SignPath Cryptoki library for the SunPKCS11 Provider 

Sample `pkcs11.config`

~~~ ini
name=SignPath.Cryptoki
library=<path>\SignPath.Cryptoki.dll
slot=1
~~~

#### Invocation

{:.panel.tip}
> **Tip**
>
> For *Linux*, configuration and invocation examples are provided in the [Linux container samples] within `Scenarios/Jar/JarSigner.ps1`. Sample invocation:
> 
> ```bash
> ./RunScenario.sh -Scenario JarSigner  -OrganizationId "$OrganizationId" -ApiToken "$ApiToken" -ProjectSlug "hash-signing" -SigningPolicySlug "test-signing"
> ```
> 

Synopsis for _jarsigner_ when using the SignPath Cryptoki library:

~~~
jarsigner <parameters> <jar-files> <keystore-alias>
~~~

| Parameter          | Value                                   | Description
|--------------------|-----------------------------------------|---------------------------------
| `-storetype`       | `PKCS11`                                | Use a PKCS11 store for the signing operation
| `-providerClass`   | `sun.security.pkcs11.SunPKCS11`         | Use the SunPKCS11 provider for the signing operation
| `-keystore`        | `NONE`                                  | Key is not loaded from a file
| `-providerArg`     | Path to `pkcs11.config`                 | The SunPKCS11 provider expects a path to the config file
| `-sigalg`          | `SHA256withRSA`, `SHA384withRSA`, `SHA512withRSA`, `SHA256withECDSA`, `SHA384withECDSA`, or `SHA512withECDSA` | Digest and signature algorithm
| `-storepass`       | `CONFIG` or `$OrganizationId:$ApiToken` | See ["PIN" parameter](#cryptoki-parameters)
| _keystore-alias_   | `$ProjectSlug/$SigningPolicySlug`       | _Project_ and _Signing Policy_ slug, separated by a forward slash

Sample: sign `myapp.jar`

~~~ powershell
jarsigner -keystore NONE -storetype PKCS11 -providerClass "sun.security.pkcs11.SunPKCS11" -providerArg pkcs11.config -sigalg "SHA256withRSA" -storepass "CONFIG" myapp.jar "$ProjectSlug/$SigningPolicySlug" 
~~~

{:.panel.warning}
> **Warning: Produce correct timestamps**
>
> When using jarsigner (or any other signing tool) directly, you are responsible for correct time stamping. See [Timestamps](/documentation/crypto-providers#timestamps)

[PKCS #11]: https://docs.oasis-open.org/pkcs11/pkcs11-base/v2.40/os/pkcs11-base-v2.40-os.html

[OpenSSL]: https://www.openssl.org/
[openssl-dsgt]: https://www.openssl.org/docs/man1.1.1/man1/dgst.html
[openssl-pkeyutl]: https://www.openssl.org/docs/man1.1.1/man1/pkeyutl.html
[openssl-cms]: https://www.openssl.org/docs/man1.1.1/man1/cms.html
[oracle-install]: https://docs.oracle.com/en/java/javase/14/security/pkcs11-reference-guide1.html#GUID-C4ABFACB-B2C9-4E71-A313-79F881488BB9
[osslsigncode]: https://github.com/mtrojnar/osslsigncode
[Linux container samples]: /documentation/crypto-providers#linux-docker-samples

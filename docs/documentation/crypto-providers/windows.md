---
main_header: Crypto Providers
sub_header: Windows CSP and KSP
layout: resources
toc: true
show_toc: 3
description: SignPath Windows CSP and KSP Crypto Providers
datasource: tables/crypto-providers
---

## General instructions

This section provides information to use SignPath with any tool that supports KSP or CSP providers.

### Installation

To install both CSP and KSP,

1. Copy the contents of the `Windows` directory of the Crypto Providers ZIP archive to the target system.
1. Run the following command with Administrator privileges in the destination directory:

   ~~~powershell
   powershell -ExecutionPolicy RemoteSigned .\InstallCspKsp.ps1
   ~~~

1. Continue with the [general Crypto Provider configuration](/documentation/crypto-providers#crypto-provider-configuration).

Alternatively, you can also run `.\InstallCspKsp.ps1` within a PowerShell or PowerShell Core session.

> **Verification**
>
> To verify the successful registration of the CSP and KSP, you can use the following command:
>
> ~~~powershell
> certutil -csplist
> ~~~
> 
> It should contain two entries:
> 
>    * `Provider Name: SignPathCSP`
>    * `Provider Name: SignPathKSP`
{: .panel .info }

CSPs [are deprecated by Microsoft](https://learn.microsoft.com/en-us/windows/win32/seccrypto/cryptographic-service-providers) and therefore most tools only require a KSP. In case you only want to install the KSP, use the following command:

~~~powershell
powershell -ExecutionPolicy RemoteSigned .\InstallCspKsp.ps1 -InstallParts KSP
~~~

#### Update to a new version

Installing a new version will overwrite the existing installation.

#### Uninstallation

Run the following command with Administrator privileges in the installation directory:

~~~powershell
powershell -ExecutionPolicy RemoteSigned .\InstallCspKsp.ps1 Uninstall
~~~

This removes both the CSP and KSP version (in case they are installed).

### Parameters

Additionally to the general [Crypto Provider configuration](/documentation/crypto-providers#crypto-provider-configuration), specify the following values using the parameters provided by your signing tool:

| Parameter             | Value                                | Description
|-----------------------|--------------------------------------|---------------------------------------
| Crypto Provider       | `SignPathKSP` or `SignPathCSP`       | SignPath KSP (preferred) or CSP
| Key container name    | `$ProjectSlug/$SigningPolicySlug`    | _Project_ and _Signing Policy_ slugs, separated by a forward slash 
| Certificate file      | Path to the x.509 certificate file   | Download the respective certificate file from SignPath

> **Keys are not specified directly**
>
> The KSP and CSP interfaces expect you to identify a key, but SignPath requires you to specify _Project_ and _Signing Policy_. SignPath will select the correct key or certificate based on the _Project_ and _Signing Policy_ you specify.
{: .panel .info }

### Error handling

The following table shows the KSP `HRESULT` result codes for the different error situations when calling the SignPath REST API.
Note that the CSP error code has to be retrieved via [`GetLastError()`](https://learn.microsoft.com/en-us/windows/win32/api/errhandlingapi/nf-errhandlingapi-getlasterror).

| Situation                                                                                                | error code (KSP result code or CSP `GetLastError()` code)
|----------------------------------------------------------------------------------------------------------|----------------------------------------------------------
| Transient errors like HTTP timeouts or 503 (Service Unavailable) which still occur after the last retry  | `NTE_DEVICE_NOT_READY` ("The device that is required by this cryptographic provider is not ready for use.") for errors without an HTTP status code. Otherwise, HTTP status code as an HRESULT in the `FACILITY_ITF`, e.g. `0x800401F7` for HTTP 503
| Non-transient service errors (e.g. 500 Internal Server Error)                                            | HTTP status code as an HRESULT in the `FACILITY_ITF`, e.g. `0x800401F4` for HTTP 500
| User errors detected by service (4xx returned)                                                           | HTTP status code as an HRESULT in the `FACILITY_ITF`, e.g. `0x80040190` for HTTP 400
| Other unspecified errors (fall back)                                                                     | `NTE_FAIL` ("An internal error occurred.")

## SignTool.exe {#signtool}

_[SignTool.exe]_ is a command line tool by Microsoft. _SignTool.exe_ can use both the SignPath CSP and the SignPath KSP. We recommend using the SignPath KSP whenever possible.

> **Important**
>
> Only the 64-bit version of _SignTool.exe_ is supported.
{: .panel .warning }

_SignTool.exe_ requires the following parameters:

| Parameter    | Value                             | Description
|--------------|-----------------------------------|----------------
| `/csp`       | `SignPathKSP` or `SignPathCSP`    | SignPath KSP (preferred) or CSP
| `/kc`        | `$ProjectSlug/$SigningPolicySlug` | Key container name: _Project_ and _Signing Policy_ slug, separated by a forward slash
| `/fd`        | `SHA256`, `SHA384` or `SHA512`    | Digest (hashing) algorithm
| `/f`         | Path to the certificate file      | Download the respective certificate file from SignPath

**Sample: sign `MyApp.exe`**

~~~powershell
signtool.exe sign /csp SignPathKSP /kc "$ProjectSlug/$SigningPolicySlug" /fd SHA256 /f "certificate.cer" "MyApp.exe"
~~~

> **Tip: Diagnostics**
>
> Specify `/v` to enable verbose output.
{: .panel .tip }

> **Warning: Produce correct timestamps**
>
> When using SignTool.exe (or any other signing tool) directly, you are responsible for correct time stamping. See [Timestamps](/documentation/crypto-providers#timestamps)
{: .panel .warning }

[SignTool.exe]: https://docs.microsoft.com/en-us/dotnet/framework/tools/signtool-exe
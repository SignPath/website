---
header: Windows CSP and KSP
layout: resources
toc: true
show_toc: 3
description: SignPath Windows CSP and KSP Crypto Providers
---

## Overview

Signing tools secifically designed for Windows typicall use CNG KSP or CAPI CSP providers. Install and use the SignPath KSP and CSP providers to use this tools with SignPath.

## Installation

To install the Windows CNG KSP and CAPI CSP providers,

1. Run the MSI installer file from the `Windows` subdirectory of the Crypto Providers ZIP archive. (See below for unattended options.)
2. Continue with the [general Crypto Provider configuration](/crypto-providers#crypto-provider-configuration).

{:.panel.info}
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

CSPs [are deprecated by Microsoft](https://learn.microsoft.com/en-us/windows/win32/seccrypto/cryptographic-service-providers), so most up-to-date tools only require a KSP. You can deselect the "Windows CAPI CSP" in the "custom setup" installer step.

### Unattended installation

To install the MSI in an automated fashion, run the following command (in an elevated command prompt).

~~~powershell
msiexec /i SignPathCryptoProviders-$Version.msi /qn /L* install.log
~~~

See [`msiexec` documentation](https://learn.microsoft.com/en-us/windows-server/administration/windows-commands/msiexec).

#### Installing as a prerequisite for build steps

If you want `msiexec` to terminate only after the installation has completed, run the following command in a PowerShell session:

~~~powershell
msiexec /i SignPathCryptoProviders-$Version.msi /qn /L* install.log | Out-Host; if ($LASTEXITCODE -ne 0) { throw "msiexec exited with $LASTEXITCODE" }
~~~

#### Selecting components

To install only parts, use the `ADDLOCAL` msiexec parameter with the following options (delimited by commas):

   * `KSP` for the Windows CNG KSP installation and registration
   * `CSP` for the Windows CAPI CNG installation and registration
   * `Cryptoki` for the Cryptoki library installation
   * `SignPathConfigAndEnv` for the default `CryptoProvidersConfig.json` configuration file in `%ProgramFiles%\SignPath\CryptoProviders`
     and the system-wide `SIGNPATH_CONFIG_FILE` environment variable

Example: install KSP and configuration file variable

~~~powershell
msiexec /i SignPathCryptoProviders-$Version.msi /qn /L* install.log ADDLOCAL=KSP,SignPathConfigAndEnv | Out-Host; if ($LASTEXITCODE -ne 0) { throw "msiexec exited with $LASTEXITCODE" }
~~~

### Update to a new version

Installing a new version will overwrite the existing installation.

### Uninstallation

Uninstall via Windows' "Apps & features" / "Installed apps" dialog.

### Unattended uninstallation

To uninstall in an automated fashion, run the following command (in an elevated PowerShell session).

~~~powershell
msiexec /x SignPathCryptoProviders-$Version.msi /qn /L* uninstall.log | Out-Host
~~~

## Using KSP/CSP parameters of signing tools

Additionally to the general [Crypto Provider configuration](/crypto-providers#crypto-provider-configuration), specify the following values using the parameters provided by your signing tool:

| Parameter             | Value                                | Description
|-----------------------|--------------------------------------|---------------------------------------
| Crypto Provider       | `SignPathKSP` or `SignPathCSP`       | SignPath KSP (preferred) or CSP
| Key container name    | `$ProjectSlug/$SigningPolicySlug`    | _Project_ and _Signing Policy_ slugs, separated by a forward slash 
| Certificate file      | Path to the x.509 certificate file   | Download the respective certificate file from SignPath

{:.panel.info}
> **Keys are not specified directly**
>
> The KSP and CSP interfaces expect you to identify a key, but SignPath requires you to specify _Project_ and _Signing Policy_. SignPath will select the correct key or certificate based on the _Project_ and _Signing Policy_ you specify.

## Error handling

The following table shows the KSP `HRESULT` result codes for different error situations when calling the SignPath REST API.

| Situation                                                                                                | error code (KSP result code or CSP `GetLastError()` code)
|----------------------------------------------------------------------------------------------------------|----------------------------------------------------------
| Transient errors like HTTP timeouts or 503 (Service Unavailable) which still occur after the last retry  | `NTE_DEVICE_NOT_READY` ("The device that is required by this cryptographic provider is not ready for use.") for errors without an HTTP status code. Otherwise, HTTP status code as an HRESULT in the `FACILITY_ITF`, e.g. `0x800401F7` for HTTP 503
| Non-transient service errors (e.g. 500 Internal Server Error)                                            | HTTP status code as an HRESULT in the `FACILITY_ITF`, e.g. `0x800401F4` for HTTP 500
| User errors detected by service (4xx returned)                                                           | HTTP status code as an HRESULT in the `FACILITY_ITF`, e.g. `0x80040190` for HTTP 400
| Other unspecified errors (fall back)                                                                     | `NTE_FAIL` ("An internal error occurred.")

The CSP error code has to be retrieved via [`GetLastError()`](https://learn.microsoft.com/en-us/windows/win32/api/errhandlingapi/nf-errhandlingapi-getlasterror).

## SignTool.exe {#signtool}

_[SignTool.exe]_ is a command line tool by Microsoft. _SignTool.exe_ can use both the SignPath CSP and the SignPath KSP. We recommend using the SignPath KSP whenever possible.

{:.panel.warning}
> **Important**
>
> Only the 64-bit version of _SignTool.exe_ is supported.

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

{:.panel.tip}
> **Tip: Diagnostics**
>
> Specify `/v` to enable verbose output.

{:.panel.warning}
> **Warning: Produce correct timestamps**
>
> When using SignTool.exe (or any other signing tool) directly, you are responsible for correct time stamping. See [Timestamps](/crypto-providers#timestamps)

[SignTool.exe]: https://docs.microsoft.com/en-us/dotnet/framework/tools/signtool-exe
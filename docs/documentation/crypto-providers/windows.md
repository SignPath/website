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

{%- assign table = site.data.tables.crypto-providers.windows-csp-ksp-general-params -%}
{%- include render-table.html -%}

<div class="panel info" markdown="1">
<div class="panel-header">Keys are not specified directly</div>

The KSP and CSP interfaces expect you to identify a key, but SignPath requires you to specify _Project_ and _Signing Policy_. SignPath will select the correct key or certificate based on the _Project_ and _Signing Policy_ you specify.

</div>

### Error handling

The following table shows the KSP `HRESULT` result codes for the different error situations when calling the SignPath REST API.
Note that the CSP error code has to be retrieved via [`GetLastError()`](https://learn.microsoft.com/en-us/windows/win32/api/errhandlingapi/nf-errhandlingapi-getlasterror).

{%- assign table = site.data.tables.crypto-providers.windows-csp-ksp-errors -%}
{%- include render-table.html -%}

## SignTool.exe {#signtool}

_[SignTool.exe]_ is a command line tool by Microsoft. _SignTool.exe_ can use both the SignPath CSP and the SignPath KSP. We recommend using the SignPath KSP whenever possible.

<div class="panel warning" markdown="1">
<div class="panel-header">Important</div>

Only the 64-bit version of _SignTool.exe_ is supported.

</div>

_SignTool.exe_ requires the following parameters:

{%- assign table = site.data.tables.crypto-providers.windows-signtool-parameters -%}
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

When using SignTool.exe (or any other signing tool) directly, you are responsible for correct time stamping. See [Timestamps](/documentation/crypto-providers#timestamps)

</div>

[SignTool.exe]: https://docs.microsoft.com/en-us/dotnet/framework/tools/signtool-exe
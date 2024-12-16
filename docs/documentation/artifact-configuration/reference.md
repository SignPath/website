---
header: Reference
layout: resources
toc: true
show_toc: 3
description: Artifact Configuration Reference
datasource: tables/artifact-configuration
---

## File and directory elements {#file-elements}

{%- include render-table.html table=site.data.tables.artifact-configuration.signing-file-elements -%}

### Container formats {#containers}

Container elements such as directories, archives, installers and package formats allow nested file elements. See [Syntax](syntax#structure) for more information.

## Signing methods

<!-- markdownlint-disable MD026 no trailing punctuation -->

Specify signing directives in file and directory elements. 

For [file and directory sets](syntax#file-and-directory-sets), specify the signing directive in the `<for-each>` element.

### `<authenticode-sign>`

{%- include_relative render-ac-directive-table.inc directive="authenticode-sign" -%}

Microsoft Authenticode is the primary signing method on the Windows platform. Authenticode is a versatile and extensible mechanism that works for many different file types. Using `<authenticode-sign>` is equivalent to using Microsoft's `SignTool.exe`.

#### Optional attributes {#authenticode-sign-attributes}

{%- include render-table.html table=site.data.tables.artifact-configuration.authenticode-attributes -%}

##### _append_ attribute

File formats that support appending signatures:

* `<pe-file>` (.exe, .dll, ...)
* `<cab-file>` (.cab)
* `<catalog-file>` (.cat)

Appending signatures is only needed for edge cases including

* adding an signature to a file that's already signed using another certificate
* adding a signature using different parameters, such as digest algorithm

##### Authenticode examples

Example: append signature, preserving any existing signatures

~~~ xml
<authenticode-sign append="true" />
~~~

Example: sign using SHA1 algoritm, then sign again using default SHA-256 algorithm (explicitly specified for clarity)

~~~ xml
<authenticode-sign hash-algorithm="sha1" />
<authenticode-sign hash-algorithm="sha256" append="true" />
~~~

Example: provide description text and URL

~~~ xml
<authenticode-sign description="ACME program" description-url="https://example.com/about-acme-program" />
~~~

See also:

* Verify existing signatures using [`authenticode-verify`](#authenticode-verify).
* Use [metadata restrictions](#metadata-restrictions) for `<pe-file>` to restrict product name and version.

### `<clickonce-sign>`

{%- include_relative render-ac-directive-table.inc directive="clickonce-sign" -%}

ClickOnce signing, also called 'manifest signing', is a method used for ClickOnce applications and Microsoft Office Add-ins. Using `<clickonce-sign>` is equivalent to using Microsoft's `mage.exe`.

ClickOnce signing applies to directories, not to individual files. Therefore, you need to specify a `<directory>` element for this method. If you want to sign files in the root directory of a container, specify `path="."`.

~~~ xml
<artifact-configuration xmlns="http://signpath.io/artifact-configuration/v1">
  <zip-file>
    <directory path=".">
      <clickonce-sign/>
    </directory>
  </zip-file>
</artifact-configuration>
~~~

### `<nuget-sign>`

{%- include_relative render-ac-directive-table.inc directive="nuget-sign" -%}

NuGet packages are signed by [NuGet Gallery](https://www.nuget.org/). They can be signed by the publisher too. Using `<nuget-sign>` is equivalent to using Microsoft's `nuget` `sign` command.

Publisher signing has the following additional security advantages:

* NuGet Gallery can be configured to accept only uploads signed with a specific certificate
* Users will be warned if package updates don't match the previous signature
* Users can configure which publishers to trust

Although the NuGet Package format is based on OPC (see next section), it uses its own specific signing format.

### `<office-macro-sign>`

{% include editions.md feature="file_based_signing.office_macros" %}

Use this directive to sign Visual Basic for Applications (VBA) macros in Microsoft Office documents and templates.
	
Use `<office-oxml-file>` for Microsoft Office Open XML files:

* **Excel:** .xlam, .xlsb, .xlsm, .xltm
* **PowerPoint:** .potm, .ppam, .ppsm, .pptm
* **Visio:** .vsdm, .vssm, .vstm
* **Word:** .docm, .dotm

Use `<office-binary-file>` for binary Microsoft Office files:

* **Excel:** .xla, .xls, .xlt
* **PowerPoint:** .pot, .ppa, .pps, .ppt
* **Project:** .mpp, .mpt
* **Publisher:** .pub
* **Visio:** .vdw, .vdx, .vsd, .vss, .vst, .vsx, .vtx
* **Word:** .doc, .dot, .wiz

Macro signatures apply only to the macros within the document files and are not affected by any other changes in the signed document files. 

### `<opc-sign>`

{%- include_relative render-ac-directive-table.inc directive="opc-sign" -%}

Signs according to the [Open Packaging Conventions](https://en.wikipedia.org/wiki/Open_Packaging_Conventions) (OPC) specification. Using `<opc-sign>` for Visual Studio Extensions is equivalent to using Microsoft's `VSIXSignTool.exe`.

Note that not all OPC-based formats use OPC signatures:

* Office Open XML files (Microsoft Office): OPC signatures are only partially recognized by Office applications
* NuGet packages: ignored, use `<nuget-sign>` instead

<!-- markdownlint-enable MD026 no trailing punctuation -->

### `<jar-sign>`

{% include editions.md feature="file_based_signing.java" %}

{%- include_relative render-ac-directive-table.inc directive="jar-sign" -%}

Android apps and app-bundles: Note that JAR signatures only implement APK signing scheme v1 (v2 and v3 are not yet supported).

#### Verification {#jar-sign-verification}

* **Java** always verifies signatures for client components. For server components, you will need to create a policy. Please consult the documentation of your application server or [Oracle's documentation](https://docs.oracle.com/javase/tutorial/security/toolsign/receiver.html).
* **Android** always verifies App signatures, but current Android versions require signing schemes v2 or v3.
* If you sign **ZIP files**, the receiver needs to manually check the signature before unpacking the file.

For manual verification, use the following command (requires [JDK](https://openjdk.java.net/install/)):

~~~ cmd
jarsigner -verify -strict <file>.zip
~~~

Add the `-verbose` option to see the certificate.

### `<xml-sign>`

{% include editions.md feature="file_based_signing.xml" %}

{%- include_relative render-ac-directive-table.inc directive="xml-sign" -%}

Sign XML files with [XMLDSIG](https://www.w3.org/TR/xmldsig-core1/). 

This will create an _enveloped signature_ for the entire document. 

The result is a `Signature` element added to the root element (after all existing children) with the following properties:

| Property          | Value                                                                         | XPath
|-------------------|-------------------------------------------------------------------------------|--------------------------------------------------------------------
| Canonicalization  | Exclusive XML Canonicalization: `http://www.w3.org/2001/10/xml-exc-c14n#`     | `/*/Signature/SignedInfo/CanonicalizationMethod/@Algorithm`
| Signature Method  | RSA SHA-256: `http://www.w3.org/2001/04/xmldsig-more#rsa-sha256`              | `/*/Signature/SignedInfo/SignatureMethod/@Algorithm`
| ReferenceUri      | Whole document: `""`                                                          | `/*/Signature/SignedInfo/Reference/@URI`
| Transformation    | Enveloped signature: `http://www.w3.org/2000/09/xmldsig#enveloped-signature"` | `/*/Signature/SignedInfo/Reference/Transforms/Transform/@Algorithm`
| Transformation    | Exclusive XML Canonicalization: `http://www.w3.org/2001/10/xml-exc-c14n#`     | `/*/Signature/SignedInfo/Reference/Transforms/Transform/@Algorithm`
| Digest method     | SHA-256: `http://www.w3.org/2001/04/xmlenc#sha256`                            | `/*/Signature/SignedInfo/Reference/DigestMethod/@Algorithm`
| X.509 Certificate | _See `key-info-x509-data` option_                                             | `/*/Signature/KeyInfo/X509Data`
{:.break-code}

**Supported options:**  

| Option                       | Optional | Description
|------------------------------|----------|------------------------------------------------------------------------------
| `key-info-x509-data`         | Yes      | `none`: Do not include any X.509 data in the signature<br/> `leaf` (Default): Include only the leaf certificate in the signature<br/> `whole-chain`: Include the whole certificate chain in the signature<br/> `exclude-root`: Include the whole certificate chain in the signature, but exclude the root certificate<br/> **Note**: `whole-chain` and `exclude-root` only work with public CA trusted certificates|

See also:

* Use [metadata restrictions](#metadata-restrictions) for `<xml-file>` to restrict root element and namespace.

### Detached raw signatures using `<create-raw-signature>` {#create-raw-signature}

{% include editions.md feature="file_based_signing.raw" %}

{%- include_relative render-ac-directive-table.inc directive="create-raw-signature" -%}

**Note: Since the detached signatures are placed in a separate file, this directive is only available within a [`<zip-file>`](syntax#zip-file-element) element.**

Detached raw signatures can be used to sign any binary or text file. They can also be used to [sign _Cosign_ metadata files](/documentation/signing-containers/cosign).

The `create-raw-signature` directive supports the following parameters:

| Parameter          | Required      | Values                       | Description
|--------------------|---------------|------------------------------|-------------------------------------------------
| `file-name`        | Yes           |                              | Name of the output file containing the signature. Use `${file.name}` to reference the source file name.
| `hash-algorithm`   | Yes           | `sha256`, `sha384`, `sha512` | Hash algorithm used to create the signature
| `rsa-padding`      | For RSA keys  | `pkcs1`, `pss`               | Padding algorithm (RSA keys only)

#### Example

~~~ xml
<artifact-configuration xmlns="http://signpath.io/artifact-configuration/v1">
  <zip-file>
    <file path="myfile.bin">
      <create-raw-signature file-name="${file.name}.sig" hash-algorithm="sha256" />
    </pe-file>
  </zip-file>
</artifact-configuration>
~~~

The resulting artifact will contain both the original file `myfile.bin` and the detached signature in `myfile.bin.sig`.

#### Detached signature verification

There are multiple tools and solutions that support handling of raw signature blocks. One popular option is `openssl dgst`. As the command does not support X.509 certificates, the public key has to be extracted before the signature can be verified using the following call:

~~~ bash
openssl dgst -verify pubkey.pem -signature file.sig file
~~~

## Verification methods {#verification}

Verification directives are used to ensure that files in a singing request are already properly signed by their respective publisher.

Use this to

* avoid installing unsigned files with your (signed) installers or packages
* sign each file in it's respective build pipeline rather than signing everything in the final (downstream) pipeline
* re-sign third-party files to comply with your organization's code signing policies

When used to verify a file before signing it, the _verify_ directive must precede any _sign_ directives.

### `<authenticode-verify>`

Verifies that a file has a valid Authenticode signature.

This method verifies signatures according to Windows rules:

* Supported hash digest algorithm and length, signing key type and length
* Valid timestamp (or unexpired publisher certificate)
* Certificate chain ends in Windows trusted root certificate 

May be combined with [`<authenticode-sign>`](#authenticode-sign). 

{:.panel.todo}
> **TODO: add**
>
> Use `append="true"` to add the new signature instead of replacing the existing one (supported formats only).

#### Example

~~~ xml
<artifact-configuration xmlns="http://signpath.io/artifact-configuration/v1">
  <msi-file>
    <pe-file-set>
      <include path="Microsoft.*.dll" max-matches="unbounded" />
      <include path="System.*.dll" max-matches="unbounded" />
      <for-each>
        <authenticode-verify/>
      </for-each>
    </pe-file-set>
  </msi-file>
</artifact-configuration>
~~~

## File metadata restrictions {#metadata-restrictions}

Some element types support restricting certain metadata values. 

The restrictions can be applied to file elements, [file set elements](syntax#file-and-directory-sets), or `<include>` elements. Attributes on `<include>` elements override those on file set elements.

| File element | Supported restriction attributes                                                | Example
|--------------|---------------------------------------------------------------------------------|--------
| `<pe-file>`  | PE file headers: `product-name`, `product-version`                              | [PE file restrictions](examples#pe-restriction)
| `<xml-file>` | Root element name and namespace: `root-element-name`, `root-element-namespace`  | [SBOM restrictions](examples#sbom-restriction)


**Footnotes:**

[^jscript]: Note that [JScript](https://en.wikipedia.org/wiki/JScript) is not the same as JavaScript. While it is possible to use this option to sign JavaScript files, JavaScript engines will not be able to use this signature.

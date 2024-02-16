---
main_header: Documentation
sub_header: Artifact Configuration
layout: resources
toc: true
show_toc: 3
description:
---

## Abstract

The artifact configuration describes the structure of the artifacts you want to sign. For simple artifacts, you can use predefined configurations to get started quickly. For signing several artifacts together, and for more complex artifacts, specify the structure of your artifact and provide signing directives using XML.

![Artifact configuration XML](/assets/img/resources/documentation_artifact-configuration.png)

## Creating and editing artifact configurations

### Upload an artifact sample

Before you start creating an artifact configuration from scratch, we recommend that you upload an artifact sample first. SignPath will then analyze your sample and look for nested artifacts that can be signed. 

For non-trivial artifacts, you may want to edit the resulting artifact configuration: 

* It may contain signing instructions for files that you do not want to sign, such as third-party components.
* It may contain fixed strings, such as version numbers, that you want to replace with [wildcards](#using-wildcards).
* It may have very similar sections that you want to unify using [`<directory>`](#directory-element) elements and wildcards ([example](#signing-similar-directories-within-an-msi-file)).

### Create an artifact configuration

When you create a new project, a default artifact configuration will be added. To create additional artifact configurations, select the project and click **Add** in the **Artifact Configurations** section. In either case, you can

* select **Upload an artifact sample** and select an artifact file to have the artifact configuration generated
* select a **Ready to use artifact configuration**
* select one of the **Templates for custom artifact configurations** and edit the XML content
* select **Custom** and create an artifact configuration from scratch

### Edit an artifact configuration

To modify an existing artifact configuration, select a project, then select the artifact configuration you want to change, and then either

* select **Edit** to select pre-defined artifact configurations or edit the XML content
* select **Update from an artifact sample** to generate your artifact configuration from a sample file

When you edit XML content in place, a graphical representation will be rendered immediately. If you prefer to use code completion, select **Download XML schema** and use a schema-aware XML editor, such as Microsoft Visual Studio.

Read more about projects and artifact configurations in [Setting up Projects](/documentation/projects).

## Containers: defining file and directory structure {#containers}

Every XML description is wrapped in an `<artifact-configuration>` root element which contains exactly one file element. This file element specifies the type of artifact and signing method. Optionally, you can restrict the name of the file using the `path` attribute.

Container-format elements may contain other file elements for deep signing. Every *container* format can contain multiple other *file* or *directory* elements to be signed. Each of those will be extracted, signed, and then put back into the container during the signing process. All inner elements need a `path` attribute.

## Deep signing containers

Sometimes you need to sign both the container and its contents. For instance, an MSI installer package needs to be signed, but you also want the files it installs to be signed. SignPath can sign both the container and its contents in a single pass if you specify an appropriate artifact configuration. See [here](#msi-sample) for an example.

### Platform considerations

File and directory names in `path` attributes are case-insensitive. You may use slash `/` or backslash `\` as directory separators.

## File elements

### File element types and signing directives

{%- assign table = site.data.tables.artifact-configuration.signing-file-elements -%}
{%- include render-table.html -%}

### File element examples

#### Signing an MSI package

~~~ xml
<artifact-configuration xmlns="http://signpath.io/artifact-configuration/v1">
  <msi-file>
    <authenticode-sign/>
  </msi-file>
</artifact-configuration>
~~~

See [Examples] for more complex artifact configurations.

### Signing multiple artifacts

If you want to sign multiple independent artifacts in one step, you need to package them into an archive before processing.

You can combine signing multiple artifacts with deep signing.

#### &lt;zip-file&gt; {#zip-file-element}

Use the `<zip-file>` element to specify a ZIP archive. SignPath will process archives inside this file. 

You can also use the [`<jar-sign>`](#jar-sign) directive to sign entire ZIP archives for verification with `jarsigner`.

##### Select multiple files

When used as a root element, you can set the `ui-multifile-upload` attribute to `on`. 

In this case, the Web application will allow selection of multiple artifacts for the _submit signing request_ feature:

* The user can select multiple files in the artifact browse dialog 
* A ZIP archive named `bundle.zip` will automatically be created (even if only a single file is selected)

The result will still be provided as a ZIP archive dowload.

Example:

~~~ xml
<artifact-configuration xmlns="http://signpath.io/artifact-configuration/v1">
  <zip-file ui-multifile-upload="on">
    <office-oxml-file path="*.xlsm" max-matches="unbounded">
      <office-macro-sign/>
    </office-oxml-file>
  </zip-file>
</artifact-configuration>
~~~

## &lt;directory&gt; element

All supported container formats have an internal directory structure. You can see this structure if you extract a container to a local disk.

You can either specify these directories in the `path` attribute of each file element or nest these file elements within `<directory>` elements.

`<directory>` elements are also used for [ClickOnce signing].

### &lt;directory&gt; example

{%- assign table = site.data.tables.artifact-configuration.directory-example -%}
{%- include render-table.html -%}

## Signing methods

<!-- markdownlint-disable MD026 no trailing punctuation -->

Specify signing directives in file and directory elements. See [file elements](#file-elements) for available methods per element type.

For file and directory sets, specify the signing directive in the `<for-each>` element.

### &lt;authenticode-sign&gt;

Microsoft Authenticode is the primary signing method on the Windows platform. Authenticode is a versatile and extensible mechanism that works for many different file types:

* [Portable Executable](https://en.wikipedia.org/wiki/Portable_Executable) (PE) files: EXE, DLL, and some other executable file formats including device drivers
* Installation formats: AppX, MSI, and CAB
* PowerShell scripts and modules

Using `<authenticode-sign>` is equivalent to using Microsoft's `SignTool.exe`.

See also:

* Use [metadata restrictions](#file-metadata-restrictions) for `<pe-file>` to restrict product name and version.

[ClickOnce signing]: #clickonce-sign

### &lt;clickonce-sign&gt;

ClickOnce signing, also called 'manifest signing', is a method used for ClickOnce applications and Microsoft Office Add-ins.

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

Using `<clickonce-sign>` is equivalent to using Microsoft's `mage.exe`.

### &lt;nuget-sign&gt;

NuGet package signing is currently being introduced to the [NuGet Gallery](https://www.nuget.org/).

Although the NuGet Package format is based on OPC (see next section), it uses its own specific signing format.

Using `<nuget-sign>` is equivalent to using Microsoft's `nuget` `sign` command.

### &lt;office-macro-sign&gt;

Available for Enterprise subscriptions
{: .badge.icon-signpath}

Use this directive to sign Visual Basic for Applications (VBA) macros in Microsoft Office files.
	
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

### &lt;opc-sign&gt;

The [Open Packaging Conventions](https://en.wikipedia.org/wiki/Open_Packaging_Conventions) (OPC) specification has its own signature format. Since OPC is the foundation for several file formats, it is not strictly a code signing format. However, code signing is used for Visual Studio Extensions (VSIX).

Other OPC formats include:

* Open XML Paper Specification (OpenXPS)
* Office Open XML files (Microsoft Office)

Note that while OPC signing can be applied to all OPC formats, specific applications and formats do not necessarily use or verify signatures, or even require a different signing format (case in point: NuGet packages).

Using `<opc-sign>` for Visual Studio Extensions is equivalent to using Microsoft's `VSIXSignTool.exe`.

<!-- markdownlint-enable MD026 no trailing punctuation -->

### &lt;jar-sign&gt;

Available for Basic and Enterprise subscriptions
{: .badge.icon-signpath}

This signing method can be used to sign the following file formats:

| Format                       | Extensions       | Remarks 
|------------------------------|------------------|---------
| Java archives                | .jar, .ear, .war | 
| Android apps und app-bundles | .apk, .aab       | Only APK signing scheme v1 (v2 and v3 are not yet supported) 
| ZIP files                    | .zip             | Only UTF-8 encoded ZIP files are supported 

#### Verification

* **Java** always verifies signatures for client components. For server components, you will need to create a policy. Please consult the documentation of your application server or [Oracle's documentation](https://docs.oracle.com/javase/tutorial/security/toolsign/receiver.html).
* **Android** always verifies App signatures.
* If you sign **ZIP files**, the receiver needs to manually check the signature before unpacking the file.

For manual verification, use the following command (requires [JDK](https://openjdk.java.net/install/)):

~~~ cmd
jarsigner -verify -strict <file>.zip
~~~

Add the `-verbose` option to see the certificate.

### &lt;xml-sign&gt;

Available for Enterprise subscriptions
{: .badge.icon-signpath}

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

**Supported options:**  

| Option                       | Optional | Description
|------------------------------|----------|------------------------------------------------------------------------------
| `key-info-x509-data`         | Yes      | `none`: Do not include any X.509 data in the signature<br/> `leaf` (Default): Include only the leaf certificate in the signature<br/> `whole-chain`: Include the whole certificate chain in the signature<br/> `exclude-root`: Include the whole certificate chain in the signature, but exclude the root certificate<br/> **Note**: `whole-chain` and `exclude-root` only work with public CA trusted certificates|

See also:
* Use [metadata restrictions](#file-metadata-restrictions) for `<xml-file>` to restrict root element and namespace.

### Detached raw signatures using &lt;create-raw-signature&gt; {#detached-raw-signatures}

Available for Enterprise subscriptions
{: .badge.icon-signpath}

Detached raw signatures can be used for arbitrary binary or text files or [signing Container Images using cosign](/documentation/signing-containers/cosign). The `create-raw-signature` directive supports the following parameters:

| Parameter          | Description                      
|-----------         |---------------------------------- 
| `hash-algorithm`   | The hash algorithm used to calculate the signature. Supported options are `sha256`, `sha384` and `sha512`.
| `rsa-padding`      | Required for signing with certificates based on RSA keys. Forbidden for other key algorithms. Supported options are `pkcs1` and `pss`.
| `file-name`        | Name of the output file for the detached signature.

**Note: Due to the detached signature being placed in a separate file, `<file>` and `<file-set>` elements are only allowed inside a <a href="#zip-file-element">`<zip-file>`</a>.**

#### Verification

There are multiple tools and solutions that support handling of raw signature blocks. One popular option is `openssl dgst`. As the command does not support X.509 certificates, the public key has to be extracted before the signature can be verified using the following call:

~~~ bash
openssl dgst -verify pubkey.pem -signature file.sig file
~~~

## Using wildcards

Every path attribute can contain the following wildcard patterns:

| Wildcard | Description                                                                                                        | Example    | Matches
|----------|--------------------------------------------------------------------------------------------------------------------|------------|-------------------------
| `*`      | Matches any number of any character (including none, excluding the directory separator).                           | `m*y`      | `my`, `mary`, `my first pony`
| `?`      | Matches  any single character.                                                                                     | `th?s`     | `this`, `th$s`, but not `ths`
| `[abc]`  | Matches one character given in the bracket.                                                                        | `[fb]oo`   | `foo` and `boo`
| `[a-z]`  | Matches one character from the range given in the bracket.                                                         | `[0-9]`    | all digits
| `[!abc]` | Matches one character that is not given in the bracket.                                                            | `[!f]oo`   | `boo` and `$oo`, but not `foo`
| `[!a-z]` | Matches one character that is not from the range given in the bracket.                                             | `[!0-9]`   | every character that is not a digit
| `**`     | Matches any number of path/directory segments. When used, they must be the only contents of the dedicated segment. | `**/*.dll` | `*.dll` files in all subdirectories (recursive)

### Number of matches

If wildcards are used, optional `max-matches` and `min-matches` parameters can be specified to set the number of files that may match the wildcard expression. 

* Both default to `1`, so wildcard expressions without `max-matches` or `min-matches` must match exactly one file
* Use `min-matches="0"` for optional elements (even without wildcards)
* Use `max-matches="unbounded"` for unlimited matches

## File and directory sets

If multiple files or directories should be handled in the same way, you can enumerate them using one of the following file or directory set elements: `<directory-set>`, `<pe-file-set>`, `<powershell-file-set>`, `<windows-script-file-set>`, `<msi-file-set>`, `<cab-file-set>`, `<catalog-file-set>`, `<appx-file-set>`, `<msix-file-set>`, `<opc-file-set>`, `<nupkg-file-set>`, `<jar-file-set>`, `<zip-file-set>`, `<office-oxml-file-set>`, `<office-binary-file-set>`, `<xml-file-set>`, `<file-set>`

Each set element contains:

* an `<include>` element for each file (or pattern) to be processed
* a `<for-each>` element that will be applied to all included elements of the set

A set's `<for-each>` element can include the same child elements as the corresponding simple file or directory element:

* `<pe-file>` supports `<authenticode-signing/>`
* therefore `<pe-file-set>` supports `<authenticode-signing/>` within the `<for-each>` element

Sets are especially useful if your artifacts contain repeating nested structures.

### File set example

{%- assign table = site.data.tables.artifact-configuration.file-set-example -%}
{%- include render-table.html -%}

## File metadata restrictions {#metadata-restrictions}

Some element types support restricting certain metadata values. 

The restrictions can be applied to file elements, [file set elements](#file-and-directory-sets), or `<include>` elements. Attributes on `<include>` elements override those on file set elements.

| File element | Supported restriction attributes
|--------------|-------------------------------------------------------------------------
| `<pe-file>`  | PE file headers: `product-name`, `product-version`
| `<xml-file>` | Root element name and namespace: `root-element-name`, `root-element-namespace`

### Example: PE file metadata restriction 

~~~ xml
<artifact-configuration xmlns="http://signpath.io/artifact-configuration/v1">
  <msi-file>
    <!-- requires all pe-files to have the respective attributes set -->
    <pe-file-set product-name="YourProductName" product-version="1.0.0.0"> 
      <include path="main.exe" />
      <!-- overrides the value of the parent pe-file-set -->
      <include path="resources*.resource.dll" max-matches="unbounded" product-version="1.0.1.0" />
      <for-each>
        <authenticode-sign />
      </for-each>
    </pe-file-set>
    <authenticode-sign /> <!-- finally sign the MSI file -->
  </msi-file>
</artifact-configuration>
~~~

### Example: XML file schema restriction for CycloneDX SBOM {#sbom-sample}

~~~ xml
<artifact-configuration xmlns="http://signpath.io/artifact-configuration/v1">
  <!-- with this restriction, only CylconeDX 1.4 SBOM files can be signed with this artifact configuration -->
  <xml-file root-element-namespace="http://cyclonedx.org/schema/bom/1.4" root-element-name="bom">
    <xml-sign/>
  </xml-file>
</artifact-configuration>
~~~

## User-defined parameters

Available for Enterprise subscriptions
{: .badge.icon-signpath}

You can define parameters for each signing request. Use this to create a more restrictive artifact configuration, track values, or include build-time values.

Parameter values can be set when submitting a signing request via the user interface or API (see [documentation](/documentation/build-system-integration#submit-a-signing-request)). Actual values are displayed on the signing request details page. 

Parameters are defined in an optional `parameters` block at the beginning of the artifact configuration and can be referenced using the `${parameterName}` syntax in any XML attribute.

~~~xml
<artifact-configuration xmlns="http://signpath.io/artifact-configuration/v1">
  <parameters>
    <parameter name="version" default-value="1.0.0" required="true" />
  </parameters>
  <pe-file path="my-installer-${version}.exe" product-name="myproduct" product-version="${version}">
</artifact-configuration>
~~~

[Examples]: #examples

## Examples

<div class='panel info' markdown='1' >
<div class='panel-header'> Examples are shortened</div>
For the sake of clarity, all examples omit the XML prolog. A complete artifact configuration looks like this:

~~~ xml
<?xml version="1.0" encoding="utf-8" ?>
<artifact-configuration xmlns="http://signpath.io/artifact-configuration/v1">
  <!-- ... -->
</artifact-configuration>
~~~
</div>

### Predefined configuration for single Portable Executable file

This configuration works for all PE files.

~~~ xml
<artifact-configuration xmlns="http://signpath.io/artifact-configuration/v1">
  <pe-file>
    <authenticode-sign/>
  </pe-file>
</artifact-configuration>
~~~

### Signing multiple artifacts in a ZIP container

You can sign multiple unrelated artifacts by packing them into a single ZIP file.

~~~ xml
<artifact-configuration xmlns="http://signpath.io/artifact-configuration/v1">
  <zip-file>
    <pe-file path="app.exe">
      <authenticode-sign/>
    </pe-file>
    <powershell-file path="setup.ps1">
      <authenticode-sign/>
    </powershell-file>
  </zip-file>
</artifact-configuration>
~~~

### Deep-signing an MSI installer {#msi-sample}

This will sign the PE files `libs/common.dll` and `main.exe`, then re-package their MSI container and sign it too. It also restricts the name of the MSI container file.

~~~ xml
<artifact-configuration xmlns="http://signpath.io/artifact-configuration/v1">
  <msi-file path="MyProduct.v*.msi">
    <pe-file path="libs/common.dll">
      <authenticode-sign/>
    </pe-file>
    <pe-file path="main.exe">
      <authenticode-sign/>
    </pe-file>
    <authenticode-sign/>
  </msi-file>
</artifact-configuration>
~~~

### Signing similar directories within an MSI file

This artifact configuration describes an MSI installer package containing several components. The components have a similar structure and are therefore defined as a `<directory-set>`. Each component contains a `main.exe` and zero or more resource DLLs.

{%- assign table = site.data.tables.artifact-configuration.similar-directories-example -%}
{%- include render-table.html -%}
{: .noheader .noborder }

Example of a directory structure that would match this configuration:

{%- assign table = site.data.tables.artifact-configuration.similar-directories-example-match -%}
{%- include render-table.html -%}
{: .noheader .noborder }

**Footnotes:**

[^jscript]: Note that [JScript](https://en.wikipedia.org/wiki/JScript) is not the same as JavaScript. While it is possible to use this option to sign JavaScript files, JavaScript engines will not be able to use this signature.
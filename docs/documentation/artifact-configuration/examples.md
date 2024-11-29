---
header: Examples
layout: resources
toc: true
show_toc: 3
description: Artifact Configuration Examples
datasource: tables/artifact-configuration
---

## Syntax

{:.panel.info}
> **Examples are shortened**
>
> For the sake of clarity, all examples omit the XML prolog. A complete artifact configuration looks like this:
> 
> ~~~ xml
> <?xml version="1.0" encoding="utf-8" ?>
> <artifact-configuration xmlns="http://signpath.io/artifact-configuration/v1">
>   <!-- ... -->
> </artifact-configuration>
> ~~~

## Basic examples

### Predefined configuration for single Portable Executable file

This configuration works for all PE files.

~~~ xml
<artifact-configuration xmlns="http://signpath.io/artifact-configuration/v1">
  <pe-file>
    <authenticode-sign/>
  </pe-file>
</artifact-configuration>
~~~

## Signing multiple files

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

{%- include render-table.html table=site.data.tables.artifact-configuration.similar-directories-example -%}
{: .noheader .noborder }

Example of a directory structure that would match this configuration:

{%- include render-table.html table=site.data.tables.artifact-configuration.similar-directories-example-match -%}
{: .noheader .noborder }

## Metadata restrictions

### PE file metadata restriction {#pe-restriction}

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

### XML file schema restriction for CycloneDX SBOM {#sbom-restriction}

~~~ xml
<artifact-configuration xmlns="http://signpath.io/artifact-configuration/v1">
  <!-- with this restriction, only CylconeDX 1.5 SBOM files can be signed with this artifact configuration -->
  <xml-file root-element-namespace="http://cyclonedx.org/schema/bom/1.5" root-element-name="bom">
    <xml-sign/>
  </xml-file>
</artifact-configuration>
~~~

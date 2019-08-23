---
title: Documentation - SignPath.io
header: Documentation
layout: resources
toc: true
background_image: '/assets/start.jpg'
---

## Abstract

The artifact configuration describes the structure of the artifacts you want to sign. For simple artifacts, you can use predefined configurations to get started quickly. For signing several artifacts together, and for more complex artifacts, specify the structure of your artifact and provide signing directives using XML.

<div class='panel info' markdown='1' data-title='Tips'>
<div class='panel-header'><i class='la la-info-circle'></i>Tips</div>
* **Basic artifact configurations can be generated from sample artifacts.** However, this is feature is not yet integrated in the online application. Until then, feel free to ask our support for help at [support@singpath.io](mailto:support@signpath.io?subject=Request%20for%20artifact%20configuration). Please attach your sample artifact.
* Alternatively, if you don't know the internal structure of your artifact, [extract container files](#extracting-artifact-packages) to your disk first.
* Use a schema-aware XML editor, such as Microsoft Visual Studio, to edit your artifact configuration. (Some tools may require you to download the [schema](https://app.signpath.io/web/artifact-configuration/v1.xsd)).
</div>

## Deep signing

In case you have more complex, nested artifacts, you might want to not only sign the container itself (for instance, an MSI installer package), but also all files that are shipped within the container (e.g. .exe and .dll files within the MSI installer). Therefore, every container format can contain multiple other file or directory elements to be signed. Each of those will be extracted, signed, and then put back into the container file during the signing process. In order for SignPath to find the right file, all inner elements need a path attribute.

## File elements

Every XML description is wrapped in an `<artifact-configuration>` root element which contains exactly one file element. This file element specifies the type of artifact and signing method. Optionally, you can restrict the name of the file using the `path` attribute.

Container-format elements may contain other file elements for deep signing.

### File element types and signing directives

<table id="signing-file-elements">
<thead>
  <tr>
    <th>Element</th>
    <th>Container format</th>
    <th>Signing directive</th>
    <th>Extensions</th>
    <th>Description</th>
  </tr>
</thead>
<tbody>
  <tr>
    <td><code>&lt;pe-file&gt;</code></td>
    <td>No</td>
    <td><code><a href="#authenticode-sign">&lt;authenticode-sign&gt;</a></code></td>
    <td>.acm, .ax, .cpl, .dll, .drv, .efi, .exe, .mui, .ocx, .scr, .sys, .tsp</td>
    <td>Portable Executable (PE) files: EXE, DLL, and other executable files</td>
  </tr>
  <tr>
    <td><code>&lt;powershell-file&gt;</code></td>
    <td>No</td>
    <td><code>&lt;authenticode-sign&gt;</code></td>
    <td>.ps1, .psm1, psd1, .psdc1, .ps1xml</td>
    <td>PowerShell scripts and modules</td>
  </tr>
  <tr>
    <td><code>&lt;zip-file&gt;</code></td>
    <td>Yes</td>
    <td>(none)</td>
    <td>.zip</td>
    <td>ZIP archives</td>
  </tr>
  <tr>
    <td><code>&lt;msi-file&gt;</code></td>
    <td>Yes</td>
    <td><code>&lt;authenticode-sign&gt;</code></td>
    <td>.msi, .msm, .msp</td>
    <td>Microsoft installer files</td>
  </tr>
  <tr>
    <td><code>&lt;cab-file&gt;</code></td>
    <td>Yes</td>
    <td><code>&lt;authenticode-sign&gt;</code></td>
    <td>.cab</td>
    <td>Windows cabinet files</td>
  </tr>
  <tr>
    <td><code>&lt;appx-file&gt;</code></td>
    <td>Yes</td>
    <td><code>&lt;authenticode-sign&gt;</code></td>
    <td>.appx, .appxbundle</td>
    <td>App packages for Microsoft Store/Universal Windows Platform

Deep signing is not yet supported.
  </td>
  </tr>
  <tr>
    <td><code>&lt;opc-file&gt;</code></td>
    <td>Yes</td>
    <td><code><a href="#opc-sign">&lt;opc-sign&gt;</a></code></td>
    <td>.vsix, .xps, ...</td>
    <td>Open Packaging Conventions (OPC) files including Visual Studio Extensions (VSIX)</td>
  </tr>
  <tr>
    <td><code>&lt;nupkg-file&gt;</code></td>
    <td>Yes</td>
    <td><code><a href="#nuget-sign">&lt;nuget-sign&gt;</a></code></td>
    <td>.nupkg</td>
    <td>NuGet packages</td>
  </tr>
  <tr>
    <td><code>&lt;directory&gt;</code></td>
    <td>Yes</td>
    <td><code><a href="#clickonce-sign">&lt;clickonce-sign&gt;</a></code></td>
    <td></td>
    <td>Directories within container files</td>
  </tr>
</tbody>
</table>

### File element examples

#### Signing an MSI package

{% highlight xml %}
<artifact-configuration xmlns="http://signpath.io/artifact-configuration/v1">
  <msi-file>
    <authenticode-sign/>
  </msi-file>
</artifact-configuration>
{% endhighlight %}

See [Examples] for more complex artifact configurations.
See [Examples] for more complex artifact configurations.

### Signing multiple artifacts

If you want to sign multiple independent artifacts in one step, you need to package them into a ZIP archive before processing.

You can combine signing multiple artifacts with deep signing.

## &lt;directory&gt; element

All supported container formats have an internal directory structure. You can see this structure if you extract a container to a local disk.

You can either specify these directories in the ``path`` attribute of each file element, or nest these file elements  within ``<directory>`` elements.

`<directory>` elements are also used for [ClickOnce signing].

### &lt;directory&gt; example

<table markdown="1">
  <thead>
    <th>The following fragment</th>
    <th>is equivalent to</th>
  </thead>
  <tbody> <tr> <td>

{% highlight xml %}
<zip-file>
  <pe-file path="bin/program.exe">
    <authenticode-sign/>
  </pe-file>
</zip-file>
{% endhighlight %}

</td> <td>

{% highlight xml %}
<zip-file>
  <directory path="bin">
    <pe-file path="program.exe">
      <authenticode-sign/>
    </pe-file>
  </directory>
</zip-file>
{% endhighlight %}

</td> </tr> </tbody> </table>

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

[ClickOnce signing]: #clickonce-sign

### &lt;clickonce-sign&gt;

ClickOnce signing, also called 'manifest signing', is a method used for ClickOnce applications and Microsoft Office Add-ins.

ClickOnce signing applies to directories, not to individual files. Therefore, you need to specify a `<directory>` element for this method. If you want to sign files in the root directory of a container, specify `path="."`.

{% highlight xml %}
<artifact-configuration xmlns="http://signpath.io/artifact-configuration/v1">
  <zip-file>
    <directory path=".">
      <clickonce-sign/>
    </directory>
  </zip-file>
</artifact-configuration>
{% endhighlight %}

Using `<clickonce-sign>` is equivalent to using Microsoft's `mage.exe`.

### &lt;nuget-sign&gt;

NuGet package signing is currently being introduced to the [NuGet Gallery](https://www.nuget.org/).

Although the NuGet Package format is based on OPC (see next section), it uses its own specific signing format.

Using `<nuget-sign>` is equivalent to using Microsoft's `nuget` `sign` command.

### &lt;opc-sign&gt;

The [Open Packaging Conventions](https://en.wikipedia.org/wiki/Open_Packaging_Conventions) (OPC) specification has its own signature format. Since OPC is the foundation for several file formats, it is not strictly a code signing format. However, code signing is used for Visual Studio Extensions (VSIX).

Other OPC formats include:

* Open XML Paper Specification (OpenXPS)
* Office Open XML files (Microsoft Office)

Note that while OPC signing can be applied to all OPC formats, specific applications and formats do not necessarily use or verify signatures, or even require a different signing format (case in point: NuGet packages).

Using `<opc-sign>` for Visual Studio Extensions is equivalent to using Microsoft's `VSIXSignTool.exe`.

<!-- markdownlint-enable MD026 no trailing punctuation -->

## Using wildcards

Every path attribute can contain the following wildcard patterns:

| Wildcard | Description |
| -------- | ----------- |
| `*`      | Matches any number of any character (including none, excluding the directory separator)
| `?`      | Matches  any single character
| `[abc]`  | Matches one character given in the bracket
| `[a-z]`  | Matches one character from the range given in the bracket
| `[!abc]` | Matches one character that is not given in the bracket
| `[!a-z]` | Matches one character that is not from the range given in the bracket
| `**`     | Matches any number of path/directory segments. When used, they must be the only contents of the dedicated segment.

If wildcards are used, optional `max-matches` and `min-matches` parameters can be specified to limit the number of files which are allowed to match the wildcard expression. Both default to `1`. (You can also use `min-matches="0"` for optional elements even without wildcards.)

## File and directory sets

If multiple files or directories should be handled in the same way, you can enumerate them using one of the following file or directory set elements:

* `<directory-set>`
* `<pe-file-set>`
* `<zip-file-set>`
* `<msi-file-set>`
* `<cab-file-set>`
* `<opc-file-set>`
* `<nupkg-file-set>`

Each set element contains:

* an `<include>` element for each file (or pattern) to be processed
* a `<for-each>` element that will be applied to all included elements of the set

A set's `<for-each>` element can include the same child elements as the corresponding simple file or directory element:

* `<pe-file>` supports `<authenticode-signing/>`
* therefore `<pe-file-set>` supports `<authenticode-signing/>` within the `<for-each>` element

Sets are especially useful if your artifacts contain repeating nested structures.

### File set example

<table markdown="1">
	<thead>
    <th>The following fragment</th>
    <th>is equivalent to</th>
  </thead>
  <tbody> 
  	<tr> 
  		<td>
{% highlight xml %}
<pe-file path="first.dll">
  <authenticode-sign/>
</pe-file>

<pe-file path="second.dll">
  <authenticode-sign/>
</pe-file>
{% endhighlight %}
			</td> 
			<td>
{% highlight xml %}
<pe-file-set>
  <include path="first.dll">
  <include path="second.dll">
  <for-each>
    <authenticode-sign/>
  </for-each>
</pe-file>
{% endhighlight %}
			</td> 
		</tr> 
	</tbody> 
</table>

## File attribute restrictions

For Microsoft Portable Executable (PE) files, the existence of their Product Name / Product Version header attributes can be enforced by setting the <code>productName</code> and <code>productVersion</code> attributes on the <code>&lt;pe-file&gt;</code>, <code>&lt;pe-file-set&gt;</code> and including <code>&lt;include&gt;</code> elements. The value of the <code>&lt;include&gt;</code> overrides any value set on the <code>&lt;pe-file-set&gt;</code> element.

### File attribute restriction example

{% highlight xml %}
<artifact-configuration xmlns="http://signpath.io/artifact-configuration/v1">
  <msi-file>
    <!-- requires all pe-files to have the respective attributes set -->
    <pe-file-set productName="YourProductName" productVersion="1.0.0.0"> 
      <include path="main.exe" />
      <!-- overrides the value of the parent pe-file-set -->
      <include path="resources*.resource.dll" max-occurs="unbounded" productVersion="1.0.1.0" />
      <for-each>
        <authenticode-sign />
      </for-each>
    </pe-file-set>
    <authenticode-sign /> <!-- finally sign the MSI file -->
  </msi-file>
</artifact-configuration>
{% endhighlight %}

[Examples]: #examples

## Examples

<div class='panel info' markdown='1' data-title='Examples are shortened'>
<div class='panel-header'><i class='la la-info-circle'></i> Examples are shortened</div>
For the sake of clarity, all examples omit the XML prolog. A complete artifact configuration looks like this:

{% highlight xml %}
<?xml version="1.0" encoding="utf-8" ?>
<artifact-configuration xmlns="http://signpath.io/artifact-configuration/v1">
  <!-- ... -->
</artifact-configuration>
{% endhighlight %}
</div>

### Predefined configuration for single Portable Executable file

This configuration works for all PE files.

{% highlight xml %}
<artifact-configuration xmlns="http://signpath.io/artifact-configuration/v1">
  <pe-file>
    <authenticode-sign/>
  </pe-file>
</artifact-configuration>
{% endhighlight %}

### Signing multiple artifacts in a ZIP container

You can sign multiple unrelated artifacts by packing them into a single ZIP file.

{% highlight xml %}
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
{% endhighlight %}

### Deep-signing an MSI installer

This will sign the PE files `libs/common.dll` and `main.exe`, then re-package their MSI container and sign it too. It also restricts the name of the MSI container file.

{% highlight xml %}
<artifact-configuration xmlns="http://signpath.io/artifact-configuration/v1">
  <msi-file path="MyProduct.v*.msi">
    <directory path="libs">
      <pe-file path="common.dll">
        <authenticode-sign/>
      </pe-file>
    </directory>
    <pe-file path="main.exe">
      <authenticode-sign/>
    </pe-file>
    <authenticode-sign/>
  </msi-file>
</artifact-configuration>
{% endhighlight %}

### Signing similar directories within an MSI file

This artifact configuration describes an MSI installer package containing several components. These components have a similar structure and are therefore defined as a `<directory-set>`. Each component contains a `main.exe` and zero or more resource DLLs.

{% highlight xml %}
<artifact-configuration xmlns="http://signpath.io/artifact-configuration/v1">
  <msi-file>
    <directory-set>
      <include path="component1" />
      <include path="component2" />
      <include path="component3" />
      <for-each>
        <pe-file-set>
          <include path="main.exe" />
          <include path="resources\*.resource.dll" min-matches="0" max-matches="unbounded" />
          <for-each>
            <authenticode-sign/>
          </for-each>
        </pe-file-set>
      </for-each>
    </directory-set>
    <authenticode-sign/>
  </msi-file>
</artifact-configuration>
{% endhighlight %}

Example of a directory structure that would match this configuration:

    MyApp.msi
      component1/
        main.exe
        resources/
          de.resource.dll
          en.resource.dll
          fr.resource.dll
      component2/
        main.exe
      component3/
        main.exe
        resources/
          en.resource.dll

## Extracting artifact packages

You can use the following tools in order to manually extract files from your artifacts. From the extracted file structure, you can then easily create a matching artifact configuration.

We recommend that you apply these tools to all contained files recursively and create a very specific artifact configuration.

| File type       | Recommended tools |
| --------------- | ----------------- |
| .zip, .cab      | Extract using tools like WinZip or 7-Zip or Windows Explorer.
| .vsix, .nupkg   | These are just special ZIP archives. Either change the extension to .ZIP or use a tool like 7-Zip to directly extract their contents.
| .msi            | Use the Windows tool msiexec.exe to perform an administrative install. Note that this might execute parts of the MSI file, so only use this for trusted files.<br> `msiexec /a filename.msi TARGETDIR=c:\full-path`
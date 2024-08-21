---
main_header: Artifact Configuration
sub_header: Syntax and Structure
layout: resources
toc: true
show_toc: 3
description: Artifact Configuration Syntax and Structure
datasource: tables/artifact-configuration
---

## Artifcat configuration syntax {#syntax}

Artifact configurations are XML files with the schema `http://signpath.io/artifact-configuration/v1"`. You can download the schema file when you edit an artifact configuration in SignPath.

They contain exactly one file element representing the artifact. 

~~~ xml
<?xml version="1.0" encoding="utf-8" ?>
<artifact-configuration xmlns="http://signpath.io/artifact-configuration/v1">
  <root-file-element>
    ...
  </root-file-element>
</artifact-configuration>
~~~

## Basic artifact structure {#structure}

**Note: The following example fragments show only the root file element.** XML prologue and `<artifact configuration>` element are omitted for clarity.

Several [element types](reference#file-elements) are available of various supported file types.

Depending on their type, file elements can contain signing directives. 

~~~ xml
<pe-file>
  <authenticode-sign/>
</pe-file>
~~~

Container elements (e.g. archives, directories, packages and installers) can contain nested files, identified by a required `path` attribute. 

Use [`<zip-file>`](#zip-file-element) as root element to sign multiple artifacts in one signing request.

~~~ xml
<zip-file>
  <pe-file path="myapp.exe"> 
    <authenticode-sign/> 
  </pe-file>
  <pe-file path="myapp.dll">
    <authenticode-sign/> 
  </pe-file>
</zip-file>
~~~

To sign several files, you may use [wildcards](#wildcards) ...

~~~ xml
<zip-file>
  <pe-file path="myapp.*" max-occurences="unbounded"> 
    <authenticode-sign/> 
  </pe-file>
</zip-file>
~~~

... or [file sets](#file-and-directory-sets) with `<for-each>` directives:

~~~ xml
<zip-file>
  <pe-file-set>
    <include path="myapp.exe"/> 
    <include path="myapp.dll"/>     
    <for-each>
        <authenticode-sign/> 
    </for-each>
  </pe-file-set>
</zip-file>
~~~

Some formats support nested signing. The following example signs both the file `myapp.exe` within the MSI file, and the MSI file itself:

~~~ xml
<msi-file>
  <pe-file path="myapp.exe">
     <authenticode-sign/> 
  </pe-file>
  <authenticode-sign/>
</msi-file>
~~~

For nested signing, consider [verifying signatures](reference#verification) of files that are already supposed to be signed:

~~~ xml
<msi-file>
  <pe-file path="thirdparty.dll">
     <authenticode-verify/> 
  </pe-file>
  <pe-file path="myapp.exe">
     <authenticode-sign/> 
  </pe-file>
  <authenticode-sign/>
</msi-file>
~~~

For root elements, the `path` attribute is optional and cannot contain directories. You may use [wildcards](#wildcards) to specify the name ...

~~~ xml
<pe-file path="myapp-v*.exe">
  <authenticode-sign/>
</pe-file>
~~~

... or be specific and provide [user defined parameters](#parameters):

~~~ xml
<pe-file path="myapp-v${version}.exe">
  <authenticode-sign/>
</pe-file>
~~~

## Main structural elements

### `<directory>` element {#directory-element}

All supported container formats have an internal directory structure. You can see this structure if you extract a container to a local disk.

You can either specify these directories in the `path` attribute of each file element or nest these file elements within `<directory>` elements.

{%- include render-table.html table=site.data.tables.artifact-configuration.directory-example -%}

### `<zip-file>` element {#zip-file-element}

Use the `<zip-file>` element to specify a ZIP archive. SignPath will process archives inside this file. 

You can also use the [`<jar-sign>`](reference#jar-sign) directive to sign entire ZIP archives for verification with `jarsigner`.

#### Upload multiple files

This feature allows users to select multiple files in the browser.

* Use `<zip-file>` as root element
* Set the `ui-multifile-upload` attribute to `on`

Result:

* The user can select one or more files in the artifact browse dialog 
* A ZIP archive named `bundle.zip` will automatically be created and uploaded (even if only a single file is selected)
* The signed artifacts will still be provided as a ZIP archive dowload (also called `bundle.zip`)

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

## Platform considerations

File and directory names in `path` attributes are case-insensitive. You may use slash `/` or backslash `\` as directory separators.

## Using wildcards {#wildcards}

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

## File and directory sets {#file-and-directory-sets}

If multiple files or directories should be handled in the same way, you can enumerate them using one of the following file or directory set elements: `<directory-set>`, `<pe-file-set>`, `<powershell-file-set>`, `<windows-script-file-set>`, `<msi-file-set>`, `<cab-file-set>`, `<catalog-file-set>`, `<appx-file-set>`, `<msix-file-set>`, `<opc-file-set>`, `<nupkg-file-set>`, `<jar-file-set>`, `<zip-file-set>`, `<office-oxml-file-set>`, `<office-binary-file-set>`, `<xml-file-set>`, `<file-set>`

Each set element contains:

* an `<include>` element for each file (or pattern) to be processed
* a `<for-each>` element that will be applied to all included elements of the set

A set's `<for-each>` element can include the same child elements as the corresponding simple file or directory element:

* `<pe-file>` supports `<authenticode-signing/>`
* therefore `<pe-file-set>` supports `<authenticode-signing/>` within the `<for-each>` element

Sets are especially useful if your artifacts contain repeating nested structures.

### File set example

{%- include render-table.html table=site.data.tables.artifact-configuration.file-set-example -%}

## User-defined parameters {#parameters}

{% include editions.md feature="artifact_configuration.user_defined_parameters" %}

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


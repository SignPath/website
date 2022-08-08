---
main_header: Documentation
sub_header: PowerShell
layout: resources
toc: true
show_toc: 0
description: SignPath PowerShell cmdlets
---

[![PowerShell Gallery](https://img.shields.io/powershellgallery/v/SignPath.svg?style=flat-square&label=PowerShell%20Gallery)](https://www.powershellgallery.com/packages/SignPath/)

To integrate SignPath in your build chain, you can use the [official SignPath module from PowerShell Gallery](https://www.powershellgallery.com/packages/SignPath).

## Install the SignPath module
~~~ powershell
Install-Module -Name SignPath
~~~

<div class="panel " markdown="1">
<div class="panel-header">Specify an an acceptable version range</div>
The releases of the SignPath module follow [semantic versioning](https://semver.org/) principles. In automated scenarios, we recommend to fix the major version and set the minimum minor version. This ensures that the most current backwards-compatible version is installed.

To achieve this, specify a lower and upper bound, e.g. `-MinimumVersion 2.1.0 -MaximumVersion 2.999.999`
</div>

## SignPath PowerShell cmdlets

| cmdlet                                           | Description 
|--------------------------------------------------|-----------------------------------------------------------------------------------------------|
| [Submit-SigningRequest](Submit-SigningRequest)   | Submit a new signing request, or resubmit an existing one
| [Get-SignedArtifact](Get-SignedArtifact)         | Get the signed artifact from a finished signing request, or wait until processing is complete
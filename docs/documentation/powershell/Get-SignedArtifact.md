---
main_header: PowerShell
sub_header: Get-SignedArtifact
layout: resources
toc: false
show_toc: 0
description: Get-SignedArtifact
---

Downloads a signed artifact based on a signing request ID.

## Syntax

<div class="pssyntax" markdown="1">

~~~ powershell
Get-SignedArtifact 
    -OrganizationId <String> -CIUserToken <String> [-ClientCertificate <X509Certificate2>]
    [-ApiUrl <String>] 
    -SigningRequestId <String> 
    -OutputArtifactPath <String>
    [-Force]
    [-WaitForCompletionTimeoutInSeconds <Int32>] 
    [-ServiceUnavailableTimeoutInSeconds <Int32>] [-UploadAndDownloadRequestTimeoutInSeconds <Int32>] 
~~~
</div>

## Description

The `Get-SignedArtifact` cmdlet waits for the specified signing request to finish and downloads the resulting artifact.

This cmdlet throws an exception if the signing request does not successfully complete in time.

## Parameters

| Parameter                                 | Type              | Description                                                   | Default value | Editions
|-------------------------------------------|-------------------|---------------------------------------------------------------|---------------|---------
| `-OrganizationId`                         | `String`          | ID of your SignPath organization
| `-CIUserToken`                            | `String`          | API token you receive when adding a new CI user
| `-ClientCertificate`                      | `X509Certificate2`| Client certificate used for a secure Web API request. Not supported by SignPath.io directly, use for proxies. | | Enterprise
| `-ApiUrl`                                 | `String`          | URL to the SignPath REST API                                  | `https://app.signpath.io/api/`
| `-SigningRequestId`                       | `String`          | ID of the siging request
| `-OutputArtifactPath`                     | `String`          | Specifies the target path for the downloaded signed artifact  | `InputArtifactPath` with an added `.signed` extension 
| `-Force`                                  | Switch            | Allows the cmdlet to overwrite the file at OutputArtifactPath | `false`
| `-WaitForCompletionTimeoutInSeconds`      | `Int32`           | Maximum time in seconds that the cmdlet will wait for the signing request to complete (upload and download have no specific timeouts) | 600 seconds
| `-ServiceUnavailableTimeoutInSeconds`     | `Int32`           | Total time in seconds that the cmdlet will wait for a single service call to succeed (across several retries) | 600 seconds
| `-UploadAndDownloadRequestTimeoutInSeconds` | `Int32`         | HTTP timeout used for upload and download HTTP requests       | 300 seconds
{: .break-column-1 }


## Examples

### Example 1: Download an artifact from a previously submitted signing request

~~~ powershell
$signingRequestID = Submit-SigningRequest `
    -OrganizationId $ORGANIZATION_ID `-CIUserToken $CI_USER_TOKEN `
    -ProjectSlug $PROJECT -SigningPolicySlug $SIGNING_POLICY `
    -ArtifactConfigurationSlug $ARTIFACT_CONFIGURATION `
    -InputArtifactPath $PATH_TO_INPUT_ARTIFACT

Get-SignedArtifact `
    -OrganizationId $ORGANIZATION_ID -CIUserToken $CI_USER_TOKEN `
    -SigningRequestId $signingRequestID `
    -OutputArtifactPath $PATH_TO_OUTPUT_ARTIFACT
~~~ 

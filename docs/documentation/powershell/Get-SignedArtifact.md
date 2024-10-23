---
main_header: PowerShell
sub_header: Get-SignedArtifact
layout: resources
toc: true
show_toc: 3
description: Get-SignedArtifact
---

Downloads a signed artifact based on a signing request ID.

## Syntax

~~~ powershell
Get-SignedArtifact 
    -OrganizationId <String> -ApiToken <String> [-ClientCertificate <X509Certificate2>]
    [-ApiUrl <String>] 
    -SigningRequestId <String> 
    -OutputArtifactPath <String>
    [-Force]
    [-WaitForCompletionTimeoutInSeconds <Int32>] 
    [-ServiceUnavailableTimeoutInSeconds <Int32>] [-UploadAndDownloadRequestTimeoutInSeconds <Int32>] 
~~~

## Description

The `Get-SignedArtifact` cmdlet waits for the specified signing request to finish and downloads the resulting artifact.

This cmdlet throws an exception if the signing request does not successfully complete in time.

## Parameters

| Parameter                                   | Type              | Description                                                   | Default value                                   | Editions
|---------------------------------------------|-------------------|---------------------------------------------------------------|-------------------------------------------------|---------
| `-OrganizationId`                           | `String`          | ID of your SignPath organization                              |
| `-ApiToken`                                 | `String`          | API token of an interactive or CI user                        |
| `-ClientCertificate`                        | `X509Certificate2`| Client certificate used for a secure Web API request. Not supported by SignPath.io directly, use for proxies. | | {{ site.data.editions | where: "pipeline_integrity.trusted_build_systems", "Optional" | map: "name" | join: ", " }}
| `-ApiUrl`                                   | `String`          | URL to the SignPath REST API                                  | `https://app.signpath.io/api/`
| `-SigningRequestId`                         | `String`          | ID of the siging request                                      |
| `-OutputArtifactPath`                       | `String`          | Specifies the target path for the downloaded signed artifact  | `InputArtifactPath` with an added `.signed` extension 
| `-Force`                                    | Switch            | Allows the cmdlet to overwrite the file at OutputArtifactPath | `false`
| `-WaitForCompletionTimeoutInSeconds`        | `Int32`           | Maximum time in seconds that the cmdlet will wait for the signing request to complete (upload and download have no specific timeouts) | 600 seconds  
| `-ServiceUnavailableTimeoutInSeconds`       | `Int32`           | Total time in seconds that the cmdlet will wait for a single service call to succeed (across several retries) | 600 seconds
| `-UploadAndDownloadRequestTimeoutInSeconds` | `Int32`           | HTTP timeout used for upload and download HTTP requests       | 300 seconds
{: .break-column-1 .break-column-4}


## Examples

#### Example 1: Download an artifact from a previously submitted signing request

~~~ powershell
$signingRequestID = Submit-SigningRequest `
    -OrganizationId $ORGANIZATION_ID `-ApiToken $API_TOKEN `
    -ProjectSlug $PROJECT -SigningPolicySlug $SIGNING_POLICY `
    -ArtifactConfigurationSlug $ARTIFACT_CONFIGURATION `
    -InputArtifactPath $PATH_TO_INPUT_ARTIFACT

Get-SignedArtifact `
    -OrganizationId $ORGANIZATION_ID -ApiToken $API_TOKEN `
    -SigningRequestId $signingRequestID `
    -OutputArtifactPath $PATH_TO_OUTPUT_ARTIFACT
~~~ 

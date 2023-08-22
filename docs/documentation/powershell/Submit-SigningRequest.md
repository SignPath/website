---
main_header: PowerShell
sub_header: Submit-SigningRequest
layout: resources
toc: false
show_toc: 0
description: Submit-SigningRequest cmdlet
---

Submits a new signing request or resubmits an existing one via the SignPath REST API.

## Syntax

### Upload an input artifact {#input-artifact}

Use `-InputArtifact` to directly upload the artifact from the specified local file.

{:.pssyntax}
~~~ powershell
Submit-SigningRequest 
    -InputArtifactPath <String>
        (-ProjectSlug <String> -SigningPolicySlug <String> [-ArtifactConfigurationSlug <String>] )
        | (-SigningPolicyId <String> [-ArtifactConfigurationId <String>] )
        [-Origin <Hashtable>]
    [-WaitForCompletion 
        -OutputArtifactPath <String>
        [-Force]
        [-WaitForCompletionTimeoutInSeconds <Int32>] 
    ]
    -OrganizationId <String> -CIUserToken <String> [-ClientCertificate <X509Certificate2>]
    [-ApiUrl <String>] 
    [-Description <String>] 
    [-Parameters <Hashtable>] 
    [-ServiceUnavailableTimeoutInSeconds <Int32>] [-UploadAndDownloadRequestTimeoutInSeconds <Int32>] 
~~~

### Provide a URL to retrieve the artifact {#artifact-retrieval}

Use `-ArtifactRetrievalLink` to instruct SingPath to download the artifact from the specified URL.

{:.pssyntax}
~~~ powershell
Submit-SigningRequest 
    -ArtifactRetrievalLink <String> 
        -ArtifactRetrievalLinkFileName <String> 
        [-ArtifactRetrievalLinkSha256Hash <String>] 
        [-ArtifactRetrievalLinkHttpHeaders <Hashtable>]
        (-ProjectSlug <String> -SigningPolicySlug <String> [-ArtifactConfigurationSlug <String>] )
        | (-SigningPolicyId <String> [-ArtifactConfigurationId <String>] )
        [-Origin <Hashtable>]
    [-WaitForCompletion 
        -OutputArtifactPath <String>
        [-Force]
        [-WaitForCompletionTimeoutInSeconds <Int32>] 
    ]
    -OrganizationId <String> -CIUserToken <String> [-ClientCertificate <X509Certificate2>]
    [-ApiUrl <String>] 
    [-Description <String>] 
    [-Parameters <Hashtable>] 
    [-ServiceUnavailableTimeoutInSeconds <Int32>] [-UploadAndDownloadRequestTimeoutInSeconds <Int32>] 
~~~

### Resubmit an existing singing request {#resubmit}

Available for Enterprise subscriptions
{: .badge.icon-signpath}

Use `-Resubmit` to create a new signing request based on an existing signing request, but typically using a different _signing policy_ ([read more.](#new-vs-resigning)).

{:.pssyntax}
~~~ powershell
Submit-SigningRequest 
    -Resubmit
        -OriginalSigningRequestId <String> 
        (-SigningPolicySlug <String>) | (-SigningPolicyId <String>)
    [-WaitForCompletion 
        -OutputArtifactPath <String>
        [-Force]
        [-WaitForCompletionTimeoutInSeconds <Int32>] 
    ]
    -OrganizationId <String> -CIUserToken <String> [-ClientCertificate <X509Certificate2>]
    [-ApiUrl <String>] 
    [-Description <String>] 
    [-Parameters <Hashtable>] 
    [-ServiceUnavailableTimeoutInSeconds <Int32>] [-UploadAndDownloadRequestTimeoutInSeconds <Int32>] 
~~~ 

## Description

The `Submit-SigningRequest` cmdlet creates a new _signing request_. The signing request will be processed by SignPath according to authorization and policy rules.

### Creating a new signing request vs. re-signing {#new-vs-resigning}

When using the `-InputArtifactPath` or `-ArtifactRetrievalLink` parameter, the specified file will be used for processing. 

When using the `-Resubmit` parameter, the specified signing request will be processed again using the specified _signing policy_. This is especially useful for conditional signing of release candidates. See [Resubmit an existing signing request](/documentation/signing-code#resubmit) for more information.

### Downloading the signed artifact 

Processing a signing request may take several minutes, or even longer if manual approval is required. You can either 

* your own logic to wait for processing to complete and download the signed artifact using the [Get-SignedArtifact](Get-SignedArtifact) cmdlet afterwards,
* or use the `-WaitForCompletion` parameter of this cmdlet to wait for processing and then download the signed artifact in a single call.

## Parameters

<div class="panel tip" markdown="1">
<div class="panel-header">Tip</div>

Signing policies in the SignPath Web application show basic `Submit-SigningRequest` calls with essential parameters.
</div>

### Parameters with `-InputArtifactPath` or `-ArtifactRetrievalLink`

| Parameter                                 | Type              | Description                                                   | Default value | Editions
|-------------------------------------------|-------------------|---------------------------------------------------------------|---------------|-----------
| `-InputArtifactPath`                      | `String`          | Local path of the artifact you want to sign
| `-ArtifactRetrievalLink`                  | `String`          | URL to download the artifact you want to sign
| `-ArtifactRetrievalLinkFileName`          | `String`          | File name of the artifact 
| `-ArtifactRetrievalLinkSha256Hash`        | `String`          | Optional hexadecimal file hash of the artifact (is specified, must match retrieved artifact)
| `-ArtifactRetrievalLinkHttpHeaders`       | `Hashtable`       | Optional HTTP headers to use when downloading the artifact 
| `-ProjectSlug`                            | `String`          | Slug of the project 
| `-SigningPolicySlug`                      | `String`          | Slug of one of the project's signing policies
| `-ArtifactConfigurationSlug`              | `String`          | Slug of one of the project's artifact configurations          | Project's default artifact configuration
| `-SigningPolicyId`                        | `String`          | ID of a project's signing policy
| `-ArtifactConfigurationId`                | `String`          | ID of one of the project's artifact configurations            | Project's default artifact configuration
| `-Origin`                                 | `Hashtable`       | Information about the origin of the artifact, see below       |               | Enterprise
{: .break-column-1 }

<div class="panel note" markdown="1">
<div class="panel-header">Slugs or IDs</div>

Use either slugs _or_ IDs, don't mix them.
</div>

<div class="panel tip" markdown="1">
<div class="panel-header">Automated builds version control</div>

Consider using these sources if you are using automated builds:

* **Artifact configuration: version management**. Create new versions of your artifact configuration for breaking changes and let your code determine the version to use. This ensures that signing will continue to work for older versions of your application while the artifact configuration evolves. If the script that invokes this cmdlet is under version control, it might be a better idea to have the artifact configuration slug hard coded in the script than to get it from a CI variable.
* **Signing policy: CI parameter**. If you take the signing policy from a Continuous Integration/Build Automation parameter, you can use the same script and cmdlet invocation for different build configurations, such as test and release.

</div>

#### `-Origin` values

Available for Enterprise subscriptions
{: .badge.icon-signpath}

This parameter should only be used from a [Trusted Build System](/documentation/trusted-build-systems).

| Parameter                                     | Description
|-----------------------------------------------|--------------------------------------------------------------------------------------
| `RepositoryData.SourceControlManagementType`  | Type of source control management (SCM) or version control system (VCS), e.g. `git`
| `RepositoryData.Url`                          | URL of the source code repository, must match project settings for origin verification
| `RepositoryData.BranchName`                   | Branch name for the build, must match signing policy settings for origin verification
| `RepositoryData.CommitId`                     | Commit ID for the build
| `BuildData.Url`                               | URL of the CI system
| `BuildData.BuildSettingsFile`                 | File containing build configuration settings not accessible through SCM/VCS. Use `@` prefix to reference a local file, e.g. `@build/settings.json`
{: .break-column-1 }

Parameters can either be passed as named above, or using nested hashtables (see [example](#example-params-origin)).

### Parameters with `-Resubmit`

| Parameter                                 | Type              | Description                                                   | Default value
|-------------------------------------------|-------------------|---------------------------------------------------------------|-----------
| `-Resubmit`                               | Switch            | Re-sign an existing signing request                           | `false`
| `-OriginalSigningRequestId`               | `String`          | ID of the signing request that should be resubmitted
| `-SigningPolicySlug`                      | `String`          | Slug of one of the original project's signing policies
| `-SigningPolicyId`                        | `String`          | ID of one of the original project's signing policies
{: .break-column-1 }

Note: Use either slugs _or_ IDs, don't mix.

### Parameters with `-WaitForCompletion`

| Parameter                                 | Type              | Description                                                   | Default value
|-------------------------------------------|-------------------|---------------------------------------------------------------|-----------
| `-WaitForCompletion`                      | Switch            | Wait for the signing request to complete                      | `false`
| `-OutputArtifactPath`                     | `String`          | Specifies the target path for the downloaded signed artifact  | `InputArtifactPath` with an added `.signed` extension 
| `-Force`                                  | Switch            | Allows the cmdlet to overwrite the file at OutputArtifactPath | `false`
| `-WaitForCompletionTimeoutInSeconds`      | `Int32`           | Maximum time in seconds that the cmdlet will wait for the signing request to complete (upload and download have no specific timeouts) | 600 seconds
{: .break-column-1 }

### Common parameters

| Parameter                                 | Type              | Description                                                   | Default value | Editions
|-------------------------------------------|-------------------|---------------------------------------------------------------|---------------|---------
| `-OrganizationId`                         | `String`          | ID of your SignPath organization
| `-CIUserToken`                            | `String`          | API token you receive when adding a new CI user
| `-ClientCertificate`                      | `X509Certificate2`| Client certificate used for a secure Web API request. Not supported by SignPath.io directly, use for proxies. | | Enterprise
| `-ApiUrl`                                 | `String`          | URL to the SignPath REST API                                  | `https://app.signpath.io/api/`
| `-Description`                            | `String`          | Optional description of the signing request
| `-Parameters`                             | `Hashtable`       | Values for [parameters defined in the artifact configuration](https://about.signpath.io/documentation/artifact-configuration#user-defined-parameters)
| `-ServiceUnavailableTimeoutInSeconds`     | `Int32`           | Total time in seconds that the cmdlet will wait for a single service call to succeed (across several retries) | 600 seconds
| `-UploadAndDownloadRequestTimeoutInSeconds` | `Int32`         | HTTP timeout used for upload and download HTTP requests       | 300 seconds
{: .break-column-1 }

## Examples

### Example 1: Submit a signing request and wait for completion

~~~ powershell
Submit-SigningRequest `
    -InputArtifactPath $PATH_TO_INPUT_ARTIFACT `
    -ProjectSlug $PROJECT -SigningPolicySlug $SIGNING_POLICY -ArtifactConfigurationSlug $ARTIFACT_CONFIG `
    -WaitForCompletion -OutputArtifactPath $PATH_TO_OUTPUT_ARTIFACT `
    -OrganizationId $ORGANIZATION_ID -CIUserToken $CI_USER_TOKEN 
~~~

### Example 2: Submit a signing request with an artifact retrieval link and wait for completion
~~~ powershell
Submit-SigningRequest `
    -ArtifactRetrievalLink "https://files.acme.com/my+program.exe" `
    -ArtifactRetrievalLinkFileName "my program.exe" `
    -ArtifactRetrievalLinkSha256Hash (Get-FileHash "./my program.exe" -Algorithm SHA256).Hash `
    -ArtifactRetrievalLinkHttpHeaders @{
      "Authorization" = "$RETRIEVAL_AUTHORIZATION"
    } `
    -ProjectSlug $PROJECT -SigningPolicySlug $SIGNING_POLICY -ArtifactConfigurationSlug $ARTIFACT_CONFIG `
    -WaitForCompletion -OutputArtifactPath $PATH_TO_OUTPUT_ARTIFACT `
    -OrganizationId $ORGANIZATION_ID -CIUserToken $CI_USER_TOKEN 
~~~

### Example 3: Separate calls for submission and retrieval 

Submit a signing request and get a signing request ID without waiting for completion ...

~~~ powershell
$signingRequestID = Submit-SigningRequest `
    -InputArtifactPath $PATH_TO_INPUT_ARTIFACT ` 
    -ProjectSlug $PROJECT -SigningPolicySlug $SIGNING_POLICY -ArtifactConfigurationSlug $ARTIFACT_CONFIG `
    -OrganizationId $ORGANIZATION_ID -CIUserToken $CI_USER_TOKEN
~~~ 

... and download the signed artifact later

~~~ powershell
Get-SignedArtifact `
    -SigningRequestId $signingRequestID `
    -OutputArtifactPath $PATH_TO_OUTPUT_ARTIFACT `
    -OrganizationId $ORGANIZATION_ID -CIUserToken $CI_USER_TOKEN 
~~~ 

### Example 4: Resubmit an existing signing request with a different signing policy

~~~ powershell
  Submit-SigningRequestResubmit `
    -Resubmit -OriginalSigningRequestId $ORIGINAL_SIGNING_REQUEST_ID `
    -SigningPolicySlug $SIGNING_POLICY `
    -WaitForCompletion `
    -OutputArtifactPath $PATH_TO_OUTPUT_ARTIFACT `
    -OrganizationId $ORGANIZATION_ID -CIUserToken $CI_USER_TOKEN 
~~~

### Example 5: Provide user-defined parameters and origin verification {#example-params-origin}

Available for Enterprise subscriptions
{: .badge.icon-signpath}

~~~ powershell
$signingRequestID = Submit-SigningRequest `
    -InputArtifactPath $PATH_TO_INPUT_ARTIFACT `
    -ProjectSlug $PROJECT -SigningPolicySlug $SIGNING_POLICY -ArtifactConfigurationSlug $ARTIFACT_CONFIG `
    -Parameters @{ 
        productVersion="1.2.0" 
        } `
    -Origin @{
        RepositoryData=@{
            SourceControlManagementType="svn";
            Url="https://github.com/org/project";
            BranchName="release/v2.1";
            CommitId="bf458b27080c81eb1e316c63867a87fdb3b47211"
        };
        BuildData=@{
            Url="https://ci.appveyor.com/project/org/name/builds/buildid/job/jobid";
            BuildSettingsFile="@settings.json"
        }
    } `
    -OrganizationId $ORGANIZATION_ID -CIUserToken $CI_USER_TOKEN 
~~~

---
main_header: Documentation
sub_header: Build System Integration
layout: resources
toc: true
redirect_from: /documentation/integrations
---

## Abstract

This section describes how SignPath can be integrated into automated builds using continuous integration software. You can use the PowerShell module provided by SignPath, directly call the Web API to submit signing requests, or integrate SignPath as part of your AppVeyor build step.

<div class='panel info' markdown='1' >
<div class='panel-header'>Locating ID values</div>
All necessary IDs can be found on the signing policy details page, including a code snippet that calls the PowerShell module.
</div>

## Authorization

Before accessing the API, you have to create a CI User in the User section of the SignPath application.

The API token is displayed when a new CI user is created. (If you lose the API key, you will need to generate a new one.)

Make sure to keep the access token in a secure location. Most Continuous Integration (CI) systems provides a mechanism to store secrets, which is usually the best place to keep API tokens. If you use several distinct systems for API access, we recommend that you create individual CI User accounts in SignPath.

## PowerShell 

[![PowerShell Gallery](https://img.shields.io/powershellgallery/v/SignPath.svg?style=flat-square&label=PowerShell%20Gallery)](https://www.powershellgallery.com/packages/SignPath/)

To integrate SignPath in your build chain, you can use the [official SignPath module from PowerShell Gallery](https://www.powershellgallery.com/packages/SignPath).

Create signing requests by calling the following commands via PowerShell:

* Install the SignPath module
  ~~~ powershell
  Install-Module -Name SignPath
  ~~~
* Submit a signing request and get a signing request ID without waiting for completion ...
  ~~~ powershell
  $signingRequestID = Submit-SigningRequest
      -CIUserToken $CI_USER_TOKEN
      -OrganizationId $YOUR_ORGANIZATION_ID
      -ProjectKey $YOUR_PROJECT_KEY
      -SigningPolicyKey $YOUR_SIGNING_POLICY_KEY
      -InputArtifactPath $PATH_TO_INPUT_ARTIFACT
  ~~~ 
* ... and download the signed artifact later
  ~~~ powershell
  Get-SignedArtifact
      -CIUserToken $CI_USER_TOKEN
      -OrganizationId $YOUR_ORGANIZATION_ID
      -SigningRequestId $signingRequestID
      -OutputArtifactPath $PATH_TO_OUTPUT_ARTIFACT
  ~~~ 
* Or submit a signing request and wait for completion
  ~~~ powershell
  Submit-SigningRequest
      -CIUserToken $CI_USER_TOKEN
      -OrganizationId $YOUR_ORGANIZATION_ID
      -ProjectKey $YOUR_PROJECT_KEY
      -SigningPolicyKey $YOUR_SIGNING_POLICY_KEY
      -InputArtifactPath $PATH_TO_INPUT_ARTIFACT
      -OutputArtifactPath $PATH_TO_OUTPUT_ARTIFACT
      -WaitForCompletion
  ~~~

## HTTP REST API

In case the PowerShell module is not sufficient, you can communicate directly with our API by calling our public HTTP REST endpoints.

### Base URL and authentication

SignPath.io uses bearer authentication.

| Common API arguments      |     |
| ------------------------- | --- |
| Base URL                  | `https://app.signpath.io/API/v1/$(OrganizationId)`
| Authorization HTTP header | `Authorization: Bearer $(token)`


You need to provide these values for every single API request.

### Submit a signing request

| Synopsis           |      |
| ------------------ | ---- |
| URL                | `/SigningRequests`
| Method             | `POST`
| Encoding           | `multipart/form-data`
| `ProjectKey`       | The project for which you want to create the signing request
| `SigningPolicyKey` | Signing policy for which you want to create the signing request
| `Artifact`         | Artifact file
| `Description`      | Optional description for your signing request (e.g. version number)

**Example:**

~~~ bash
curl -H "Authorization: Bearer $CI_USER_TOKEN" \
     -F "ProjectKey=$YOUR_PROJECT_KEY" \
     -F "SigningPolicyKey=test-signing" \
     -F "Artifact=@$PATH_TO_ARTIFACT" \
     -F "Description=$DESCRIPTION" \
     https://app.signpath.io/API/v1/$ORGANIZATION_ID/SigningRequests
~~~

**Success result:** HTTP status code `201`. A HTTP `Location` response-header field is returned with the URL of the created entity.

### Check the status of a signing request

| Synopsis   |      |
| ---------- | ---- |
| URL        | `/SigningRequests/$(SigningRequestId)` <br> (`Location` response-header from the call that submitted the signing request)
| Method     | GET
| Parameters | none

**Example:**

~~~ bash
curl -H "Authorization: Bearer $CI_USER_TOKEN" \
     https://app.signpath.io/API/v1/$ORGANIZATION_ID/SigningRequest/$SIGNING_REQUEST_ID
~~~

**Success result:** HTTP status code `200`. Status of the signing request in JSON format:

~~~ json
{
  "status":"Completed",
  "description":"Called by curl",
  "projectId":"c90eb2c7-d34e-49fc-9e90-c00235ecaf1a",
  "projectKey":"test-project",
  "projectName":"Test project",
  "artifactConfigurationId":"24b767a6-092f-4104-869d-25f0da159576",
  "artifactConfigurationKey":"Default",
  "artifactConfigurationName":"Default",
  "signingPolicyId":"137ada35-fc11-4719-a3a4-269983692197",
  "signingPolicyKey":"test-signing",
  "signingPolicyName":"test-signing",
  "unsignedArtifactLink":"https://app.signpath.io/API/v1/c2099ac1-b4b5-4b30-934e-3933c2d9922d/SigningRequests/a4559e13-9e95-480a-9567-5b8a3252bb27/UnsignedArtifact",
  "signedArtifactLink":"https://app.signpath.io1/API/v1/c2099ac1-b4b5-4b30-934e-3933c2d9922d/SigningRequests/a4559e13-9e95-480a-9567-5b8a3252bb27/SignedArtifact"
}
~~~

**Possible `status` values:** `WaitingForApproval`, `QueuedForProcessing`, `Processing`, `Completed`, `Failed`, `Denied`, `Canceled`, `RetrievingArtifact`, `ArtifactRetrievalFailed`

### Download the signed artifact

Once the signing request is successfully completed, the status response contains a `signedArtifactLink` field with a link to the signed artifact file. It can easily be retrieved by issuing the following command:

| Synopsis   |      |
| ---------- | ---- |
| URL        | `/SigningRequests/$(SigningRequestId)/SignedArtifact` <br> (`signedArtifactLink` field from `GET SigningRequests/`id)
| Method     | GET  |
| Parameters | none

**Example:**

~~~ bash
curl -H "Authorization: Bearer $CI_USER_TOKEN" \
     -o $LOCAL_PATH_TO_DOWNLOADED_ARTIFACT \
     https://app.signpath.io/API/v1/$ORGANIZATION_ID/SigningRequest/$SIGNING_REQUEST_ID/SignedArtifact
~~~

**Success result:** HTTP status code `200`. Returns the binary content of the signed artifact.

## AppVeyor

If you are using the CI service AppVeyor, there is an alternative CI integration. Instead of pushing the artifact from your build script, you can issue an AppVeyor notification after your build, and SignPath.io will pull the artifact from AppVeyor. This results in additional confidence and provides the foundation for restricted Open Source signing.

### Rationale

By pulling the artifact from AppVeyor, SignPath.io can make sure that the binary artifact is a result of a specific build process applied to specific source code (branch and commit).

### Prerequisites and restrictions

This feature is a proof-of-concept for Open Source projects. Future versions may allow disabling certain limitations in paid subscriptions.

Current limitations:

* The AppVeyor project and the Git repository must be public 

Supported Git repository hosting: 
  * [GitHub](https://github.com/)
  * [GitLab](https://gitlab.com/)
  * [Bitbucket](https://bitbucket.org)

The following checks are performed:

* No additional scripts may be executed during the build step and no cache entries may be used (so that the build remains fully traceable and is only built from the repository)
* The build settings may not be modified between starting the AppVeyor build and calling SignPath.io

This is to guarantee that the binary artifacts result purely from the specified source code.

### Build documentation

SignPath adds the following information to packages:

* For NuGet packages:
  1. The build settings are stored in an AppVeyorSettings.json file in the root of the NuGet package
  2. The commit hash and repository URL are written to the metadata of the NuGet package

These steps allow consumers of the signed artifact to verify source code version and build settings.

### Setup
This shows the secrets that need to be shared between AppVeyor.com and SignPath.io:
![AppVeyor Setup flow](/assets/img/resources/documentation_build-integration_appveyor.png)

<table style="table-layout: auto;">
<thead>
  <tr>
    <th style="width: 20%;">Action</th>
    <th style="width: 60%;">Steps</th>
    <th style="width: 20%;">Remarks</th>
  </tr>
</thead>
<tbody>
  <tr>
    <td>Add an AppVeyor integration to a SignPath project</td>
    <td markdown="1">

1. On [ci.appveyor.com](https://ci.appveyor.com), select *My Profile* and *API Keys*, then remember the **Bearer token** for the next step
2. On SignPath.io, add an *AppVeyor integration* to your *project* and enter the **API key** you just acquired

</td>
    <td>SignPath.io must authenticate against Appveyor to retrieve the build artifacts</td>
  </tr> <tr>
    <td>Encrypt the SignPath API token in AppVeyor</td>
    <td markdown="1">

1. On SignPath.io, choose the Users menu and create a new *CI User* or open an existing one
2. Remember the **SignPath API token** for the next step
3. On [ci.appveyor.com](https://ci.appveyor.com), open *Account Settings* and choose *[Encrypt YAML](https://ci.appveyor.com/tools/encrypt)*
4. Enter **"Bearer &lt;SignPath API token&gt;"** (without quotes)
5. Remember the **encrypted SignPath API token** for the next step

</td>
    <td>AppVeyor lets you encrypt secret values. You can then safely use the encrypted string in your appveyor.yaml file</td>
  </tr> <tr>
    <td>Add a deploy Webhook</td>
    <td colspan="2" markdown="1">

Append this to your appveyor.yaml file:

~~~ yaml
deploy:
- provider: Webhook
  url: https://app.signpath.io/API/v1/<ORGANIZATION_ID>/Integrations/AppVeyor?ProjectKey=<PROJECT_KEY>&SigningPolicyKey=<SIGNING_POLICY_KEY>
  authorization:
     secure: <ENCRYPTED_ACCESS_TOKEN>
~~~

Replace the parameters:
* `<ORGANIZATION_ID>`, `<PROJECT_KEY>` and `<SIGNING_POLICY_KEY>` values can be retrieved from the signing policy page
* `<ENCRYPTED_ACCESS_TOKEN>` is the value from the previous step

</td> </tr> </tbody> </table>

## Azure DevOps

[![Azure DevOps installations](https://img.shields.io/visual-studio-marketplace/azure-devops/installs/total/SignPath.signpath-tasks?color=blue&label=Visual+Studio+Marketplace+installs)](https://marketplace.visualstudio.com/items?itemName=SignPath.signpath-tasks)

For Azure DevOps, you can use build pipeline tasks from the [official SignPath extension on Visual Studio Marketplace](https://marketplace.visualstudio.com/items?itemName=SignPath.signpath-tasks).

## Webhooks

For every project, you can configure a webhook that is called once signing requests are completed. The payload has the following format:

~~~ json
{
  "OrganizationId": "c2099ac1-b4b5-4b30-934e-3933c2d9922d",
  "SigningRequestId": "a4559e13-9e95-480a-9567-5b8a3252bb27",
  "Status": "Completed"
}
~~~
---
main_header: Documentation
sub_header: Build System Integration
layout: resources
toc: true
show_toc: 3
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

Make sure to keep the access token in a secure location. Most Continuous Integration (CI) systems provide a mechanism to store secrets, which is usually the best place to keep API tokens. If you use several distinct systems for API access, we recommend that you create individual CI User accounts in SignPath.

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

### Get signing request data

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

**Success result:** HTTP status code `200`. Signing request data in JSON format:

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
  "origin": {
    "repositoryMetadata": {
      "repositoryUrl": "https://github.com/name/project",
      "branchName": "master",
      "commitId": "efe8bbc00c5484bfd38ce13a749ea2103a8ea713"
    },
    "buildUrl": "https://ci.appveyor.com/project/user/project/builds/30003889/job/x6mlmxrctauro5nb",
    "buildSettingsFile": {
      "fileName": "AppVeyorSettings.json",
      "downloadLink": "https://fqa.test.signpath.io/API/v1/c2099ac1-b4b5-4b30-934e-3933c2d9922d/SigningRequests/137ada35-fc11-4719-a3a4-269983692197/BuildSettingsFile"
    }
  }
}
~~~

* **Possible `status` values:** `WaitingForApproval`, `QueuedForProcessing`, `Processing`, `Completed`, `Failed`, `Denied`, `Canceled`, `RetrievingArtifact`, `ArtifactRetrievalFailed`
* `origin` is only available for signing requests with origin verification

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

## CI integrations with origin verification

Origin verification ensures that a signed artifact is the result of building a specific source code version.

In order to achieve this, you cannot submit a signing request from an unfinished build. Instead, you have to finish the build job without signing, and then trigger a signing request with origin verification. 

When signing is completed, you can use a Webhook handler for further processing, such as uploading the signed artifact to a repository. 

Origin verification results in additional confidence. It provides the foundation for restricted Open Source signing.

Origin verification verifies the following information:

* **Source code repository URL** as specified in the SignPath **project**
* **Branch** as specified in the **signing policy**
* **Commit version**
* **Build job URL** as provided by the CI system
* **Reproducability** checks that the build process is completely determined by the source code repository

Verification of reproducability depends on the CI system used. Typical verifications include:

* Build settings are fully determined by a configuration file under source control
* No manual overrides of critical build settings in CI system's build job
* Prevent caching from previous (unverified) builds

The final goal of origin verification is enable signing policies based on source code reviews. 

<div class="panel warning" markdown="1">
<div class="panel-header">Source code reviews must include build scripts</div>

Note that a build scripts or makefile can download any software from the Internet and include it as a build artifact. SignPath cannot possibly detect or prevent this, but it can make sure that any such evasion will be visible in the source code repository.

Make sure that your source code review policy includes build scripts and makefiles.
</div>

<div class="panel info" markdown="1">
<div class="panel-header">Use origin verification restrictions</div>

Enable additional restrictions for signing policies that use release certificates:
* Select **Verify origin** to make sure that only verified builds can be signed
* Define source code review polcies for branches that are supposed to be used for production releases. Use the **Allowed branch names** setting to make sure that a signing policy can only be used for those branches. Typical settings include `master` or `release/*`.
* If you need to be able to sign other builds under special circumstances, consider adding another signing policy with strong approval requirements (e.g. 2 out of *n*).
</div>

### AppVeyor

#### Prerequisites and restrictions

This feature is currently dedicated to Open Source projects. Future versions will allow disabling certain limitations in paid subscriptions.

Current limitations:

* The AppVeyor project and the Git repository must be public 

The following checks are performed:

* No additional scripts may be executed during the build step and no cache entries may be used (so that the build remains fully traceable and is only built from the repository)
* The build settings may not be modified between starting the AppVeyor build and calling SignPath.io

This is to ensure that the binary artifacts result purely from the specified source code.

<div class="panel todo" markdown="1">
<div class="panel-header">TODO</div>

Is the following list complete? see https://www.appveyor.com/docs/build-configuration/#generic-git-repositories-and-yaml
> At the moment those supported are: GitHub (hosted and on-premise), Bitbucket (hosted and on-premise), GitLab (hosted and on-premise), Azure DevOps, Kiln and Gitea. 
</div>

<div class="panel info" markdown="1">
<div class="panel-header">Supported Git repositories</div>

Since origin verification cannot be ensured for [alternative YAML file locations](https://www.appveyor.com/docs/build-configuration/#alternative-yaml-file-location), AppVeyor's [generic Git repository](https://www.appveyor.com/docs/build-configuration/#generic-git-repositories-and-yaml) support is not available.

These Git repositories are currently fully supported by AppVeyor:
  * [GitHub](https://github.com/)
  * [GitLab](https://gitlab.com/)
  * [Bitbucket](https://bitbucket.org)
</div>

#### Setup
This figure shows the secrets that must be shared between AppVeyor.com and SignPath.io:
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
     secure: <ENCRYPTED_SIGNPATH_API_TOKEN>
~~~

Replace the parameters:
* `<ORGANIZATION_ID>`, `<PROJECT_KEY>` and `<SIGNING_POLICY_KEY>` values can be retrieved from the signing policy page
* `<ENCRYPTED_SIGNPATH_API_TOKEN>` is the value from the previous step

</td> </tr> </tbody> </table>

#### Attached build documentation

SignPath adds the following information to packages:

* For NuGet packages:
  1. The build settings are stored in an AppVeyorSettings.json file in the root of the NuGet package
  2. The commit hash and repository URL are written to the metadata of the NuGet package

These steps allow consumers of the signed artifact to verify source code version and build settings.

## Other CI integrations

### Azure DevOps

[![Azure DevOps installations](https://img.shields.io/visual-studio-marketplace/azure-devops/installs/total/SignPath.signpath-tasks?color=blue&label=Visual+Studio+Marketplace+installs)](https://marketplace.visualstudio.com/items?itemName=SignPath.signpath-tasks)

For Azure DevOps, you can use build pipeline tasks from the [official SignPath extension on Visual Studio Marketplace](https://marketplace.visualstudio.com/items?itemName=SignPath.signpath-tasks).

## Webhook notifications

If you want to react on completed signing requests, you can add a **Webhook** **notification** in your project's **Integration** section.

For each completed signing request, SignPath will post the following JSON information to the specified URL:

~~~ json
{
  "OrganizationId": "094f5736-6b8c-4ca7-9514-0933c8b928e2",
  "SigningRequestId": "b4596ce6-1b8d-4527-9cce-16b3e174fb3d",
  "Status": "Completed"
}
~~~

A handler for this Webhook can use the Web API for further activities, such as pushing the signed artifact to a repository. Use the Web API to get signing request data including build information.
---
title: Code Signing - SignPath.io
header: Documentation
layout: resources
toc: true
---

## Abstract

This section describes how SignPath can be integrated into automated builds using continuous integration software. You can use the PowerShell module provided by SignPath, directly call the Web API to submit signing requests, or integrate SignPath as part of your AppVeyor build step.

<div class='panel info' markdown='1' data-title='Tips'>
<div class='panel-header'><i class='la la-info-circle'></i>Locating ID values</div>
All necessary IDs can be found on the signing policy details page, including a code snippet that calls the PowerShell module.
</div>

## Authorization

Before accessing the API, you have to create a CI User in the User section of the SignPath application.

The API token is displayed when a new CI user is created. (If you lose the API key, you will need to generate a new one.)

Make sure to keep the access token in a secure location. Most Continuous Integration (CI) systems provides a mechanism to store secrets, which is usually the best place to keep API tokens. If you use several distinct systems for API access, we recommend that you create individual CI User accounts in SignPath.

## PowerShell 

[![PowerShell Gallery](https://img.shields.io/powershellgallery/v/SignPath.svg?style=flat-square&label=PowerShell%20Gallery)](https://www.powershellgallery.com/packages/SignPath/)

SignPath can be integrated in your automated build process by using our API. For convenience, we provide a PowerShell module that can be used from within your build/deploy chain. The module can be downloaded from [PowerShell Gallery](https://www.powershellgallery.com/packages/SignPath).

Signing requests can be created by calling the following commands via PowerShell:

{% highlight powershell %}
Install-Module -Name SignPath

# Submit a signing request and get a signing request ID without waiting for completion ...
$signingRequestID = Submit-SigningRequest
    -CIUserToken $CI_USER_TOKEN
    -OrganizationId $YOUR_ORGANIZATION_ID
    -ProjectKey $YOUR_PROJECT_KEY
    -SigningPolicyKey $YOUR_SIGNING_POLICY_KEY
    -InputArtifactPath $PATH_TO_INPUT_ARTIFACT

# ... and download the signed artifact later.
Get-SignedArtifact
    -CIUserToken $CI_USER_TOKEN
    -OrganizationId $YOUR_ORGANIZATION_ID
    -SigningRequestId $signingRequestID
    -OutputArtifactPath $PATH_TO_OUTPUT_ARTIFACT

# Or submit a signing request and wait for completion.
Submit-SigningRequest
    -CIUserToken $CI_USER_TOKEN
    -OrganizationId $YOUR_ORGANIZATION_ID
    -ProjectKey $YOUR_PROJECT_KEY
    -SigningPolicyKey $YOUR_SIGNING_POLICY_KEY
    -InputArtifactPath $PATH_TO_INPUT_ARTIFACT
    -OutputArtifactPath $PATH_TO_OUTPUT_ARTIFACT
    -WaitForCompletion
{% endhighlight %}

## HTTP REST API

In case the PowerShell module is not sufficient, you can communicate directly with our API by calling our public HTTP REST endpoints.

### Base URL and authentication

SignPath.io uses bearer authentication.

<table>
<thead>
  <tr>
    <th colspan='2'>Common API arguments</th>
  </tr>
</thead>
<tbody>
  <tr>
    <td>Base URL</td>
    <td><code>https://app.signpath.io/API/v1/${OrganizationId}</code></td>
  </tr>
  <tr>
  	<td>Authorization HTTP header</td>
  	<td><code>Authorization: Bearer ${Token}</code></td>
  </tr>
</tbody>
</table>


You need to provide these values for every single API request.

### Submit a signing request

<table>
	<thead>
		<tr>
			<th colspan='2'>Synopsis</th>
		</tr>
	</thead>
	<tbody>
		<tr>
			<td>URL</td>
			<td><code>/SigningRequests</code></td>
		</tr>
		<tr>
			<td>Method</td>
			<td><code>POST</code></td>
		</tr>
		<tr>
			<td>Encoding</td>
			<td><code>multipart/form-data</code></td>
		</tr>
		<tr>
			<td><code>ProjectKey</code></td>
			<td>The project for which you want to create the signing request</td>
		</tr>
		<tr>
			<td><code>SigningPolicyKey</code></td>
			<td>The signing policy for which you want to create the signing request</td>
		</tr>
		<tr>
			<td><code>Artifact</code></td>
			<td>The artifact file</td>
		</tr>
		<tr>
			<td><code>Description</code></td>
			<td>Optional description for your signing request (e.g. version number)</td>
		</tr>
	</tbody>
</table>


**Example:**

{%highlight bash%}
curl -H "Authorization: Bearer $CI_USER_TOKEN" \
     -F "ProjectKey=$YOUR_PROJECT_KEY" \
     -F "SigningPolicyKey=test-signing" \
     -F "Artifact=@$PATH_TO_ARTIFACT" \
     -F "Description=$DESCRIPTION" \
     https://app.signpath.io/API/v1/$ORGANIZATION_ID/SigningRequests
{%endhighlight%}

**Success result:** HTTP status code `201`. A HTTP `Location` response-header field is returned with the URL of the created entity.

### Check the status of a signing request

<table>
	<thead>
		<tr>
			<th colspan='2'>Synopsis</th>
		</tr>
	</thead>
	<tbody>
		<tr>
			<td>URL</td>
			<td><code>/SigningRequests/${SigningRequestId}</code><br>(<code>Location</code> response-header field from call to submit the signing request)</td>
		</tr>
		<tr>
			<td>Method</td>
			<td><code>GET</code></td>
		</tr>
		<tr>
			<td>Parameters</td>
			<td><code>none</code></td>
		</tr>
	</tbody>
</table>


**Example:**

{%highlight bash%}
curl -H "Authorization: Bearer $CI_USER_TOKEN" \
     https://app.signpath.io/API/v1/$ORGANIZATION_ID/SigningRequest/$SIGNING_REQUEST_ID
{%endhighlight%}

**Success result:** HTTP status code `200`. Status of the signing request in JSON format:

{%highlight json%}
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
{%endhighlight%}

**Possible `status` values:** `WaitingForApproval`, `QueuedForProcessing`, `Processing`, `Completed`, `Failed`, `Denied`, `Canceled`, `RetrievingArtifact`, `ArtifactRetrievalFailed`

### Download the signed artifact

Once the signing request has been successfully completed, the status response contains a `signedArtifactLink` field with a link to the signed artifact file. It can easily be retrieved by issuing the following command:

| Synopsis   |      |
| ---------- | ---- |
| URL        | `/SigningRequests/`id`/SignedArtifact` <br> (`signedArtifactLink` field from `GET SigningRequests/`id)
| Method     | GET  |
| Parameters | none

**Example:**

```bash
curl -H "Authorization: Bearer $CI_USER_TOKEN" \
     -o $LOCAL_PATH_TO_DOWNLOADED_ARTIFACT \
     https://app.signpath.io/API/v1/$ORGANIZATION_ID/SigningRequest/$SIGNING_REQUEST_ID/SignedArtifact
```

**Success result:** HTTP status code `200`. Returns the binary content of the signed artifact.

## AppVeyor

If you are using the CI service AppVeyor, there is an alternative CI integration. Instead of pushing the artifact from your build script, you can issue an AppVeyor notification after your build, and SignPath.io will pull the artifact from AppVeyor. This results in additional confidence and provides the foundation for restricted Open Source signing.

### Rationale

By pulling the artifact from AppVeyor, SignPath.io can make sure that the binary artifact is a result of a specific build process applied to specific source code (branch and commit).

### Prerequisites and restrictions

This feature is a proof-of-concept for Open Source projects. Future versions may allow disabling certain limitations in paid subscriptions.

Current limitations:

  * The AppVeyor project and the Git repository must be public on one of the following hosting services:
    * GitHub
    * GitLab
    * Bitbucket

These are verified in order to guarantee that the binary results from the specified source code:

  * No additional scripts may be executed during the build step and no cache entries may be used (so that the build remains fully traceable and is only built from the repository)
  * The build settings must not be modified between starting the AppVeyor build and calling SignPath.io

### Build documentation

In order to enable independent verification of builds, SignPath performs the following actions:

  * For NuGet packages:
    1 The build settings are stored in an AppVeyorSettings.json file in the root of the NuGet package
    2 The commit hash and repository URL are written to the metadata of the NuGet package

These steps allow consumers of the signed artifact to confidently link the it to a specific source code version and build settings.

### Setup
This shows the secrets that need to be shared between AppVeyor.com and SignPath.io:
![AppVeyor Setup flow](/assets/img/resources/documentation_build-integration_appveyor.png)

<table style="table-layout: auto;">
<thead>
  <tr>
    <th style="width: 20%;">Action</th>
    <th style="width: 40%;">Remarks</th>
    <th style="width: 40%;">Step by step</th>
  </tr>
</thead>
<tbody>
  <tr>
    <td>Add an AppVeyor integration to a SignPath project</td>
    <td>SignPath.io must authenticate against Appveyor to retrieve the build artifacts</td>
    <td>
    	<ol>
    		<li>On <a href='https://ci.appveyor.com'>ci.appveyor.com</a>, select <i>My Profile</i> and <i>API Keys</i>, then remember the <b>Bearer token</b> for the next step</li>
  			<li>On SignPath.io, add an <i>AppVeyor integration</i> to your <i>project</i> and enter the <b>API key</b> you just acquired</li>
  		</ol>
  </td>
  </tr>
  <tr>
    <td>Encrypt the SignPath API token in AppVeyor</td>
    <td>AppVeyor lets you encrypt secret values. You can then safely use the encrypted string in your appveyor.yaml file</td>
    <td>
    	<ol>
  			<li>On SignPath.io, choose the Users menu and create a new _<i>CI User</i> or open an existing one</li>
  			<li>Remember the <b>SignPath API token</b> for the next step</li>
  			<li>On <a href='https://ci.appveyor.com'>ci.appveyor.com</a>, open <i>Account Settings</i> and choose <i><a href='https://ci.appveyor.com/tools/encrypt'>Encrypt YAML</a></i></li>
  			<li>Enter <b>"Bearer &lt;SignPath API token&gt;"</b> (without quotes)</li>
  			<li>Remember the <b>encrypted SignPath API token</b> for the next step</li>
  		</ol>
  </td>
  </tr>
  <tr>
    <td>Add a deploy Webhook</td>
    <td colspan="2">Append this to your appveyor.yaml file:
    	<div class="language-yaml highlighter-rouge">
    		<div class="highlight">
    			<pre class="highlight"><code><span class="na">deploy</span><span class="pi">:</span>
<span class="pi">-</span> <span class="na">provider</span><span class="pi">:</span> <span class="s">Webhook</span>
  <span class="na">url</span><span class="pi">:</span> <span class="s">https://app.signpath.io/API/v1/&lt;ORGANIZATION_ID&gt;/Integrations/AppVeyor?ProjectKey=&lt;PROJECT_KEY&gt;&amp;SigningPolicyKey=&lt;SIGNING_POLICY_KEY&gt;</span>
  <span class="na">authorization</span><span class="pi">:</span>
     <span class="na">secure</span><span class="pi">:</span> <span class="s">&lt;ENCRYPTED_ACCESS_TOKEN&gt;</span>
</code></pre>
			</div>
		</div>
		Replace the parameters:
		<ul>
			<li> <code>&lt;ORGANIZATION_ID&gt;</code>, <code>&lt;PROJECT_KEY&gt;</code> and <code>&lt;SIGNING_POLICY_KEY&gt;</code> values can be retrieved from the Signing policy page</li>
			<li> <code>&lt;ENCRYPTED_ACCESS_TOKEN&gt;</code> is the value from the previous step</li>
		</ul>
</td>
</tr>
</tbody>
</table>

## Azure DevOps
For Azure DevOps you can use build pipeline tasks from the  [official extension](https://marketplace.visualstudio.com/items?itemName=SignPath.signpath-tasks) on the marketplace. These tasks will provide an integrated experience in calling the PowerShell module.

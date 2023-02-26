---
main_header: Documentation
sub_header: Origin Verification
layout: resources
toc: true
show_toc: 3
description: Documentation for using Origin Verification in SignPath
---

Available for Enterprise subscriptions
{: .badge.icon-signpath}

## Abstract

Origin verification allows build systems to provide reliable origin metadata with your signing requests, so that SignPath can execute advanced policies based on trusted information. 

Origin metadata includes:

* The repository, branch and commit ID of the source code that was built
* The URL and configuration of the build that created the signing request

See the [signing policy](/documentation/projects#signing-policy-origin-verification) documentation for some ideas on how to secure your build pipelines using origin verification.

## Jenkins CI

A connector is available that connects Jenkins CI as a Trusted Build System. 

This connector ensures that 
* A build was actually performed by a specific Jenkins CI instance, not by some other entity in possession of the CI User token
* Origin metadata is provided by Jenkins CI, not the build script, and can therefore not be forged
* The artifact is stored as an immutable Jenkins artifact before it is submitted for signing

Contact support@signpath.io for the connector and documentation.

## AppVeyor

<div class="panel info" markdown="1">
<div class="panel-header">Pre-configured connector</div>

The AppVeyor connector is built into SignPath and connects to appveyor.com. 
* AppVeyor is available based on the configuration of your SignPath organization. You don't need to add it on the Trusted Build Systems page. 
* It must still be linked to each project (see below)

A customizable connector for AppVeyor Server will be provided in the future.
</div>

### Prerequisites and restrictions

In order to ensure Origin Verification, you cannot submit a signing request from an unfinished build. Instead, you have to finish the build job without signing, and then trigger a signing request with origin verification. When signing is completed, you can use a Webhook handler for further processing, such as uploading the signed artifact to a repository. 

The following checks are performed:

* No additional scripts may be executed during the build step and no cache entries may be used (so that the build remains fully traceable and is only built from the repository). The scripts must be all set to off at the bottom of the project settings page on AppVeyor.
* The build settings may not be modified between starting the AppVeyor build and calling SignPath.io
* The build configuration must be stored in the root directory under the name `appveyor.yml` or `.appveyor.yml` (no custom name is allowed to be set under *Project settings* and *Custom configuration .yml file name*)
* For Open Source subscriptions, the AppVeyor project and the Git repository must be public.

These checks are performed to ensure that the binary artifacts result purely from the specified source code.

<div class="panel todo" markdown="1">
<div class="panel-header">TODO</div>

Is the following list complete? see https://www.appveyor.com/docs/build-configuration/#generic-git-repositories-and-yaml
> At the moment those supported are: GitHub (hosted and on-premises), Bitbucket (hosted and on-premises), GitLab (hosted and on-premises), Azure DevOps, Kiln and Gitea. 
</div>

### Setup
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

1. On [ci.appveyor.com](https://ci.appveyor.com)
   * Select *Account* and *Security*
   * Make sure the checkboxes for both *API v1* and *API v2* are checked
2. On [ci.appveyor.com](https://ci.appveyor.com)
   * Select *My Profile* and *API Keys*
   * Remember the **Bearer token** for the next step
3. On [SignPath.io](https://app.signpath.io)
   * Navigate to your *project*, go to *Trusted Build Systems* and add a link to *AppVeyor*
   * In the dialog, enter the **API key** you just acquired

</td>
    <td>SignPath.io must authenticate against Appveyor to retrieve the build artifacts</td>
  </tr> <tr>
    <td>Encrypt the SignPath API token in AppVeyor</td>
    <td markdown="1">

1. On [SignPath.io](https://app.signpath.io)
   * Choose the Users menu and create a new *CI User* or open an existing one
   * Remember the **SignPath API token** for the next step
2. On [ci.appveyor.com](https://ci.appveyor.com)
   * Open *Account Settings* and choose *[Encrypt YAML](https://ci.appveyor.com/tools/encrypt)*
   * Enter **``Bearer <SIGNPATH_API_TOKEN>``** (without &lt;brackets&gt;)
   * Remember the **encrypted SignPath API token** for the next step

</td>
    <td>AppVeyor lets you encrypt secret values. You can then safely use the encrypted string in your appveyor.yaml file</td>
  </tr> <tr>
    <td>Add a deploy Webhook</td>
    <td colspan="2" markdown="1">

Append this to your appveyor.yaml file:

~~~ yaml
deploy:
- provider: Webhook
  url: https://app.signpath.io/API/v1/<ORGANIZATION_ID>/Integrations/AppVeyor?ProjectSlug=<PROJECT_SLUG>&SigningPolicySlug=<SIGNING_POLICY_SLUG>
  authorization:
     secure: <ENCRYPTED_SIGNPATH_API_TOKEN>
~~~

| Parameter                                                 | Description                                                            |
| --------------------------------------------------------- | ---------------------------------------------------------------------- |
| `<ORGANIZATION_ID>`                                       | SignPath organization ID (can be retrieved from the organization page)
| `ProjectSlug=<PROJECT_SLUG>`                              | Project slug
| `SigningPolicySlug=<SIGNING_POLICY_SLUG>`                 | Signing policy slug
| `ArtifactConfigurationSlug=<ARTIFACT_CONFIGURATION_SLUG>` | _Optional_ artifact configuration slug (default artifact configuration if not specified)
| `<ENCRYPTED_SIGNPATH_API_TOKEN>`                          | The encrypted value from the previous step

</td> </tr> </tbody> </table>

### Attached build documentation

SignPath adds the following information to packages:

* For NuGet packages:
  1. The build settings are stored in an AppVeyorSettings.json file in the root of the NuGet package
  2. The commit hash and repository URL are written to the metadata of the NuGet package

These steps allow consumers of the signed artifact to verify source code version and build settings.

## Azure DevOps

Contact support@signpath.io for a preview version of our Azure DevOps connector with origin verification support.
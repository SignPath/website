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

Origin verification allows trusted build systems to provide reliable origin metadata with your signing requests, so that SignPath can execute advanced policies based on trusted information. 

Origin verification results in additional confidence for information in signing reqeusts, whether used for inspection or for policies. The feature is designed for use in enterprise scenarios, where policies and security controls need to be administered, enforced and audited centrally, while development teams still maintain full control over their projects. The ultimate goal of origin verification is to enable signing policies based on source code reviews.

<div class="panel info" markdown="1">
<div class="panel-header">Open Source code signing</div>

The same principles are applied for Open Source signing, where [SignPath Foundation](https://signpath.org) provides certificates to individual OSS projects. Origin verification ensures that the Foundation's signing policies are observed while leaving full control over repositories and build configurations with the OSS teams.
</div>

Origin verification verifies the following information:

* **Source code repository URL** as specified in the SignPath **project**
* **Branch** as specified in the **signing policy**
* **Commit version**
* **Build job URL** as provided by the CI system
* **Reproducability** checks that the build process is completely determined by the source code repository

Verification of reproducability depends on the CI system used. Typical verifications include:

* **Build settings** are fully determined by a configuration file under **source control**
* **No manual overrides** of critical build settings in CI system's build job
* **Prevent caching** from previous (possibly unverified) builds

In order to use origin verification, a [Trusted Build System](trusted-build-systems) must be configured and linked to the project.

<div class="panel tip" markdown="1">
<div class="panel-header">Use origin verification restrictions</div>
Enable additional restrictions for signing policies that use release certificates:

* Select **Verify origin** to make sure that only verified builds can be signed
* Define source code review policies for branches that are supposed to be used for production releases. Use the **Allowed branch names** setting to make sure that a signing policy can only be used for specified branches. Typical settings include `master` or `release/*`.
* If you need to be able to sign other builds under special circumstances, consider adding another signing policy with strong approval requirements (e.g. 2 out of *n*).
</div>

<div class="panel warning" markdown="1">
<div class="panel-header">Source code reviews must include build scripts</div>
Note that a build script or makefile can download any software from the Internet and include it as a build artifact. SignPath cannot possibly detect or prevent this, but it can make sure that any such evasion will be visible in the source code repository.

Make sure that your source code review policy includes CI configuration, build scripts, and makefiles. External content should not be accepted in reviews.
</div>

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
   * Select *My Profile* and [*API Keys*](https://ci.appveyor.com/api-keys)
   * Remember the ① **Bearer token** for the next step
3. On [SignPath.io](https://app.signpath.io)
   * Navigate to your *project*, scroll down to the *Trusted Build Systems* section and add a link to *AppVeyor*
   * In the dialog, enter the ① **API key** you just acquired

</td>
    <td>SignPath.io must authenticate against Appveyor to retrieve the build artifacts</td>
  </tr> <tr>
    <td>Encrypt the SignPath API token in AppVeyor</td>
    <td markdown="1">

1. On [SignPath.io](https://app.signpath.io)
   * Choose the Users menu and create a new *CI User* or open an existing one
   * Remember the ② **SignPath API token** for the next step
2. On [ci.appveyor.com](https://ci.appveyor.com)
   * Open *Account Settings* and choose *[Encrypt YAML](https://ci.appveyor.com/tools/encrypt)*
   * Enter ② **``Bearer <SIGNPATH_API_TOKEN>``** (without &lt;brackets&gt;)
   * Remember the ③ **encrypted SignPath API token** for the next step

</td>
    <td>AppVeyor lets you encrypt secret values. You can then safely use the encrypted string in your appveyor.yaml file</td>
  </tr> <tr>
    <td>Add a deploy Webhook</td>
    <td colspan="2" markdown="1">

Append this to your appveyor.yaml file:

~~~ yaml
deploy:
- provider: Webhook
  url: https://app.signpath.io/API/v1/<ORGANIZATION_ID>/Integrations/AppVeyor?ProjectSlug=<PROJECT_SLUG>&SigningPolicySlug=<SIGNING_POLICY_SLUG>&ArtifactConfigurationSlug=<ARTIFACT_CONFIGURATION_SLUG>
  authorization:
     secure: <ENCRYPTED_SIGNPATH_API_TOKEN>
~~~

| Parameter                                                 | Description                                                            |
| --------------------------------------------------------- | ---------------------------------------------------------------------- |
| `<ORGANIZATION_ID>`                                       | SignPath organization ID (can be retrieved from the organization page)
| `<PROJECT_SLUG>`                                          | Project slug
| `<SIGNING_POLICY_SLUG>`                                   | Signing policy slug
| `<ARTIFACT_CONFIGURATION_SLUG>`                           | _Optional_ artifact configuration slug (default artifact configuration if not specified)
| `<ENCRYPTED_SIGNPATH_API_TOKEN>`                          | ③ The encrypted value from the previous step

</td> </tr> </tbody> </table>

### Attached build documentation

SignPath adds the following information to packages:

* For NuGet packages:
  1. The build settings are stored in an AppVeyorSettings.json file in the root of the NuGet package
  2. The commit hash and repository URL are written to the metadata of the NuGet package

These steps allow consumers of the signed artifact to verify source code version and build settings.

## Azure DevOps

Contact support@signpath.io for a preview version of our Azure DevOps connector with origin verification support.
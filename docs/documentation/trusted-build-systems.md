---
main_header: Documentation
sub_header: Trusted Build Systems
layout: resources
toc: true
show_toc: 3
description: Documentation for providing Trusted Build Systems to SignPath
---

Available for Enterprise subscriptions
{: .badge.icon-signpath}

## Abstract

Trusted build systems create a trust relationship between SignPath and certain systems used in your build pipeline. They are typically implemented as connectors and configured in SignPath. Use trusted build systems to provide origin metadata with your signing requests and enable [origin verification](build-system-integration#ci-integrations-with-origin-verification).

## Configuration

To add a trusted build system to your SignPath organization:
* go to the **Trusted Build Systems** page (top menu) and click **Add**.
* enter a name, slug and (optionally) description
* remember the token that is created as a result

The token must then be used to configure the connector (see connector documentation). You can now link this trusted build system to your projects.

To use a trusted build system in a project:
* open the project
* find the **Trusted build systems** section
* click **Link**
* select one of the trusted build systems of your organization
* depending on the type of build system, you might need to add authentication information and/or an artifact path (see your connector's documentation)

The build system can now be used to submit signing requests with origin metadata. A trusted build system is required for signing policies with origin verification enabled.

## Available connectors

### Build node authentication

A connector is available that will let you use TLS client certificates for build node authentication. 

This results in a two-fold authentication strategy:
* CI User: a project-specific token must be presented to submit a signing request (usually stored as a secret in the CI system's project configuration)
* Build node: only specific build nodes are able to submit the signing request

This ensures that a CI User token cannot be used outside the CI system. It's also possible to restrict its use to certain build nodes. We recommend defining groups of build nodes based on their security attributes. Ideally, build nodes authorized for release signing meet the following requirements:
* No direct access for development teams (file shares, RDP etc.)
* Administrative permissions limited to a small number of administrators
* Build scripts run without elevated permissions

If you need build nodes with wider permission sets, consider separating the process of compilation and packaging from other steps (e.g. running tests). You might also want to consider signing initial builds as release candidates, and only provide release signatures after testing.

You may configure the system to accept certificates based on
* subject/distinguished name conditions (e.g. common name or organizational unit)
* the issuer (e.g. issued by a certain immediate certificate)
* a Microsoft Certificate Server Template ID (useful if you assign certificates to Active Directory computer groups)

Contact support@signpath.io for the connector and documentation.

### Jenkins CI

A connector is available that connects Jenkins CI as a Trusted Build System. 

This connector ensures that 
* A build was actually performed by a specific Jenkins CI instance, not by some other entity in possession of the CI User token
* Origin metadata is provided by Jenkins CI, not the build script, and can therefore not be forged
* The artifact is stored as an immutable Jenkins artifact before it is submitted for signing

Contact support@signpath.io for the connector and documentation.

### AppVeyor

<div class="panel info" markdown="1">
<div class="panel-header">Pre-configured connector</div>

The AppVeyor connector is built into SignPath and connects to appveyor.com. 
* AppVeyor is available based on the configuration of your SignPath organization. You don't need to add it on the Trusted Build Systems page. 
* It must still be linked to each project (see below)

A customizable connector for AppVeyor Server will be provided in the future.
</div>

#### Prerequisites and restrictions

This feature is currently dedicated to Open Source projects. Future versions will allow disabling certain limitations in paid subscriptions.

Current limitations:

* The AppVeyor project and the Git repository must be public 

In order to ensure Origin Verification, you cannot submit a signing request from an unfinished build. Instead, you have to finish the build job without signing, and then trigger a signing request with origin verification. When signing is completed, you can use a Webhook handler for further processing, such as uploading the signed artifact to a repository. 

The following checks are performed:

* No additional scripts may be executed during the build step and no cache entries may be used (so that the build remains fully traceable and is only built from the repository). The scripts must be all set to off at the bottom of the project settings page on AppVeyor.
* The build settings may not be modified between starting the AppVeyor build and calling SignPath.io
* The build configuration must be stored in the root directory under the name `appveyor.yml` or `.appveyor.yml` (no custom name is allowed to be set under *Project settings* and *Custom configuration .yml file name*)

This is to ensure that the binary artifacts result purely from the specified source code.

<div class="panel todo" markdown="1">
<div class="panel-header">TODO</div>

Is the following list complete? see https://www.appveyor.com/docs/build-configuration/#generic-git-repositories-and-yaml
> At the moment those supported are: GitHub (hosted and on-premises), Bitbucket (hosted and on-premises), GitLab (hosted and on-premises), Azure DevOps, Kiln and Gitea. 
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
  url: https://app.signpath.io/API/v1/<ORGANIZATION_ID>/Integrations/AppVeyor?ProjectSlug=<PROJECT>&SigningPolicySlug=<SIGNING_POLICY>
  authorization:
     secure: <ENCRYPTED_SIGNPATH_API_TOKEN>
~~~

Replace the parameters:
* `<ORGANIZATION_ID>`, `<PROJECT>` and `<SIGNING_POLICY>` values can be retrieved from the signing policy page
* `<ENCRYPTED_SIGNPATH_API_TOKEN>` is the value from the previous step

</td> </tr> </tbody> </table>

#### Attached build documentation

SignPath adds the following information to packages:

* For NuGet packages:
  1. The build settings are stored in an AppVeyorSettings.json file in the root of the NuGet package
  2. The commit hash and repository URL are written to the metadata of the NuGet package

These steps allow consumers of the signed artifact to verify source code version and build settings.


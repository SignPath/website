---
main_header: Trusted Build Systems
sub_header: AppVeyor
layout: resources
toc: false
show_toc: 0
description: AppVeyor
---


{:.panel.info}
> **Pre-configured connector**
>
> The AppVeyor connector is built into SignPath and connects to appveyor.com. 
> * AppVeyor is available based on the configuration of your SignPath organization. You don't need to add it on the Trusted Build Systems page. 
> * It must still be linked to each project (see below)
> 
> A customizable connector for AppVeyor Server will be provided in the future.

## Prerequisites and restrictions

In order to ensure Origin Verification, you cannot submit a signing request from an unfinished build. Instead, you have to finish the build job without signing, and then trigger a signing request with origin verification. When signing is completed, you can use a Webhook handler for further processing, such as uploading the signed artifact to a repository. 

The following checks are performed:

* No additional scripts may be executed during the build step and no cache entries may be used (so that the build remains fully traceable and is only built from the repository). The scripts must be all set to off at the bottom of the project settings page on AppVeyor.
* The build settings may not be modified between starting the AppVeyor build and calling SignPath.io
* The build configuration must be stored in the root directory under the name `appveyor.yml` or `.appveyor.yml` (no custom name is allowed to be set under *Project settings* and *Custom configuration .yml file name*)
* For Open Source subscriptions, the AppVeyor project and the Git repository must be public.

These checks are performed to ensure that the binary artifacts result purely from the specified source code.

{:.panel.todo}
> **TODO**
>
> Is the following list complete? see https://www.appveyor.com/docs/build-configuration/#generic-git-repositories-and-yaml
>
> At the moment those supported are: GitHub (hosted and on-premises), Bitbucket (hosted and on-premises), GitLab (hosted and on-premises), Azure DevOps, Kiln and Gitea. 

## Setup
This figure shows the secrets that must be shared between AppVeyor.com and SignPath.io:
![AppVeyor Setup flow](/assets/img/resources/documentation/build-integration_appveyor.png)

{%- include render-table.html table=site.data.tables.trusted-build-systems.appveyor-setup -%}

## Attached build documentation

SignPath adds the following information to packages:

* For NuGet packages:
  1. The build settings are stored in an AppVeyorSettings.json file in the root of the NuGet package
  2. The commit hash and repository URL are written to the metadata of the NuGet package

These steps allow consumers of the signed artifact to verify source code version and build settings.


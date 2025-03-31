---
header: Azure DevOps
layout: resources
toc: true
show_toc: 3
description: Azure DevOps
---

## Prerequisites

* On SignPath.io: [Use the predefined Trusted Build System](/documentation/trusted-build-systems#configuration) _Azure DevOps (dev.azure.com)_.
* Create an artifact configuration with the following format:
    ```xml
    <?xml version="1.0" encoding="utf-8" ?>
    <artifact-configuration xmlns="http://signpath.io/artifact-configuration/v1">
      <zip-file>
        <directory path="*">
          ... the files you want to sign
        </directory>
      </zip-file>
    </artifact-configuration>
    ```
    See [Artifact Configurations](/documentation/artifact-configuration) for more details.

    {:.panel.info}
    > **Root folder in artifact configuration**
    >
    > Azure DevOps allows to publish whole directories as artifacts. When downloading the artifacts, they provide a zip archive including a folder with the name of artifact as specified in the pipeline definition. The artifact configuration needs to map this format.

* In your Azure DevOps organization, install the [SignPath Azure DevOps Extension](https://marketplace.visualstudio.com/items?itemName=SignPath.signpath-tasks)
* In the Azure DevOps project settings, add a Service Connection of type SignPath
* Use the provided task in your build pipelines to sign the artifact


{:.panel.info}
> **Azure DevOps Server**
>
> SignPath hosts an instance of the Azure DevOps connector which is linked to dev.azure.com For integrating self-hosted Azure DevOps Server instances, contact our [support](/support) team.


## Checks performed by SignPath

The Azure DevOps connector performs the following checks:

* A build was actually performed by an Azure DevOps pipeline, not by some other entity in possession of the API token
* [Origin metadata](/documentation/origin-verification) is provided by Azure DevOps, not the build script, and can therefore not be forged
* The artifact is stored on the Azure DevOps server before it is submitted for signing

## Usage

The SignPath extension provides a `SubmitSigningRequest` task that can be integrated into a Azure DevOps pipeline definition:

{% raw %}
```yaml
steps:

# required for the artifact to be available on the Azure DevOps server
- task: PublishBuildArtifacts@1
  inputs:
    PathtoPublish: '$(Build.SourcesDirectory)/your-artifact'
    ArtifactName: 'unsigned-artifact'

- task: SubmitSigningRequest@1
  inputs:
    serviceConnectionName: 'my-signpath-service-connection'
    projectSlug: '<SignPath project slug>'
    artifactConfigurationSlug: 'azure-devops'
    signingPolicySlug: '<SignPath signing policy slug>'
    parameters: |
      version: ${{ convertToJson(parameters.someUserInput) }}
      myparam: "another param"
    azureDevOpsArtifactName: 'unsigned-artifact'
    waitForCompletion: true
    outputArtifactDirectory: '$(Build.SourcesDirectory)/signed'
```
{% endraw %}

### Task inputs

| Parameter                                     | Default Value                 | Description 
|-----------------------------------------------|-------------------------------|---------------------------
| `serviceConnectionName`                       | (mandatory)                   | The name of the service connection used for authentication.
| `projectSlug`                                 | (mandatory)                   | The SignPath project slug.
| `signingPolicySlug`                           | (mandatory)                   | The SignPath signing policy slug.
| `artifactConfigurationSlug`                   |                               | The SignPath artifact configuration slug. If not specified, the default is used.
| `azureDevOpsArtifactName`                     | (mandatory)                   | The name of the Azure DevOps artifact. Must be uploaded using the `PublishBuildArtifact` task before it can be signed.
| `waitForCompletion`                           | (mandatory)                   | If true, the action will wait for the signing request to complete. Defaults to `true`.
| `outputArtifactDirectory`                     |                               | Path to where the signed artifact will be extracted. If not specified, the task will not download the signed artifact from SignPath.
| `waitForCompletionTimeoutInSeconds`           | `600`                         | Maximum time in seconds that the action will wait for the signing request to complete.
| `serviceUnavailableTimeoutInSeconds`          | `600`                         | Total time in seconds that the action will wait for a single service call to succeed (across several retries).

| `downloadSignedArtifactTimeoutInSeconds`      | `300`                         | HTTP timeout when downloading the signed artifact. Defaults to 5 minutes.
| `parameters`                                  |                               | Multiline-string of values that map to [user-defined parameters](/documentation/artifact-configuration/syntax#parameters) in the Artifact Configuration. Use one line per parameter with the format `<name>: "<value>"` where `<value>` needs to be a valid JSON string.

### Action output variables

The action supports the following output parameters:
- `SigningRequestId`: The id of the newly created signing request. Available to subsequent tasks as an environment variable `<TASKNAME>_SIGNINGREQUESTID`
- `SigningRequestWebUrl`: The url of the signing request in SignPath. Available to subsequent tasks as an environment variable `<TASKNAME>_SIGNINGREQUESTWEBURL``.
- `SignPathApiUrl`: The base API url of the SignPath API. Available to subsequent tasks as an environment variable `<TASKNAME>_SIGNPATHAPIURL`.
- `SignedArtifactDownloadUrl`: The url of the signed artifact in SignPath. Available to subsequent tasks as an environment variable `<TASKNAME>_SIGNEDARTIFACTDOWNLOADURL`.
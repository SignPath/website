---
header: TeamCity
layout: resources
toc: true
show_toc: 3
description: TeamCity
---

## Setup

### Self-hosted setup

For SignPath to integrate with the TeamCity server, you have to deploy the **SignPath TeamCity Connector** container image in a location that can reach the TeamCity server and install the **SignPath TeamCity Plugin** providing the dedicated build runners.

Contact our [support](/support) team for access to these components.

### On SignPath

1. Add a custom trusted build system and copy the _Trusted Build System Token_ to your TeamCity connector configuration
2. Link the trusted build system with all projects built on TeamCity


## Checks performed by SignPath

The TeamCity connector performs the following checks:

* A build was actually performed by a TeamCity build configuration, not by some other entity in possession of the API token
* [Origin metadata](/documentation/origin-verification) is provided by the TeamCity server, not the build script, and can therefore not be forged
* The artifact is stored on the TeamCity server before it is submitted for signing

## Usage

### Usage with versioned settings
The SignPath TeamCity Plugin provides a build runner that can be used for submitting signing requests to SignPath.

{% raw %}
```kotlin
import jetbrains.buildServer.configs.kotlin.buildSteps.signPathSubmitSigningRequest

project {
    buildType {
        // Other build type settings ...
        steps {
            // Other build steps ...
            signPathSubmitSigningRequest {
                connectorUrl = "https://your-teamcity-connector-instance-base.url"     
                organizationId = "%SignPath.OrganizationId%"
                apiToken = "<Signpath api token>"
                projectSlug = "<SignPath project slug>"
                signingPolicySlug = "<SignPath signing policy slug>"
                inputArtifactPath = "path/to/your/artifact"
                outputArtifactPath = "path/to/store/the/signed/artifact"
                waitForCompletion = true
            }
        }
    }
}
```
{% endraw %}

### Usage without versioned settings

Add a build step of type _SignPath: Submit Signing Request_

### Build step parameters

| Parameter                                         | Default Value                 | Description 
|---------------------------------------------------|-------------------------------|---------------------------
| `connectorUrl`                                    | (mandatory)                   | The base URL of the SignPath connector.
| `organizationId`                                  | (mandatory)                   | The SignPath organization ID.
| `apiToken`                                        | (mandatory)                   | The SignPath API token.
| `projectSlug`                                     | (mandatory)                   | The SignPath project slug.
| `signingPolicySlug`                               | (mandatory)                   | The SignPath signing policy slug.
| `artifactConfigurationSlug`                       |                               | The SignPath artifact configuration slug. If not specified, the default is used.
| `inputArtifactPath`                               | (mandatory)                   | The path to the artifact to be signed. Both absolute paths and relative paths from the working directory are accepted.
| `waitForCompletion`                               | (mandatory)                   | If true, the action will wait for the signing request to complete. Defaults to `true`.
| `outputArtifactPath`                              |                               | Path to where the signed artifact will be stored. Both absolute paths and relative paths from the working directory are accepted.
| `waitForCompletionTimeoutInSeconds`               | `600`                         | Maximum time in seconds that the action will wait for the signing request to complete.
| `serviceUnavailableTimeoutInSeconds`              | `600`                         | Total time in seconds that the action will wait for a single service call to succeed (across several retries).
| `uploadAndDownloadSignedArtifactTimeoutInSeconds` | `300`                         | HTTP timeout used for upload or download of the artifact.Defaults to 5 minutes.
| `publishUnsignedArtifactTimeoutInSeconds`         | `300`                         | Timeout used for publishing the unsigned artifact to the TeamCity server before sending the signing request.

<!-- TODO
| `parameters`                                      |                               | Multiline-string of values that map to [user-defined parameters](/documentation/artifact-configuration/syntax#parameters) in the Artifact Configuration. Use one line per parameter with the format `<name>: "<value>"` where `<value>` needs to be a valid JSON string.
-->

### Build step output parameters

After the build step is run, the following parameters will be available to subsequent build steps:

- `signingRequestId`: The id of the newly created signing request.
- `signingRequestWebUrl`: The url of the signing request in SignPath.
- `signPathApiUrl`: The base API url of the SignPath API. 
- `signedArtifactDownloadUrl`: The url of the signed artifact in SignPath.

## Example

For a reference implementation, see the [demo repository](https://github.com/signpath/demo-teamcity).
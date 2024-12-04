---
header: Jenkins Plugin
layout: resources
toc: true
show_toc: 2
description: Jenkins Plugin
---

## Performed checks

The plugin ensures that 
* A build was actually performed by a specific Jenkins CI instance, not by some other entity in possession of the API token
* [Origin metadata](/documentation/origin-verification) is provided by Jenkins CI, not the build script, and can therefore not be forged
* The artifact is stored as an immutable Jenkins artifact before it is submitted for signing

## Installation

See the [official plugin page](https://plugins.jenkins.io/signpath/) on how the plugin can be installed.

### Configuration

On SignPath: See the respective [configuration section](/documentation/trusted-build-systems#configuration).

On Jenkins:

* Under _Manage Jenkins_ and _System_ in the plugin's configuration section, the default values for the endpoint and credential ID can be set
* The _Trusted Build System Token_ needs to be stored in a _System_ Credential (Under _Manage Jenkins / Manage Credentials_)
* The _Api Token_ of a SignPath user with submitter permissions needs to be available to the build pipelines of the respective projects


## Usage

In your `Jenkinsfile`, make sure the artifacts to be signed are pushed to the master node by adding a stage e.g.

```scala
    stage('Archive') {
      steps {
        archiveArtifacts artifacts: "build-output/**", fingerprint: true
      }
    }
```

### Provided steps

Include the `submitSigningRequest` and optionally, the `getSignedArtifact` steps in your build pipeline.

#### General parameters

| Parameter                                             | Default Value     | Description |
| ----------------------------------------------------- | -                 | ----        |
| `apiTokenCredentialId`                     | `SignPath.ApiToken`                | The ID of the credential containing the **API Token**. Recommended in scope "Global".
| `trustedBuildSytemTokenCredentialId`       | `SignPath.TrustedBuildSystemToken` | The ID of the credential containing the **Trusted Build System Token**. Needs to be in scope "System".
| `serviceUnavailableTimeoutInSeconds`       | `600`                              | Total time in seconds that the step will wait for a single service call to succeed (across several retries).
| `uploadAndDownloadRequestTimeoutInSeconds` | `300`                              | HTTP timeout used for upload and download HTTP requests. Defaults to 300.
| `waitForCompletionTimeoutInSeconds`        | `600`                              | Maximum time in seconds that the step will wait for the signing request to complete.

#### Parameters for the `submitSigningRequest` step

| Parameter                    | Default Value | Description |
| -----------------------------| -             | ----        |
| `organizationId`             | (mandatory)   | The ID of the SignPath organization
| `projectSlug`                | (mandatory)   | The slug of the SignPath project 
| `signingPolicySlug`          | (mandatory)   | The slug of the SignPath signing policy
| `artifactConfigurationSlug`  |               | The SignPath artifact configuration slug. If not specified, the default is used.
| `inputArtifactPath`          | (mandatory)   | The relative path of the artifact to be signed
| `outputArtifactPath`         |               | The relative path where the signed artifact is stored after signing
| `waitForCompletion`          | (mandatory)   | Set to `true` for synchronous and `false` for asynchronous signing requests
| `parameters`                 |               | A `Map<String, String>` with key/value pairs that map to [user-defined parameters](/documentation/artifact-configuration/syntax#parameters) in the Artifact Configuration.

#### Parameters for the `getSignedArtifact` step

| Parameter                    | Default Value | Description |
| -----------------------------| -             | ----        |
| `organizationId`             | (mandatory)   | The ID of the SignPath organization
| `signingRequestId`           | (mandatory)   | The ID of the signing request (is returned by the `submitSigningRequest` step)
| `outputArtifactPath`         | (mandatory)   | The relative path where the signed artifact is stored after signing

### Examples

#### Example: Submit a synchronous signing request

```scala
    stage('Sign with SignPath') {
      steps {
        submitSigningRequest(
          organizationId: "${ORGANIZATION_ID}",
          projectSlug: "${PROJECT_SLUG}",
          signingPolicySlug: "${SIGNING_POLICY_SLUG}",
          artifactConfigurationSlug: "${ARTIFACT_CONFIGURATION_SLUG}",
          inputArtifactPath: "build-output/my-artifact.exe",
          outputArtifactPath: "build-output/my-artifact.signed.exe",
          waitForCompletion: true
        )
      }
    }
```

#### Example: Submit an asynchronous signing request with parameters

```scala
    stage('Sign with SignPath') {
      steps {
        script {
          signingRequestId = submitSigningRequest(
            organizationId: "${ORGANIZATION_ID}",
            projectSlug: "${PROJECT_SLUG}",
            signingPolicySlug: "${SIGNING_POLICY_SLUG}",
            artifactConfigurationSlug: "${ARTIFACT_CONFIGURATION_SLUG}",
            inputArtifactPath: "build-output/my-artifact.exe",
            outputArtifactPath: "build-output/my-artifact.signed.exe",
            waitForCompletion: false,
            parameters: [
              "version": "1.0",
              "my-param": "another param"
            ]
          )
        }
      }
    }
    stage('Download Signed Artifact') {
      input {
        id "WaitForSigningRequestCompleted"
        message "Has the signing request completed?"
      }
      steps{
        getSignedArtifact( 
          organizationId: "${ORGANIZATION_ID}",
          signingRequestId: "${signingRequestId}",
          outputArtifactPath: "build-output/my-artifact.exe"
        )
      }
    }
```

---
main_header: Documentation
sub_header: Signing Docker images
layout: resources
toc: true
show_toc: 5
description: Documentation for signing Docker containers with SignPath
---

Available for Enterprise and Open Source subscriptions
{: .badge.icon-signpath}

## Overview

There are currently 3 competing technologies for signing Docker images:

* _[sigstore's cosign](https://docs.sigstore.dev/signing/quickstart/)_: A Linux foundation project, primarily developed for the open source community. See [below](#cosign) on how to use it with SignPath.
* _[Notary v1 (Docker Content Trust)](https://github.com/theupdateframework/notary)_: Part of the standard docker CLI. See [below](#notary-v1) on how to use it with SignPath.
* _[Notation](https://notaryproject.dev/)_: Previously known as Notary v2 it is the successor of Notary v1 (Docker Conten Trust). Not yet supported by SignPath.


### Why use SignPath for container signing?

SignPath provides the following advantages when signing for Docker Content Trust (DCT):

* You can use the full power of SignPath **signing policies**, including permission, approval, and origin verification
* You can use all **CI integration** features of SignPath
* Configuration and policy management is **aligned with other signing methods**, such as Authenticode or Java signing
* SignPath maintains a **full audit log** of all signing activities

For _Notary v1 / Docker Content Trust (DCT)_, there are additional specific advantages:

* **You don't need to keep the target key** (a powerful key without hardware protection option that you would otherwise need for every new developer)
* **Developers don't need to keep their own delegation keys**
* SignPath controls **signing on a semantic level**, where DCT would just verify signatures on manifest files (i.e. with SignPath, a signing request that claims to add a signature to a specific image and/or label can be trusted to do just that and nothing else)

For _cosign_, there are additional specific advantages:

* You can **authenticate automated build systems instead of individual developers** and leverage origin verification for CI systems that do not support cosign workload identities (currently only Github and Gitlab in their SaaS offerings)
* You can use your own key material and **keep your signature data private** without having to operate an own instance of Fulcio

## Using cosign {#cosign}

### Overview

_cosign_ belongs to the [sigstore](https://www.sigstore.dev/) project. It is primarily targeted at the open source community, allowing individual developers and Github Actions builds to authenticate using OpenIdConnect and receive short-lived signing keys from a Fulcio certificate authority (CA). All signatures are recorded in a public transparency log (called rekor). Due to the keys not being persistent anywhere, _cosign_ refers to this method as "keyless signing".

This approach is not practical for all organizations which
* use an automated build system that does not support cosign (currently only Github Actions SaaS and Gitlab SaaS) or
* don't want their signatures to be logged in the public Rekor log and don't want to operate their own Fulcio CA

For these organizations, signing with _cosign_ is only possible using public/private key pairs.

<div class="panel info" markdown="1">
<div class="panel-header">X.509 certificate chains in cosign</div>

_cosign_ builds upon X.509 certificate chains, but requires specific additional attributes to be set in each certificate. The project is actively working on supporting custom certificates from traditional PKIs.

</div>

### Prerequisites

Required components on the client: 
* cosign in version 2.0.0 or higher

In your SignPath organization, you need the following entities:
* a project with an artifact configuration of type _Detached raw signatures_
* a certificate (only the public/private key pair will be used)

The Docker container image needs to be pushed to an OCI-compliant container registry.

### Signing

Signing container images with cosign using SignPath consists of 3 steps:

#### 1. Create an unsigned `payload.json` file

~~~ bash
export IMAGE_DIGEST=`docker inspect --format='{% raw %}{{index .RepoDigests 0}}{% endraw %}' $FQN`
cosign generate $IMAGE_DIGEST > payload.json
~~~

* `$FQN` contains the fully qualified name, see [FQN](#fqn)
* The first part extracts the repository digest identifier for the given FQN
* The second part tells cosign to generate a metadata file that can be signed

#### 2. Create a detached signature for the `payload.json` file

You can create a detached `payload.json.sig` signature using any of SignPath's [build system integrations](#/documentation/build-system-integrations) or via the user interface. Please note that you need to create a zip file containing the `payload.json` file before uploading it.

#### 3. Attach the signature to the image

cosign expects the signature to be base64 encoded before it can be attached:

~~~ bash
cat payload.json.sig | base64 > payload.json.base64.sig
~~~

Then, the following command will upload the signature to the repository:

~~~ bash
cosign attach signature --payload payload.json --signature payload.json.base64.sig $IMAGE_DIGEST
~~~

## Using Notary v1 (Docker Content Trust) {#notary-v1}

### Overview

DCT is based on Notary, which uses a system of keys:

| Key type        | Handled by       | Used to                                             | Usage frequency                     | Recommendation
|-----------------|------------------|-----------------------------------------------------|-------------------------------------|------------------------------------------
| **Root**        | Repository admin | issue all other keys (except delegation keys)       | Initialization + each key rotation | Use a Yubikey USB token
| **Target**      | Repository admin | issue delegation keys                               | Initialization + each key rotation | Delete after initialization/key rotation
| **Delegation**  | **SignPath**     | individual images and labels                        | Each image build                    | Use one delegation key for all developers
| **Snapshot**    | Notary signer    | sign matching collections to prove consistency      | Each image build                    | (Registry/Notary take care of this)
| **Timestamp**   | Notary signer    | sign current collections to prove "freshness"       | Constantly                          | (Registry/Notary take care of this)

#### Setup overview

The process to set up SignPath for DCT is as follows:

* Create a single delegation key in SignPath using the HSM store (e.g. one per Registry)
* For each repository
  1. execute `Initialize-DockerSigning`, which 
     * creates a root key for your repository (preferably using a Yubikey token)
     * creates a target key 
     * adds the delegation key to the target key
     * registers the root key with Notary (results in new snapshot and timestamp keys created on Notary signer)
  2. delete the target key's private key (recommended; no need to add more delegates later, but you can always perform a [key rotation](https://github.com/notaryproject/notary/blob/master/docs/best_practices.md#key-rotations))
  3. lock the token with the root key in a safe (you will not need it again unless you need to do a key rotation)
  4. set up repository, project and signing policy in SignPath

Step-by-step instructions are available in the [setup phase](#setup-phase) section.

As a result of this procedure, all remaining keys will be on secure systems:

| Key type        | Physical protection       | Access control
|-----------------|---------------------------|-----------------------------
| **Root**        | Yubikey                   | Locked in safe + PIN
| **Target**      | (deleted)                 | n/a
| **Delegation**  | SignPath HSM              | SignPath policies
| **Snapshot**    | (depends on Notary setup) | Notary/Registry credentials
| **Timestamp**   | (depends on Notary setup) | Notary/Registry credentials

#### Signing overview

Execute `Invoke-DockerSigning` in your CI system, or call each step individually. See [signing phase](#signing-phase) for step-by-step instructions.

#### Security considerations

The following table lists 

* the potential security impact in case a key is compromised (i.e. an adversary managed to retrieve or use the private key)
* the recovery procedure in case a key is compromised or simply lost

(Some of the impact scenarios also require access to Notary/Registry credentials. See [Notary threat model](https://github.com/notaryproject/notary/blob/master/docs/service_architecture.md#threat-model) for a full breakdown.)

| Key type      | Security impact                                               | Recovery procedure 
|---------------|---------------------------------------------------------------|--------------------
| **Root**      | illegitimate images signed, illegitimate keys issued          | Manual recovery for repository and all clients
| **Target**    | illegitimate images signed, illegitimate delegate keys issued | Key rotation
| **Delegate**  | illegitimate images signed                                    | Key rotation
| **Snapshot**  | mix-and-match attack                                          | Key rotation
| **Timestamp** | legitimate images wrongly declared current (freeze attack)    | Key rotation


<div class="panel info" markdown="1">
<div class="panel-header">The misleading security assumption of Notary and Docker Content Trust (DCT)</div>

**TL;DR: a single compromised delegation key will compromise all image repositories that trust this delegation.**

**Update**: The Notary documentation is no longer hosted on docker.com. The implicit promise that Notary's threat model also works for Docker Content Trust is no longer made. This section will soon be updated to reflect the new structure of Docker's documentation. The Notary documentation is currently not published but available at [GitHub](https://github.com/theupdateframework/notary/tree/master/docs).

Docker Content Trust (DCT) builds on the Notary signing system. While Notary was basically built for DCT, this does not necessarily mean that the two systems are well aligned.

Notary has a well-defined [threat model](https://github.com/notaryproject/notary/blob/master/docs/service_architecture.md#threat-model) which states the following about compromised delegation keys:

> An attacker can add malicious content, remove legitimate content from a collection, and mix up the targets in a collection, but only within the particular delegation roles that the key can sign for. **Depending on the restrictions on that role, they may be restricted** in what type of content they can modify. *[Our emphasis]*

**This is the most important part of the threat model,** since it involves the least protected keys. However, DCT uses Notary in a way that provides no such restriction. While DCT does provide the usual per-delegation signature manifests, its primary source of trust is **a shared signature manifest** called `releases.json` that includes all signatures from all delegates. 

When verifying signatures, Docker only looks at this shared manifest, and thereby invalidates the separation of delegates provided by Notary. This essentially means that everybody who holds any delegation key can add signatures for images and labels, and change existing signature entries from other delegates.

Note that developers usually own a single delegation key that is trusted by many repositories. Issuing seperate delegation keys for each repository is not a good solution, it just puts an additional burden on developers to keep their keys secure, thus increasing the risks. Also, DCT does not support hardware tokens for delegation keys. 

(Disclaimer: all compromise scenarios for delegation keys assume access to the developer's Notary credentials, which are usually the same as their Docker registry credentials.)
</div>

### Setup phase

#### Prerequisites

Required components: 
* PowerShell 6 or higher
* [SignPathDocker](https://powershellgallery.com/packages/SignPathDocker/) PowerShell module
* [Notary client](https://github.com/theupdateframework/notary/releases) version 0.6.1 or greater (installed with Docker Desktop until v3.3.3)

Optional components:
* Attached [Yubikey](https://github.com/notaryproject/notary/blob/master/docs/advanced_usage.md#use-a-ubikey) USB token (strongly recommended)

#### Steps

##### 1. Create a new self-signed X.509 certificate in SignPath

This certificate will be added as a **delegation key** to your Docker repository in a later step. 

You only need one delegation key, it can be shared between repositories.

##### 2. Get or create the root and target keys

In order for SignPath to ensure that only valid tags can be signed, you need to upload the repository's root key (only the public key) to SignPath. Use the [SignPathDocker](https://powershellgallery.com/packages/SignPathDocker/) PowerShell module. 

<div class="panel info" markdown="1">
<div class="panel-header">PowerShell parameters and FQN</div>

`Get-RootCertificate`, `Initialize-DockerSigning`, and `Add-DelegationCertificate` accept the following parameters:

| Parameter                             | Description     |
| ------------------------------------- | --------------- |
| `Repository`                          | The FQN provided when creating the Docker repository in SignPath
| `NotaryUsername` and `NotaryPassword` | The credentials of your Notary server. In most cases, these are the same as the credentials for your Docker registry.
| `NotaryUrl`                           | Optional parameter to specify the URL of your internal notary server. Defaults to `https://notary.docker.io` which is the Notary server used by Docker Hub.

<a name="fqn"/> 
**Fully qualified name (FQN)**

For images hosted on Docker Hub, the FQN is `docker.io/<namespace>/<repository>`, e.g. `docker.io/jetbrains/teamcity-server`. 

If you are using your own registry, specify the value you would use for Docker CLI commands, but without tag or digest values. E.g. when using `docker pull myreg.jfrog.io/myrepo/myimage:latest`, the FQN would be `myreg.jfrog.io/myrepo/myimage`.

</div>

Choose one of the following scenarios:

###### Scenario 1: You are currently not signing your Docker images

Call the following command:

~~~ powershell
Initialize-DockerSigning -Repository $FQN `
  -NotaryUsername $NOTARY_USERNAME -NotaryPassword $NOTARY_PASSWORD [-NotaryUrl $NOTARY_URL]
~~~

Executing this command will  

* create all necessary keys, prompting for passphrases during execution
  * root key (file or, preferably, Yubikey token)
  * target key (file)
  * snapshot key (temporary)
* rotate the snapshot key (new key issued and maintained by Notary signer)
* publish the _trust data_ to the Notary server 
* extract the public part of the root key as a certificate file

The command prints the path of the certificate you need to upload in step 4.

###### Scenario 2: You are already signing your Docker images

If you already have an existing set of keys that you want to keep, you only need to export the public part of the root key for uploading to SignPath. 

You can export the public key by calling the following command on the machine where the _root_ and _targets_ keys are stored:

~~~ powershell
Get-RootCertificate -Repository $FQN `
  -NotaryUsername $NOTARY_USERNAME -NotaryPassword $NOTARY_PASSWORD [-NotaryUrl $NOTARY_URL]
~~~

The command prints the path of the certificate you need to upload in step 4.

We recommend that you remove existing delegation keys as soon as you have verified that your SignPath setup works. Use the `notary delegation remove` [command](https://github.com/notaryproject/notary/blob/master/docs/advanced_usage.md#work-with-delegation-roles) or perform a [key rotation](https://github.com/notaryproject/notary/blob/master/docs/advanced_usage.md#rotate-keys).

##### 3. Add the delegation certificate to your repository's delegation keys

Download the delegation key certificate file from step 1. Add it using the following command:

~~~ powershell
Add-DelegationCertificate -Repository $FQN `
  [-NotaryUrl $NOTARY_URL] [-NotaryUsername $NOTARY_USERNAME] [-NotaryPassword $NOTARY_PASSWORD] `
  -DelegationCertificatePath certificate.cer 
~~~

This adds a delegation (default name `signpath`) with the key from the specified certificate and publishes the changes to the Notary server. You will be prompted for the password of your _targets key_.

##### 4. Set up a Docker repository and project in SignPath

* Add a new Docker repository in SignPath
  * specify its fully qualified name ([FQN](#fqn))
  * upload the root certificate file from step 2
* Create a project with an artifact configuration of type _Docker signing data_ for this repository
* Add a signing policy to the project and choose the certificate you created in step 1

##### 5. When everything works, delete the target key

Delete the file `~/.docker/trust/private/$id*.key` where `$id` is the 7 digit key of the target key you created in step 2. See the [Notary documenation](https://github.com/notaryproject/notary/blob/master/docs/advanced_usage.md#files-and-state-on-disk).

We recommend to perform a test signing before deleting the target key.

<div class="panel info" markdown="1">
<div class="panel-header">Delete the target key: reason and consequences</div>

DCT and Notary provide no method to protect the target key beyond a simple passphrase. Yubikey tokens can only be used for the root key. However, since SignPath uses only a single delegation key for all developers and CI systems, there is usually no need to for the target key after the setup phase. We therefore recommend that you delete the key file right after sucessfull initialization.

If you run into unexpected problems later that require a target key, you can always create a new one by performing a [key rotation](https://github.com/notaryproject/notary/blob/master/docs/advanced_usage.md#rotate-keys). Don't forget to add existing delegation keys you want to keep after a key rotation.

The default [expiration time](https://github.com/theupdateframework/notary/blob/master/docs/best_practices.md) for both target and delegation keys is 3 years. After this time, you need to perform a key rotation in any case.
</div>

### Signing phase

#### Prerequisites

Required components:

* PowerShell 6 or higher
* Docker CLI
* [SignPathDocker](https://powershellgallery.com/packages/SignPathDocker/) PowerShell module

The unsigned image must be 
  * available on the local computer (preferably right after building it) 
  * _and_ pushed to the registry (unsigned)

#### Execution

##### Single-step signing

For convenience, the `SignPathDocker` module provides a single command to sign a Docker image:

~~~ powershell
Invoke-DockerSigning -Repository $FQN -Tags $TAGS `
  -ApiToken $API_TOKEN -OrganizationId $ORGANIZATION_ID `
  -ProjectSlug $PROJECT_SLUG -SigningPolicySlug $SIGNING_POLICY_SLUG `
  [-ArtifactConfigurationSlug $ARTIFACT_CONFIGURATION_SLUG] [-Description $DESCRIPTION] `
  [-NotaryUrl $NOTARY_URL] [-NotaryUsername $NOTARY_USERNAME] [-NotaryPassword $NOTARY_PASSWORD] `
  [-RegistryUrl $REGISTRY_URL] [-RegistryUsername $REGISTRY_USERNAME] [-RegistryPassword $REGISTRY_PASSWORD]
~~~

##### Perform each step separately

Alternatively, you perform each step separately. Reasons to do this include

* create multiple signatures with a single signing request
* perform asynchronous signing, e.g. to accommodate for a manual approval step

~~~ powershell
# Create a Docker signing data file containing all metadata required for signing
New-DockerSigningData -Repository $FQN -Tags $TAGS `
  [-RegistryUrl $REGISTRY_URL] [-RegistryUsername $REGISTRY_USERNAME] [-RegistryPassword $REGISTRY_PASSWORD] `
  [-NotaryUrl $NOTARY_URL] [-NotaryUsername $NOTARY_USERNAME] [-NotaryPassword $NOTARY_PASSWORD] `
  -OutputArtifactPath $ZIP_FILE

# Submit a new signing request to SignPath.
$signingRequestId = Submit-SigningRequest -InputArtifactPath $ZIP_FILE `
  -ApiToken $API_TOKEN -OrganizationId $ORGANIZATION_ID `
  -ProjectSlug $PROJECT_SLUG -SigningPolicySlug $SIGNING_POLICY_SLUG 

# Get the signed artifact
Get-SignedArtifact $signingRequestId -ApiToken $API_TOKEN -OrganizationId $ORGANIZATION_ID 

# Upload the signed metadata to the Notary server
Push-SignedDockerSigningData -Repository $FQN -InputArtifactPath $ZIP_FILE `
  [-NotaryUrl $NOTARY_URL] [-NotaryUsername $NOTARY_USERNAME] [-NotaryPassword $NOTARY_PASSWORD]
~~~

<div class="panel info" markdown="1">
<div class="panel-header">PowerShell parameters</div>

`Invoke-DockerSigning`, `New-DockerSigningData`, `Submit-SigningRequest`, and `Push-SignedDockerSigningData` accept all or some of the following parameters:

| Parameter                                                          | Description     |
| ------------------------------------------------------------------ | --------------- |
| `Repository`                                                       | The FQN provided when creating the Docker repository in SignPath
| `Tags`                                                             | A comma-separated list of Docker tags that you want to sign (e.g. `v1,1.2.17`)
| `ApiToken`                                                         | The API token of the CI user (see [build system integration](./build-system-integration#authentication))
| `OrganizationId`                                                   | ID of your SignPath organization
| `ProjectSlug`, `SigningPolicySlug` and `ArtifactConfigurationSlug` | The respective project, signing policy and artifact configuration for your signing request
| `Description`                                                      | Optional description for your signing request (e.g. version number)
| `NotaryUsername` and `NotaryPassword`                              | The credentials of your Notary server. In most cases, these are the same as the credentials for your Docker registry. If specified, overrides values in the `NOTARY_AUTH` environment variable. `NotaryPassword` is a PowerShell SecureString.
| `RegistryUsername` and `RegistryPassword`                          | The credentials of your Docker registry. If specified, overrides values in the `REGISTRY_AUTH` environment variable. `RegistryPassword` is a PowerShell SecureString.
| `RegistryUrl` and `NotaryUrl`                                      | Optional parameter to specify the URLs of your internal registry and notary server. Defaults to `docker.io` (Docker Hub) and `notary.docker.io` (Notary of Docker Hub)

**Passing SecureString parameters**

Use the following syntax to create `SecureString` objects for the `-NotaryPassword` and `-RegistryPassword` parameters: 

~~~ powershell
$SECURE_PASSWORD = ConvertTo-SecureString $PLAINTEXT_PASSWORD -AsPlainText 
~~~

**Using environment variables for authentication**

If you would rather provide credentials via environment variables, username and password have to be concatenated with a colon `:`, encoded in base64 and stored in  the `REGISTRY_AUTH` or `NOTARY_AUTH` environment variable respectively. See the [Notary documentation](https://github.com/notaryproject/notary/blob/master/docs/reference/client-config.md#environment-variables-optional).

**WaitForCompletion option**

Instead of calling `Get-SignedArtifact` separately, you may call `Submit-SigningRequest` with the  `-WaitForCompletion` parameter. The `Submit-SigningRequest` command is described in  [build system integration](./build-system-integration#powershell).
</div>

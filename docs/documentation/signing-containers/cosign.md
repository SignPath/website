---
main_header: Container Signing
sub_header: Sigstore Cosign
layout: resources
toc: true
show_toc: 0
description: Documentation for signing Docker images with SignPath using Cosign
---

## Cosign Overview

_Cosign_ is part of the [Sigstore](https://www.sigstore.dev/) project. It is primarily targeted at the open source community, allowing individual developers to sign container images using OpenID user accounts from GitHub, Google or Microsoft. For those developers, Sigstore eliminates the need for certificates or locally storeed private keys.

> **Sigstore architecture**
>
> Sigstore combines the _Cosign_ tool, the _Fulcio_ certificate authority and the _Rekor_ transparency log as follows:
>
> 1. Cosign creates a metadata file for signing
> 2. Fulcio authenticates the user account using OpenID Connect (OIDC)
> 3. Fulcio creates a short-lived certificate for the OIDC identity using an ephemeral key and signs the metadata digest
> 4. Rekor logs the signature in its public transparency log
> 5. Cosign uploads signature and metadata to the image's repository
{: .panel .info }

## Advantages of using SignPath for Cosign

While this works well for individual developers, organizations often have differen requirements, including

* Control issuing of certificates and key management
* Using automated CI/CD build system that do not support 3rd party OICD authentication
* Do not use individual OICD user accounts for signing
* No public signature logging (or operating their own Fulcio CA)

SignPath supports Cosign signing using an organization's certificate and keys.

Additionally, SignPath allows to process the entire metadata file. Metadata files contain

* The container image's identity (e.g. Docker Hub namespace/repository identifiers)
* The container image's hash digest
* Optional data

Submitting full metadata files instead of their hash codes has several advantages:

* Full auditing of signed data
* Additional verifications (e.g. image identity) can be performed before signing
* Additional information (e.g. source and build metadata and attestations) can be inserted before signing

SignPath will offer advanced verification and information features in the near future.

> **X.509 certificate chains in Cosign**
>
> _Cosign_ builds upon X.509 certificate chains, but requires specific additional attributes to be set in each certificate. The sigstore project is actively working on supporting custom certificates from traditional PKIs.
{: .panel .info }

## How to use Cosign with SignPath

When Cosign is used directly, it creates the metadata, signs it, and upload the signature. You can use Cosign with SignPath's [Cryptoki provider](/documentation/crypto-providers/cryptoki).

When SignPath is used to sign Cosign metadata files, you need to perform each step separately:

1. Use `cosign` to create the metadata file
2. Use SignPath to create a signatore for the metadata 
3. Use `cosign` to upload metadata and signature to your repository

### Prerequisites

Required components on the client: 
* Cosign in version 2.0.0 or higher

In your SignPath organization, you need the following entities:
* A project with an artifact configuration of type _Detached raw signatures_
* A certificate (only the public/private key pair will be used)

The Docker container image must be pushed to an OCI-compliant container registry.

### Step 1: create the metadata file

~~~ bash
# Extract the repository digest identifier for the given FQN
export IMAGE_DIGEST=`docker inspect --format='{% raw %}{{index .RepoDigests 0}}{% endraw %}' "$FQN:$TAG"`
# Generate a metadata file to be signed
cosign generate $IMAGE_DIGEST > payload.json
# Package the metadata file for SignPath
zip payload.json.zip payload.json
~~~

> **FQN and TAG**
>
> <a name="fqn"/> 
> **Fully qualified name (FQN)**
> 
> For images hosted on Docker Hub, the FQN is `docker.io/<namespace>/<repository>`, e.g. `docker.io/jetbrains/teamcity-server`. 
> 
> If you are using your own registry, specify the value you would use for Docker CLI commands, but without tag or digest values. E.g. when using `docker pull myreg.jfrog.io/> myrepo/myimage:latest`, the FQN would be `myreg.jfrog.io/myrepo/myimage`.
> 
> 
> `$TAG` refers the specific image tag (e.g. `latest`)
{: .panel .info }

### Step 2: create a signature for the metadata

Upload the `payload.json.zip` file to SignPath for signing. Use the artifact configuration "Detached raw signatures" for a single container image or extend it according to your needs. See [detached raw signatures](/documentation/artifact-configuration/reference#create-raw-signature) for more details. The following step expects the signed artifact to be stored as `payload.json.signed.zip`.

### Step 3: attach the signature to the image

Finally, the following snippet will unzip the signed artifact, encode the signature in base64 for _cosign_ and upload the signature to the repository:

~~~ bash
# Extract the detached signature
unzip -n payload.json.signed.zip
# Encode the signature using base64 for cosign
cat payload.json.sig | base64 > payload.json.base64.sig
# Upload the signature to the registry
cosign attach signature --payload payload.json --signature payload.json.base64.sig $IMAGE_DIGEST
~~~
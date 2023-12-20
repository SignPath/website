---
main_header: Documentation
sub_header: Signing Docker images with cosign
layout: resources
toc: true
show_toc: 0
description: Documentation for signing Docker images with SignPath using cosign
---

## Signing Docker Images with cosign

### Overview

_cosign_ belongs to the [sigstore](https://www.sigstore.dev/) project. It is primarily targeted at the open source community, allowing individual developers and Github Actions builds to authenticate using OpenIdConnect and receive short-lived signing keys from a Fulcio certificate authority (CA). All signatures are recorded in a public transparency log (called Rekor). Due to the keys not being persistent anywhere, _cosign_ refers to this method as "keyless signing".

This approach is not practical for all organizations which
* use an automated build system that does not support cosign (currently only Github Actions SaaS and Gitlab SaaS) or
* don't want their signatures to be logged in the public Rekor log and don't want to operate their own Fulcio CA

For these organizations, signing with _cosign_ is only possible using public/private key pairs.

<div class="panel info" markdown="1">
<div class="panel-header">X.509 certificate chains in cosign</div>

_cosign_ builds upon X.509 certificate chains, but requires specific additional attributes to be set in each certificate. The sigstore project is actively working on supporting custom certificates from traditional PKIs.

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

#### 1. Prepare the metadata for signing

~~~ bash
# Extract the repository digest identifier for the given FQN
export IMAGE_DIGEST=`docker inspect --format='{% raw %}{{index .RepoDigests 0}}{% endraw %}' "$FQN:$TAG"`
# Generate a metadata file to be signed
cosign generate $IMAGE_DIGEST > payload.json
# Package the metadata file for SignPath
zip payload.json.zip payload.json
~~~

<div class="panel info" markdown="1">
<div class="panel-header">FQN and TAG</div>

<a name="fqn"/> 
**Fully qualified name (FQN)**

For images hosted on Docker Hub, the FQN is `docker.io/<namespace>/<repository>`, e.g. `docker.io/jetbrains/teamcity-server`. 

If you are using your own registry, specify the value you would use for Docker CLI commands, but without tag or digest values. E.g. when using `docker pull myreg.jfrog.io/myrepo/myimage:latest`, the FQN would be `myreg.jfrog.io/myrepo/myimage`.


`$TAG` refers the specific image tag (e.g. `latest`)
</div>

#### 2. Create a signature for the metadata

Upload the `payload.json.zip` file to SignPath for signing. Use the artifact configuration "Detached raw signatures" for a single container image or extend it according to your needs. See [detached raw signatures](/documentation/artifact-configuration#detached-raw-signatures') for more details. The following step expects the signed artifact to be stored as `payload.json.signed.zip`.

#### 3. Attach the signature to the image

Finally, the following snippet will unzip the signed artifact, encode the signature in base64 for _cosign_ and upload the signature to the repository:

~~~ bash
# Extract the detached signature
unzip -n payload.json.signed.zip
# Encode the signature using base64 for cosign
cat payload.json.sig | base64 > payload.json.base64.sig
# Upload the signature to the registry
cosign attach signature --payload payload.json --signature payload.json.base64.sig $IMAGE_DIGEST
~~~
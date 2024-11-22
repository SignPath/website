---
header: Signing Container Images
layout: resources
toc: true
show_toc: 3
description: Documentation for signing container images with SignPath
redirect_from: /documentation/docker-signing
datasource: tables/signing-containers
---

{% include editions.md feature="file_based_signing.docker" %}

## Overview

SignPath supports these technologies for signing container images:

* **[Sigstore Cosign](/documentation/signing-containers/cosign)**: Sign containers using Cosign by Sigstore (a Linux foundation project)
* **[Docker Content Trust (DCT)](/documentation/signing-containers/docker-content-trust)**: Sign containers using DCT, directly supported by the Docker CLI and Mirantis 

## Comparing Cosign and DCT

Both Cosign and DCT use concepts that differ widely from classic code signing methods as used by most platforms. Both follow their individual philosophies and have their specific advantages and shortcomings. We generally recommend the more modern Cosign, but according to your requirements you might prefer DCT. If DCT is a requirement by some customers, you might want to consider using both methods.

### Similarities 

* **No classic Certificate Authorities:** Manual key/certificate trust configuration ("pinning") required
* **Signing items in OCI repositories rather than files:** Signatures are not transferable to other repositories, e.g. in replication scenarios

### Differences 

{%- include render-table.html table=site.data.tables.signing-containers.methods-differences -%}
{: .row-headers }

## Why use SignPath for container signing?

SignPath provides the following advantages:

* You can use the full power of SignPath **signing policies**, including permission, approval, and origin verification
* You can use all **CI integration** features of SignPath
* Configuration and policy management is **aligned with other signing methods**, such as Authenticode or Java signing
* SignPath maintains a **full audit log** of all signing activities including metadata such as the registry URL and signed image tag
* You can **sign multiple images in a single signing request**, making audits/reviews of multi-image releases a lot easier

For _cosign_, there are additional specific advantages:     

* You can **authenticate automated build systems instead of individual developers** and leverage origin verification for CI systems that do not support Cosign workload identities (currently only Github and Gitlab in their SaaS offerings)
* You can use your own key material and **keep your signature data private** without having to operate an own Fulcio certificate authority system

For _Notary v1 / Docker Content Trust (DCT)_, there are additional specific advantages:

* **You don't need to keep the target key** (a powerful key without hardware protection option that you would otherwise need for every new developer)
* **Developers don't need to keep their own delegation keys**
* SignPath controls **signing on a semantic level**, where DCT would just verify signatures on manifest files (i.e. with SignPath, a signing request that claims to add a signature to a specific image and/or label can be trusted to do just that and nothing else)





---
main_header: Documentation
sub_header: Signing Docker images
layout: resources
toc: true
show_toc: 0
description: Documentation for signing Docker containers with SignPath
---

Available for Enterprise and Open Source subscriptions
{: .badge.icon-signpath}

## Overview

There are currently 3 competing technologies for signing Docker images:

* _[sigstore's cosign](https://docs.sigstore.dev/signing/quickstart/)_: A Linux foundation project, primarily developed for the open source community. Documentation on how to use it with SignPath can be found [here](/documentation/docker-signing/cosign).
* _[Docker Content Trust](https://github.com/theupdateframework/notary)_: Part of the standard docker CLI. Documentation on how to use it with SignPath can be found [here](/documentation/docker-signing/docker-content-trust).
* _[Notation](https://notaryproject.dev/)_: Previously known as Notary v2 it is the successor of Notary v1 (Docker Conten Trust). Not yet supported by SignPath.


### Why use SignPath for container signing?

SignPath provides the following advantages:

* You can use the full power of SignPath **signing policies**, including permission, approval, and origin verification
* You can use all **CI integration** features of SignPath
* Configuration and policy management is **aligned with other signing methods**, such as Authenticode or Java signing
* SignPath maintains a **full audit log** of all signing activities including metadata such as the registry URL and signed image tag
* You can **sign multiple images in a single signing request**, making audits/reviews of multi-image releases a lot easier

For _cosign_, there are additional specific advantages:

* You can **authenticate automated build systems instead of individual developers** and leverage origin verification for CI systems that do not support cosign workload identities (currently only Github and Gitlab in their SaaS offerings)
* You can use your own key material and **keep your signature data private** without having to operate an own Fulcio certificate authority system

For _Notary v1 / Docker Content Trust (DCT)_, there are additional specific advantages:

* **You don't need to keep the target key** (a powerful key without hardware protection option that you would otherwise need for every new developer)
* **Developers don't need to keep their own delegation keys**
* SignPath controls **signing on a semantic level**, where DCT would just verify signatures on manifest files (i.e. with SignPath, a signing request that claims to add a signature to a specific image and/or label can be trusted to do just that and nothing else)





---
header: Origin Verification
layout: resources
toc: false
description: Documentation for using Origin Verification in SignPath
datasource: tables/origin-verification
---

{% include editions.md feature="pipeline_integrity.origin_verification" value="optional" %}

Origin verification allows trusted build systems to provide reliable origin metadata with your signing requests, so that SignPath can execute advanced policies based on trusted information. 

Origin verification results in additional confidence for information in signing reqeusts, whether used for inspection or for policies. The feature is designed for use in enterprise scenarios, where policies and security controls need to be administered, enforced and audited centrally, while development teams still maintain full control over their projects. The ultimate goal of origin verification is to enable signing policies based on source code reviews.

{:.panel.info}
> **Open Source code signing**
> 
> The same principles are applied for Open Source signing, where [SignPath Foundation](https://signpath.org) provides certificates to individual OSS projects. Origin verification ensures that the Foundation's signing policies are observed while leaving full control over repositories and build configurations with the OSS teams.

Origin verification verifies the following information:

* **Source code repository URL** as specified in the SignPath **project**
* **Branch** as specified in the **signing policy**
* **Commit version**
* **Build job URL** as provided by the CI system
* **Reproducability** checks that the build process is completely determined by the source code repository

Verification of reproducability depends on the CI system used. Typical verifications include:

* **Build settings** are fully determined by a configuration file under **source control**
* **No manual overrides** of critical build settings in CI system's build job
* **Prevent caching** from previous (possibly unverified) builds

In order to use origin verification, a [Trusted Build System](trusted-build-systems) must be configured and linked to the project.

{:.panel.tip}
> **Use origin verification restrictions**
> 
> Enable additional restrictions for signing policies that use release certificates:
>
> * Select **Verify origin** to make sure that only verified builds can be signed
> * Define source code review policies for branches that are supposed to be used for production releases. Use the **Allowed branch names** setting to make sure that a signing policy can only be used for specified branches. Typical settings include `main` or `release/*`.
> * If you need to be able to sign other builds under special circumstances, consider adding another signing policy with strong approval requirements (e.g. 2 out of *n*).

{:.panel.warning}
> **Source code reviews must include build scripts**
>
> Note that a build script or makefile can download any software from the Internet and include it as a build artifact. SignPath cannot possibly detect or prevent this, but it can make sure that any such evasion will be visible in the source code repository.
>
> Make sure that your source code review policy includes CI configuration, build scripts, and makefiles. External content should not be accepted in reviews.

See the [signing policy](/projects#signing-policy-origin-verification) documentation for some ideas on how to secure your build pipelines using origin verification.

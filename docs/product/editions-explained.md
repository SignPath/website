---
title: Editions
header: Editions and Pricing explained
layout: resources
toc: true
show_toc: 2
description: 'Detailed description of SignPath editions: features and quotas'
hide_nav: true
---

This page explains how the quotas and features of all [SignPath Editions](/product/editions).

## Quotas

### Code signing certificates

#### What is the advantage of Extended Validation (EV) code signing certificates?

EV certificates are considered more trustworthy because they

* they require stricter identity checks by the certificate authority (CA)
* are only issued on secure hardware (USB token or HSM)

**For non-EV certificates, Windows will warn users about new and newly re-issued certificates.**

This does not happen with EV certificates, since they start with full reputation for Microsoft SmartScreen. You will also need EV certificates to sign Windows drivers.

#### What are test certificates used for?

You may create any number of self-signed test certificates and assign them to signing policies. These are used for test-signing your projects.

Test-signing is used to avoid the security implications of release-signing with EV certificates, which 

* to test your signing configuration (especially artifact configurations) without the  (which would be )

### Projects

*Code Signing Starter* and *Code Signing Basic* are priced based on the number of projects you can create in SignPath. Choose the number of projects you need when you buy your subscription, or upgrade later. If you need more than *max. projects*, you need to upgrade to another the subscription type.

We recommend to use one SignPath *project* for each actual software project. 

If your project produces several artifacts, you have these options to handle them with a single *SignPath* project:

* Use deep signing: Sign an installer *and* the files it contains
* Package your artifacts into a ZIP archive: Sign all artifacts that result from a single build job in one step
* Use multiple artifact configurations within one project (not available for *Code Signing Starter*)

### Users

*Code Signing Starter* and *Code Signing Basic* are priced based on the number of active user accounts. Choose the number of users you need when you buy your subscription, or upgrade later. If you need more than *max. users*, you need to upgrade to another subscription type.

User accounts are required for all interactions with the SignPath user interface, including

* manual upload and approval of signing requests
* administration of your SignPath organization and projects
* checking the status of signing requests
* creating reports
* receiving notifications

This quota does not limit the number of CI user accounts or build agents you can use.

### Signing requests

*Code Signing Starter* and *Code Signing Basic* have an upper limit for the number of signing requests.

Included signing requests per year and project:

| Signing policy  | Certificate                                   | Starter | Basic |
|-----------------|-----------------------------------------------|--------:|------:|
| release-signing | Extended Validation (EV) release certificate  |      20 |    50 |
| test-signing    | Self-signed test certificate                  |     100 |   250 |

**Example:** a *Code Signing Basic* subscription with 3 *projects* allows you to complete 

* 150 release-signing requests per year (50 &times; 3) 
* 750 test-signing requests per year (250 &times; 3)

The signing requests quota can be used freely between projects. You may upgrade the available projects of your subscription to get more signing requests per year.

#### How many signing requests will I need?

We recommend that you create one signing request per release of your software. This makes it easier to integrate with CI systems, use security-enhancing artifact configurations, and track your signining requests.

* Consider packing your artifacts into a single ZIP archive for signing
  * if your software consist of multiple artifacts (e.g. several EXE and DLL files)
  * if you produce several variants of your software for each release (e.g. runtime environments, processor architectures, customer variants)
* Consider using [deep signing](#deep-signing) if you produce packages in supported formats such as MSI installers

#### Individual signatures {#individual-signatures}

Each signed file inside a signing request counts towards the individual signatures quota. 

* **Example:** an MSI file containing 1 EXE and 2 DLL files would result in 4 individual signatures. 

You may sign **up to 100 files per *available* signing request** (i.e. the sum of release- and test-signing requests). 

* **Example:** 900 signing requests are available in the previous example (150 + 750). That would result in 900 &times; 100 = 90,000 individual signatures per year.

You can adjust the [artifact configuration](/documentation/artifact-configuration) to specify which files should be signed.

### CI pipelines

*Code Signing Starter*: one CI pipeline at a time. 

*Code Signing Basic*: one CI pipeline per available project at a time.

Additional signing requests submitted from CI pipelines may be rejected and have to be repeated later.

## Signing methods and file types {#file-based-signing}

SignPath directly supports signing various file formats. See [the artifact configuration reference](/documentation/artifact-configuration/reference#file-elements) for details about available signing methods and file types.

### Microsoft Office macros {#office-macros}

{% include editions.md feature="file_based_signing.office_macros" %}

Sign Office macros to protect against macro malware.

With a policy-based code signing process, you can sign your company's Office macros for internal and/or external use. As an immediate benefit, you can disable execution of unsigned macros, thus preventing macro viruses and other macro-based malware deterministically.

See [Office macros](/product/office-macros) for more information.

### XML Signing {#xml-signing}

{% include editions.md feature="file_based_signing.xml" %}

SignPath supports signing XML files using [XMLDSIG](https://www.w3.org/TR/xmldsig-core1/). 

See [artifact configuration](/documentation/artifact-configuration/reference#xml-sign) for details.

### Container image signing {#container-signing}

{% include editions.md feature="file_based_signing.docker" %}

SignPath supports signing Docker container images and tags using cosign and Docker Content Trust (DCT). See [Signing Container Images](/documentation/signing-containers) for details.

### Bills of Material {#sbom-signing}

{% include editions.md feature="file_based_signing.sbom" %}

Sign Bills of Material (BOM) in the [Cyclone DX](https://owasp.org/www-project-cyclonedx/) XML format. This includes

* Software Bill of Materials (SBOM)
* Software-as-a-Service Bill of Materials (SaaSBOM)
* Hardware Bill of Materials (HBOM)
* and others

See this [artifact configuration sample](/documentation/artifact-configuration/examples#sbom-restriction) for details.

## Crypto providers and hash signing {#hash-based-signing}

{% include editions.md feature="hash_based_signing.rest_api" %} 

Use SignPath cryptographic providers with any code signing tool that supports either of these interfaces:

| SignPath Provider                    | Technology/Interface               | Supported Platforms  | Signing Tools
|--------------------------------------|------------------------------------|----------------------|------------------------------------------------
| Key Storage Provider (KSP)           | Cryptography Next Generation (CNG) | Windows              | `SignTool.exe`, `Mage.exe`, `nuget sign`, ...
| Cryptographic Storage Provider (CSP) | Cryptographic API (CAPI)           | Windows              | Same as KSP, legacy tools
| Cryptoki library                     | PKCS #11                           | Windows, Linux       | `jarsigner`, OpenSSL, GPG, RPM, DEB, Maven ...
| CryptoTokenKit                       | Code signigng for Apple macOS, iOS, watchOS, tvOS | macOS | Xcode, `xcodebuild`, `codesign`

Note that with hash-based signing, artifacts are not transferred to and signed by the SignPath application, but locally on the user machine or build agent. The signing operation is always executed synchronously, typically through one of the cryptographic providers listed above.

{:.panel.info}
> **Advanced usage scenarios**
>
> Certain features are not available for hash-based signing with these cryptographic providers. However, they may be used in certain scenarios when directly using SignPath REST APIs. Contact [SignPath Support](/support) for more information.
>
> * [Signing multiple files in a single signing request](/documentation/artifact-configuration/#signing-multiple-files)
> * [User-defined parameters](#user-defined-parameters)
> * [Manual approval](#manual-approval)
> * [Origin verification](#origin-verification)

## Artifact configuration

Artifact configurations define what artifacts to sign and how. They can either simply define the file type, or they can be detailed specifications of complex artifacts that contain other (nested) artifacts. See [setting up projects](/documentation/projects#artifact-configurations) for details.

### Deep signing

Sign installers, packages etc. *and* their content in a single step. See [signing nested artifacts](/documentation/projects#signing-nested-artifacts-deep-signing)

### Multiple versions

{% include editions.md feature="artifact_configuration.multiple_configurations_per_project" %}

Create [multiple artifact configurations](/documentation/projects#keeping-versions-of-artifact-configurations) for

* projects that create different artifact at different times, but you want to use the same signing policies
* artifact configurations that change significantly over time (versioning)

### Metadata constraints

{% include editions.md feature="artifact_configuration.metadata_constraints" %}

You can restrict some [file attributes](/documentation/artifact-configuration/reference#metadata-restrictions) in the artifact configuration. 

This is useful if you want to 

* enforce metadata policies (signed binaries must use consistent publisher metadata)
* avoid unintentional signing of third-party components
* defend against unauthorized signing (while this can be circumvented by aware parties, the attempt is reported and can be investigated)

### User-defined parameters

{% include editions.md feature="artifact_configuration.user_defined_parameters" %}

You can define [parameters](/documentation/artifact-configuration/syntax#parameters) for each signing request. 

Use this to
* create more restrictive artifact configurations
* track arbitrary values across signing requests
* include build-time values 

## Policy enforcement

### Manual approval

{% include editions.md feature="policy_enforcement.manual_approval" %}

Specify that one or more approvals are required before a signing request is processed. 

This is typically used for release-signing. Note that [origin verification](#origin-verification) allows to create secure signing policies without manual approval. 

#### Quorum approval

{% include editions.md feature="policy_enforcement.quorum_approval" %}

You may also specify that a certain number approvals is required (a.k.a. _k-out-of-n_ approval).

See [approval process](/documentation/projects#approval-process) for more information about manual approval.

### Signing policies per project

For *Code Signing Starter* and *Code Signing Basic*, you get two signing policies per project:

* a test-signing policy for testing the signing configuration and signing test builds
* a release-signing policy for signing builds that will be delivered to end users

*Advanced Code Signing* and *Code Signing Gateway* allow to define any number of singing policies per project. You can use this to create policies with different levels of manual and automatic verification. 

Example:

* *test* signing without verification, using a test certificate
* *pre-release* signing with [origin verification](#origin-verification), using a certificate that is recognized by QA devices
* *release* signing with origin verification and a constraint on *release branches* only
* *exception release* signing with origin verification, no branch constraints, but manual approval instead
* *emergency signing* without origin verification, but manual approval with 3 required approvals

See [code signing certificates](#code-signing-certificates).

### Resubmit

{% include editions.md feature="policy_enforcement.resubmit" %}

Resubmit signing requests for signing using different policies and/or certificates.

This can be used to sign _release candidates_ with test certificates at first, and re-sign them with release certificates once they have been tested and approved for release. 

See [signing code](/documentation/signing-code#resubmit).

### Certificate policies

{% include editions.md feature="policy_enforcement.policies_for_certs" %}

Specify that certain validation criteria must be enabled for specific certificates. This enforces these policies for all projects end their respective signing policies.

See [managing certificates](/documentation/managing-certificates).

## Pipeline Integrity

### Origin verification

{% include editions.md feature="pipeline_integrity.origin_verification" value="Optional" %}

When a CI build is submitted to SignPath, certain metadata will be retrieved and verified by SignPath. This includes

* source code repository
* repository branch
* source code commit
* build information

Verification ensures that a person or system with knowledge of the API token cannot simply submit an unauthorized signing request. 

**Origin verification enables the most advanced level of code signing security.** Even without origin verification, SignPath prevents many attack vectors using a combination of authentication and permissions, artifact configurations and constraints, malware scanning, notifications, and auditing. However, as soon as somebody gets access to the CI user token, security cannot be guaranteed. 

Origin verification traces a software build back to the original source code, making it virtually impossible to sign unauthorized code.

For full security, make sure

* that the source code repository is the *single source of truth* for software builds, including build scripts and CI configurations
* that all upstream components are signed by their publishers, and signatures are verified
* that your repository and CI infrastructure is secure

See [origin verfication](/documentation/origin-verification) for more information.

#### Origin-based policies

Specify the *source code repository* for a SignPath project, and (optionally) the *branch* name(s) for a signing policy. This ensures that only software from legitimate builds of these repositories can be signed using this policy.

#### Manual origin verification

When using manual approval on top of origin verification, approvers will have reliable information to base their decisions on. Also, they can be sure that builds will not even be presented for approval if they don't meet the policy requirements.

#### Build validation

For some CI systems, SignPath offers connectors that can validate software builds for security. This ensures that development teams do not use or enable inherently insecure mechanisms in their release build configurations. Insecure practices include caching on build nodes, interactive access to build nodes, ad-hoc build configuration changes and more.
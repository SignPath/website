---
main_header: Documentation
sub_header: Setting up Projects
layout: resources
toc: true
redirect_from: /documentation/key-concepts#projects
---

## Overview

A project in SignPath bundles all settings that are required to sign one or a bundle of artifacts that belong together (e.g. a product). Projects consist of the following parts:

* One or more **artifact configurations** which define how an artifact (or a version of the artifact) is structured, and which parts should be signed as well as the signing methods
* One or more **signing policies** (typically test-signing and release-signing) that are used to declare the rules for signing and specify a certificate
* One or more **integrations** to allow for deeper integration within your build pipeline

## Artifact configurations

At the core of each SignPath project is an artifact configuration. It describes the file type of your artifact and a corresponding code signing method (e.g. an EXE file signed with Authenticode). You can specify **multiple artifact configurations** to allow different **versions** of your software to be signed (e.g. in case the structure of your artifact changes). You can also sign **multiple files** or **complex nested artifacts**.

**Multiple files example:**

* a ZIP archive containing several artifacts that need Authenticode signing

**Nested artifacts examples:** 

* a CAB file containing EXE and DLL files, all of which should be signed with Authenticode
* an MSI installer containing an Office add-in, which in turn contains DLLs
  * the MSI file and the DLLs should be signed using Authenticode
  * the Office add-in has a ClickOnce manifest that requires manifest signing

You can create an artifact configuration by selecting one of the **predefined templates** or by **uploading a sample artifact** which will be analyzed by SignPath. 

In the latter case, you need to manually review the resulting artifact configuration and exclude all 3rd party libraries that you don't want to be signed with your certificate.

For details on how to create, generate or edit an artifact configuration, see [artifact configuration](/documentation/artifact-configuration)

## Signing policies

Signing policies are useful to differentiate between different process restrictions. For instance, you might want to use a test certificate for signing internal releases and use the production certificate only for customer-facing release builds. Signing policies allow you to configure

### General Properties

| Property        | Value |
|-----------------|-------|
| **Certificate** | Select the certificate that will be used to sign the artifact |
| **Submitters**  | Select the users that are allowed to submit an artifact (may be regular or [CI users](/documentation/users#ci-users)) |

### Approval process

Select **Use approval process** if you want to require manual approval for each signing request. This is recommended for release-signing.

| Property               | Value |
|------------------------|-------|
| **Approvers**          | Select the users that are allowed to approve signing requests. They will receive e-mail notifications for each request. |
| **Required approvals** | Set how many approvals are required. Note that a single *deny* will abort the request. (Also known as *quorum* or *k-out-of-n approval*.) |

### Origin verification restriction

Select **Verify origin** if you want to accept only signing requests with positive origin verification.

Requirements: 

* Only CI users may be declared as submitters
* A [trusted build system](#trusted-build-systems) must be configured in the project settings.

| Property                   | Value |
|----------------------------|-------|
| **Project repository URL** | Must be configured in the project settings (applies to all signing policies) |
| **Allowed branch names**   | For release-signing, it is recommended to restrict the signing policy to release branches, such as `master` or `release/*`. This helps to enforce a code review policy for release builds and prevents accidental or intentional release-signing of internal and test builds. |

<div class='panel tipp' markdown='1'>
<div class='panel-header'>Create differentiated signing policies</div>

You can create multiple signing policies with any combination of manual approval and origin verification. Use this to draw a clear line between standard and exceptional procedures.

Here is an example:

| Signing policy name            | Approval             | Origin verification   |
|--------------------------------|----------------------|-----------------------|
| test-signing                   | none                 | none                  |
| release-signing                | none                 | branches: `release/*` |
| release-signing (all branches) | 1 approval required  | branches: `*`         |
| release-signing (manual)       | 2 approvals required | none                  |

In this example, release signing is controlled through the Git repository. Since this is also where reviews happen, it's important to restrict it to branches that are normally used for release builds. 

Approval is required if another branch is used for release signing, but origin verification is still available. Approvers might include project managers or senior team members.

In some situations, it might even be necessary to sign any old release, e.g. via manual upload. This requires approval from two persons, maybe even from a reduced list that includes senior management.

</div>

## Trusted build systems

Trusted build systems are used to provide [origin verification](#origin-verification-restriction) in your build pipeline.

This requires a [CI integration with origin verification support](/documentation/build-system-integration#ci-integrations-with-origin-verification). Currently only AppVeyor is supported.

## Webhooks

Configure Webhooks to notify other systems in your build chain about successful signing requests. See [Webhook notifications](/documentation/build-system-integration#webhook-notifications).
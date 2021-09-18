---
main_header: Documentation
sub_header: Setting up Projects
layout: resources
toc: true
redirect_from: /documentation/key-concepts#projects
description: How to set up development projects for repeated signing with SignPath
---

## Overview

A project in SignPath bundles all settings that are required to sign one or a bundle of artifacts that belong together (e.g. a product). 

Projects consist of these settings:

* [**Artifact configurations**](#artifact-configurations) define the **structure** of an artifact is structured, which parts should be signed, and the respective **signing methods**.

* [**Signing policies**](#signing-policies) are used to declare the **rules and permissions** for signing with a specific **certificate**. A typical project has signing policies for **test-signing** and **release-signing**.

* [**Trusted build systems**](#trusted-build-systems) are specified to add [**origin verification**](#origin-verification-restriction) to your signing requests. <span class="subscription-type">[Enterprise subscriptions]</span>

* [**Webhooks**](#webhooks) provide notifications for build automation.

* [**Project configurators**](#project-configurators) define who is allowed to configure artifact configurations and webhooks. <span class="subscription-type">[Enterprise subscriptions]</span>

## Artifact configurations

At the core of each SignPath project is an artifact configuration. It describes the file type of your artifact and a corresponding code signing method (e.g. an EXE file signed 
with Authenticode). 

### Signing multiple files in one step

An artifact configuration may contain instructions to sign multiple files in a single step. Just put them in a single ZIP archive and specify how each file should b be signed.

### Signing nested artifacts (deep-signing)

It is commonly necessary to sign files *and* files within those files. In this case you want to specify an artifact configuration for deep-signing. SignPath will extract the files and sign them from the inside out, then re-package everything and sign the containing file.

**Examples:** 

* A **CAB file** containing **EXE and DLL files**. Both the CAB file and the executables should be signed with Authenticode
* An **MSI installer** containing an **Office add-in**, which in turn contains **DLL files**
  * the MSI file and the DLLs should be signed using Authenticode
  * the Office add-in has a ClickOnce manifest that requires manifest signing

### Keeping versions of artifact configurations

<span class='badge'><i class='icon-signpath'></i>Available for Basic and Enterprise subscriptions</span>

Create multiple artifact configurations for

* projects that create different artifact at different times, but you want to use the same signing policies
* artifact configurations that change significantly over time (versioning)

Versioning ensures that your SignPath setup will still work for old versions of your artifacts, e.g. if you rebuild or resign an old version. Explicit versioning is only required if the structure of the artifact changes. If you just add files to a package, you might as well just [make them optional](/documentation/artifact-configuration#number-of-matches) (`min-matches="0"`).

If you want to use versioned artifact configurations with CI

* be sure to check the artifact configuration slug into your source code repository, so you can always access the correct version
* when calling SignPath from a build script or CI configuration, specify the artifact configuration slug instead of using the default

### Defining artifact configurations

You can create an artifact configuration by selecting one of the **predefined templates** or by **uploading a sample artifact** which will be analyzed by SignPath. 

In the latter case, you need to manually review the resulting artifact configuration and exclude all 3rd party libraries that you don't want to be signed with your certificate.

For details on how to create, generate or edit an artifact configuration, see [artifact configuration](/documentation/artifact-configuration).

## Signing policies

Signing policies define the rules and permissions for signing and the certificate that will be used. Each signing request must use a specific signing policy. The signing request will then be processed according to this policy.

Typically, a project contains these two singing policies:

* **test-signing** is used for internal builds that will be used for testing. It usually uses a self-signed certificate that is installed on test systems. Since this certificate is typically unknown on customer systems, test-signing often has wide permissions and few restrictions, if any.
* **release-signing** is used for release builds that are shipped to customers and used on production systems. It typically uses a certificate purchased from a public Certificate Authority (CA). Software releases are sensitive and must be done in a secure, controlled and reproducible manner. Therefore, release-signing is often configured with few permissions and additional restrictions.

Both types of policies may alternatively use certificates that are issued by an in-house CA.

<div class="panel tipp" markdown="1">
<div class="panel-header">Why sign test builds?</div>
It's important that test builds are signed, so they will behave like release builds *on test systems*. Several platform mechanisms may be used or inadvertently encountered that behave differently for signed and unsigned software.

Test-signing can also provide protection for test systems, if these systems are configured in a way that prevents installation or execution of unsigned software, or produces warnings for users.
</div>

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
| **Required approvals** | Set how many approvals are required. Note that a single *deny* will abort the request. (Also known as *quorum* or *k-out-of-n approval*.) <span class="subscription-type">[Enterprise subscriptions]</span> |

### Origin verification restriction

<span class='badge'><i class='icon-signpath'></i>Available for Enterprise subscriptions</span>

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

<span class='badge'><i class='icon-signpath'></i>Available for Enterprise subscriptions</span>

Trusted build systems are used to provide [origin verification](#origin-verification-restriction) in your build pipeline.

This requires a [CI integration with origin verification support](/documentation/build-system-integration#ci-integrations-with-origin-verification). Currently only AppVeyor is supported.

From your project configuration, you can link any trusted build system that your SignPath administrator has added.

## Webhooks

Configure Webhooks to notify other systems in your build chain about successful signing requests. See [Webhook notifications](/documentation/build-system-integration#webhook-notifications).

## Project configurators

<span class='badge'><i class='icon-signpath'></i>Available for Enterprise subscriptions</span>

Select the users that are allowed to modify the artifact configurations and webhooks.
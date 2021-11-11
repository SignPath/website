---
main_header: Documentation
sub_header: Signing Code
layout: resources
toc: true
description: How to sign your code using SignPath
---

## Overview

Once your project is set up, you can submit a signing request by either

* Uploading an artifact on the web interface
* Integrating a call to SignPath in your build process
* Re-submitting an existing signing request

## Direct upload

For testing purposes or when you have very infrequent releases, you can choose to simply upload the binary artifact via the web interface.

## Build process integration

We recommend that you integrate SignPath in your automatic CI pipeline. This has several advantages besides just saving tedious work:

* Elimination of error-prone routine activities provides additional security
* Automatic propagation of metadata, such as version numbers, source code version and build
* Origin verification ensures that the signed binary conforms to a specific source code version

SignPath provides multiple ways to be integrated into your pipeline. See the [documentation](/documentation/build-system-integration) for details including information about origin verification.

## Re-submitting an existing signing request

Available for Enterprise subscriptions
{: .badge.icon-signpath}

You can re-submit an existing signing request and specify a different signing policy. This is especially useful when you build a release candidate, and want to postpone the release decision until later.

When compared to just submitting the same artifact again, the new re-submit feature has the following advantages:

* The exact same artifact is being signed that was used for testing
* Any verified [origin information](/documentation/build-system-integration#ci-integrations-with-origin-verification) is still available 
* The original signing request is referenced

### Re-submit parameters

| Parameter      | Value 
|----------------|----------
| Signing Policy | required 
| Description    | optional 
| _all other_    | copied from original signing request

### Permissions and policies

* Permissions and origin verfication are evaluated according to the new signing policy.
* Origin verifcation is evaluated based on the original signing request's origin data. 

This ensures that the integrity of the signing request and artifact are preserved even when fully detached from the actual build process.

### Usage scenario

A typical release scenarios would look like this:

| Step | Actor                              | Condition              | Action
|-----:|------------------------------------|------------------------|---------------------------------------------------------
| 1    | CI system                          |                        | The software is built and submitted for test-signing
| 2    | SignPath                           | test-signing policy    | The software is signed using the test certificate
| 3    | CI system or automatic test runner | tests passing          | A re-submit request is created for release-signing
| 5    | SignPath                           | release-signing policy | Project manager is notified about pending approval
| 4    | Project manager                    | arbitrary              | Approves or denies
| 5    | SignPath                           | approval               | The software is signed using the release certificate

<div class="panel info" markdown="1">
<div class="panel-header">Note</div>

This feature is currently only available via the [REST API](/documentation/build-system-integration#re-submit-a-signing-request) and [PowerShell module](/documentation/build-system-integration#powershell).
</div>
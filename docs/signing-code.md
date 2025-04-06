---
header: Signing Code
layout: resources
toc: true
show_toc: 3
description: How to sign your code using SignPath
---

## Overview

Once your project is set up, you can submit a signing request by either

* Uploading an artifact on the web interface
* Integrating a call to SignPath in your build process
* Resubmitting an existing signing request

## Direct upload

For testing purposes or when you have very infrequent releases, you can choose to simply upload the binary artifact via the web interface.

## Build process integration

We recommend that you integrate SignPath in your automatic CI pipeline. This has several advantages besides just saving tedious work:

* Elimination of error-prone routine activities provides additional security
* Automatic propagation of metadata, such as version numbers, source code version and build
* Origin verification ensures that the signed binary conforms to a specific source code version

SignPath provides multiple ways to be integrated into your pipeline. See the [documentation](/build-system-integration) for details including information about origin verification.

## Resubmitting an existing signing request {#resubmit}

{% include editions.md feature="policy_enforcement.resubmit" %}

You can resubmit an existing signing request and specify a different signing policy. This is especially useful when you build a release candidate, and want to postpone the release decision until later.

When compared to just submitting the same artifact again, the new resubmit feature has the following advantages:

* The exact same artifact is being signed that was used for testing
* Any verified [origin information](/build-system-integration#ci-integrations-with-origin-verification) is still available 
* The original signing request is referenced

### Resubmit via user interface

To resubmit a completed signing request, click the _Resubmit signing request_ button on its details page.

Required permissions: This button is only visible for users with permission to submit a signing request for any of the project's signing policies.

### Resubmit via API

This feature is available via the [REST API](/build-system-integration#resubmit-a-signing-request) and [PowerShell module](/powershell/Submit-SigningRequest#resubmit).

### Parameters

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

<!-- TODO: "trusting the test certificates" should link to /code-signing/test-certificates

A typical release scenarios would look like this:

| Step | Actor                              | Condition              | Action
|-----:|------------------------------------|------------------------|---------------------------------------------------------
|    1 | CI system                          |                        | A release candidate is built and submitted for test-signing.
|    2 | SignPath                           | test-signing policy    | The release candidate is signed using the test certificate.
|    3 | CI system or test tool             |                        | The release candidate is tested. Consider trusting the test certificate on test systems.
|    4 | CI system or test tool             | tests passing          | A resubmit request is created for release-signing.
|    5 | SignPath                           | release-signing policy | Project manager is notified about pending approval.
|    6 | Project manager                    | arbitrary              | Approves or denies based on test results and verified origin data from step 2.
|    7 | SignPath                           | approval               | The release candidate is signed using the release certificate.

Instead of manual approval using SignPath (steps 5 and 6), a release management or workflow system might be used to submit the re-signing request and/or provide the approval using SignPath REST APIs. 
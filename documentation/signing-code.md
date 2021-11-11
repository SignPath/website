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

Depending on your process, you can decide to either 

1. sign the release candidate with a release certificate, then validate and publish it
2. sign the release candidate with a test certificate, then perform additional tests and only when the tests pass, apply the release certificate

For the second option, you want to ensure that

* the release certificate is applied to the exact same artifact that was used for testing
* the [origin information](/documentation/build-system-integration#ci-integrations-with-origin-verification) is still available for the release signing request

In SignPath, this use case is supported by allowing a signing request to be re-submitted with a different signing policy. The artifact is then re-used and the origin information is included in the new signing request. 
_Note: This feature is currently only available via the API and PowerShell module._
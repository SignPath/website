---
main_header: Documentation
sub_header: Signing Code
layout: resources
toc: true
description: How to sign your code using SignPath
---

## Overview

Once your project is set up, you can submit a signing request by either

* Upload an artifact on the web interface
* Integrate a call to SignPath in your build process

## Direct upload

For testing purposes or when you have very infrequent releases, you can choose to simply upload the binary artifact via the web interface.

## Build process integration

We recommend that you integrate SignPath in your automatic CI pipeline. This has several advantages besides just saving tedious work:

* Elimination of error-prone routine activities provides additional security
* Automatic propagation of metadata, such as version numbers, source code version and build
* Origin verification ensures that the signed binary conforms to a specific source code version

SignPath provides multiple ways to be integrated into your pipeline. See the [documentation](/documentation/build-system-integration) for details including information about origin verification.

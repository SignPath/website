---
title: Code Signing - SignPath.io
header: User Guide
layout: resources
toc: true
---

## Overview

A project in SignPath bundles all settings that are required to sign one or a bundle of artifacts that belong together (e.g. a product). Projects consist of the following parts:

* One or more **artifact configurations** which define how an artifact (or a version of the artifact) is structured, and which parts should be signed as well as the signing methods
* One or more **signing policies** (typically test-signing and release-signing) that are used to declare the rules for signing and specify a certificate
* One or more **integrations** to allow for deeper integration within your build pipeline

## Artifact configurations

At the core of each SignPath project is an artifact configuration. It describes the file type of your artifact and a corresponding code signing method (e.g. an EXE file signed with Authenticode). You can specify multiple artifact configurations to allow different versions of your software to be signed (e.g. in case the structure of your artifact changes). You can also sign multiple files or complex nested artifacts, e.g.

* a ZIP archive containing several artifacts that need Authenticode signing
* a CAB file containing EXE and DLL files, all of which should be signed with Authenticode
* an MSI installer containing an Office add-in, which in turn contains DLLs – the MSI file and the DLLs should be signed using Authenticode, while the Office add-in has a ClickOnce manifest that requires manifest signing

You can create an artifact configuration by selecting one of the predefined templates or uploading a sample artifact which will be analyzed by SignPath. In the latter case, you need to manually review the resulting artifact configuration and exclude all 3rd party libraries that you don't want to be signed with your certificate.

For details on how to write an artifact configuration in XML, see the [documentation](/product/documentation/artifact-configuration)

## Signing policies

Signing policies are useful to differentiate between different process restrictions. For instance, you might want to use a test certificate for signing internal releases and use the production certificate only for customer-facing release builds. Signing policies allow you to configure

* which certificate to use to sign the artifact
* who is allowed to submit an artifact
* who needs to approve the request
* whether the origin of the artifact should be verified (only possible with AppVeyor integrations at the moment)

## Integrations

Integrations are an advanced way to integrate SignPath into your build pipeline. Currently, SignPath only offers an integration with AppVeyor which can be used to pull the artifact from the AppVeyor server and allows SignPath to verify its origin (repository URL and commit). For information on how to set up a build integration, see the [documentation](/product/documentation/build-system-integration).




---
main_header: Documentation
sub_header: Managing Certificates
layout: resources
toc: true
description: How to manage code signing certificates in SignPath
---

## Overview

SignPath helps you control access to your code signing certificates. You have to decide how many code signing certificates you need in your organization. Depending on your business model, you might want to use one certificate across your entire organizations or have separate certificates for each project or customer.

## Test and Release certificates

* Use **test certificates** during the development process. You can test your release process and sign every build. Test certificates are not created by a commercial CA and are therefore not trusted by operating systems or browsers. Artifacts that were mistakenly or even maliciously signed by a test certificate cannot affect your users and customers. You can read more about how to roll out and manage test certificates in your infrastructure in the [knowledge base](/code-signing/test-certificates).
* Use dedicated **release certificates** for each published version of your software. SignPath allows you to enforce stricter policies for release certificates.

## Certificate types

With SignPath, you have three options for creating or importing a certificate:

* **Self-signed certificates** are not signed by any certificate authority and therefore not trusted. You can use them for testing your release process.
* **Certificate signing requests (CSRs)** can be created usign SignPath. You can use the CSR to purchase a certificate from a trusted certificate authority (CA). By creating a CSR, you ensure that the private key is created directly on our hardware security module (HSM) and cannot be compromised. This is the recommended way for securing your code signing process.
* **PFX files** can be imported into SignPath. If you already own a certificate, you can simply upload it. However, as your private key may have already been exposed, we recommend to use PFX imports only as a temporary solution.

## Restrictions

SignPath allows you to configure restrictions for certificates. You can, for instance, specify that all signing requests that are using the certificate must be manually approved.

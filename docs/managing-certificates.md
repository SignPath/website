---
header: Managing Certificates
layout: resources
toc: true
show_toc: 3
description: How to manage code signing certificates in SignPath
---

## Overview

SignPath helps you control access to your code signing certificates. You have to decide how many code signing certificates you need in your organization. Depending on your business model, you might want to use one certificate across your entire organizations or have separate certificates for each project or customer.

## Test and Release certificates

* Use **test certificates** during the development process. You can test your release process and sign every build. Test certificates are not created by a commercial CA and are therefore not trusted by operating systems or browsers. Artifacts that were mistakenly or even maliciously signed by a test certificate cannot affect your users and customers. <!-- TODO: You can read more about how to roll out and manage test certificates in your infrastructure in the [knowledge base](/code-signing/test-certificates). -->
* Use dedicated **release certificates** for each published version of your software. SignPath allows you to enforce stricter policies for release certificates.

## Certificate types {#certificate-types}

With SignPath, you have the following options for creating or importing a certificate:

* **Self-signed X.509 certificates** are not signed by any certificate authority and therefore not trusted. You can use them for testing your release process.
* **X.509 certificate signing requests (CSRs)** can be created using SignPath. You can use the CSR to purchase a certificate from a trusted certificate authority (CA). By creating a CSR, you ensure that the private key is created directly on our hardware security module (HSM) and cannot be compromised. This is the recommended way for securing your code signing process. Once issued, you can [upload the certificate](#ca-issued-x509-certificates) to SignPath.
* **PFX-imported X.509 certificates**: If you already own a certificate, you can simply upload it. However, as your private key may have already been exposed, we recommend to use PFX imports only as a temporary solution. (Only available for RSA keys.)
* **GPG keys** are certificates based on the OpenPGP standard, also known as GPG or GnuPG. They can be used to sign arbitrary files using GPG detached signature file. It is also the foundation of many Linux and Open Source signing formats including RPM and Debian package signing.

{:.panel.info}
> **GPG keys and certificates**
>
> {% include editions.md feature="no_display.gpg_key_management" %}
>
> In the world of GPG, certificates are known under various names:
>
> * Certificate or Transferable Public Keys according to [OpenPGP](https://datatracker.ietf.org/doc/html/rfc4880) 
> * GPG keys or GPG public keys in everyday usage (which can be confusing as _public key_ usually means the public part of an asymmetfic cryptographic key pair)
>
> SignPath uses the term _GPG key_ to denote this type of _Certificate_.
>
> These terms all refer to a specific file format that includes the actual public key, the key holder's identity (name and email address), expiration, and other data.
>
> Unlike X.509, GPG does not define a Public Key Infrastructure (PKI) based on Certificate Authoities (CAs). Instead, GPG certificates are usually provided as downloads on a separate channel and/or published on an [OpenPGP Key server](https://en.wikipedia.org/wiki/Key_server_(cryptographic)).

## Restrictions

SignPath allows you to configure restrictions for certificates. You can, for instance, specify that all signing requests that are using the certificate must be manually approved.

## CA-issued X.509 certificates
X.509 certificates issued by a certificate authority (CA) can be uploaded to SignPath.

### Certificate chains

**Publisher certificates** (also know as the leaf certificates) identify the publisher and contain the public key of the key pair that is actually used for signing.
<!-- [Certificate chains](/code-signing/theory#certificate-chains) --> 
**Certificate chains** also contain the issuers of the publisher certificate (often an intermediary certificate, which is in turn issued by a root certificate). They can be complete (from publisher to root) or incomplete.

### File formats and encoding
X.509 certificates can be uploaded in several formats. Some of these formats can only contain the publisher certificate. Other formats can also contain complete or partial certificate chains. SignPath supports the following formats:

| Format        | Common extensions       | Content                      
|---------------|-------------------------|------------------------------
| PEM           | `.pem`, `.cer`          | Base64-encoded certificate(s). Multiple certificates are simply appended.
| DER           | `.cer`, `.crt`, `.der`  | A single certificate in binary format.
| PKCS#7 (CMS)  | `.p7b`                  | A collection of certificates, wrapped in a PKCS#7 structure.

### Uploading certificates
When a publisher certificate or a partial certificate chain is uploaded, SignPath tries to complete the certificate chain using publicly available information. This usually works well for certificates issued by commercial Certificate Authorities. For private certificates issued by private PKIs, we recommend uploading the entire certificate chain.

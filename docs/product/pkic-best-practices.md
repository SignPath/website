---
header: PKI Consortium Best Practices for Code Signing
layout: resources
toc: true
description: Mapping SignPath features to the code signing recommendations of the PKI Consortium
---

The [PKI Consortium](https://pkic.org/) (PKIC, formerly known as CA Security Council) is a consortium of several [PKI](https://en.wikipedia.org/wiki/Public_key_infrastructure)-related organizations. One of its goals is to advance code signing practices in the industry. The PKI Consortium has released a [white paper](https://pkic.org/uploads/2016/12/CASC-Code-Signing.pdf) that contains several best practices for code signing.

This is good and valuable advice, and SignPath.io supports these recommendations. However, it can be quite difficult and expensive to set up and repeatedly execute a code signing process that meets these criteria. If you use SignPath, it will take care of these recommendations for you. (SignPath organization administrators will be able to opt out of some security practices.)

This page outlines how SignPath ensures that these recommendations are fulfilled.

## Overview

| PKIC recommendation                                                   | SignPath compliance |
|-----------------------------------------------------------------------|---------------------|
| 1. Minimize access to private keys                                    | **[Automatic][1]**  |
| 2. Protect private keys with cryptographic hardware products          | **[Automatic][2]**  |
| 3. Time-stamp code                                                    | **[Automatic][3]**  |
| 4. Understand the difference between test-signing and release-signing | **[Automatic][4]**  |
| 5. Authenticate code to be signed                                     | **[Automatic][5]**  |
| 6. Virus scan code before signing                                     | **[Automatic][6]**  |
| 7. Do not over-use any one key                                        | **[Optional][7]**   |

## Detailed recommendations

[1]: #1-minimize-access-to-private-keys

### 1. Minimize access to private keys

**Automatically fulfilled when using SignPath.**

> SignPath stores keys on hardware security modules (HSMs) and strictly limits access to those based on authentication, rules, permissions and approvals.

| PKIC recommendation details                                         | Compliance    | Remarks |
|---------------------------------------------------------------------|---------------|---------|
| Allow minimal connections to computers with keys                    | **Automatic** | No computers (including SignPath.io servers) can read HSM-based keys. Authorized build agents are authenticated before submitting signing requests.
| Minimize the number of users who have key access                    | **Automatic** | No users (including SignPath.io administrators) can read HSM-based keys. Authorized users are authenticated before submitting signing requests.
| Use physical security controls to reduce access to keys             | **Automatic** | Access to HSMs is restricted to dedicated SignPath.io servers that execute fully authorized signing requests.

[2]: #2-protect-private-keys-with-cryptographic-hardware-products

### 2. Protect private keys with cryptographic hardware products

**Automatically fulfilled when using SignPath.**

> Keys for release signing are stored on a hardware security module (HSM) by default.

| PKIC recommendation details                                                                              | Compliance    | Remarks |
|----------------------------------------------------------------------------------------------------------|---------------|---------|
| Cryptographic hardware does not allow export of the private key to software where it could be attacked   | **Automatic** | SignPath always creates HSM-based keys as *non-exportable*.
| Use a FIPS 140 Level 2-certified product (or better)                                                     | **Automatic** | SignPath.io uses SafeNet Luna Network HSMs [validated][luna fips] for FIPS 140-1 and FIPS 140-2 Level 3, and certified for Common Criteria (ISO/IEC15408).
| Use an EV code signing certificate which requires the private key to be generated and stored in hardware | **Automatic** | SignPath will create a certificate signing request (CSR) from your HSM key. Use this CSR to purchase a certificate from any Certificate Authority. While this is required only for EV certificates, SignPath ensures the same security for normal (OV) certificates.

[3]: #3-time-stamp-code

### 3. Time-stamp code

**Automatically fulfilled when using SignPath.**

> All signatures will be counter-signed with SHA256 time stamps by a reliable time stamping server.

| PKIC recommendation details                                                                | Compliance    | Remarks |
|--------------------------------------------------------------------------------------------|---------------|---------|
| Time-stamping allows code to be verified after the certificate has expired or been revoked | **n/a**       | *(informational)*

[4]: #4-understand-the-difference-between-test-signing-and-release-signing

### 4. Understand the difference between test-signing and release-signing

**Automatically fulfilled when using SignPath.**

> This is what SignPath [signing policies](/documentation/projects#signing-policies) are all about. While projects contain all information required for signing a specific artifact, only signing configurations will allow your projects to be signed using any given certificate.
>
> SignPath advises you to create at least one signing policy for test-signing and one for release-signing.

| PKIC recommendation details                                                                             | Compliance    | Remarks |
|---------------------------------------------------------------------------------------------------------|---------------|---------|
| Test-signing private keys and certificates requires less security access controls than production code signing private keys and certificates | **Automatic** | Signing policies for test-signing and release-signing have different permissions and approval requirements.
| Test-signing certificates can be self-signed or come from an internal test CA                           | **Guidance**  | Create a self-signed certificate from the setup wizard, or create a CSR for an in-house CA.
| Establish a separate test code signing infrastructure to test-sign pre-release builds of software       | **Guidance**  | SignPath.io allows you to use dedicated credentials and build agents for each signing policy. We recommend to share the essential build configuration in order to avoid confusion and configuration errors.

[5]: #5-authenticate-code-to-be-signed

### 5. Authenticate code to be signed

**Automatically fulfilled when using SignPath.**

> Signing requires a signing policy and authenticated signing requests. Release-signing additionally requires authenticated approvals.

| PKIC recommendation details                                                                                     | Compliance    | Remarks |
|-----------------------------------------------------------------------------------------------------------------|---------------|---------|
| Any code that is submitted for signing should be strongly authenticated before it is signed and released        | **Automatic** | Signing request must be submitted from authenticated users or build agents.
| Implement a code signing submission and approval process to prevent the signing of unapproved or malicious code | **Automatic** | Define submission and approval permissions per signing configuration.
| Log all code signing activities for auditing and/or incident-response purposes                                  | **Automatic** | All activities including submission and approval (or denial) are logged and easily accessible from the user interface. Also, submitted and signed code is retained for later use including auditing, incident response, forensics, and re-signing. (Retention period depends on subscription type.)

[6]: #6-virus-scan-code-before-signing

### 6. Virus scan code before signing

**Automatically fulfilled when using SignPath.**

> Every signing request will be scanned for malware first.

| PKIC recommendation details                                               | Compliance    | Remarks |
|---------------------------------------------------------------------------|---------------|---------|
| Code Signing does not confirm the safety or quality of the code; it confirms the publisher and whether or not the code has been changed | **n/a** | *(informational)*
| Implement virus-scanning to help improve the quality of the released code | **Automatic** | *See above*

[7]: #7-do-not-over-use-any-one-key-distribute-risk-with-multiple-certificates

### 7. Do not over-use any one key (distribute risk with multiple certificates)

**Using multiple release certificates is optional with SignPath.**

> SignPath allows you to configure any number of certificates at any given time. (Available HSM key storage capacity depends on your subscription type.)

{:.panel.tip}
> **Do a cost/benefit analysis**
>
> Buying multiple EV certificates can be costly. On the other hand, non-EV certificates will always start with zero [SmartScreen](https://en.wikipedia.org/wiki/Microsoft_SmartScreen) reputation.
> 
> We recommend that you consider buying separate certificates for major product lines, teams or customers. However, you can have a perfectly secure code signing process with a single release certificate.

| PKIC recommendation details | Remarks |
|-----------------------------|---------|
| If code is found with a security flaw, then publishers may want to prompt a User Account Control dialog box to appear when the code is installed in the future; this can be done by revoking the code signing certificate so a revoked prompt will occur | SignPath puts you in a good position in case you have to revoke a certificate: All signatures have a valid time stamp, so only signatures from *after* the revocation date will be invalid.
| If the code with the security flaw was issued before more good code was issued, then revoking the certificate will impact the good code as well | SignPath lets you re-sign individual releases that were involuntarily affected by revocations.
| Changing keys and certificates often will help to avoid this conflict | This is true, but it will only reduce the problem in some situations. If you discover a security flaw shortly after the incident, chances are that you will still be using the same key and certificate.

---
title: Code Signing - SignPath.io
header: Knowledge Base
layout: resources
toc: true
---

## Purpose

Installing and updating software is arguably the most vulnerable activity from a security perspective. While anti-malware software can mitigate some well-known risks, it can never provide full protection. Since even a single successful attack is enough to take over a user account, a computer or even a network, it is imperative that only software from trusted sources is installed on user devices and servers.

Code signing is used to indicate and verify the publisher of software programs and make sure the software has not been modified after publishing.

Code signing can provide the following security assertions:

* **Authentication:** who signed the code
* **Integrity:** the code cannot be changed undetected
* **Non-repudiation:** the original signer cannot deny having signed the file

(Note that these assertions are made based on certificate authority practices, publisher practices and cryptographic methods. This does not imply a legal guarantee.)

On a higher level, the objective of code signing is to provide evidence that software does not impose security threats to users and systems executing it:

* **Trust:** Organizations and persons must undergo an identification process with a certificate authority, so one could assume *a smaller likelihood of criminal intent*. Using the information about the publisher’s identity, users can make *educated decisions* about whether to install and execute a specific program, and system administrators can define *security policies* that will be enforced, allowing only trusted programs to execute or gain elevated permissions.
* **Virus prevention:** Cryptographic signatures can guarantee that no alteration, such as a virus infection, has taken place *after* the publisher has signed it.
* **Update safety:** Through certificates, updates can be verified to be published by the original publisher.
* **Persistence:** Modern code signing techniques deliver the signature with the software, so it can be verified at any time independently from the delivery mechanism.

## Implementation

Code signing uses public key cryptography for signing and verification, in a way very similar to e-mail and PDF file signatures. Publishers are identified using certificates they purchase from trusted certificate authorities, much like HTTPS certificates.

Code signing certificates always identify legal entities such as businesses, educational institutions and government agencies, and sometimes individual persons.

Today, code signatures are considered by most operating systems, web browsers, development platforms, add-in systems, app stores, anti-malware utilities and some enterprise management software. There are specific code signing methods for different file formats, and systems vary in how they check signatures and what effect they have.

For instance:

* Before Windows executes a downloaded file, it looks for a signature and validates it. If the file has a valid signature, Windows SmartScreen will assert the file's reputation based on the certificate.
* When a program tries to modify a user's system, Windows User Account Control (UAC) will display a warning that informs the user about the software's publisher.

Other platforms have different methods for signing and verification, some of them are also listed in this guide.
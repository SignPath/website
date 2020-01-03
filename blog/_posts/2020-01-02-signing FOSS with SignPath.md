---
layout: post
title:  "SignPath offers attested code signing for FOSS projects"
image: '2019-12-13-bg'
date:   2020-01-02 12:00:00 +0100
author: Stefan Wenig
summary: '2/2: ############### TBD #######################.'
---

# SignPath offers attested code signing for FOSS projects

This is part two of a two-post series about Free and Open Source Software (FOSS) and code signing. 

[Part one](/blog/2020/01/01/open-source-code-signing.html) examined how distributing binary builds undermines the fundamental virtues of FOSS and code signing is necessary, but cannot solve the basic problems. We also looked at the lack of code signing certificates for the FOSS community.

This part presents our solution: 

* **Attested signing** by [SignPath.io](https://about.signpath.io) ensures that signed binaries are actually built from published source code 
* [SignPath Foundation](https://about.signpath.io/Foundation) provides **free certificates** for community projects 

## Introduction

We believe that the situation described in [part one] is unsustainable and propose a solution. It consists of three pillars:

* A system that can verify if a distributable package is a true representation of the public source code
* Cryptographic signatures for verified packages
* Free certificates for FOSS projects that target platforms that require identity verification by Certificate Authorities (e.g. Windows, Java)

SignPath.io is a code signing platform that allows software publishers to define and enforce policies for their software teams. SignPath Foundation provides free certificates to FOSS projects that are willing to create their software packages in a way that allows this verification to take place.

This solves several problems:

* For FOSS projects, as for large organizations, code signing is a difficult matter. It involves many challenges: understanding the various signing domains (X.509, PGP, TUF), a multitude of tools and formats, platform policies, key security, and processes. Trying to solve all these issues in an ad-hoc manner is time-consuming, error-prone, and always a security risk. 

## Purpose and capabilities of SignPath 

We developed SignPath to make code signing easier, more transparent, more secure, and subject to policy control for software vendors. 

    For commercial software vendors and non-profit organizations alike, ensuring secure build processes and secure code signing chains is not an easy task. Many struggle to achieve some security and oversight. And even for those who try hard, there are always loopholes that are hard to identify and even harder to close.


FOSS code signing builds on the following features of SignPath.io:

* **Origin verification:** SignPath connects the dots between (reviewed) source code and (compiled) packages. An organization can restrict the use of certificates and secret keys to trusted builds of certain source code repositories. This eliminates the need to trust the build chain of every single project, and security reviews can finally focus on the source code. By restricting release certificates and keys to release branches, strict review policies can be limited to those.
* **Deep artifact inspection** ensures that components are only signed if they match the specification. This includes verification of signatures of upstream components. (Note that we recommend additional verification on the level of package-management since package signatures often cannot be verified at later stages.)
* **Manual approval** may be required by policy, in addition to or instead of origin verification. If used as an addition, approvers get the choice of approving or denying the signing of a specific, verified version of the software. 
* **Virus scanning** prevents signing of components with identifiable virus signatures or behaviour.
* **Secure key storage** on FIPS 140-2 level 3 hardware guarantees that secret keys cannot be copied or removed. Policy enforcement guarantees that they cannot be misused for anything but defined processes, and full auditing is provided on a level that is meaningful to auditors. The software was created using a security-first development process and is hosted on a hardened environment on Microsoft Azure with several active security measures. Internal and external security testing on all levels further strengthens resilience even to sophisticated attacks.

### SignPath Foundation

The purpose of SignPath Foundation is to provide certificates for FOSS projects. Unlike most Open Source foundations, we do not focus on a specific technology, platform, license, type of software or greater goals. We also do not require projects to follow any kind of style guide, code of conduct, decision making rules, or any process. 

However, some technical criteria must be met, and a few rules must be followed in order to fulfill the single goal of SignPath Foundation: Make sure that code signing increases everybody's security, and prevent misuse of certificates. 

### FOSS Certificates

FOSS projects that require X.509 certificates can apply for those with SignPath Foundation. For these projects, SignPath Foundation will act as the publisher. 

All of SignPath.io’s policy enforcement features mentioned above will be combined to make sure that signed packages

* are built from the specified source code
* are approved by the project’s maintainers
* do not contain known malware

SignPath Foundation will issue certificates depending on the nature of the project:

* **Executables and installers:** For packages that can be executed on users’ systems, SignPath Foundation will verify the project’s reputation. This certificate program is not open to everyone: new or obscure OSS projects might be rejected. Under the current certificate regime, it is not possible to grant the level of trust that comes with CA-issued certificates to anybody, as this would undercut the effectiveness of security mechanisms such as Windows SmartScreen or User Access Control (UAC). (Projects may still use SignPath.io with their own certificates.)
* **Components and libraries:** For packages that can only be used by other software developers, such as program libraries, SignPath Foundation will not verify the project's reputation. Rather, we assume that developers consuming these components will verify the reputation of these components and their respective maintainers themselves. SignPath.io will still perform all automatic verifications, so developers need only trust the source code, not shipped binaries.

Additional rules that must be followed by FOSS projects: 

* publish a code signing policy
* publish a privacy policy (for code that communicates with predefined services)
* ask for consent for system modifications
* do not exploit security vulnerabilities

Failure to comply with these rules may result in immediate revocation of all issued certificates. 

SignPath Foundation will issue individual X.509 certificates for participating projects. The organization name on each certificate will be SignPath Foundation (Delaware). Projects will not have direct access to signing keys.

### Conditions for free use 

Use of SignPath.io and X.509 certificates are free for community projects that use OSS licenses. Projects sponsored by Organizations or using commercial dual-licensing are not eligible for free use. OSS foundations, educational institutions, and other non-profit organizations may qualify for discounts.

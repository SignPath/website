---
layout: post
title:  "Code signing for Free and Open Source Software is important, but also difficult"
image: '2019-12-13-bg'
date:   2020-01-01 12:00:00 +0100
author: Stefan Wenig
summary: '1/2: Distributing binary packages undermines the fundamental promises of FOSS, endangering both FOSS and non-FOSS software; getting code signing certificates for FOSS.'
---

This is part one of a two-post series about Free and Open Source Software (FOSS) and code signing. 

This part examines the following issues:

* Distributing privately built binary builds undermines the fundamental promises of FOSS &ndash; it assumes full trust in far too many people. While code signing can prevent other problems, it cannot solve the specific problems of binary FOSS.
* Virtually all modern software is built on top of existing FOSS components. Therefore, security problems with FOSS components affect the whole software industry.
* It is too hard to acquire code signing certificates for FOSS projects.

[Part two](/blog/2020/01/02/signing-FOSS-with-SignPath.html) will explain how **attested signing** by [SignPath.io](https://about.signpath.io) solves the trust problem, and announce that [SignPath Foundation](https://about.signpath.io/Foundation) provides **free certificates** for community projects.

## Why is code signing for FOSS important?

### Abstract

It’s 2020, and [Free and Open Source Software](https://en.wikipedia.org/wiki/Free_and_open-source_software) (FOSS) is now the benchmark for security in software. While openness does not guarantee the absence of backdoors or defects, they are easier to spot, and usually corrected quickly. We’ve come a long way from [security through obscurity].

Also, it’s 2020, and we’re still trusting binary code published by strangers on the Internet, often without knowing it.

How do these observations go together? 

The processes and techniques of FOSS do not automatically extend to software delivery, especially outside pure FOSS ecosystems like Linux. A FOSS project’s source code is available for review, but at the same time, it’s difficult or outright impossible to verify that a binary package you just downloaded is actually the result of this same source code. 

The problem is amplified by the fact that FOSS components are used by virtually every software product and project under the sun. The result is that unverified code, often in binary form, is distributed to user and customer systems, from home PCs to hardened corporate server environments. This fact is often obscured by indirect usage.

### Code signing introduction

Proprietary software and FOSS have always had very different approaches to security and reliability.

Proprietary software vendors ask you to trust them, and you usually don’t get to review their source code. But they have professional development teams and processes and follow their own security policies. Hopefully, they have strict internal code reviews and a secure build process that turns the source code into an installation package. Vendors stand with their names for the security of the software they publish.

Back in the day, you had to trust the original installation media, sometimes protected with some kind of forge-proof seal. Later, when software started being distributed over an increasingly hostile Internet, it was cryptographically signed. And it still works like this: 

* The software vendor has its legal identity verified by a trusted **Certificate Authority (CA)**, which then issues an **X.509 certificate** that connects the publisher's identity to a key pair.
* The software publisher uses the **private key** to **sign** the software. (Only the vendor has this private key.)
* The operating system will then accept the CA’s identity assertion for the vendor, and use the **public key** to **verify** the vendor’s signature. (The public key is part of the certificate.)

A positive verification tells us two things:
* **Authenticity:** Who published the software
* **Integrity:** It hasn’t been modified since 

This is the digital version of the forge-proof seal.

### Unsolved issues of FOSS authenticity

But what does authenticity mean for FOSS? Who is this publisher, and why should we trust them?

This hints at a mismatch between code signing and the fundamental principles of FOSS. 

FOSS code is open for everyone to review, and "given enough eyeballs, all bugs are shallow" as the famous quote by Eric S. Raymond goes. Maintainers and contributors, code-literate users, security experts, and bounty hunters will hopefully review every line of code and spot every security problem. The wider a package is used, the better the chances are that this works. This is the foundation of FOSS security. Without it, we are back to trusting strangers on the Internet.

All should be good and well if you just download the source code from the official code repository (e.g., from GitHub) and build the binary code on your own machine. But this is not what most people do.

Applications are usually installed from binary packages. This means that someone else used a compiler to turn the source code into binary executable files, and created a package with these files. But it is all but impossible to verify that this is what actually happened. The person building the package might have made a mistake, or not be trustworthy to begin with.

But is this enough? Who is in charge of the secret key used for signing? Unlike the source code, it cannot be openly shared, or it would be useless. Somebody must own the key and be trusted with signing. When a company or foundation publishes FOSS software, they can step in and provide secure processes and policies, much like a proprietary software vendor. For example, if you trust the Mozilla Foundation to securely build and sign Firefox installation packages, you can assume that a Mozilla signature guarantees a proper build from the public source code.

<div class='panel warning' markdown='1'>
<div class='panel-header'>Non-binary distributions</div>

The problem does not only apply to code that is distributed in binary form. Even software packages for some interpreted languages must be compiled first (e.g., TypeScript to JavaScript) or otherwise prepared using a build script. But even if a package consists of exactly the same contents as the source code repository: as soon as the code is separated from its repository, it might be modified, so we still need to worry about authenticity and integrity. 

</div>

### Trusting source code vs. trusting people

The majority of FOSS projects is not maintained by some foundation, but by a community of individuals. Some of them might work for other organizations and even maintain the project as part of their job, but they are still acting as individuals. But who gets the private key now? Who builds the software and signs it? Is the key distributed among several people? Why do they trust each other, and does this mean you trust them too? 

Many things can go wrong here. For one, the code has to be built somewhere safe. An OSS developer’s machine might be hacked or infected with a virus. A professional environment would provide secured build servers, but how many FOSS projects have access to those? They might use a public service to build their packages, but there’s no guarantee, and even then, it’s a mess. How do they provide access to their keys to this service? It is difficult when the secret key is on a disk. It’s impossible if the secret key is on a secure hardware token. Or maybe they only sign the whole package in a final manual step? That’s prone to errors, and doesn’t work for many scenarios. (E.g. when files within a package must be signed too.)

In short, it’s complicated, and mistakes are inevitable. And all of this is assuming that nobody deliberately betrays your trust.

<div class='panel info' markdown='1'>
<div class='panel-header'>Disclaimer: platform variety and X.509</div>

Code signing methods are manifold and often confusing. While they all share the purpose of ensuring authenticity and integrity in some way, the technical implementations differ as wildly as the procedures and underlying assumptions. So every general statement about code signing must be considered with a grain of salt. 

* Windows, macOS and iOS, Android and Java** use X.509 certificates. Microsoft is notorious for using a variety of code signing methods and formats for their various products and technologies. 
* Linux distributions** usually rely on certificate-less PGP signatures or SHA-2 hash codes printed on download pages, but there's not a single consistent code signing architecture or automatic verification mechanism. 

This discussion is written from an X.509 perspective on code signing. That said, the basic trust problems remain the same for all platforms.

All popular operating systems have an official central distribution mechanism, such as Apple's App Store or Linux repositories. Of these, only Linux repositories tend to have a process that aims to ensure authenticity of FOSS builds. But even there, eventually all trust is put into individuals who build the packages on their personal computers and upload them. And none of this adresses the problem of upstream trust, which we will discuss in the next section.

</div>

### The threat of upstream dependencies: supply-chain attacks

These days, few programs are built from scratch. Even moderately complex applications use FOSS components for standard tasks. And more often than not, these components build on other components. The components an application builds on, also known as "upstream", are as critical to the applications security as the application code itself.

This affects FOSS programs, commercial programs and custom-built solutions equally. A typical line-of-business (LOB) application has hundreds or even thousands of direct and indirect upstream dependencies. Most of them are FOSS components. An attacker would only have to insert themselves into one of those to insert malicious code into the application. 

This is how [supply-chain attacks](http://localhost:4000/code-signing/media-coverage/#supply-chain-attacks) work, and they are becoming a bigger threat each year.

<div class='panel info' markdown='1'>
<div class='panel-header'>Package managers</div>

Upstream dependencies are often managed through package managers. Unfortunately, most of them don't support code signing. 

The notable exceptions are: 

* .NET: [Nuget Gallery](https://nuget.org) signs every package with a Gallery signature. Additionally, publishers can sign each package with their own certificates, and users can create publisher policies, but this is not yet widely used.
* Java: [Maven Central](https://central.sonatype.org/) requires PGP-based signatures, but it's up to every developer to create a build chain that actually verifies them. Standard Java Archive signatures are not used by Central.

</div>

### Conclusion

Sometimes you will find a signature on FOSS software you’re using. But even then, it’s hard to know whether all the code in the package has been built from trusted source code. For any reasonably complex system, it’s almost safe to assume that this cannot be assured. A dedicated attacker would just have to find a single weak link, and even in the absence of such an attempt, mistakes happen.

Today’s manifold and complex code signing systems cannot protect us effectively in times of FOSS popularity, distributed responsibilities, and componentized architectures. We need to do better.

## Certificate availability

There is an additional problem for FOSS projects that target platforms with X.509 code signing policies, such as Microsoft Windows or Java: if they are not maintained by a company or foundations, one of the maintainers will have to buy a personal certificate from a CA. 

This is expensive and time-consuming. CAs increasingly refuse to give out code signing certificates to individuals, and when they do, it's usually in the form of secure hardware token, which in turn leads to some of the problems mentioned above. OSS projects will only go through this ordeal if they really have to, i.e., if the platform warns users about unsigned software. This is usually not the case for libraries and other software components, so those are left unsigned.

Read about SignPath's proposed solution for these issues in [part two](/blog/2020/01/02/signing-FOSS-with-SignPath.html) of this blog post series.
---
layout: post
title: "Why Code Signing is the Missing Link in DevSecOps"
image: '2024-09-09-bg'
date: 2024-09-10 08:00:00 +0000
author: Paul Savoie
summary: "As software supply chains grow ever more complex, we can no longer blindly trust software components in our pipelines. To stay safe, we must always verify."
description: "description"
---


# From Implicit to Explicit: Why code signing is the missing link in DevSecOps

"Trust, but verify": this is a well-known proverb that defined the Cold War era. Today, these powerful words alone could be used to describe the philosophy behind the security of the world's digital infrastructure, from satellites to web browsers.

Thanks to modern cryptographic techniques, especially asymmetric key encryption, we can ensure the integrity and authenticity of billions of website visits and software downloads worldwide. Users don't can remain blissfully unaware of the behind-the-scenes process to benefit from it -- a hallmark of great security. This invisible protection works silently to keep our digital interactions safe and trustworthy.

However, there's an inconvenient truth for us software professionals who see how "the sausage is made": when it comes to assembling software for professional use, the benefits of modern crytography, in the form of code signing, prove to be the exception rather than the rule.

In this blog post, I want to emphasize the importance of explicitly establishing trust in our software supply chains. As more DevSecOps initiatives launch to build a more resilient global digital infrastructure, we can no longer justify trusting without verifying the software components in our pipelines.

## Why DevSecOps Needs Code Signing

Today, the importance of protecting supply chains cannot be overstated: Gartner predicts that by 2025, 45% of organizations worldwide will have experienced attacks on their software supply chains (a three-fold increase from 2021). The reason is straightforward: with the rise of DevOps and open source, software supply chains have rapidly grown more complex. This has created an attack surface that is not only much larger but also harder to measure and, in many cases, beyond direct control.

Code signing has long been a pillar of IT security. Yet applications have grown in complexity. Applications often consist of hundreds or even thousands of components. Such complexity makes code signing seem almost impossible. Many administrators find that the limited guarantees of incomplete verification simply aren't worth the hassle.

Where it is in use, code signing often occurs too late in the development cycle to be of much use. Typically, DevOps teams only sign the final, assembled software build before delivery. Even worse, software is often signed without any mechanism in place to verify the signature!

There are many drivers behind lack of adption, including limited awareness, budget constraints, and competing priorities. The challenge is reminiscent of the problem DevSecOps was created to address: by integrating security and development throughout the entire process, we can ensure that security becomes an integral part of the software lifecycle rather than an afterthought.

So why isn't code signing integrated in the same way as other DevOps tools?

Code signing is the only surefire way to guarantee that pipelines haven't been tampered with, and that they produce the expected output. It's time we raise the bar to ensure the integrity of entire build pipelines instead of beefing up each individual step (code, build, deliver) separately.


## The Problem with Traditional Code Signing

Code-signing means attaching a digital certificate to software. Traditionally, within a Public Key Infrastructure (PKI), a certificate authority (CA) verifies the developer's identity and adds its public key to the certificate. The developer then hashes the source code, encrypts the hash (digest) with their private key, and combines this with the certificate and hash function to create a signature block. This block is then inserted into the software, completing the code-signing process.

The problem with this process arises when the build environment grows more complex and dynamic:

- In DevOps, build pipelines involve many steps that require careful verification. Third-party dependencies need thorough vetting before approval. Securing continuous integration (CI) systems is already a challenge for DevOps engineers who must balance security and velocity. Imposing traditional code signing can seem impractical, if not impossible.
- Code signing solutions must be selective about what they accept to sign. They can't simply sign anything presented to them. Instead, they need to verify that each signature request is valid and comes from a trusted source, following a specific set of rules.
- As more developers need permission to sign software, encryption keys must be both accessible and carefully safeguarded. Key management is a huge challenge in itself: code signing must use keys that are protected on hardware. So-called hardware signing modules (HSMs) were simply not designed to support modern CI/CD pipelines, which require flexibility and agility.

In short, traditional code signing demands complex security infrastructure, often beyond the capacity of all but the largest organizations teams to handle. For this reason, code signing adoption by DevSecOps teams has lagged other software supply chain security capabilties, such as software composition analysis (SCA).

But source code integrity and trusted build systems don't have to be daunting. Let's explore a few simple, pragmatic solutions.

## How SignPath Brings Code Signing to DevSecOps

At SignPath,our mission is to relentlessly simplify and abstract the complexity out of code signing infrastructure.  The result is automated, authenticated builds that eliminate friction from the development process, while significantly improving software supply chain security. Our robust and flexible mechanism is a natural fit for modern CI/CD pipelines and software development practices.

We created a solution that enables teams to:

- Neatly integrate code signing into your existing CI/CD pipelines: we enable fully automated code signing workflows. Our solution eliminates many maintenance headaches by avoiding cumbersome ad-hoc scripts that need to securely handle cryptographic providers and tools. Metadata from the CI system can easily be attached to signing requests, providing additional context. This allows you to know exactly what got signed and enhances transparency.
- Deep sign software packages: we allow enable to sign multiple artifacts—such as executables, packages, SBOMs, or files within packages—in a single request. This feature is particularly useful when both application files and the package (or installer) require signing, which often creates a challenging dependency between the build process and the code signing process.
- Centrally manage signing policies: organizations can define comprehensive, fine-grained signing policies in a central location. These policies control permissions, approvals, and origin verification, ensuring every signing operation follows strict security guidelines. Regardless of the tech stack, build process, or signing methods used, all rules are declared in a single location.

As a result, you gain strong cryptographic assurance that every software release:

- Can be comprehensively traced back to a specific source code version
- Meets all policy requirements, including those for reviews and testing
- Originates from secure infrastructure that resists tampering, from within or without

## Wrap Up

Software supply chain attacks are on the rise. It's time to raise our collective standards and apply the same security mantra when building software as when we deliver it: trust but verify, making the implicit explicit.

By making code signing an intrinsic part of the DevSecOps framework, organizations can significantly reduce the risk of tampering, ensure compliance, and build resilient software supply chains.
Thanks to its years of experience implementing code signing into the most complex infrastructure, SignPath is proud to play a unique role in bringing code signing to DevSecOps.

To experience the distinctive advantages SignPath offers, [Request a Demo](https://forms.gle/sAHSsxgASx2BYPzc9) today.
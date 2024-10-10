---
layout: post
title: "The Misconception of Integrity as Quality"
image: '2024-09-09-bg'
date: 2024-10-08 08:00:00 +0000
author: Stefan Wenig
summary: "Code integrity and code quality: Two concepts that are often used interchangeably. That's not only inaccurate, but also potentially harmful."
description: "description"
---


# The Misconception of Integrity as Quality: A Perspective on Definitions and Misuses


I'm seeing far too many sources conflating the concepts of “code integrity” and “code quality”. As the founder of a startup that provides a code integrity platform, I see this as a problem! In software architecture and development, precise terminology is crucial. Conflating terms can, and often does, lead to mistakes, compromises, and system failures.

{% include image.html url="/assets/posts/2024-10-08.jpg" %}

Take, for example, the Wikipedia page on [Code Integrity](https://en.wikipedia.org/wiki/Code_integrity). The article reiterates various definitions and ideas about software quality under the rubric of code integrity.

The confusion is evident in the first line:

> Code integrity is a measurement used in the software delivery lifecycle. It measures how high the source code's quality is when it is passed on to QA.

Huh? Code integrity is a measure of code quality? Given that Wikipedia is often the “go-to” source for authoritative definitions, this article only reinforces my point -- the need for clarity and accuracy in defining such critical terms.

It wouldn't be a big deal if the integrity/quality confusion were confined to a single Wikipedia article. But the article is just a symptom of a wider problem. The conflation crops up again and again, even on product pages of (otherwise sophisticated) technology companies.

Keeping in mind the current state of software supply chain security, such confusion can have potentially catastrophic consequences. True, word usages and meanings can (and must) evolve. That's the nature of language. However, stretching them too far in a technical context is unwise. For effective design and proper implementation of best practices, we need to be crystal clear about what we mean by “integrity” and “quality”.


## What we talk about when we talk about “integrity”

In the general sense, integrity refers to the state of being whole, undivided, and uncorrupted. In the domain of software, “integrity” has a very precise meaning. By saying the software exhibits “integrity”, we mean that it remains unadulterated by any third parties, and is provably free of any unintended modifications. Some might argue that software integrity refers to the absence of any unauthorized changes in the delivered product. This interpretation aligns well with the concept of maintaining the original intent and design of the software. For example, some types of software supply chain attacks are referred to as “code integrity attacks”. 

Quality, on the other hand, is a multifaceted concept. We usually think of quality as a (surprise!) qualitative, rather than a quantitative, measure. Yet, in the domain of software, quality measures, as empirically as possible, a software deliverable's adherence to product requirements, performance metrics, scaling characteristics, UX/DX designs, and industry standards.

## What is “code integrity” after all?

Let's boil it down. “Code integrity" refers specifically to the preservation of the original state of a piece of code, even across a heterogeneous set of developers, machines, repositories, CI/CD pipelines, and environments. 

This definition encompasses multiple dimensions of integrity:

- Authenticity and Security: Ensuring that the code has not been modified by unauthorized parties. Code signing is a technique that guarantees authenticity and integrity by confirming the source of the code and ensuring it has not been tampered with.
- Source Code Integrity: Encompasses version management, branch protections, and thorough reviews, ensuring the source code remains as intended by its creators.
- Dependency Integrity: Ensuring third-party dependencies are trustworthy and have not been compromised.
- Build Integrity: Covers the transformation of source code and dependencies into a final software package, which must be secure and reliable to maintain integrity.
- Package Integrity: The final deliverable’s integrity must be protected to ensure that what is delivered to users is exactly what was intended.

## Refuting the Integrity = Quality misconception

Claiming that integrity equals quality is wrong, wrong, wrong! Simplifying such a nuanced concept into a catch-all term leads to a perilous lack of precision. Without pointing fingers, such oversimplifications typically find their outlet in marketing materials, which often strive to appease (bamboozle?) multiple audiences, or at least to solve more problems than is realistic, or, for that matter, true.

A precise and useful definition of code integrity encompasses:

- Ensuring no unauthorized changes have been made.
- Maintaining the authenticity and original state of the software.
- Safeguarding the integrity of the source code, dependencies, build process, and final package.

That's a much more valuable, not to mention, *actionable*, contribution to resources like Wikipedia, compared to the current ambiguous and circular definitions.

## Industry efforts around code integrity

Thanksfully, a number of organizations and working groups are tackling this issue of code integrity. The OWASP community, for example, is developing a standard for Software Bill of Materials (SBOM). CycloneDX, as it is called, is a "full-stack Bill of Materials (BOM) standard that provides advanced supply chain capabilities for cyber risk reduction." [OASIS-OPEN](https://www.oasis-open.org/standards/) is creating end-to-end traceability for threats impacting software components. Another notable industry initiative is the security framework known as [Supply-chain Levels for Software Artifacts](https://slsa.dev/), or, SLSA. Proposed by Google in collaboration with [Open Source Security Foundation](https://openssf.org/), SLSA bills itself as a "a checklist of standards and controls to prevent tampering, improve integrity, and secure packages and infrastructure."

## Wrap up	
In conclusion, while integrity and quality are related, they're not, by any means, synonymous. Integrity focuses on the preservation of the original state and authenticity. Quality involves a broader, perhaps less well-defined, range of attributes. If we want to build software that incorporates both integrity and quality, we first need clear and precise definitions. 

So, let's maintain the integrity of our language and use terms appropriately, especially when it comes to important concepts like code integrity.

To experience the distinctive advantages SignPath offers for code integrity, [Request a Demo](https://forms.gle/sAHSsxgASx2BYPzc9) today.

---
layout: post
title: "The Misconception of Integrity as Quality
<!-- image: '2024-10-08-bg' -->
date: 2024-10-08 08:00:00 +0000
author: Stefan Wenig
summary: "Code integrity and code quality: Two concepts that are often used interchangeably. That's not only inaccurate, but also potentially harmful."
description: "description"
---


# The Misconception of Integrity as Quality: A Perspective on Definitions and Misuses


In the context of code, “integrity” and “quality” are terms I often see used interchangeably. As the founder of a startup that provides software integrity, I see this as a problem! In software architecture and development, precision in terminology is crucial. Conflating terms can lead to mistakes, compromises, and system failures.

{% include image.html url="/assets/posts/2024-10-08.jpg" %}

Take, for example, the Wikipedia page on [Code Integrity](https://en.wikipedia.org/wiki/Code_integrity). The article reiterates various definitions and ideas about software quality under the rubric of code integrity.

The confusion is evident in the first line:

> Code integrity is a measurement used in the software delivery lifecycle. It measures how high the source code's quality is when it is passed on to QA.

The article also sources definitions from seemingly circular references and random web pages.  Given that Wikipedia is often the “go-to” source for authoritative definitions, this article only reinforces the need for clarity and accuracy in defining such critical terms.

In my view, such confusion has consequences, particularly keeping in mind the current state of software supply chain security. Words have specific meanings, and while their usage can evolve, stretching them too far often leads to confusion and miscommunication, especially in a technical context. Clarity in terms such as “integrity” and “quality” is essential for effective design and proper implementation of best practices.


## What we talk about when we talk about “integrity”

Integrity, in its truest sense, refers to the state of being whole, undivided, and uncorrupted. In the world of  software, “integrity” has a precise meaning. By saying the software has “integrity”, we mean that it remains unadulterated by any third parties or even any unintended modifications. Some might argue that software integrity refers to the absence of any unauthorized changes in the delivered product. This interpretation aligns well with the concept of maintaining the original intent and design of the software. For example, people in our field refer to some forms of software supply chain attacks as “code integrity attacks”. 

Quality, on the other hand, is a multifaceted concept in software development. While often considered subjective, it encompasses both measurable and perceptual aspects. In the context of software, quality refers to how well the product meets specified requirements, user needs, and industry standards.
The Consortium for IT Software Quality (CISQ) has defined five major desirable structural characteristics needed for a piece of software to provide business value: Reliability, Efficiency, Security, Maintainability, and Size.	

High-quality software not only performs its intended functions correctly but also provides a positive user experience, is robust against errors, and can be easily modified or extended. Unlike integrity, which focuses on preserving the original state of the software, quality is about enhancing its overall value and effectiveness.

## What is “code integrity” after all?

“Software integrity" refers specifically to the preservation of the original state of a piece of code. This involves several dimensions:

- Authenticity and Security: Ensuring that the code has not been modified by unauthorized parties. Code signing is a technique that guarantees authenticity and integrity by confirming the source of the code and ensuring it has not been tampered with.
- Source Code Integrity: Encompasses version management, branch protections, and thorough reviews, ensuring the source code remains as intended by its creators.
- Dependency Integrity: Ensuring third-party dependencies are trustworthy and have not been compromised.
- Build Integrity: Covers the transformation of source code and dependencies into a final software package, which must be secure and reliable to maintain integrity.
- Package Integrity: The final deliverable’s integrity must be protected to ensure that what is delivered to users is exactly what was intended.

## Stretching the definition

While these points might seem to stretch the definition of integrity slightly, they all focus on maintaining the original, uncorrupted state of the software. Extending the definition further to include all kinds of policies and procedures might seem reasonable, as violations of these can corrupt the process and, consequently, the final product.

## The Integrity = Quality misconception

Claiming that integrity equals quality is not only incorrect but also unhelpful. It attempts to simplify a nuanced concept into a catch-all term, which leads to a loss of precision and meaning. Such oversimplifications are often found in marketing materials, where the goal might be to sell a concept rather than to convey its precise technical meaning.

A precise and useful definition of code integrity would encompass:

- Ensuring no unauthorized changes have been made.
- Maintaining the authenticity and original state of the software.
- Safeguarding the integrity of the source code, dependencies, build process, and final package.

Such a definition would be a much more valuable contribution to resources like Wikipedia, compared to the current ambiguous and circular definitions.
In fact, several working groups are tackling this issue of code integrity. The OWASP community, for example, is developing a standard for Software Bill of Materials (SBOM). OASIS-OPEN is focusing on creating end-to-end traceability for threats impacting software components. Meanwhile, the Open Source Software Foundation is working on establishing code integrity guidelines. Google's SLSA and Microsoft's SCIM frameworks are notable in their innovative approaches within the field.

## Wrap up
In conclusion, while integrity and quality are related, they are far from synonymous. Integrity focuses on the preservation of the original state and authenticity, while quality encompasses a broader range of attributes. Clear and precise definitions are crucial, particularly in technical fields, to ensure effective communication and implementation of best practices. So, let's maintain the integrity of our language and use terms appropriately, especially when it comes to important concepts like code integrity.

To experience the distinctive advantages SignPath offers for code integrity, [Request a Demo](https://forms.gle/sAHSsxgASx2BYPzc9) today.

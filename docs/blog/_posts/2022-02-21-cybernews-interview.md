---
layout: post
title: "Cybernews interview with our CEO: supply chains and code signing"
image: '2022-03-21_01-bg'
date: 2022-02-21 16:00:00 +0000
author: Stefan Wenig
published: true
summary: "&quot;You can spend millions of dollars for IT security and still become a victim of an attack on a supplier&quot;"
description:
---

Read the original interview at [Cybernews](https://cybernews.com/security/stefan-wenig-signpath-you-can-spend-millions-of-dollars-for-it-security-and-still-become-a-victim-of-an-attack-on-a-supplier/).

**_If there’s anything that companies shouldn’t put aside, it’s cybersecurity because threats are lurking around every corner of the cyber world._**

_Businesses of any size can unexpectedly fall victim to various dangers, including ransomware attacks, data breaches, or identity theft. It can lead to demanding a financial ransom, loss of sensitive data, or damaged brand reputation._

_And while it’s only a matter of time when a company will encounter cybercriminals, there are various tools, such as secure code signing services, that can be used to prevent attacks._

_For this reason, [Cybernews](https://cybernews.com/) invited Stefan Wenig, the CEO of SignPath – a company that specializes in safe code signing. Wenig shared his views about cybersecurity and the importance of code signing._

**How did SignPath originate? What has your journey been like so far?**

Back when I was in charge of software development at [RUBICON](https://www.rubicon.eu/), we had to sign some client-side add-ons for our enterprise Web applications. We purchased a certificate, which came on a USB token. That requires a lot of driver and configuration fumbling and is impossible to integrate with build automation. You end up with a tedious, insecure, manual process.

By then, code signing incidents had started making serious news. Initially, this was about key theft, but more recent cases pointed towards a different problem – how do you make sure that you only sign software releases that were built in a secure way, from a properly reviewed source, according to all your policies?

Later, some government and enterprise customers started asking for signatures on server applications too, so integration and automation became a key concern. Some customers prescribed secure code signing practices, so now it had to be automatic and secure, across a wide range of products and projects.

We didn’t find a good solution on the market, so we experimented with a signing service that offloads code signing to a secure, isolated service. That turned out to be harder than we thought, so we knew early on that if we were going to do this, we’d build it as a product.

Fast forward 5 years, SignPath is now an independent company, providing this solution as a Cloud service and on-premises to SMBs and large enterprises.

**Can you tell us a little bit about what you do? Why is code signing needed?**

Code signing is the process of putting a digital signature on a program before it is distributed, installed, and executed. Like a digital signature on a document, it guarantees authenticity and integrity. Authenticity means that files have been signed by the software’s publisher. Integrity means that the program’s files have not been modified since.

Most current platforms automatically verify signatures when programs and apps are downloaded and installed. They all bring their specific formats and procedures: Microsoft, Java, Google, and Apple all use certificate-based formats. This allows customers to verify the legal name and country of the publisher. Linux and Docker do it a bit differently.

Code signing can ensure that only trusted programs are installed and run on any computer or smartphone. So, at least in theory, if a program is properly signed by a trusted publisher, you should be able to trust it. But there are pitfalls.

**How do cybercriminals take advantage of software that isn’t code signed? What is the worst that can happen?**

Whether it’s viruses, Trojan horses, or targeted attacks where hackers directly attack an organizations’ systems: cybercriminals try to get your computer to run their own programs. Consumers face ransomware, theft of identity or financial data, or permanent takeovers of their computers into botnets. Corporations, government agencies, and other organizations also find that these programs are used to open backdoors for further attacks and to infect other computers in the network.

A widely known defense against malicious code is anti-malware programs. They detect and prevent some breaches, but this is an arms race: malware changes all the time to stay undetected. And it’s virtually impossible for anti-malware tools to detect a targeted attack.

That’s why modern operating systems go out of their way to prevent untrusted programs from running at all. Code signing is the primary mechanism to ensure and verify this trust.

**Do you think the recent global events altered the way people perceive cybersecurity?**

Absolutely, in two ways. First, there was the [Sunburst](https://cybernews.com/editorial/us-secret-service-vet-solarwinds-was-cybersecurity-s-9-11/) incident. In 2020, Russian hackers had infiltrated the software company SolarWinds and inserted a backdoor into their software. The software is used by tens of thousands of organizations, so they all had these backdoors opened. The incident went undetected for many months before security specialist FireEye found it.

Sunburst also demonstrated that code signing is not enough. The modified software was properly signed, and not for lack of a safe signing infrastructure. The incident happened somewhere else in the build pipeline, but there was no connection between build policies and signing. In fact, signing only made it worse – it conveyed that it should be trusted when it was already weaponized.

Similar incidents have happened before and since, but Sunburst made the big news. Finally, everybody realized how susceptible even the most security-savvy organizations are to supply-chain attacks. In other words, you can spend tens or hundreds of millions of dollars for IT security and still become a victim of an attack on a supplier, or on your own software development teams.

And of course, more recent events put us all in a dangerous place. Everyone is very aware that current conflicts are fought not only on real battlefields, but economics and the Internet are weaponized, too. This is not just about losing credit card data anymore.

**In your opinion, which industries are especially vulnerable to attacks carried out by injecting malicious code?**

The most advanced attacks these days come from nation-state actors. So obviously, government agencies and their contractors are high on the list. When it comes to attacking nations, critical industries include defense, aerospace, finance, health care, and energy, especially nuclear.

But nation-states participate in economically motivated attacks, too. And of course, classic cybercrime is still a thing. No industry is spared when it comes to stealing customer data or blackmail.

Modern supply-chain attacks specifically expose the tech industry. If the first move is at a software company, attackers can potentially get at their customers. And since today all technology comes with software, this threat extends to the entire tech industry.

**Why do you think code signing is often overlooked? Are there any other security details that you believe are often pushed to the background?**

When you ship software to consumers, code signing is often required, so that’s an obvious starting point for many organizations. However, software running on servers usually doesn’t require code signing. So naturally, enterprise software and Web applications are often used without code signing.

Sometimes software is signed, but the signatures are not routinely and automatically verified as part of the deployment procedures. Reasons for this include awareness, budgets, and prioritizing, but many IT administrators will also tell you that they don’t do it because too many programs or components are not signed, and they don’t see the point of only partial verification.

Obviously, both problems expose the servers and networks to significant risk. Installing software of unverified origin naturally means that attackers can attack the process at any point of their choosing.

**What are the best practices companies should follow when developing and launching software?**

Let’s start with the obvious – all software should be signed before it leaves the publisher’s environment. This allows customers (or operations teams) to verify its origin and integrity.

The next item on everyone’s checklist is to secure this process. Like almost everything in cryptography, code signing relies on the secrecy of private keys. If they get stolen, somebody else will be able to sign their own programs (or modified versions of your software) in your name. We already see secure key management for code signing as an emerging product category.

But signing your software is only half the story. Our industry is increasingly aware of the need to design, code, and test software for security. But less thought is given to the fact that these processes are under attack. New versions of software are being built all the time, and every time you build a program, there’s that risk of somebody messing with the process.

You want to make sure that only software versions that are built in a secure way get signed. And that’s really the hard part of code signing. How do you make sure that the process didn’t get compromised before you do the final signature?

You also want to have some control over releases, such as creating release candidates and delaying the decision to sign and release. That might include automatic testing gateways or manual approvals. However, automatic verifications still have to happen immediately.

**What cyber threats do you find the most concerning nowadays? What can average individuals do to protect themselves?**

On an enterprise level, supply chain attacks are changing what we have learned about security. When you cannot trust your suppliers, how are you going to defend your own organization? It’s no longer enough to have systems and processes in place that protect your own infrastructure, you also need to worry about who you’re buying from.

Is the software actually from the right source and free from modifications? It’s easy to check a signature. But you also start to worry about which publishers (or which certificates) to trust. Controlling the supply chains of software products is not an easy task. We see formal processes around that, with enterprises starting to track their supply chains, define technical and legal requirements and align incident processes. But software is made of software, so each supplier has their own supply chain, and that’s a difficult thing to track with lists and contracts.

We need to get to the point where an automatic signature verification can convey security properties, such as the policies that were used when making and signing the software.

For individuals, the best advice we can give is what you’re hearing everywhere: don’t mess with security defaults, don’t trust anything on the Internet, and take warnings seriously.

**What does the future hold for SignPath?**

We’re always improving our core product. With a new release every other week, expect us to keep adding new platforms and formats, integrations, policies, and other features.

We’ll also extend our [SignPath Foundation](https://signpath.org/) initiative. Through the Foundation, we’re offering free code signing to Open Source projects. We provide certificates for each project, but they are issued in our name, and the Foundation is in control of the signing policies. We’re using the same functionality that enterprises would deploy to stay in control of certificates and policies across their individual teams.

This allows users to easily trust the downloadable program packages just as much as they trust the source code hosted on GitHub. Open Source signing is currently a limited offering, and we plan to automate the onboarding process and open it up.

Another focus area will be software supply chains. Standards around software bills of material and provenance documentation are currently evolving, and we’re going to see them adopted in a way that allows interoperability across the supply chain.

Producing and signing these documents will be a priority for SignPath. Eventually, we’ll also want to verify this data for incoming components and allow our customers to build signing policies based on it. This will be a major milestone in our mission to provide verifiable trust in the software supply chain.
---
layout: post
title: "The Threat of Office Macros and how to mitigate them with Code Signing"
image: '2023-03-28_01-bg'
date: 2023-03-28 16:00:00 +0000
author: Andreas Willich
published: true
summary: "lorem ipsum lorem ipsum lorem ipsum lorem ipsum lorem ipsum lorem"
description:
show_cta_trial_signup: false
show_newsletter: false
cta_text: "Do you want to secure your Office Macros?"
cta_only_for_enterprise: true
---

Many businesses and organizations rely on Microsoft Office macros to streamline their operations and automate repetitive tasks. Macros are small programs that can be embedded in Office documents to perform specific actions automatically. However, while macros can be useful, they also pose a high risk to IT security.

The reason macros are risky is because they run with the same permissions as the user who opens the document. This means that if a document contains a malicious macro, it can execute and carry out harmful actions with the same level of access as the user who opened the document. So if you have access to all financial data of your company, also the macro has access to it. Furthermore, hackers can use social engineering tactics to trick users into enabling macros, making it easy for them to gain unauthorized access to a computer system.

Unlike regular programs, Office documents are often opened without much thought. Users may receive an email with an attached document, or they may download a document from the internet. In these cases, users may not be aware that the document contains a macro, or they may not think twice about enabling macro execution when prompted. This ease of access makes macros a popular attack vector for hackers.

Another challenge with macros is that it's difficult for administrators to create policies that define which macros are safe to run. Unlike regular programs, macros are usually not signed, making it hard to verify their authenticity. Policy frameworks such as application control or whitelisting don't work well for macros because they are often used for legitimate business purposes.

Finally, malware scanners can miss some malicious macros, making it even more difficult to protect against macro-based attacks. Hackers can use obfuscation techniques to hide the true nature of a macro, making it hard for scanners to detect.

The threat of malware infection via Microsoft Office macros got reduced by Microsoft, as they recently blocked all execution of macros from Microsoft Office files downloaded from the Internet ([Announcement by Microsoft](https://techcommunity.microsoft.com/t5/microsoft-365-blog/helping-users-stay-safe-blocking-internet-macros-by-default-in/ba-p/3071805)), but

1. This can still be unblocked by the user ([How-To from Microsoft](https://support.microsoft.com/en-us/topic/a-potentially-dangerous-macro-has-been-blocked-0952faa0-37e7-4316-b61d-5b5ed6024216)).  
  Which could be provoked through a social engineering attack.
2. It doesn't help against attacks from within your organization

Here you can see an overview over easily available methods to limit execution of Microsoft Office macros:

| Method                                                       | Security level  | Implementation  | Business impact | Remarks
|--------------------------------------------------------------|-----------------|-----------------|-----------------|----------------------------------------
| Enable macro execution                                       | 🔴             | 🟢              | 🟢             | This should never be enabled
| Let users decide whether to execute macros                   | 🟠             | 🟢              | 🟢             | You cannot rely on users _always_ making the right decision
| Disable macro execution except for digitally signed macros   | 🟡             | 🟠              | 🟢             | Adequate private key security requires dedicated hardware, plus you need a reliable and auditable process
| Disable macro execution except for users who require them    | 🟡             | 🔴              | 🟠             | Each of these users still poses a risk, and they often add up
| Disable macro execution except for certain storage locations | 🟡             | 🟡              | 🟡             | This will mitigate direct internet/email attacks, but still any user can drop a malicious document in a trusted location
| Disable macro execution for everyone                         | 🟢             | 🟢              | 🔴             | Very safe but often unrealistic 
| **Using SignPath:** <br> Disable macro execution except for digitally signed macros   | 🟢 | 🟢 | 🟢             | Provide a secure process that aligns signing authorization and approval policies with macro execution policies.

The only solution is to limit the execution to reviewed macros of your organization. To verfiy their authenticity and that they are not manipulated after the review, they need to be signed with trusted certificates.

To make it easier for you to implement this in your organization, we added last year the ability to sign Microsoft Office macros with SignPath.  
This allowes you to use our policy framework to control who is allowed to sign the macros and manage the secure storage of your private keys.

## How would your future workflow look like?

Macros signing is easy to set up using the policy framework provided by us:

* VBA (Office Visual Basic for Applications) developers create and edit macros in office documents and document templates
* Administrators set up signing permissions and approval rules
* Macros are signed manually or automatically using SignPath

For approved macros, this process has no impact on business units using Office documents:

* Users can create new documents and view, edit and save data in existing documents without affecting signed macros
* Documents can be stored in any location and shared via email

So your users have still the flexibility to store and share documents as they want, but you can still control the execution of macros.

## How to get started?

Microsoft Office Macro Signing is available as part of our [Enterprise subscription](/product/editions).  

Please contact us to get started:

<a class="btn btn-primary trial trial-button" href="mailto:sales@signpath.io?Subject=Request%20trial%20for%20Enterprise%20subscription">Request an Enterprise Trial
  <span class="hint--top-left hint--medium" aria-label="Uses a non-trusted timestamping server">{% include check_white.svg %}</span>
</a>
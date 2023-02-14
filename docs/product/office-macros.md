---
sub_header: Microsoft Office Macro Signing
layout: resources
toc: true
description: Protecting from malicious Office macros through policy restrictions and signing
---

## The Threat of Office Macros

While many organizations depend on **Microsoft Office macros for business-critical processes**, they pose a **high risk for IT security**. Macros are programs within Office documents that **execute with the same permissions as the user** opening the document. Not to speak of macros that use other exploits to elevate their privileges even beyond that. That makes Office macros a preferred way for hackers to get into organizations, with attacks ranging from **ransomware** to **spear phishing**.

Unlike normal programs, Office documents are often opened by users without thinking twice. Enabling macro execution is then just a click away, which is especially easy to achieve via **social engineering** by including instructions in an email or even the document itself. 

Also unlike normal programs, administrators find it **almost impossible to provide policy settings** that define which macros may be executed. Policy frameworks such as **application control/whitelisting don't work for macros**. And malware scanners will always miss some malevolent macros.

## Implement Macro Signing to Create Secure End User Policies

**Digitally signing your organization's macros will unlock the policy capabilities of Microsoft Office:**

* Use group policies to allow execution only for macros signed with trusted certificates
* Assign trusted certificates to users and groups

![Supported applications: Excel, PowerPoint, Project, Publisher, Visio, Word](/assets/img/product/office-macros/office-supported-apps.png){:width=800}

<div class="panel tip" markdown="1">
<div class="panel-header">Global certificate vs. assigning certificates to teams</div>

For instance, you can easily configure that some or all users of your organization may use macros signed using your **global macro signing certificate**.

Or you might have a more complex certificate policy that assigns **specific macro signing certificates** to departments:

| Department       | Trusted certificates
|------------------|---------------------------------------------------------
| Finance          | Global, Finance
| Legal            | Legal
| Engineering      | Global, Engineering, some subcontractors
| Restricted users | none
| Everyone else    | Global

Your business partners will be informed that macros have been signed by your organizations. They can then decide to trust these macros on a per-user basis or through the same policy framework.

</div>

**Using SignPath, you can keep your signing keys safe and easily create well-defined signing processes for each of these certificates.**

## Inadequacy of Other Approaches

This table shows how readily available policies provide **inadequate security** and/or **impact the business** to an unacceptable degree:

| Method                                                       | Security level  | Implementation  | Business impact | Remarks
|--------------------------------------------------------------|-----------------|-----------------|-----------------|----------------------------------------
| Enable macro execution                                       | 🔴             | 🟢              | 🟢             | This should never be enabled
| Let users decide whether to execute macros                   | 🟠             | 🟢              | 🟢             | You cannot rely on users _always_ making the right decision
| Disable macro execution except for digitally signed macros   | 🟡             | 🟠              | 🟢             | Adequate private key security requires dedicated hardware, plus you need a reliable and auditable process
| Disable macro execution except for users who require them    | 🟡             | 🔴              | 🟠             | Each of these users still poses a risk, and they often add up
| Disable macro execution except for certain storage locations | 🟡             | 🟡              | 🟡             | This will mitigate direct internet/email attacks, but still any user can drop a malicious document in a trusted location
| Disable macro execution for everyone                         | 🟢             | 🟢              | 🔴             | Very safe but often unrealistic 
| **Using SignPath:** <br> Disable macro execution except for digitally signed macros   | 🟢 | 🟢 | 🟢             | Provide a secure process that aligns signing authorization and approval policies with macro execution policies.

## End-to-End Security for Office Macros

Macros signing is easy to set up using the policy framework provided by SignPath:

* VBA developers create and edit macros in office documents and document templates 
* Macros are signed manually or automatically using SignPath
* Administrators set up signing permissions and approval rules

For approved macros, this process has no impact on business units using Office documents:

* Users can create new documents and view, edit and save data in existing documents without affecting signed macros
* Documents can be stored in any location and shared via email

![Macro signing process](/assets/img/product/office-macros/macro-signing-process.png){:width=800}

---
layout: post
title: "Experiences with Security Report Handling: The Good and the Bad"
image: '2021-03-23_01-bg'
date: 2021-03-23 08:00:00 +0000
author: Daniel Ostovary
summary: "On the stark differences of reporting security vulnerabilities between major software vendors"
description:
---

When reporting the vulnerability/security issue described in [On the Importance of Trust Validation: Microsoft's Dangerous Mistake](https://about.signpath.io/blog/2020/08/26/on-the-importance-of-trust-validation.html) and [Unfulfilled Exceptations: Revoked Certificates in JAR Signing](https://about.signpath.io/blog/2020/08/26/unfulfilled-expectations.html) we noticed big differences in security report handling between the contacted vendors. In this blog post we are talking about our experiences with these security reports. The blog post is written in cooperation with Marc Nimmerichter from [Certitude](https://certitude.consulting/en).

## Reporting the VSIX Installer Vulnerability

We reported the vulnerability to Microsoft shortly after its discovery. Microsoft is not only the developer of the VSIX installer, but also the responsible CVE Numbering Authority (CNA) for Microsoft products [[1]](#1), i.e. Microsoft is responsible for issuing CVEs for the VSIX installer. Microsoft has confirmed the vulnerability and has rated its severity as **moderate**. Microsoft provided the following explanation for the severity of the vulnerability:

1. Revocation checking does not completely mitigate a stolen private key scenario anyway.
2. No popular publisher of VSIX packages has had their private key stolen.

Microsoft stated this vulnerability **does not warrant the issuing of a CVE** because it only has **moderate severity**.

While we agree with the first argument, the second remains a mystery:

* It's unclear to us how Microsoft would know about all stolen private keys, as it is not obligatory to report stolen keys to Microsoft
* There are no specific code-signing certificates for VSIX, so this vulnerability could not be exploited with private keys that were stolen any software publisher, not only "popular package publishers" (see [On the Importance of Trust Validation: Microsoft's Dangerous Mistake](https://about.signpath.io/blog/2020/08/26/on-the-importance-of-trust-validation.html))

Furthermore, there is no reason to assume that CVEs should only be issued for vulnerabilities rated higher than moderate. If that were the case, users would be restricted in their ability to protect themselves from moderate vulnerabilities. It should be noted that CVEs are frequently issued for vulnerabilities with moderate severity (e.g. [CVE-2019-1020019](https://nvd.nist.gov/vuln/detail/CVE-2019-1020019), [CVE-2020-128809](https://nvd.nist.gov/vuln/detail/CVE-2020-12880), or [CVE-2020-10643](https://nvd.nist.gov/vuln/detail/CVE-2020-10643)). 

Unfortunately, Microsoft's decision on issuing a CVE was not up for discussion, so we contacted MITRE to obtain a CVE. MITRE is a root CNA and is responsible for all CVEs that are not covered by other CNAs [[1]](#1). After a short exchange of emails, MITRE stopped responding to us, even after another follow up on our behalf. Almost a year later, in late April 2020, we unexpectedly received a message by MITRE, asking us if we would still like to have a CVE number assigned. Despite confirming that we suggest to assign a CVE, MITRE has not assigned this vulnerability a CVE number yet.

### Intransparent Fix

Microsoft has informed us that they were planning to fix this vulnerability with Visual Studio 16.3, which was released in Fall 2019. The release notes of Visual Studio 16.3. did not mention the vulnerability in any way [[2]](#2). However, in May 2020 we could confirm that the vulnerability is fixed at least in versions >=16.5.2047. 

### Timeline

	15/06/2019: Initial discovery of the vulnerability and subsequent confirmation
	08/07/2019: Reporting the vulnerability to Microsoft
	21/07/2019: Microsoft confirms the vulnerability 
	08/08/2019: Microsoft plans to address the vulnerability in Visual Studio 16.3
	14/08/2019: Trying to obtain a CVE from MITRE since Microsoft is very reluctant to issue a CVE
	20/08/2019: Microsoft refuses to issue a CVE
	20/08/2019: No more responses from MITRE until 28/04/2020
	23/09/2019: Release of Visual Studio 16.3 (supposedly fixed version)
	28/04/2020: MITRE asks if we still want a CVE
	11/05/2020: Confirming to MITRE that we still want a CVE
	11/05/2020 - 23/03/2021: After further requests to MITRE no CVE was assigned

## Reporting the JarSigner Security Issue

Shortly after discovery of the missing revocation check in the JarSigner, we informed Oracle about it. Oracle quickly agreed that this could be an issue and informed us that they will address it by providing an option for CRL checks in the JarSigner. As the security issue is conceptional and not technically a vulnerability, we did not try to obtain a CVE for it.

### Timeline

	24/03/2020: Initial discovery of the security issue and subsequent confirmation
	26/03/2020: Reporting the security issue to Oracle
	20/04/2020: Oracle confirms the security issue and plans to address it in JDK15

## Security Report Handling: Microsoft vs. Oracle

The security report handling between Microsoft and Oracle could hardly be more different.

While discussing the vulnerability with Microsoft, they tried to disregard the vulnerability - seemingly without fully understanding it at first. After a more thorough explanation, Microsoft agreed to issue a fix for this vulnerability, but, in our opinion, downplayed the severity of the vulnerability with at least partially invalid arguments (see above). Based on this arguments, they argued moderate severity and that no CVE was warranted. The unwillingness to asign a CVE and the absence of a mention of this vulnerability in the Visual Studio 16.3 release notes casts some doubts on their priorities: would they rather keep a vulnerability under cover, and produce a silent fix after a long delay, or would they keep their users informed to help them be secure? The former approach is commonly considered bad practice. 

In contrast to Microsoft's security report handling, Oracle has acknowledged the security issue, without trying to avoid to take action or unreasonably downplaying it, and is transparently fixing it through a public ticket system. Although we wished Oracle had made automatic CRL checks a default in the JarSigner, in our opinion, Oracle handled this security report very well overall.

<div class='sources' markdown='1'>
# Sources
* \[<span id='1'>1</span>\] [https://cve.mitre.org/cve/request_id.html](https://cve.mitre.org/cve/request_id.html)
* \[<span id='2'>2</span>\] [https://docs.microsoft.com/en-us/visualstudio/releases/2019/release-notes-v16.3](https://docs.microsoft.com/en-us/visualstudio/releases/2019/release-notes-v16.3)
</div>

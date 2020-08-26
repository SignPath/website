---
layout: post
title:  "Unfulfilled Expectations: Revoked Certificates in JAR Signing"
image: '2020-08-26-02-bg'
date:   2020-08-26 00:00:00 +0000
author: Daniel Ostovary
summary: "In April we became aware of a conceptual security issue in the JarSigner. The fix will be shipped with the release of JDK 15"
---

In April 2020 we became aware of a conceptual security issue in the Java JarSigner. The JarSigner does not check certificate revocations, which breaks JAR signing to some extend.

In this blog post we are going to talk about this issue. The blog post is written in cooperation with Marc Nimmerichter from [Impidio](https://www.impidio.com/). We have reported this issue to Oracle shortly after its discovery. We will talk about our experiences with reporting this issue in a future blog post. To understand this issue, one has to understand Certificate Revocation Lists (CRLs) first.

# Certificate Revocation Lists
If the owner of a certificate wishes to revoke their certificate (i.e. invalidate it, for example, because of compromise), they can request the issuing Certificate Authority (CA) to put the certificate on a CRL (e.g. see [[5]](#5)). The CRL distribution point is indicated in the CA's certificate [[5]](#5). Often, a verifier of a signature checks the certificate's CRL to see if it is revoked [[6]](#6) (e.g. the Windows signature verification of an executable). 

# The Security Issue
We found evidence that there was some CRL check for JAR signatures in the past (e.g. for Java Applets in JDK 7; see [[1-3]](#3)). However, a source code analysis of the JarSigner of the JDK 12 and a review of its official documentation [[4]](#4) show that CRLs are not automatically checked, neither by the JarSigner nor anywhere else in the JDK. Instead, as Oracle told us, developers are expected to call the PKIXRevocationChecker explicitly to check for revocations. 

# The Impact
Since the JarSigner does not check CRLs, any stolen and revoked code-signing certificate can be used to sign JARs without the JarSigner warning users of a revoked certificate. That is unless users explicitely check revocation with the PKIXRevocationChecker. As verifiers of a signature often check the CRL of the certificate, users of the JarSigner almost certainly expect the JarSigner to do so too. These users rely on CRLs for security, but the JarSigner does not actually provide this level of security. 

# Addressing the Security Issue
Shortly after discussing the issue with Oracle, they created a ticket to address this issue ([JDK-8242060](https://bugs.openjdk.java.net/browse/JDK-8242060)). This ticket is expected to be resolved with JDK 15, which is planned to be released on September 15, 2020 [[6]](#6). Users of the JarSigner should note that this issue will not be addressed in older versions of the JDK (i.e.  JDKs before JDK 15).

<div class='sources' markdown='1'>
# Sources
* \[<span id='1'>1</span>\] [https://docs.oracle.com/javase/7/docs/technotes/tools/windows/jarsigner.html](https://docs.oracle.com/javase/7/docs/technotes/tools/windows/jarsigner.html)
* \[<span id='2'>2</span>\] [https://blogs.oracle.com/java-platform-group/signing-code-for-the-long-haul](https://blogs.oracle.com/java-platform-group/signing-code-for-the-long-haul)
* \[<span id='3'>3</span>\] [https://java.com/en/download/help/revocation_options.xml](https://java.com/en/download/help/revocation_options.xml)
* \[<span id='4'>4</span>\] [https://docs.oracle.com/en/java/javase/12/](https://docs.oracle.com/en/java/javase/12/)
* \[<span id='5'>5</span>\] [https://www.csoonline.com/article/2607448/revoke-certificates-when-you-need-to----the-right-way.html](https://www.csoonline.com/article/2607448/revoke-certificates-when-you-need-to----the-right-way.html)
* \[<span id='6'>6</span>\] [https://openjdk.java.net/projects/jdk/15/](https://openjdk.java.net/projects/jdk/15/)
</div>

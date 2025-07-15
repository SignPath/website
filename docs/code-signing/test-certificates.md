---
header: Managing Test Certificates
layout: resources
toc: true
show_toc: 3
description: How to enroll test certificates with an intentionally limited scope.
---

## Overview

Test certificates can be used to sign development builds that are not going to be distributed to your users or customers. You can read how to create test certificates in SignPath in the [user guide](/documentation/managing-certificates) In order to ensure your artifacts behave the same way during installation even though they are not signed by commercial CA you need to trust the certificate on the computers you use for testing. There are some options when managing test certificates:

* You can either create **self-signed** certificate or create them using an **in-house CA**.
* You can roll out the certificate by installing them **manually** or by using **automated processes**.

## Creating certificates

You have two options to create certificates:

### Self-signed certificates

Self-signed certificates can be created right from within SignPath and don't require an additional setup of tools and infrastructure. The disadvantage is that you cannot revoke the certificate, but have to remove it from each computer if it was misused.

### In-House CA

To use an in-house CA, you can create a certificate signing request (CSR) in SignPath and use your in-house CA (e.g. Microsoft Active Directory Certificate Services or OpenSSL) to issue the test certificate. The certificate can then be imported into SignPath. By using an in-house CA, you have one controlled instance for your public key infrastructure (PKI) and a straight-forward revocation process, in case the certificate has been misused.

## Installing certificates

Certificates can be rolled out to your test computers manually or using an automated process. You should generally add self-signed test certificates to the `Trusted Root Certification Authorities` certificate store of computers you use for testing your software. If you do this, Windows will treat your test certificates as if they were issued by a trusted Root CA.

{:.panel.tip}
> **Trusted publishers**
>
> You may also add your test certificates to the `Trusted Publishers` store on internal machines. This is what happens when a user choses to always trust this publisher during installation, and therefore results in the same behavior, so don't do this if you want to replicate the default behavior on user machines.
> 
> Adding a certificate to this store will affect User Account Control (UAC) device driver installation prompts as well as whitelisting features such as Software Restriction Policies (SRP), AppLocker and WDAC Code Integrity Policies. 
> 
> Only add your certificates to this store for computers in your own organization, don't use your installer to add your certificate to this store.

### Manual installation

On Windows, you can install certificates by following these steps:

1. Open the certificate in Windows Explorer
    * For certificate file: select *Open*.
    * For signed files: select *Properties* from the context menu, go to the *Digital Signatures* tab, open a signature (Details) and select *View Certificate*.
2. In the certificate property window, click *Install Certificate...*
3. Select *Current User* or *Local Machine* location
4. Select the *Trusted Root Certification Authorities* store

### Using scripts and batch files {#scripts}

* In PowerShell scripts, use 
  ~~~ powershell
  Import-Certificate $certificate_file -CertStoreLocation Cert:\LocalMachine\Root
  ~~~
* In batch files, use 
  ~~~ 
  CertUtil -addstore Root <certificate-file>
  ~~~

These commands require administrative permissions.

### GPO auto-enrollment {#gpo}

Use Group Policy Objects (GPOs) to add certificates to computers. The following GPOs are available in `Windows Settings` › `Security Settings` › `Public Key Policies`

* To trust a certificate, create a GPO for `Trusted Root Certification Authorities`
* In order to explicitly un-trust a certificate, create a GPO for `Untrusted Certificates`

## Trusted publishers {#trusted-publishers}

For some use cases, the certificate must also be registered as a _Trusted Publisher_ in addition to basic PKI trust:

* PowerShell scripts
* Microsoft Office macros
* ClickOnce applications
* certain GPO-driven MSI installation scenarios
* legacy ActiveX controls
* certain device drivers

{:.panel.warning}
> **Don't rely solely on _Trusted Publishers_ for restricting certificate scope**
>
> You can use _Trusted Publishers_ to fine-tune permissions for the use cases listed above. However, be aware that other signing schemes including Windows executables do _not_ require the certificate to be in _Trusted Publishers_. 
>
> SignPath allows you to control file access to certificates based on file types. For instance, if you a SignPath user is _Submitter_ for a SignPath _Project_ with a PowerShell _Artifact Configuration_, they will not be able to use that certificate to sign Windows executables too.

The certificate is often presented in a user prompt (depending on user permissions):

* _Trust once_ will enable execution once
* _Always trust_ will add the certificate to _Trusted Publishers_

You can also pre-load the certificate to _Trusted Publishers_ using the methods described above:

* PowerShell [scripts](#scripts): `-CertStoreLocation Cert:\LocalMachine\TrustedPublisher` 
* Batch files: `-addstore TrustedPublisher`
* [GPOs](#gpo): `Windows Settings` › `Security Settings` › `Public Key Policies` › `Trusted Publishers`

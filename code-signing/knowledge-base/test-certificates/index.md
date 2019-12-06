---
title: Code Signing - SignPath.io
header: Code Signing
layout: resources
toc: true
---

Test certificates can be used to sign development builds that are not going to be distributed to your users or customers. You can read how to create test certificates in SignPath in the [user guide](/product/user-guide/managing-certificates) In order to ensure your artifacts behave the same way during installation even though they are not signed by commercial CA you need to trust the certificate on the computers you use for testing. There are some options when managing test certificates:

* You can either create **self-signed** certificate or create them using an **in-house CA**.
* You can roll out the certificate by installing them **manually** or by using **automated processes**.

## Creating certificates

You have two options to create certificates:

### Self-signed certificates

Self-signed certificates can be created right from within SignPath and don't require an additional setup of tools and infrastructure. The disadvantage is that you cannot revoke the certificate, but have to remove it from each computer if it was misused.

### In-House CA

To use an in-house CA, you can create a certificate signing request (CSR) in SignPath and use your in-house CA (e.g. Microsoft Active Directory Certificate Services or OpenSSL) to issue the test certificate. The certificate can then be imported into SignPath. By using an in-house CA, you have one controlled instance for your public key infrastructure (PKI) and a straight-forward revocation process, in case the certificate has been misused.

## Installing certificates

Certificates can be rolled out to your test computers manually or using an automated process. You should generally add self-signed test certificates to the <code>Trusted Root Certification Authorities</code> certificate store of computers you use for testing your software. If you do this, Windows will treat your test certificates as if they were issued by a trusted Root CA.

<div class='panel info' markdown='1' data-title='Tips'>
<div class='panel-header'><i class='la la-info-circle'></i>Trusted publishers</div>
You may also add your test certificates to the <code>Trusted Publishers</code> store on internal machines. This is what happens when a user choses always trust this publisher during installation, and therefore results in the same behavior, so don't do this if you want to replicate the default behavior on user machines. Adding a certificate to this store will affect User Account Control (UAC) device driver installation prompts as well as whitelisting features such as Software Restriction Policies (SRP), AppLocker and WDAC Code Integrity Policies. (Only add your certificates to this store for computers in your own organization.)
</div>

### Manual installation

On Windows, you can install certificates by following these steps:

1. Open the certificate in Windows Explorer
    * Certificate file: select *Open*.
    * Signed files: select *Properties* from the context menu, go to the *Digital Signatures* tab, open a signature (Details) and select *View Certificate*.
2. In the certificate property window, click *Install Certificate...*
3. Select *Current User* or *Local Machine* location
4. Select the *Trusted Publishers* store

### Using scripts and batch files

* In PowerShell scripts, use `Import-Certificate <certificate-file> -CertStoreLocation Cert:\LocalMachine\Root`
* In batch files, use `CertUtil -addstore Root <certificate-file>`

These commands require administrative permissions.

### Auto-enrollment

Use Group Policy Objects (GPOs) to add certificates to computers.

* In order to trust a certificate, create a GPO for
  * `Windows Settings`
  * `Security Settings`
  * `Public Key Policies/Trusted Root Certification Authorities`
* In order to explicitly un-trust a certificate, create a GPO for
  * `Windows Settings`
  * `Security Settings`
  * `Public Key Policies/Untrusted Certificates`
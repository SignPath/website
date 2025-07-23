---
header: Windows Platform
layout: resources
toc: true
show_toc: 2
description: An in-depth look into the code signing technologies and procedures for Microsoft Windows
---

## Signing methods

The primary code signing mechanism of Windows is Authenticode. It is used to sign executables and libraries as well as installers, packages, device drivers, and PowerShell scripts. Additionally, some programs use code signing to validate add-ins on installation. They use specific package formats, such as ClickOnce (Microsoft Office) or Open Packaging Convention (Microsoft Visual Studio), and therefore require specific tools for code signing. Every program has its own rules for displaying and enforcing code signing.

A new member of the code signing family is NuGet, a platform for distribution of program libraries to software developers. NuGet is currently introducing optional code signing with its own tool set. Code Signing will be verified by the NuGet Gallery ([nuget.org](https://www.nuget.org)) and displayed prominently online as well as in Visual Studio.

## When are signatures verified?

### Verifications for downloaded programs

Windows marks downloaded software as insecure ("Mark-of-the-Web") and evaluates the code signature when it is executed. It requires a signature that is cryptographically valid, based on a certificate issued by a trusted Certificate Authority, and it checks various properties of the certificate and the signature.

* A missing or invalid signature will lead to a security warning, encouraging the user to abort the execution.
* A valid signature will either prompt the user with the publisher name, or silently execute the program, depending on the certificate’s SmartScreen reputation (see below).

{:.panel.info}
> **Mark-of-the-Web: downloaded files and code signing**
> 
> The Mark-of-the-Web (MotW) is a flag on a file that indicates it has been *downloaded from the internet*. It is applied by browsers and other tools that download files to local disks. This indicates to Windows that the program might not be secure. When the program is started, the signature and certificate validation process is executed. 
>
> All major browsers for Windows apply the MotW correctly (Internet Explorer, Edge, Chrome, Firefox and Opera). Notably, 7zip does not propagate the MotW when unpacking. 
>
> You can see (and remove) this indication in Windows Explorer by opening the program file’s Properties dialog just below the file attributes.

#### Microsoft SmartScreen

SmartScreen is a cloud-based system that compares downloaded software against lists of known programs and certificates. It is a vital part of Microsoft's anti-malware strategy.

(The term SmartScreen is also used for a feature in Edge and Internet Explorer that helps avoiding phishing sites and social engineering attacks, a function that is not related to code signing.)

| Validation and reputation | Action |
|---------------------------|--------|
| The program is not signed, or the signature is invalid | The user is warned not to start the program |
| The program has a valid signature, but the certificate has little or no reputation | The name of the software publisher is displayed, and the user is prompted to proceed or abort |
| The program is signed, and the certificate has reputation | The program is executed or installed

There are two ways to gain **SmartScreen reputation**:

* **Standard (OV) certificates:** The certificate is encountered several times in the wild, and no malign usage was reported. SmartScreen collects this data from Windows users.
* **Extended Validation (EV) certificates:** these certificates have full reputation when they are issued.


{:.panel.info}
> **EV certificates strongly recommended for Internet downloads**
>
> If your programs are downloaded and installed by users, SmartScreen reputation is very important. Without full reputation, users will be warned not to trust your software, and the option to execute or install it is hidden behind a "more information" link. 
> 
> Renewed standard (OV) certificates do not inherit reputation. Therefore, using OV certificates will result in warnings at least every three years (the maximum validity for code-signing certificates).

{:.panel.product}
> **SignPath: use EV certificates without USB tokens**
>
> EV code-signing certificates must be stored on secure hardware. Normally this means that you will receive a USB token from the CA. These tokens are difficult to use in team scenarios and automated builds &ndash; you will have to store them safely and attach them to build computers when needed. They usually require installation of device drivers, CSPs, and often password entry for each signature. The need to build on a physical computer also defies the goal of having safe, reproducable build environments. 
> 
> **SignPath** stores certificates on a secure HSM, so you can purchase and use EV certificates without tokens. 
> 
> * Request an attested certificate signing request (CSR) from SignPath
> * Buy an EV certificate from your favorite CA
> * Download the certificate from the CA, upload it to SignPath (does not include private key)

### Verifications for all programs

Even when a program is already installed, or was not downloaded from the Internet, signatures of individual program files may still be verified:

* **User Account Control** (UAC) will prompt the user for permission when a program tries to make changes to the system.
* **Application whitelisting** policies are deployed by enterprise administrators to prevent execution of unwanted programs.

#### User Account Control (UAC)

Windows uses UAC to prevent unwanted changes to user systems. When active, users cannot modify their systems, or start programs that will modify their systems, without explicit consent. When a user starts such a program, UAC will display a dialog box warning the user of potential system modifications and ask for consent. 

If the program is signed, UAC will display the publisher and offer to display the full certificate. Unsigned programs will warn the user of an "unknown publisher".

#### Application whitelisting and code signing policies

In the ongoing fight against malware and other security risks, enterprises are increasingly using whitelisting mechanisms. These mechanisms only allow the loading and execution of program files signed by a trusted publisher. If the software publisher does not apply signatures to all of its executables and libraries, whitelisting becomes ineffective. There are ways to work around missing signatures, such as hash-based policies, but they are hard to configure and essentially insecure: It is quite hard to ensure the integrity of program files that are received without signatures, both initially and with every update.

Windows 10 offers two flavors of **Code Integrity Policy** mechanisms:

* Windows Defender Application Control (WDAC), formerly known as Device Guard Configurable Code Integrity
* Hypervisor Code Integrity (HVCI)

While WDAC is integrated in the Windows kernel, HVCI works in its own environment, completely separated from the Windows OS and thereby safe even from dangerous rootkits. HVCI can only be used with compatible hardware. Both mechanisms are supported by Intelligent Security Graph (ISG), a cloud-based reputation system. They can be configured automatically by *managed installers*, such as the System Center Configuration Manager (SCCM).

Older versions of Windows provide different mechanisms for whitelisting: Windows 7 introduced **AppLocker**, and Windows XP featured **Software Restriction Policies** (SRP). Also, many anti-malware vendors provide their own whitelisting tools in their endpoint protection and management suites.

## File types

Most downloaded programs are installation programs or packages. Popular file types include Microsoft Installer (MSI), Cabinet Files (CAB), AppX Packages and Bundles, and App-V packages. Installers are also often distributed in the form of self-extracting programs (e.g. Setup.exe). For device drivers, Windows strictly requires Authenticode signing, either by the publisher or by the Windows Hardware Quality Lab (WHQL). PowerShell scripts and modules may also require code signing, depending on the security policy and the source of the file.

### Signing individual program files (deep signing)

Installation programs and packages install the actual program files on the computer’s disk. Installed program files should be signed too, but the reason for this is less obvious, since Windows will usually not check their signatures. Here are some reasons for signing every single program file:

* It’s just the right thing to do. By signing all executables and libraries, you present yourself as a publisher that has the customer’s security in mind.
* After installation, users and their tools have no way of checking the integrity of program files unless they are signed. A virus infection could go undetected.
* Enterprises sometimes repackage software. This allows them to customize the configuration; for Microsoft Application Virtualization (App-V) this is a required step. Repackaging removes program files from the safety of a signed container while transferring them to another, thus putting their integrity temporarily at risk.
* Administrators can create and deploy policies that allow program execution based on various signature-based criteria. This is called whitelisting, and is considered to be much safer than relying only on anti-malware tools.

### Redistributable files

The most obvious case for signing individual program files can be made for redistributable files, such as libraries and tools that will be distributed with other programs. Since they are included with installation packages of other programs, they are vulnerable in the entire software development process. From software developers downloading these files from unsafe sources or over unsafe connections, to malware-infected developer PCs, there are more risks of modification or infection than can be managed.

Independent software vendors, and also enterprises with in-house development departments, are increasingly aware of the risk associated with third-party libraries and tools. Once more, the only viable way of ensuring integrity is code signing by the original publisher.

## Tools used for code signing

### SignTool.exe (Windows SDK)

The primary tool for code signing is SignTool.exe from the Windows SDK, which can be called via the command line. When using it, you have to provide the following information:

* The file you want to sign
* The certificate
* The algorithm for calculating the hash digest
* The time stamp server (optional)

The digest algorithm defaults to SHA-1. However, you need to use at least SHA-2 for any practical purpose. The most common choice is SHA-256 (SHA-2 algorithm with 256-bit digests). The certificate can be a PFX file or a certificate from a Windows certificate store.

* If a PFX file contains a password protected private key, the password must be specified using an additional parameter. Alternatively, the private key can be provided by a CSP (see below).
* A certificate can be stored in a certificate store. In this case, you need to provide the certificate name or thumbprint. (A certificate from the Windows certificate store can be chosen automatically, but this is fragile and therefore not recommended.)
* You can also use a hardware security module through the Windows certificate store.
  
### SHA-1 vs SHA-2

SHA-1 is no longer considered secure by the crypto community or Microsoft. Hackers may be able to forge signatures based on this outdated algorithm. Therefore, current versions of Windows will only accept signatures based on SHA-1 digests for files that were signed and time-stamped before 2016. For a signature to be considered valid, the certificate itself as well as any intermediate certificates in the certificate chain must be signed using SHA-2 too. (Note that Windows Explorer will still report SHA-1 signatures as valid in the file properties dialog, but for all purposes they will be rejected by Windows.)

For some time, it was recommended that files should be dual-signed with both SHA-1 and SHA-2 signatures for backwards compatibility, but this seems no longer necessary: SHA-2 has been in Windows starting with Windows 8 and Server 2012. Also, Windows 7 and Server 2008 have been updated in 2015 to support SHA-2.

## Hardware Security Modules (HSMs) {#hsm}

### What is an HSM?

The private key of a certificate must be properly protected. Theft of private keys is the main attack vector for code signing, thereby compromising both users and publishers. Since it’s not possible to effectively protect private keys in files or certificate stores managed by Windows, it is widely recommended that hardware security modules (HSMs) are used for code signing. For Extended Validation certificates, it is even required that keys are managed in HSMs meeting the requirements of FIPS 140-2 level 2.

An HSM is a device that stores secret keys and performs cryptographic operations using these keys. When used properly, the HSM will generate the key itself, and will never expose it to any user or any other device. So when you use a HSM for signing, the HSM will not give the key to the signing software. Rather, the signing software will send the data (the digest) to the HSM and ask for a signature.

{:.panel.warning}
> **HSM limitations**
>
> Note that hardware keys can still be physically stolen, especially when stored on inexpensive USB devices. 
>
> Additionally, even if the key is not stolen, it could be abused by a hacker who gains access to the HSM, or a system that can access the HSM, such as a build server.

### Using HSMs for code signing on Windows

SignTool.exe (or Authenticode in general) cannot use HSMs directly, but it uses the Windows CryptoAPI to access certificates in Windows certificate stores. CryptoAPI uses an extensible architecture for storing certificates: Cryptographic Service Providers (CSPs) 

A CSP can provide these services:

* physical storage of certificates and keys
* implementation of cryptographic algorithms, like encryption, digests and signatures

HSMs usually bring their own installable CSPs. You can think of the CSP as a device driver for the HSM.

{:.panel.info}
> **HSM code signing under the hood**
> 
> Here is what happens when you call SignTool.exe with a certificate from an HSM:
> 
> 1. **SignTool.exe** calls the Windows CryptoAPI (**CAPI**) and passes the **file** and **certificate ID**
> 2. **CAPI** finds the Subject Interface Package (**SIP**) for the **file** type
> 3. The **SIP** computes the file's hash **digest** 
> 4. **CAPI** selects the **HSM**'s Cryptographic Service Provider (**CSP**) based on the certificate
> 5. **CAPI** calls the **CSP** with the **digest** and the **certificate ID**
> 6. The **CSP** submits a *create signature* request to the **HSM**
> 7. The **HSM** creates a **signature**
> 8. The **SIP** writes the **signature** to the **file**

In this process, the HSM will never expose the private key to any other system.

The current implementation of Authenticode and SignTool.exe can only use CryptoAPI, but not the more recent Cryptographic API: Next Generation (CNG). This may result in less then optimal HSM support, since HSM vendors tend to focus their effort on current technoligies.

### HSM buyer’s advice

* USB token HSMs cannot easily be used in virtualized environments and are limited to a single machine. Also, they usually require interactive authentication via PIN codes or other mechanisms that may prevent automation.
* Professional network HSMs solve this problem, but they require extensive operational procedures and staff training.
* As stated above, Authenticode and many other signing mechanisms require CSPs, a technology based on CAPI1 which is otherwise often considered obsolete. HSM support for CSPs therefore varies widely in quality of software, documentation and support.
* Whether a HSM supports SHA-2 code signing is an important consideration when buying a HSM. You should ask specifically for support of SHA-256 in Microsoft Authenticode (or more technically, CSPs and CAPI v1).
* HSMs have varying support for creating certificates via certificate signing requests (CSRs) and accessing them from CSPs. You might have to search for working procedures on the internet or contact the vendor's tech support.
**Warning:** Since this is quite difficult to accomplish, many users resort to importing insecure key files into the HSM, which defies the purpose of the HSM in a critical stage. This is not a secure practice, and does not meet regulations for Extended Validation (EV) certificates!
* Some complex key management systems have a FIPS-certified HSM at their core as part of a larger physical or virtual system. In this case, the FIPS certification might not encompass the entire system. You should ask specifically if FIPS certification is provided for the entire use case of generating keys and CSRs, as well as creating signatures.

---
layout: post
title: "Building Trusted Software for macOS: A how-to guide for digital signing"
image: '2024-09-09-bg'
date: 2024-11-29 06:00:00 +0000
author: Paul Savoie
summary: "To provide a great user experience, you must prevent annoying pop-ups and alerts by digitally signing your app to make it trusted by macOS."
description: "description"
---

The App Store is a powerful force in the digital world, serving as a portal to a massive user base.  Today, there are over 2.2 billion active Apple devices worldwide. Apple’s App Store alone attracts more than [650 million](https://www.apple.com/newsroom/2023/05/developers-generated-one-point-one-trillion-in-the-app-store-ecosystem-in-2022/) weekly active users worldwide. Often, however, it makes sense to bypass the App Store and deliver your applications directly to your users, for example, via a download from your web site. 

The downside of direct distribution are the annoying pop-ups and alerts that can plague users trying install and execute apps. To prevent that experience, you must digitally sign your app to make it trusted by macOS. 

In this post, we’ll show you how to deliver trusted macOS apps, without the added overhead of distributing via the App Store. 

## Gatekeeper
To protect Apple users against untrustworthy apps, macOS relies on technology called ‘Gatekeeper’. Gatekeeper scans software from any source, from an app store, an arbitrary website, an email attachment, wherever. The application that downloads the file (that browser or email client) adds the file attribute `com.apple.quarantine`. The quarantine attribute alerts Gatekeeper to both verify the digital signature, and to check whether it’s notarized, before executing it.  We’ll discuss notarization later. But the critical point is that your software must be digitally signed by a private key associated with a trusted X.509 certificate.

## Formats
Applications on macOS are saved in the `.app` format, a file system folder with a specific layout. If you want to distribute software, you package the `.app` folder using one of two container formats: 

* Disk Images (`.dmg`): Easiest when distributing a single file/app. 
* Installer packages (`.pkg`): Allows for specialized scenarios, such as running code during the installation. 

(Refer to Apple’s [official guide to packaging applications](https://developer.apple.com/documentation/xcode/packaging-mac-software-for-distribution) for more details.)

## Prereqs for Code Signing
First, make sure you have: 

* An [Apple developer account](https://developer.apple.com/programs/enroll/). It costs $99 a year. 
* Xcode 
* Xcode developer tools. 
  * Run `xcode-select --install` on the command line 

## Code Signing Certificates
Apple software is signed using x.509 code signing certificates. 

### Certificate Signing Requests
Code Signing Certificates link metadata, such as the name and place of registration of your company, to an asymmetric, public/private key pair. You can request a certificate from a Certificate Authority (CA), providing the metadata and the public key. This request is called a Certificate Signing Request (CSR); the CA verifies that the metadata is correct before issuing and signing the certificate. 

The private key remains under your control. It must be securely stored. Anybody in possession of the private key can sign software in the name of your organization. 

### Storage of the Private Key
Apple’s [documentation](https://developer.apple.com/help/account/create-certificates/create-a-certificate-signing-request) refers to creating the keypair on a Mac and storing it in the local keychain, protected by a password. To make the keys available on other build/developer machines, you have to share the key pair. Popular tools, such as [fastlane](https://docs.fastlane.tools/actions/match/), recommend storing certificates and encrypted private keys in a central location where they can be accessed by any developer. Of course, this introduces risk. It makes it easier for an attacker to steal the key file and encryption password to sign any software in your company’s name! Since no further authentication is required, this attack vector is especially dangerous when publishing software outside the confines and relative security of the App Store. 

In the Windows world, the CA/Browser forum mandates that private keys for code signing certificates are generated on Hardware Security Modules (HSM) where they are protected from theft. It’s a good idea to follow these guidelines for Apple software as well. 

Cloud-based code signing solutions ([SignPath](https://about.signpath.io), for one) make it easy to use an HSM for code signing. SignPath provides an option, via the web-based console, to generate a certificate signing request (CSR) for a  private key generated on hardware. It’s a simple point-and-click operation, with absolutely zero configuration or provisioning hassle. 

### Creating a Test Certificate
These days, everyone builds software on continuous integration systems. No matter which system you use, it’s a good idea to bake code signing into the build process itself. This will minimize the hassle of doing manual signing or writing scripts at build and release time. 

But you probably don’t want to sign all your nightly builds with an official Apple code signing certificate.  It’s easier to just use a test certificate. One hitch is that you need to configure your system to trust that test certificate. 

To make it trusted, you can install the test certificate on a keychain in your macOS system and enable the “Code Signing” trust setting. Gatekeeper will still identify and complain about the missing notarization though. If you’re doing manual testing, you can right-click the application and ignore the warning. If you’re testing programmatically, you can remove the quarantine flag. Use the following command to avoid Gatekeeper checks altogether: 

~~~
xattr -d com.apple.quarantine ~/Downloads/sample.app 
~~~

_Important: Apple’s `codesign` tool, which is used for signing software, does not require certificates to be issued by Apple. Package Installers (`.pkg`) are a notable exception. The `.pkg` format only supports official certificates by Apple. Test certificates cannot be used._

### Creating a Release Certificate
If you want all the Apple devices in the world to trust your application, you need an official certificate from Apple. Those certificates are trusted by default on all Apple devices. You can get an official Apple certificate from the [developer portal](https://developer.apple.com/documentation/xcode/packaging-mac-software-for-distribution).  Apple supports a variety of certificates. Depending on the chosen distribution format, you need to create either a Developer ID Installer (for `.pkg`) or a Developer ID Application (for `.dmg` and `.app`) certificate. 

![Screenshot of Apple's Developer Portal](/assets/posts/2024-10-25_developer_portal.png)

After choosing the certificate type, you can upload your Certificate Signing Request (CSR). (Hopefully, you generated the private key for the CSR on an HSM.)  Note that the underlying key pair must be generated using the **RSA algorithm** with a length of **2048 bits**. Apple will issue the certificate, and then you can import it into your code signing solution of choice.

### Putting Code Signing Certificates to Work
You can’t distribute that HSM-backed key to your build/developer machines. That key will never leave the HSM. So how do you use it for code signing in your continuous integration pipeline?  Simple. You just need an application known as CryptoTokenKit. It registers your certificate  in the system’s keychain, along with an identifier for the private key. During the signing operation, Apple’s crypto backend calls the CryptoTokenKit extension, which in turn forwards any signing operation to the signing service (in our case, SignPath.io). If you’re interested in the technical details, there’s an excellent deep dive into the CryptoTokenKit architecture by Timothy Perfitt on [this website](https://twocanoes.com/cryptotokenkit-communication/). 

The documentation for the **SignPath CryptoTokenKit** can be found [here](/documentation/crypto-providers/macos).

## Notarization
> The Apple notary service is an automated system that scans your software for malicious content, checks for code-signing issues, and returns the results to you quickly. If there are no issues, the notary service generates a ticket for you to staple to your software; the notary service also publishes that ticket online where Gatekeeper can find it. 

If you want to avoid warning dialogs during install, notarization is required when distributing your software outside of the AppStore. For more details, see the [official documentation](https://developer.apple.com/documentation/security/notarizing-macos-software-before-distribution). To automate this process, Apple provides the `notarytool` and `stapler` executables. The former uploads the artifact to the Apple servers for automated scanning and the latter attaches the notarization to the software. You will have to authenticate against Apple using an [app-specific password](https://support.apple.com/en-us/102654). According to Apple, notarization is completed within 5 minutes for most software and within 15 minutes for 98% of uploaded software. That’s fast enough to include it in most automated builds. However, note that the first submission can take up to day. 

_Notarization requires a signature with a valid release certificate issued by Apple. You must use release certificates, or it won’t work._

### Hardened Runtime
A hardened runtime is a pre-requisite for notarization. Follow the [official article](https://developer.apple.com/documentation/xcode/configuring-the-hardened-runtime) by Apple to add a hardened runtime capability to your app. You need to list all exceptions to the restrictions explicitly. 

> The Hardened Runtime is a collection of system-enforced restrictions that disable a set of functional capabilities, such as loading third-party frameworks, and prohibit access to restricted resources, such as the device’s built-in camera, to prevent certain classes of exploits from compromising the runtime integrity of your macOS app. 

When signing your software with a hardened runtime, you need to add the `–-options=runtime` parameter to the `codesign` call. Make sure to test your app thoroughly after enabling the hardened runtime to ensure that all use-cases still work. 

### The `get-task-allow` entitlement 

When building the software automatically using the `xcodebuild` tool, there is another special setting to consider: Apple automatically injects an entitlement used for debugging at build time which is incompatible with the notarization process. You can disable this behavior by passing the `CODE_SIGN_INJECT_BASE_ENTITLEMENTS=NO` flag to your `xcodebuild` call. See [here](https://developer.apple.com/documentation/security/resolving-common-notarization-issues#Avoid-the-get-task-allow-entitlement) for more technical details.

## Sample
Let’s get hands on! First you'll need a Free Trial account on Signpath. Sign up here: https://login.signpath.io/ 

Below is a code snippet that highlights how to sign and notarizes an application. For a full working sample, visit the [demo repository](https://github.com/SignPath/demo-macos).

{% raw %}
~~~bash

###  Install SignPath MacOSCryptoTokenKit
curl -o SignPathCryptoTokenKit.dmg https://download.signpath.io/cryptoproviders/macos-cryptotokenkit/2.0.0/SignPathCryptoTokenKit.dmg
codesign -dv --verbose SignPathCryptoTokenKit.dmg               # check signature
hdiutil attach ./SignPathCryptoTokenKit.dmg -mountroot ./tools  # mount the disk image

### Register the CryptoTokenKit
open "./tools/SignPathCryptoTokenKit/SignPathCryptoTokenKit.app" --args \
  --organization-id $SIGNPATH_ORGANIZATION_ID \
  --project-slug $SIGNPATH_PROJECT_SLUG \
  --signing-policy-slug $SIGNPATH_SIGNING_POLICY_SLUG

sleep 20 # wait for token to be registered

### Sign the sample.app file
codesign -f --timestamp --options=runtime \
  -s $CERTIFICATE_SUBJECT_NAME \
  --entitlements sample/sample/sample.entitlements \
  ./build/sample.app

codesign -dv --verbose ./build/sample.app   # check signature

### Create and sign a .dmg file
hdiutil create -format UDZO -srcfolder ./build/sample.app ./build/sample.dmg

codesign -f --timestamp --options=runtime \
  -s $CERTIFICATE_SUBJECT_NAME \
  --entitlements sample/sample/sample.entitlements \
  ./build/sample.dmg

codesign -dv --verbose ./build/sample.dmg   # check signature

### Notarize the .dmg file
xcrun notarytool submit ./build/sample.dmg \
  --apple-id $APPLE_ID \
  --team-id $APPLE_TEAM_ID \
  --password $APPLE_NOTARIZATION_APP_SPECIFIC_PASSWORD \
  --wait \
  --timeout 15m

xcrun stapler staple ./build/sample.dmg # staple the notarization result

~~~ 
{% endraw %}

## Conclusion 

You now have everything you need to start building and releasing trusted applications for macOS, directly to your user base. The Apple App Store and enterprise distribution channels provide safe and convenient ways to reach users, but direct distribution is often preferred for Enterprise software. However, it does come with the added responsibility of properly signing and notarizing your applications. By following these requirements and keeping your keys secure, you can safely distribute your application outside of the App Store, while still ensuring a quality end user experience with your trustworthy apps. 
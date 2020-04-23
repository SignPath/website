---
title: FAQ - SignPath.io
header: FAQ
layout: resources
---

## Do I need to purchase a code signing certificate separately from my SignPath subscription?

Yes, SignPath.io provides a code signing as-a-service solution, but only Certificate Authorities (CAs) can issue code signing certificates. 

We recommend to create a certificate signing request (CSR) on SignPath.io and use it to buy a code signing certificate from a CA. That way, your private key is never exposed and is securely generated and stored on our hardware security module (HSM). You can buy a code signing certificate from any CA, such as **TODO**

## Should I buy an extended validation (EV) or a regular code signing certificate?

Extended validation certificates include stricter identity checks by the certificate authorities (CAs). They are considered more trustworthy: 

* Software signed with EV certificates is trusted by Microsoft SmartScreen right from the beginning. 
* Windows drivers need to be signed using an EV certificate.
* Private keys of EV certificates need to be stored on a physical device (such as a USB token or hardware security module (HSM))

We recommend buying an EV certificate, even if they are more expensive.

Please contact us if you want to buy an EV certificate, so we can provide instructions and the proof of HSM required by your CA.

## Why does the AppVeyor integration webhook return a 400 (Bad Request) error message?

We perform several checks on the AppVeyor project. Unfortunately, AppVeyor does not display the error message we return in the Webhook call. We therefore integrated a feature to send it out via email. You can enter a notification email address for the CI user is used to call the Webhook and will receive a more detailed error message. Common mistakes include:

* Did you set the API token correctly, as described [here](https://about.signpath.io/documentation/build-system-integration#appveyor)?
 * Did you include the "Bearer prefix" and omitted all quotes when encrypting the value on AppVeyor?
* Did you add the CI user as a submitter to the signing policy?
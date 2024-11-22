---
header: Double Authentication Proxy
layout: resources
toc: true
show_toc: 3
description: Double Authentication Proxy
---

The Double Authentication Proxy is a connector that will let you use mutual TLS (TLS/SSL client certificates) for build node authentication. 

This results in a two-fold authentication strategy:

* CI User: a project-specific token must be presented to submit a signing request (usually stored as a secret in the CI system's project configuration)
* Build node: only specific build nodes are able to submit the signing request

You may configure the system to accept certificates based on
* subject/distinguished name conditions (e.g. common name or organizational unit)
* the issuer (e.g. issued by a certain immediate certificate)
* a Microsoft Certificate Server _template ID_ (see below)

{:.panel.tip}
> **Use Active Directory computer groups via Microsoft Certificate Server**
>
> This is a very straightforward way to authorize specific groups of build nodes for SignPath:
> 
> * Include all build nodes with certain security properties in a computer group
> * Use Microsoft Certificate Server to assign computer certificates to this group (we recommend using short-lived certificates, i.e. days or weeks, for security critical groups)
> * Specify the template ID in the Double Authentication Proxy configuration
> * Register the Double Authentication Proxy as trusted build system (see [configuration](#configuration))
> * Submit signing requests using mTLS, e.g. using the [PowerShell cmdlet](/documentation/powershell/Submit-SigningRequest). Use the template ID to select the correct certificate client certificate.

This diagram shows how machine certificates, Double Authentication Proxy and SignPath work together:

![Double Authentication Proxy architecture diagram](/assets/img/resources/documentation/double-authentication-proxy.png){:width="500px"}

Contact [our support team](/support) for installable container images and documentation.



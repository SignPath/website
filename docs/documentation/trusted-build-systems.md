---
main_header: Documentation
sub_header: Trusted Build Systems
layout: resources
toc: true
show_toc: 3
description: Documentation for providing Trusted Build Systems to SignPath
---

{% include editions.md feature="pipeline_integrity.trusted_build_systems" value="Optional" %}

## Abstract

Trusted build systems create a trust relationship between SignPath and certain systems used in your build pipeline. They are typically implemented as connectors and configured in SignPath. 

### Origin verification {#abstract-origin-verification}

The primary function of trusted build systems is to serve as the foundation of origin verifcation. This feature allows build systems to provide reliable origin metadata with your signing requests, so that SignPath can execute advanced policies based on trusted information. 

See [origin verifcation](/documentation/origin-verification) for details.

### Direct use {#abstract-direct-use}

Trusted build systems can also be used to simply restrict signing to certain build systems. Use them to make sure that certain signing policies and certificates can only be used from build agents with specific properties.

See [below](#direct-use) for details.

## Configuration

To add a trusted build system to your SignPath organization:
* go to the **Trusted Build Systems** page (top menu) and click **Add**.
* enter a name, slug and (optionally) description
* remember the token that is created as a result

The token must then be used to configure the connector (see connector documentation). You can now link this trusted build system to your projects.

To use a trusted build system in a project:
* open the project
* find the **Trusted build systems** section
* click **Link**
* select one of the trusted build systems of your organization
* depending on the type of build system, you might need to add authentication information and/or an artifact path (see your connector's documentation)

The build system can now be used to submit signing requests with origin metadata. A trusted build system is required for signing policies with origin verification enabled.

## Direct use of trusted build systems {#direct-use}

Possible policies include:

* Prevent root access: allow code signing only from build agents that don't allow any build scripts to modify systems settings
* Prevent network access: guarantee that artifacts cannot be arbitrarily received from internet sources
* Restrict user access: don't let development teams connect to the build agent, with or without administrative permissions (if you need build nodes with wider permission sets, consider separating the process of compilation and packaging from other steps such as running tests)
* Require current security policies: avoid misuse of recently restored or otherwise not up-to-date build agents

See [below](#da-proxy) for a simple way to achieve this using machine certificate enrollment. 

### Double Authentication Proxy {#da-proxy}

Double Authentication Proxy is a connector that will let you use mutual TLS (TLS/SSL client certificates) for build node authentication. 

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
> * Include all buiild nodes with certain security properties in a computer group
> * Use Microsoft Certificate Server to assign computer certificates to this group (we recommend using short-lived certificates, i.e. days or weeks, for security critical groups)
> * Specify the template ID in the Double Authentication Proxy configuration
> * Register the Double Authentication Proxy as trusted build system (see [configuration](#configuration))
> * Submit signing requests using mTLS, e.g. using the [PowerShell cmdlet](/documentation/powershell/Submit-SigningRequest). Use the template ID to select the correct certificate client certificate.

This diagram shows how machine certificates, Double Authentication Proxy and SignPath work together:

![Double Authentication Proxy architecture diagram](/assets/img/resources/documentation/double-authentication-proxy.png){:width="500px"}

Contact [our support team](/support) for installable container images and documentation.



---
header: Trusted Build Systems
layout: resources
toc: true
show_toc: 3
description: Documentation for providing Trusted Build Systems to SignPath
---

{% include editions.md feature="pipeline_integrity.trusted_build_systems" value="optional" %}

## Abstract

Trusted build systems create a trust relationship between SignPath and certain systems used in your build pipeline. They are typically implemented as connectors and configured in SignPath. 

### Origin verification {#abstract-origin-verification}

The primary function of trusted build systems is to serve as the foundation of origin verifcation. This feature allows build systems to provide reliable origin metadata with your signing requests, so that SignPath can execute advanced policies based on trusted information. 

See [origin verifcation](/origin-verification) for details.

### Direct use {#abstract-direct-use}

Trusted build systems can also be used to simply restrict signing to certain build systems. Use them to make sure that certain signing policies and certificates can only be used from build agents with specific properties.

See [below](#direct-use) for details.

## Supported build systems

The following build systems are currently supported by SignPath:

* [GitHub](/trusted-build-systems/github)
* [Jenkins](/trusted-build-systems/jenkins)
* [Azure DevOps](/trusted-build-systems/azure-devops)
* [AppVeyor](/trusted-build-systems/appveyor)

Generic support for any build system is available with the [Double Authentication Proxy](/trusted-build-systems/double-authentication-proxy).

## Configuration

To add a trusted build system to your SignPath organization:
* go to the **Trusted Build Systems** page (top menu) and click **Add custom** or **Add predefined**.
* enter a name, slug and (optionally) description
* for _custom_ Trusted Build Systems, remember the token that is created as a result

### Custom Trusted Build Systems

The token that was generated must be used to configure the connector (see the connector documentation for the respective build system). You can now link this trusted build system to your projects.

To use a trusted build system in a project:
* open the project
* find the **Trusted build systems** section
* click **Link**
* select one of the trusted build systems of your organization
* depending on the type of build system, you might need to add authentication information and/or an artifact path

The build system can now be used to submit signing requests with origin metadata. A trusted build system is required for signing policies with origin verification enabled.

## Direct use of trusted build systems {#direct-use}

Possible policies include:

* Prevent root access: allow code signing only from build agents that don't allow any build scripts to modify systems settings
* Prevent network access: guarantee that artifacts cannot be arbitrarily received from internet sources
* Restrict user access: don't let development teams connect to the build agent, with or without administrative permissions (if you need build nodes with wider permission sets, consider separating the process of compilation and packaging from other steps such as running tests)
* Require current security policies: avoid misuse of recently restored or otherwise not up-to-date build agents

See the [Double Authentication Proxy](/trusted-build-systems/double-authentication-proxy) for a simple way to achieve this using machine certificate enrollment. 

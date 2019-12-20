---
main_header: Documentation
sub_header: Managing Users
layout: resources
toc: true
---

## Overview

SignPath is designed to make sure that people in charge of security have full control over code signing. Therefore, it makes sense to assign the role of *organization administrator* to security persons, such as InfoSec officers. It is also possible to assign administrative privileges to people in the development team. This can be on a permanent basis, or only temporarily to speed up initial setup. You can go with a model where every change has to be implemented by a dedicated administrator, or you can decentralize administration and have InfoSec review change audit logs regularly. Use the model that works best for your organization.

If you aim for the highest security, we recommend assigning the administrator role only to InfoSec staff and have them working directly with the development teams.

## User types

* **Administrators** have control over your SignPath organization, including the management of certificates and definition of policies
* **Regular users** are allowed to submit artifacts for signing according to the defined policies (see [Signing code](/documentation/signing-code))
* **Support users** are used to grant SignPath support staff access to your organization. You can enable them by selecting *Authorize support user* in the *More* menu on your organization page. Support users have adminstrative privileges and can be disabled to prevent further access.

Additionally, you can create **CI users** for integrating with your automated build systems.

## Notifications and audit logs

Signpath will inform you and your team about signing requests:

* Administrators will be notified about completed and re-submitted signing requests
* Users will be notified about the status of a signing request they created or when their approval is required.

Additionally, you can use the web application to see a full activity audit for each entity, including users, certificates, projects, signing policies and signing requests.
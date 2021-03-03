---
main_header: Documentation
sub_header: Managing Users
layout: resources
toc: true
---

## Overview

## Interactive users

An interactive user account is required for people who administer your SignPath organization or interact with the application, such as submitters or approvers. Typically, most software developers will not directly use SignPath on a regular basis, but rather interact with the SCM and CI systems that integrate with SignPath.

### User roles

* **Administrators** have control over your SignPath organization, including the management of certificates and definition of policies.
* **Regular users** are allowed to submit and/or signing requests according to the signing policies (see [Signing code](/documentation/signing-code)).

### Permissions

SignPath is designed to make sure that people in charge of security have full control over code signing. Therefore, it makes sense to assign the role of *organization administrator* to security persons, such as InfoSec officers. It is also possible to assign administrative privileges to people in the development team. This can be on a permanent basis, or only temporarily to speed up initial setup. You can go with a model where every change has to be implemented by a dedicated administrator, or you can decentralize administration and have InfoSec review change audit logs regularly. Use the model that works best for your organization.

If you aim for the highest security, we recommend assigning the administrator role only to InfoSec staff and have them working directly with the development teams.

Note that all information is accessible to all users within an organization.

## CI users

CI user accounts are used to integrate SignPath into your build automation. They use API tokens instead of usernames and passwords. We recommend that you store these API tokens in your CI system's build settings as secret values.

## Support users

By default, the SignPath support team does not have access to your data. 

If you require assistance from our support team, please select *Authorize support user* in the *More* menu on your organization page. 

The support user account has administrative privileges. If you disable it after your issue is resolved, please remember to enable it for your next support request.

## Notifications and audit logs

Signpath will inform you and your team about signing requests:

* Administrators will be notified about completed and re-submitted signing requests
* Users will be notified about the status of a signing request they created, or when their approval is required

The web application has a full activity audit for each signing request, but also for administrative objects (users, certificates, projects, signing policies and artifact configurations).
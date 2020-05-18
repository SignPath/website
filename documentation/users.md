---
main_header: Documentation
sub_header: Managing Users
layout: resources
toc: true
---

## Overview

SignPath is designed to make sure that people in charge of security have full control over code signing. Therefore, it makes sense to assign the role of *organization administrator* to security persons, such as InfoSec officers. It is also possible to assign administrative privileges to people in the development team. This can be on a permanent basis, or only temporarily to speed up initial setup. You can go with a model where every change has to be implemented by a dedicated administrator, or you can decentralize administration and have InfoSec review change audit logs regularly. Use the model that works best for your organization.

If you aim for the highest security, we recommend assigning the administrator role only to InfoSec staff and have them working directly with the development teams.

## User roles

* **Administrators** have control over your SignPath organization, including the management of users, projects, policies and certificates.
* **Regular users** have read access to all data. Additional permissions including [signing code](/documentation/signing-code) are assigned through [signing policies](https://about.signpath.io/documentation/projects#signing-policies).

## Special user types

### CI users

CI user accounts are used to integrate SignPath into your build automation. They use API tokens instead of usernames and passwords. We recommend that you store these API tokens in your CI system's build settings as secret values.

Like regular users, CI users have full read access and are assigned permissions through signing policies.

### Support users

A support user account can be added to grant SignPath support access to your organization. Select *Authorize support user* in the *More* menu on your organization page. Support users have full administrative privileges. You can disable them to prevent further access.

## Administrators in Open Source organizations

For free Open Source subscriptions, the permissions of administrators are limited to ensure that SignPath Foundation certificates can only be used for assigned projects with origin verification.

Specifically, administrators of OSS projects cannot

* create projects
* edit project metadata (name, key, status, repository URL and description)
* add or edit certificates

## Notifications and audit logs

Signpath will inform you and your team about signing requests:

* Administrators will be notified about completed and re-submitted signing requests
* Users will be notified about the status of a signing request they created, or when their approval is required

The web application has a full activity audit for each signing request, but also for administrative objects (users, certificates, projects, signing policies, and artifact configurations).
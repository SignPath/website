---
main_header: Documentation
sub_header: Managing Users
layout: resources
toc: true
description: Documentation for SignPath user management
---

## Overview

## Interactive users

An interactive user account is required for people who administer your SignPath organization or interact with the application, such as submitters or approvers. Typically, most software developers will not directly use SignPath on a regular basis, but rather interact with the SCM and CI systems that integrate with SignPath.

### User accounts and SignPath organizations

Note that user accounts are not the same as users in an organization.

* Use the [login page] to create a user account or sign in.
* Users must be invited to SignPath organizations in order to use them.
* A user account may be used for one or more SignPath organizations. 

| User account type         | Provider                              | How to use                            | Editions   |
|---------------------------|---------------------------------------|---------------------------------------|------------|
| Social account            | Google or Microsoft                   | Click _Google_ or _Microsoft_ to use an existing user account
| Username and password     | [Okta] provided by SignPath           | Click _Sign up_ at first use, then enter email address as _Username_
| Enterprise single sing-on | Your Organization's identity provider | Enter email address as _Username_     | Enterprise |

<div class="panel info" markdown="1">
<div class="panel-header">Account unification</div>

All social accounts and username/password accounts using the same email address are considered the same account.
</div>

### Invitation

In order to add a user to a SignPath organization, an invitation email is sent to the user. 

* On the _Users and Groups_ page, click _Invite user_.
* Enter the name and email address.

Accepting invitations:

* Users must use the invitation within {{ site.data.settings.TokenValidityOptions.InvitationEmailTokenValidityDuration }} days. After that, a new invitation must be sent for security reasons (click _Reinvite_ on the user's page).
* Users must sign in to accept an invitation. If they are already signed in, they have the option to sign out and use another account to login first. Accepting the invitation will link the organization's user to the active user account.

### User roles

| Role               | Global Permissions                                                                                              | Consider assigning to         |
|--------------------|-----------------------------------------------------------------------------------------------------------------|-------------------------------|
| **Administrator**  | Control the SignPath organization, including certificate management, user management, and projects and policies | InfoSec, PKI, user management staff
| **Global readers** | Read all information, including signing requests artifacts for all projects and signing policies                | Auditors
| **Regular users**  | No specific permissions                                                                                         | Team administrators and members

### Permissions

In addition to these global user roles, the following permissions are assigned per project or signing policy:

* Projects: [*Readers* and *Configurators* permissions](projects#project-settings)
* Signing policies: [*Submitters* and *Approvers* permissions](projects#signing-policies)

Read permissions:

* All users can view configuration information and metadata
* Access to artifacts is restricted to users with read permissions for the signing request
* Users have read permissions for a Signing Request if they have
  * an appropriate global role: *Administrator*, *Global Reader*
  * a role for the Project: *Reader*, *Configurator*
  * a role for the Signing Policy: *Submitter*, *Approver*

### Notifications

SignPath will inform you and your team about signing requests. Every user can select the notification level for each signing policy separately. The following options are available:

* *All*: You receive all notifications for the signing request
* *Default:* See below
* *None*: You don't receive any notifications

#### Default notifications

By default, only users who participate in the signing request as either a submitter or an approver will receive notifications.

* *Approvers* are informed when a signing request needs to be approved, when the number of required approvals has been reached or when the signing request has been denied. The person who performed the final approval is also notified when the signing request has completed or failed or when it is retried.
* *Submitters* receive notifications for all status changes of the signing request.


## CI users

CI user accounts are used to integrate SignPath into your build automation. They use API tokens instead of usernames and passwords. We recommend that you store these API tokens in your CI system's build settings as secret values.

## Support users

By default, the SignPath support team does not have access to your data. 

If you require assistance from our support team, please 

* go to your *organization* page (click the organization name in the upper right corner)
* select *Authorize support user* in the *More* menu on your organization page

The support user account has administrative privileges. If you disable it after your issue is resolved, please remember to enable it for your next support request.

Please always mention your *Organization ID* in support requests.

## Audit logs

The web application has a full activity audit for each signing request, but also for administrative objects (users, certificates, projects, signing policies and artifact configurations).

[Okta]: https://www.okta.com/
[login page]: https://login.signpath.io/
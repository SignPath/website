---
main_header: Documentation
sub_header: Managing Users
layout: resources
toc: true
description: Documentation for SignPath user management
---

## Overview

SignPath supports the following type of users:

* [Interactive users](#interactive) can log into the web application to perform various activities depending on their [role](#roles)
* [CI users](#ci) are used to integrate with CI systems and other applications through SignPath's REST APIs
* The [*support user*](#support) account is used to grant (and revoke) access for SignPath support staff

## Interactive users {#interactive}

An interactive user account is required for people who administer your SignPath organization or interact with the application, such as submitters or approvers. Typically, most software developers will not directly use SignPath on a regular basis, but rather interact with the SCM and CI systems that integrate with SignPath.

### User accounts and SignPath organizations

To get access to an existing SignPath organizations, users must be [invited](#invitations) or [synchronized](#directory-sync).

Only [sign up][login page] for a new user account if you want to evaluate SignPath using a free trial subscrition.

| User account type         | Provider                              | How to use                            | Editions   |
|---------------------------|---------------------------------------|---------------------------------------|------------|
| Social account            | Google or Microsoft                   | Click _Google_ or _Microsoft_ to use an existing user account
| Username and password     | [Okta] provided by SignPath           | Click _Sign up_ at first use, then enter email address as _Username_
| Enterprise single sing-on | Your Organization's identity provider | Enter email address as _Username_     | Enterprise |

A user account may be used for one or more SignPath organizations. 

<div class="panel info" markdown="1">
<div class="panel-header">Account unification</div>

All social accounts and username/password accounts using the same email address are considered the same account.
</div>

### Invitations {#invitations}

When a user is added to a SignPath organization manually, an invitation email is sent to the user. 

* On the _Users and Groups_ page, click _Invite user_.
* Enter the name and email address.

Accepting invitations:

* Users must use the invitation within {{ site.data.settings.TokenValidityOptions.InvitationEmailTokenValidityDuration }} days. After that, a new invitation must be sent for security reasons (click _Reinvite_ on the user's page).
* Users must sign in to accept an invitation. If they are already signed in, they have the option to sign out and use another account to login first. Accepting the invitation will link the organization's user to the active user account.

### Directory synchronization {#directory-sync}

Available for Enterprise subscriptions
{: .badge.icon-signpath}

SignPath provides synchronization with Microsoft Entra ID/Azure Active Directory via SCIM. This allows you to perform user management in your organization's directory and use existing users and groups.

See [directory synchronization](/documentation/directory-synchronization). 

### API tokens {#interactive-api-token}

Users can add API tokens to their own user account:

  * Click your user name (upper right corner) and choose _My profile_
  * Click _Generate token_ in the _API Token_ section

<div class="panel warning" markdown="1">
<div class="panel-header">Remember your token</div>

API tokens are only displayed when generated. Store them in a safe location. If an API token is lost, you need to regenerate it, potentially invalidating existing configurations using the previous token.

We recommend using a password safe for personal API tokens.
</div>

## CI users {#ci}

CI user accounts are primarily used to integrate SignPath into your build automation. 

They can also be used for other automation tasks. You may need to consider adding [roles](#roles) to CI users for those.

CI users can only authenticate with an API token. 

<div class="panel warning" markdown="1">
<div class="panel-header">Remember your token</div>

API tokens are only displayed when generated. Store them in a safe location. If an API token is lost, you need to regenerate it, potentially invalidating existing configurations using the previous token.

We recommend that you store API tokens used for CI integration in your CI system's build settings as secret values.
</div>

<div class="panel tip" markdown="1">
<div class="panel-header">Account unification</div>

We recommend using a dedicated CI user per project, but you may opt to share CI users for all projects in a team.

If you don't use [origin verification](/documentation/origin-verification), you should create a CI user per signing policy and strongly restrict access to the user's API token through your CI systems _secrets_ configuration.

Example: Assume _Team 1_ has two projects _A_ and _B_, each with _test-signing_ and _release-signing_ signing policies. Consider creating CI users as follows:

| Using origin verification | CI user per project                                       | CI user per team
|---------------------------|-----------------------------------------------------------|---------------------------------------
| **Yes**                   | `PrjA`, `PrjB`                                            | `Team1`
| **No**                    | `PrjA-test`, `PrjA-release`, `PrjB-test`, `PrjB-release`  | `Team1-test`, `Team1-release`

</div>

## Support users {#support}

By default, the SignPath support team does not have access to your data. 

If you require assistance from our support team, please 

* go to your *organization* page (click the organization name in the upper right corner)
* select *Authorize support user* in the *More* menu on your organization page

The support user account has administrative privileges. If you disable it after your issue is resolved, please remember to enable it for your next support request.

Please always mention your *Organization ID* in support requests.

## User roles {#roles}

| Role                          | Global permissions                                                                               | Consider assigning to
|-------------------------------|--------------------------------------------------------------------------------------------------|----------------------------
| **Global Administrator**      | Control the entire SignPath organization                                                         | Subscription owner
| **Certificate Administrator** | Certificate management                                                                           | PKI team
| **User Administrator**        | User management                                                                                  | User management 
| **Project Administrator**     | Project and policy configuration, Docker repository management                                   | Dev/DevOps policy owners
| **Global Reader**             | Read all information, including signing requests artifacts for all projects and signing policies | Auditors
| **Regular User**              | No global permissions                                                                            | Team members and administrators

**Global Administrators** have the following permissions:

* Combined permissions of the limited administrator roles (certificate, user and project)
* Trusted build system management
* Delete the SignPath organization

<div class="panel tip" markdown="1">
<div class="panel-header">Role distribution hints</div>

* **User administration** may be performed in your organization's directory and synchronized to SignPath. 
* **Project administration** may be performed by a dedicated team. Creating projects and policies, and assigning certificates based on these policies, should be performed based on your organization's policies and approval processes. Day to day configuration changes may be delegated via each project's _configurators_ role.
</div>

## Permissions {#permissions}

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

## Notifications {#notifications}

SignPath will inform you and your team about signing requests. Every user can select the notification level for each signing policy separately. The following options are available:

* *All*: You receive all notifications for the signing request
* *Default:* See below
* *None*: You don't receive any notifications

### Default notifications

By default, only users who participate in the signing request as either a submitter or an approver will receive notifications.

* *Approvers* are informed when a signing request needs to be approved, when the number of required approvals has been reached or when the signing request has been denied. The person who performed the final approval is also notified when the signing request has completed or failed or when it is retried.
* *Submitters* receive notifications for all status changes of the signing request.

## Audit logs {#audit}

SignPath maintains a full audit log for each signing request, but also for administrative changes (users, certificates, projects, signing policies and artifact configurations).

[Okta]: https://www.okta.com/
[login page]: https://login.signpath.io/
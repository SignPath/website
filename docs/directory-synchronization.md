---
header: Directory synchronization
layout: resources
toc: false
description: Documentation for SignPath directory synchronization using Microsoft Entra ID
---

## Directory synchronization with Microsoft Entra ID/Azure Active Directory

Directory synchronization is supported via the SCIM protocol. This page describes the configuration for Microsoft Entra ID (previously Azure Active Directory). 

### Steps


#### 1. Create a new enterprise application in Microsoft Entra ID

In the _Azure Portal,_ go to _Microsoft Entra ID_ / _Enterprise Applications_ and create a new application. Select "Create your own application" on the top.

![Microsoft Entra ID - creating a new custom application](/assets/img/resources/scim/scr_01-create-app.png){:.margin-left}

#### 2. Define SignPath application roles in the application registration

Go back to the Microsoft Entra ID main page, select _App registrations_, change the list to _All Applications_ and find the application registration you just created. 

![Microsoft Entra ID - finding the App registration](/assets/img/resources/scim/scr_02a-select-app-registration.png){:.margin-left}

Under _App roles_, create an entry for each role in SignPath using "Users/Groups" as allowed member types:

| Display name                       | Value                                                                  
|------------------------------------|------------------------------
| SignPath Global Administrator      | `GlobalAdministrator` 
| SignPath Certificate Administrator | `CertificateAdministrator` 
| SignPath User Administrator        | `UserAdministrator` 
| SignPath Project Administrator     | `ProjectAdministrator`
| SignPath Global Reader             | `GlobalReader`
| SignPath Regular User              | `RegularUser`

_Note: For more information about the permissions assigned to each role, see the [user documentation](/users#roles)._

![Microsoft Entra ID - create app roles](/assets/img/resources/scim/scr_02b-create-app-roles.png){:.margin-left}

#### 3. Create a synchronization user on SignPath

In your SignPath organization, create a CI user, remember the _Api Token_ and change its role to _Directory Synchronizer_. This user will be the service account on SignPath that creates/updates the user and group entities.

#### 4. Configure provisioning for the enterprise application

Go back to the Microsoft Entra ID main page, select _Enterprise applications_ and select the application you have created in step 1. 

Under _Provisioning_, click _Get started_, then enter the following settings:

* Use _Automatic_ for the _Provisioning mode_.
* Enter `https://scim.connectors.`<wbr>`signpath.io/scim/<your-organization-id>/dry-run` as a _Tenant URL_. 
* Use the SignPath CI User _API token_ from step 3 as the _Secret Token_.

![Microsoft Entra ID - select provisioning](/assets/img/resources/scim/scr_04a-select-provisioning.png){:.margin-left}

{:.panel.tip}
> **Dry-Run mode**
> 
> By specifying the `/dry-run` postfix in the _Tentant URL_, you tell the SignPath connector to only simulate the updates/changes, but not perform any write operations. We recommend testing the setup with this configuration and to remove the `/dry-run` URL segment when done (see step 7).

Click "Test connection" to confirm that the configuration is correct. When successful, save the provisioning settings.

#### 5. Configure provisioning mapping for the enterprise application

Close the dialog, select _Provisioning_, open the _Mapping_ group and click _Azure Active Directory Users_.

![Microsoft Entra ID - select mapping](/assets/img/resources/scim/scr_05a-mapping-part1.png){:.margin-left}

On the next page, check _Show advanced options_ and click on _Review your schema here_.

![Microsoft Entra ID - select mapping](/assets/img/resources/scim/scr_05b-mapping-part2.png){:.margin-left}

Then, replace the existing JSON with the one from [this link](/assets/MicrosoftEntraIDScimConfiguration.json) and save the schema. After closing the dialog, you **need to refresh the Azure page**, then the _Attribute Mappings_ will be pre-filled for you. Click on the row that maps to "externalId" in the _customappsso Attribute_ column.

![Microsoft Entra ID - replace mapping](/assets/img/resources/scim/scr_05c-mapping-part3.png){:.margin-left}

Change the _Mapping type_ to "Expression" and enter the following expression: `Append("<your-sso-identifier>:", [objectId])`.

![Microsoft Entra ID - mapping expression](/assets/img/resources/scim/scr_05d-mapping-part4.png){:.margin-left}

{:.panel.tip}
> **Mapping expression**
>
> To find out the value for `<your-sso-identifier>:`, open an exising user on SignPath. In the _Identity_ field, everything before the first `:` is your SSO identifier.
> 
> ![SignPath - look up SSO identifier](/assets/img/resources/scim/scr_05e-sso-identifier-on-signpath.png)
> 
> In order for SignPath to be able to map your Microsoft Entra ID users correctly, the second part of the _SignPath Identity_ (after the `:`) should map to the respective field of the Microsoft Entra ID user. If you are mapping your Microsoft Entra ID users directly, you can use `[objectId]`. If you are forwarding your `sid` from your Active Directory, use `[onPremisesSecurityIdentifier]`.
>
> _For details on how the expression system works in Azure, see the [Microsoft reference for writing expressions for attribute mappings]._

After saving the mapping, you can now test your configuration.

#### 6. Test the configuration

Go back to the _Entra ID_ main page, select _Enterprise applications_ and select the enterprise application you created. Select _Users and groups_ and click "Add users and groups".

![Microsoft Entra ID - add users and groups](/assets/img/resources/scim/scr_06a-add-users-and-groups.png){:.margin-left}

Select a test user that already exists in the SignPath organization and assign them a role. Then select _Provisioning_ on the left pane and _Provision on demand_ on the next screen. Select the user you just added and click "Provision".

![Microsoft Entra ID - test provisioning](/assets/img/resources/scim/scr_06b-test-provisioning.png){:.margin-left}

When the provisioning succeeded, click on "View details" in section _3. Match user between source and target system_. The synchronization should have found an existing user on SignPath that matches. If it attempts to create a new user, there is an error in the configuration.

![Microsoft Entra ID - validate provisioning](/assets/img/resources/scim/scr_06c-validate-provisioning.png){:.margin-left}

#### 7. Remove the `/dry-run` postfix, assign users and groups and start provisioning

After you successfully tested the configuration, you can remove the `/dry-run` postfix of the _Tenant URL_ that was entered in step 4. Afterwards, you can start the provisioning on the _Overview_ page of the provisioning settings The assigned Entra ID users and groups will then be synchronized to your SignPath organization.

![Microsoft Entra ID - validate provisioning](/assets/img/resources/scim/scr_07a-start-provisioning.png){:.margin-left}

You can now assign all users and groups that you want to synchronize.

{:.panel.tip}
> **Notes on the synchronization**
> 
> **User synchronization:**
> 
> In the default mapping configuration, Entra ID users are initially mapped to SignPath users by comparing the following attribute values: 
> * First, the `externalId` attribute configured in step 5
> * Second, the `displayName` attribute
> 
> Every user must be assigned at most one role other than _Regular User_, otherwise the synchronization will fail.
> 
> When an Entra ID user is removed from all groups that are synchronized, the SignPath user will be deactivated.
> 
> **Group synchronization:**
> 
> * Groups are initially mapped using their `displayName` attribute. If a group does not exist in SignPath yet, it will be created.
> * Nested groups are not supported by Microsoft by Microsoft Entra. However, if a user is both in a first- and second-level group, their group assignment (but not role assignment) is correctly resolved. See the [official Microsoft documentation on scoping].
> * We suggest creating two "types" of groups:
> 	* _Role groups_ like "PKI Team" or "Auditors" where users are mapped to a specific role, e.g. _Certificate Administrator_ or _Global Reader_.
> 	* _Project specific groups_ that can be assigned within SignPath, such as "Project 1 Submitters" or "Project 2 Configurators". You can assign these groups the role _Regular User_.
> 
> After the first mapping is done, Azure will match users and groups using their unique IDs.

{:.panel.tip}
> **Troubleshooting**
>
> All synchronization attempts can be viewed in the _Enterprise Application_ under _Provisioning logs_.
>
> Please note that some items may take a couple of hours to be synchronized.

[Microsoft reference for writing expressions for attribute mappings]: https://learn.microsoft.com/en-us/entra/identity/app-provisioning/functions-for-customizing-application-data
[official Microsoft documentation on scoping]: https://learn.microsoft.com/en-us/entra/identity/app-provisioning/how-provisioning-works#scoping
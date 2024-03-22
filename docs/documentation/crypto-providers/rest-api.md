---
main_header: Crypto Providers
sub_header: REST API
layout: resources
toc: true
show_toc: 3
description: Direct usage of the REST API for hash signing
datasource: tables/crypto-providers
---

## Overview

As an alternative to using a Crypto Provider client, signing requests to a ["Hash signing data"](/documentation/crypto-providers#signpath-project-configuration) project can also be performed directly via SignPath's REST API.

All API requests require the following parameters:

{%- assign table = site.data.tables.crypto-providers.rest-api-parameters -%}
{%- include render-table.html -%}

## Signing Request

The signing request (which contains the hash to sign and metadata) is an HTTP POST request to `$ApiUrl/v1/$OrganizationId/`&#8203;`SigningRequests` with the following `multipart/form-data` fields:

{%- assign table = site.data.tables.crypto-providers.rest-api-signing-request-fields -%}
{%- include render-table.html -%}

Example request:

~~~ powershell
$FormBoundary = New-Guid

$Response = Invoke-WebRequest -Method Post -Uri "$ApiUrl/v1/$OrganizationId/SigningRequests" `
    -ContentType "multipart/form-data; boundary=$FormBoundary" `
    -Headers @{ Authorization = "Bearer $ApiToken" } -Body @"
--$FormBoundary
Content-Disposition: form-data; name="ProjectSlug"

$ProjectSlug
--$FormBoundary
Content-Disposition: form-data; name="SigningPolicySlug"

$SigningPolicySlug
--$FormBoundary
Content-Disposition: form-data; name="IsFastSigningRequest"

true
--$FormBoundary
Content-Disposition: form-data; name="Artifact"; filename="payload.json"
Content-Type: application/json

{
    "SignatureAlgorithm": "RsaPkcs1",
    "RsaHashAlgorithm": "2.16.840.1.101.3.4.2.1",
    "Base64EncodedHash": "GJShnIW6FTrL90OsTkP8AEyJFgSyb4xp4eg+oq/HxI8=",

    "Metadata":
    {
        "CreatingProcess": { "CommandLine": "SampleCommand -SampleArgument", "User": "SampleUser" }
    }
}
--$FormBoundary--
"@
~~~

### payload.json format {#hash-signing-payload-json}

{%- assign table = site.data.tables.crypto-providers.rest-api-payload-json -%}
{%- include render-table.html -%}

<div class="panel info" markdown="1">
<div class="panel-header">Key length</div>

The used key length and therefore the length of the resulting `Signature` in the response depends on the key length of the used certificate referenced in the signing policy. For ECDSA signatures also the used curve is determined by the certificate.

</div>

### Response {#signing-request-response}


The response contains a JSON body with the following content depending on the request's `IsFastSigningRequest` value.

* If `IsFastSigningRequest` was `true`: The Base64-encoded signature in the `Signature` property and the repeated incoming JSON properties.

   Example response:

   ~~~ JSON
   {
      "SignatureAlgorithm": "RsaPkcs1",
      "RsaHashAlgorithm": "2.16.840.1.101.3.4.2.1",
      "Base64EncodedHash": "GJShnIW6FTrL90OsTkP8AEyJFgSyb4xp4eg+oq/HxI8=",
      "Metadata": { ... },
      "Signature": "wGI2oiHHVSVGHR1rtjv83Pir1SEVLmnLNGuJD4..."
   }
   ~~~

* If `IsFastSigningRequest` was `false`: Only a `SigningRequestId` property. The actual signing operation will be performed asynchronously and can be retrieved via following `GET $ApiUrl/v1/$OrganizationId/`&#8203;`SigningRequests/$SigningRequestId` requests to check the status and retrieve the signature value. See the ["Get signing request data" section](/documentation/build-system-integration#get-signing-request-data) for more information.

## Retrieve Signing Policy details {#retrieve-signing-policy-details}

Via `GET $ApiUrl/v1/$OrganizationId/`&#8203;`Cryptoki/MySigningPolicies` all signing policies with the user referenced by the API token assigned as _Submitter_ can be queried. With optional `?projectSlug=$ProjectSlug&`&#8203;`signingPolicySlug=$SigningPolicySlug` query parameters the returned signing policies can be restricted (to exactly one if the project / signing policy exists).

The response contains signing policy details like the `signingPolicyId`, the RSA key parameters or the referenced X.509 certificate (`certificateBytes`).

Example response:

~~~ JSON
{
    "signingPolicies": [
        {
            "signingPolicySlug": "test-signing",
            "projectSlug": "hash-signing-test",
            "keySizeInBits": 2048,
            "rsaParameters": {
                "publicExponent": "AQAB",
                "modulus": "2e4JTm..."
            },
            "signingPolicyId": "eacd4b78-6038-4450-9eec-4acd1c7ba6f1",
            "certificateBytes": "MIIC5zCC...",
            "keyType": "Rsa",
            "publicKeyBytes": "MIIBCgKC..."
        },
        ... in case multiple signing policies match
    ]
}
~~~~
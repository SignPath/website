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

## Signing Request

See [HTTP REST API](/documentation/build-system-integration#rest-api) for basic instructions to submit a signing request.

### Fast signing

For hash data we recommend using a _fast signing request_. These requests are performed immediately without queuing, and the API immediately returns the signed artifact.

* Provide the additional field `IsFastSigningRequest` with the value `true`
* The API returns the JSON-formatted result (see [response description](#signing-request-response))

(By default, the API returns a signing request ID that can be used to [get the result](/documentation/build-system-integration#get-signing-request-data).)

### Artifact format for signing hash digests {#hash-signing-payload-json}

{%- include render-table.html table=site.data.tables.crypto-providers.rest-artifact-format -%}

<!-- this comment is a workaround for a markdown parsing error, next panel class would be ignored -->

{:.panel.info}
> **Key length**
> 
> SignPath crypto providers use the file name `payload.json` for hash digest artifacts.

### Response {#signing-request-response}

The response artifact has the same format and values as the request artifact with the additional property 'Signature'.

| JSON property | Description 
|---------------|--------------
| `Signature `  | Base64-encoded signature of 'Base64EncodedHash'. Format and length depend on the key of the signing policy's certificate.

### Example 

**Request:**

~~~ bash
curl -H "Authorization: Bearer $API_TOKEN" \
     -F "ProjectSlug=$PROJECT" \
     -F "SigningPolicySlug=test-signing" \
     -F "IsFastSigningRequest=true" \
     -F "Artifact=@$PATH_TO_ARTIFACT" 
     https://app.signpath.io/API/v1/$ORGANIZATION_ID/SigningRequests
~~~

**Request artifact:**

~~~ json
{
    "SignatureAlgorithm": "RsaPkcs1",
    "RsaHashAlgorithm": "2.16.840.1.101.3.4.2.1",
    "Base64EncodedHash": "GJShnIW6FTrL90OsTkP8AEyJFgSyb4xp4eg+oq/HxI8=",
    "Metadata":
    {
        "CreatingProcess": { "CommandLine": "SampleCommand -SampleArgument", "User": "SampleUser" }
    }
}
~~~

**Response:**

~~~ json
{
    "SignatureAlgorithm": "RsaPkcs1",
    "RsaHashAlgorithm": "2.16.840.1.101.3.4.2.1",
    "Base64EncodedHash": "GJShnIW6FTrL90OsTkP8AEyJFgSyb4xp4eg+oq/HxI8=",
    "Metadata": { ... },
    "Signature": "wGI2oiHHVSVGHR1rtjv83Pir1SEVLmnLNGuJD4..."
}
~~~

## Retrieve Signing Policy details {#retrieve-signing-policy-details}

Use `GET {{site.sp_api_url}}/v1/$OrganizationId/Cryptoki/MySigningPolicies?``projectSlug=$Project&signingPolicySlug=$SigningPolicy` to get information about the signing plicy, including the X.509 certificate and RSA key parameters.

(If project and signing policy are not specified, this API returns all signing policies where user identified by the API token is assigned as _Submitter_.)

**Example response:**

~~~ json
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
        }
    ]
}
~~~~
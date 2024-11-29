---
title: FAQ - SignPath.io
header: Frequently asked Questions
layout: resources
toc: true
show_toc: 3
description: Frequently Asked Questions about SignPath
---

## Troubleshooting

### Why does the AppVeyor integration webhook return a 400 (Bad Request) error message?

SignPath performs several checks on the AppVeyor project and returns an error if they fail. Since AppVeyor does not display the error message returned by the Webhook, SignPath also sends it to the notification email address. 

To receive a detailed error message, make sure the CI user has a valid notification email address.

Check for these common mistakes:

* Did you set the API token correctly, as described [here](https://about.signpath.io/documentation/build-system-integration#appveyor)?
* Did you include the "Bearer prefix" and omit all quotes when encrypting the value on AppVeyor?
* Did you add the CI user as a submitter to the signing policy?

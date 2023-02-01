---
sub_header: SignPath with Thales DPoD Cloud HSM
layout: resources
toc: true
description: Keep your keys on a dedicated Thales Data Protection on Demand (DPoD) Cloud HSM
---

## Hybrid deployment models with DPoD Cloud HSM

At the core of every SignPath deployment, a [Hardware Security Module (HSM)](/code-signing/windows-platform/#hsm) keeps your keys safe.

With [Thales Data Protection on Demand][DPoD] (DPoD), you can get your own dedicated Cloud HSM instances to store and manage your keys.

Between the pure managed SaaS environment and a fully self-hosted environment with a dedicated HSM, SignPath offers two **hybrid deployment options**:

* Use SignPath in the Cloud with your own dedicated DPoD Cloud HSM
* Deploy SignPath in a self-hosted environment, but use a DPoD Cloud HSM instead of hosting a dedicated HSM

## SignPath and DPoD in the Cloud

By default, your keys are stored in a shared HSM cluster operated by SignPath. This is a convenient option for simple code signing situations, especially if you need few key pairs, and your keys can easily be replaced. For customers who need to have more control over their key material, we offer dedicated Cloud HSM instances as an option.

Advantages of using DPoD Cloud HSM with SignPath Cloud:

* **Control your key material:** implement your own **security policies** for key management, **backup and restore** keys, and **transfer** them between (Cloud) HSM instances
* **Control your key lifetime:** while keys in the shared SaaS HSM cluster are bound to your SignPath subscription, a DPoD Cloud HSM can be held and used independently

![Hybrid SaaS deployment model](/assets/img/product/thales-dpod/deployment-hybrid-saas.png)

## Self-hosted SignPath with DPoD Cloud HSM

If you are **deploying SignPath in a Private Cloud** environment, it is obvious that you would also use a Cloude-based HSM. Thales DPoD provides just that.

![Private Cloud deployment model](/assets/img/product/thales-dpod/deployment-private-cloud.png)

When **deploying SignPath on-premises**, the obvious option would seem to be using a dedicated HSM such as the Thales Luna Network HSM series. However, a Cloud HSM might be in fact be a better fit:

* DPoD can be readily deployed, without **procurement, installation, configuration and training** blocking the deployment
* The *total cost of ownership* is considerably lower than with on-premises HSMs
* There is **less room for errors** that could lead to security breaches or key loss
* DPoD Cloud HSMs come with **high availability** and **disaster recovery** by default

![Hybrid on-premises deployment model](/assets/img/product/thales-dpod/deployment-hybrid-onprem.png)

It might seem counter-intuitive to use a Cloud HSM when you have already decided to host your own instance SignPath. In fact though, there are some good arguments for this hybrid solution, depending on the reasons you opted for hosting SingPath on-premises in the first place:

* **Network traffic volume:** Traffic between your CI/CD environments and SignPath can be considerable, but data exchange between SignPath and the Cloud HSM is limited to small hash digests and signature blocks.
* **Confidentiality:** Your policies may not allow sending (compiled) code files to the Cloud. However, SignPath will send only small hash digests to the Cloud HSM, from which no information about the actual file contents can be derived.

## Classic deployment models

For easier comparison, this sections shows the pure SaaS and on-premises deployments.

![Full SaaS deployment model](/assets/img/product/thales-dpod/deployment-full-saas.png)

![Full on-premises deployment model](/assets/img/product/thales-dpod/deployment-full-onprem.png)

## Getting DPoD Cloud HSM for SignPath

DPoD Cloud HSM can be procured with SignPath, or you can bring an existing DPoD instance. In either case we recommend using one or more dedicated Cloud HSM instances for code signing.

Please [contact our sales team](mailto:sales@signpath.io?subject=Using SignPath with DPoD) for more information.

[DPoD]: https://cpl.thalesgroup.com/encryption/data-protection-on-demand
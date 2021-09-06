---
main_header: Code Signing
sub_header: Media Coverage of Breaches
layout: resources
toc: true
show_toc: 3
description: A summary of recent media reports about breaches related to insecure code signing practices
---

## Overview

Recent attack reports, tech and mainstream media as well as research groups show the increasing role of **supply-chain attacks** using **stolen code signing certificates** (or more accurately, their private keys) in targeted attacks.

In short, while high-value targets often have their defenses up, the same is not always the case for software vendors and contractors. So in order to compromise worthwhile targets, attackers will try to infiltrate them by attacking their suppliers first. With a valid signature from a known supplier, it is much easier to infiltrate the network of a hardened target.

Major concepts include:

* **Advanced Persistent Threat (APT) groups**: as [FireEye](https://www.fireeye.com/current-threats/apt-groups.html) summarizes in their list of APT teams, they are often **nation-sponsored** and attack their targets over months or years.
In the case of stealing code signing keys, there are even dedicated teams that perform key theft as a support function for other teams (see [Winnti umbrella] below).
* **Code Signing**: the process of applying a cryptographic signature to software components. Properly signed software can be verified to be signed by a specific publisher (authentication) and unmodified (integrity). Code signatures are verified by many platforms and tools, including operating systems, Web browsers, update mechanisms and anti-malware tools. See [code signing introduction](./introduction) for more information.
Since in theory, a well-functioning code signing infrastructure can be used to effectively prevent malware infections, the code signing ecosystem itself is subject to increasingly fierce attacks.
* **Supply chain attacks**: High-level targets such as government organizations, defense companies or infrastructure providers, are often well-prepared for internet attacks. In order to circumvent their defenses, hackers will attack organizations that provide software to their targets and are less prepared for sophisticated attacks, such as software vendors or contractors. Since malware injection would be detected through code signing, attackers will try to steal the victims private keys and sign infected software versions, or get the victim to do the signing.
The signed and infected software will then be distributed to high-level attack targets. Once the infected code is executed within their network, attackers will try to steal data and passwords, and compromise further systems such as back-end servers.
* **Multi-layered attacks**: a software product is infected not by direct attack of the vendor, but by attacking the producer, packager or distributor of a third party or Open Source component (see [PDF editor incident] below).
* **Multi stage attacks**: an infected component is distributed to a wide audience to open a backdoor, but the actual malware is only distributed to selected high-value targets. These targets are either pre-defined in the first stage, or selected via **Command and Control (C2) servers**. All incidents described here follow this pattern.

## Winnti umbrella

Starting in 2013 and still active, Winnti umbrella is a collective of Chinese advanced persistent threat (APT) groups that attack software companies and game studios **primarily in order to obtain code signing certificates**. These certificates are then passed on to other APT groups that **attack high-level political and economic targets**.

The original Winnti group was detected by **Kaspersky** and detailed in their 2013 APT report [Winnti. More than just a game](https://securelist.com/winnti-more-than-just-a-game/37029/). In 2018, **401TRG** published a report about the wider Winnti umbrella: [Burning Umbrella: An Intelligence Report on the Winnti Umbrella and Associated State-Sponsored Attackers](https://401trg.com/burning-umbrella).

Media coverage includes [Infosecurity Magazine (2018)](https://www.infosecurity-magazine.com/news/chinese-spy-groups-linked-under/) and [ZDNet (2019)](https://www.zdnet.com/article/chinese-hacking-group-backdoors-products-from-three-asian-gaming-companies/).

Winnti umbrella is linked to several of the described below, including [ShadowPad] and [ShadowHammer].

## Supply chain attacks

### Stuxnet

The most publicized incident dates back about a decade: When **Stuxnet** dealt a sustained setback to **Iran's nuclear program** through sabotage of their centrifuges in 2009/2010, it all started with a piece of malware transmitted to a PC via a USB flash drive. The malware was able to run and eventually infect the network because it was **signed with certificates of JMicron and Realtek**. Stuxnet has been attributed to the U.S. and Israel.

The incident has been widely reported then and since. The [Stuxnet Wikipedia article](https://en.wikipedia.org/wiki/Stuxnet) is a good starting point for media references.

### Bit9 breach

In 2012, hackers **compromised code signing certificates** from security software vendor Bit9 (later renamed to [Carbon Black](https://www.carbonblack.com/)). These certificates were then used to sign malware in order to **attack defense industry customers of Bit9**.

The attack was analyzed in detail by **[SANS institute](https://www.sans.org/)** in their 2015 report [The Scary and Terrible Code Signing Problem You Don't Know You Have](https://www.sans.org/reading-room/whitepapers/critical/scary-terrible-code-signing-problem-you-36382). As a conclusion, this report also includes a list of **recommendations for hardening code signing** infrastructure.

The attack started with a **SQL injection** attack on a public-facing web server by an **Advanced Persistent Threat group**. When an archived virtual machine for code signing was reactivated in 2013, it was taken over and the **private key** for an old code signing certificate was **stolen**.

Bit9 was a pioneer in **whitelisting-based endpoint protection** software. Instead of blacklisting malware signatures, whitelisting allows only certain programs based on code signing and file hashes, which is far more effective. However, the archived virtual machine was not protected by the company's own software, Bit9 Parity, which allowed for this breach.

Some interesting **takeaways** from this incident:

* The attack was sophisticated enough to **exploit an operational oversight**, the reactivation of a virtual machine that was not properly protected, **when it happened**.
* Even for a **security software company** building a product based on code signatures, their own code signing process was far enough **removed from their core product and process** to allow for such an oversight.
* Using **cryptographic hardware** for code signing would have prevented the private key theft (but attackers would still have been able to sign malware using the hacked server).

**[Krebs on Security](https://krebsonsecurity.com)** has good coverage of this incident in the 2013 articles [Security Firm Bit9 Hacked, Used to Spread Malware](https://krebsonsecurity.com/2013/02/security-firm-bit9-hacked-used-to-spread-malware/) and [Bit9 Breach Began in July 2012](https://krebsonsecurity.com/2013/02/bit9-breach-began-in-july-2012/).

### Kingslayer supply chain attack

From 2015 to 2017, the tool **[EvLog](http://www.eventid.net/)** by cyber security vendor **Altair Technologies** was hijacked by hackers and used against high-profile targets.

* The vendor's **code signing certificate key was stolen**
* A **modified version** of the tool was created with a **backdoor Trojan**
* **MSI installers and executables** for the modified tool were **signed** with the original vendor certificate
* The vendor's web servers were hacked to **redirect download links** to attacker-controlled servers
* These servers contained the modified, signed files
* The version including the backdoor downloaded **additional payload for pre-determined attack targets** from a Command and Control (C2) server (second stage attack)

The **eventual targets** are unknown, as an eleven month period is missing from the monitoring data of researchers. However, the vendor's **customers** include major **telecommunication** providers, **military** organizations, Fortune 500 companies, **defense** contractors, **IT product manufacturers** and solution providers, western **government** organizations, **banks and financial institutions**, and higher educational institutions.

RSA researchers point out that a supply chain attack of this grade will **circumvent many security measures of even hardened organizations**, since highly **privileged network administrators** are directly compromised. **Antivirus tools fail** to recognize this kind of malware, whether based on virus signatures or behavior analysis. RSA expects this attack to be **a template for many to follow**.

In their conclusions, the researchers recommend that **tool vendors pay special attention** to their infrastructure and **code signing** mechanisms, including use of **Hardware Security Modules** (HSMs) and validated time stamping.

The incident was originally analyzed and reported by **RSA Research** on their [blog](https://www.rsa.com/en-us/blog/2017-02/kingslayer-a-supply-chain-attack). Later, Canadian cyber security firm *Altair Technologies* was identified as the victim. **Krebs on Security** accused the firm of trying to conceal the incident in the 2017 article [How to Bury a Major Breach Notification](https://krebsonsecurity.com/2017/02/how-to-bury-a-major-breach-notification/), also [reported by **SC Magazine**](https://www.scmagazineuk.com/vendor-hiding-supply-chain-cyber-attack-gets-uncovered-krebs/article/1475233). Also in 2017, **Security Week** reported a China connection in their article [Serious Breach Linked to Chinese APTs Comes to Light](https://www.securityweek.com/serious-breach-linked-chinese-apts-comes-light).

### ShadowPad

In 2017, **server management software** by NetSarang was infected with a backdoor. The software was **signed** with a legit NetSarang certificate and subsequently **distributed** to customers.

After installation, the software would keep contacting **Command and Control servers** based on dynamically generated DNS names. The backdoor was fully equipped to **extract data** and to **load and execute further code**.

The attack was discovered by **Kaspersky** after being tipped off by a customer's security team. Kaspersky published the report [ShadowPad: How Attackers hide Backdoor in Software used by Hundreds of Large Companies around the World](https://www.kaspersky.com/about/press-releases/2017_shadowpad-how-attackers-hide-backdoor-in-software-used-by-hundreds-of-large-companies-around-the-world) and a detailed analysis on their [SecureList](https://securelist.com/shadowpad-in-corporate-networks/81432/) site.

According to Kaspersky, this was one of the most significant supply-chain attacks at the time, **potentially targeting "hundreds of customers** in industries like financial services, education, telecoms, manufacturing, energy, and transportation." The attack was detected soon, and NetSarang reacted quickly. While infected systems were only identified in Hong Kong, more infections could not be ruled out.

As a Kaspersky researcher concluded:

*"ShadowPad is an example of how dangerous and wide-scale a successful supply-chain attack can be. Given the opportunities for reach and data collection it gives to the attackers, most likely it will be reproduced again and again with some other widely used software component.*"

Media coverage was provided by [The Register](https://www.theregister.co.uk/2017/08/15/netsarang_software_backdoor/) and [The Inquirer](https://www.theinquirer.net/inquirer/news/3015829/shadowpad-backdoor-uncovered-in-netsarang-server-management-software) among others.

### CCleaner supply chain attack

Also in 2017, a backdoor was implanted in the popular Windows utility **CCleaner**. When Chinese hacker group Axiom/APT17 managed to compromise the vendor, the modified software was not only signed, but entered the regular distribution process too. This resulted in malware **infection of more than 2 million users.** The first attack stage only extracted non-sensitive data from infected machines. See the [Wikipedia article](https://en.wikipedia.org/wiki/CCleaner#Trojan_in_distributed_program) for more information, including media references.

Reporting by [**Talos**](https://blog.talosintelligence.com/2017/09/avast-distributes-malware.html) and [**Cisco**](https://blogs.cisco.com/security/talos/ccleaner-c2-concern) (2017) identified a **second stage** of targeted infections: "Only about 40 PCs operated by **high-tech and telecommunications companies were further infected**". The target list included HTC, Samsung, Sony, VMware, Intel, Microsoft, Cisco, O2, Vodafone, Linksys, Epson Akamai, and DLink.

In 2018, [**SC Magazine** reported](https://www.scmagazineuk.com/avast-ccleaner-hackers-planned-infect-victims-third-stage-chinese-hacking-tool/article/1473074) that a **third-stage** attack of infected PCs had already been prepared. When this was detected, only a few machines at CCleaner producer Piriform had been infected. The **malware was customized** for Piriform, leading researchers to the conclusion that this was an **elaborate supply chain attack**: by infecting millions of users, the attackers were essentially casting a very wide net in order to compromise only a few select targets.

Whether this was the final stage is unknown, compromising tech firms might have been just the setup for attacks on some of their customers.

### ASUS: ShadowHammer

In 2019, a sophisticated **supply chain attack** on computer manufacturer **ASUS** was detected by **Kaspersky** and described in their APT report [Operation ShadowHammer](https://securelist.com/operation-shadowhammer/89992/).

Once more, software from a legitimate vendor was **modified, signed and distributed** through the vendors official web site. The update was **automatically downloaded and installed** on many systems, since it had a **valid code signature** from ASUS.

The modified version of **ASUS Live Update** included a list of target MAC addresses for the eventual targets of the attack. Any targeted PC would download a **second stage malware** from a Command and Control (C2) server. The actual targets have not yet been disclosed. As with most sophisticated, targeted attacks, **nation-state actors** are assumed to be responsible.

Kaspersky reports a **victim distribution** with a focus on the **EU** (50%), **Russia** (18%) and **North America** (7%).

As an automatic update mechanism was abused to distribute malware, there is always a risk that some users come to the conclusion that it would increase their security to **disable updates**, a notion widely **rejected by experts**.

As the [New York Times](https://www.nytimes.com/2019/03/27/opinion/asus-malware-hack.html) writes:

*"The main responsibility lies with the industry. Asus will no doubt be criticized for allowing its servers to be compromised and for failing to detect that it had been distributing malicious software to its customers. Other vendors should take note and harden their own systems."*

The incident was also reported by [Wired](https://www.wired.com/story/asus-software-update-hack/), [Motherboard](https://motherboard.vice.com/en_us/article/pan9wn/hackers-hijacked-asus-software-updates-to-install-backdoors-on-thousands-of-computers), [SC Magazine](https://www.scmagazine.com/home/security-news/cybercrime/a-threat-actor-hijacked-asuss-software-update-to-install-backdoors-on-thousands-of-computers-and-ultimately-push-malware-to-machines/), [BleepingComputer](https://www.bleepingcomputer.com/news/security/asus-live-update-infected-with-backdoor-in-supply-chain-attack/), [Wall Street Journal](https://www.wsj.com/articles/malware-attack-on-asus-computers-raises-concerns-11553638579) and many others.

## Coverage by Microsoft

### Microsoft Security Intelligence Report 2018

In [volume 24](https://www.microsoft.com/security/blog/2019/02/28/microsoft-security-intelligence-report-volume-24-is-now-available/) of its regular report, Microsoft emphasizes that **breaking chains of trust** through **supply chain attacks** is becoming an increasing problem.

*"The increased number of software supply chain attacks over the past few years has become an important topic in many cybersecurity conversations and is a primary source of concern in many IT departments."*

The reports lists the following incidents for 2017:

* [Petya ransomware outbreak](https://www.microsoft.com/security/blog/2017/06/27/new-ransomware-old-techniques-petya-adds-worm-capabilities/)
* [Operation WilySupply](https://www.microsoft.com/security/blog/2017/05/04/windows-defender-atp-thwarts-operation-wilysupply-software-supply-chain-cyberattack/)
* [ShadowPad](https://www.kaspersky.com/about/press-releases/2017_shadowpad-how-attackers-hide-backdoor-in-software-used-by-hundreds-of-large-companies-around-the-world) (Kaspersky)
* [CCleaner](https://www.rsaconference.com/events/us18/agenda/sessions/10593-ccleaner-apt-attack-a-technical-look-inside) (RSA Conference)

For 2018, Microsoft mentions the following incidents:

* [Behavior monitoring combined with machine learning spoils a massive Dofoil coin mining campaign](https://www.microsoft.com/security/blog/2018/03/07/behavior-monitoring-combined-with-machine-learning-spoils-a-massive-dofoil-coin-mining-campaign/)
* [Compromised Auto-Update Mechanism Affects South Korean Users](https://blog.trendmicro.com/trendlabs-security-intelligence/compromised-auto-update-mechanism-affects-south-korean-users/) (Trend Micro)
* [VestaCP compromised in a new supply-chain attack](https://www.welivesecurity.com/2018/10/18/new-linux-chachaddos-malware-distributed-servers-vestacp-installed/) (ESET)

#### PDF editor incident

* [Attack inception: Compromised supply chain within a supply chain poses new risks](https://www.microsoft.com/security/blog/2018/07/26/attack-inception-compromised-supply-chain-within-a-supply-chain-poses-new-risks/): Malware payload introduced in popular PDF editor

This incident is highlighted for its **multi-layered supply chain approach**: A vendor of a PDF editor was tricked into downloading a **compromised third party component** from a slightly modified mirror source, custom-built for this attack. This mirror had a single modified MSI installer that was then distributed with the PDF editor. While the modified component was not signed, it still ended up in the official PDF editor distribution, signed by the vendor. The **vendor didn't check for third-party signatures before signing** their own package.

The incident is further explained at [1:09](https://www.youtube.com/watch?v=uXm2XNSavwo&t=1m9s) in the video mentioned below.

### Supply chain attacks video

Microsoft produced an [educational video](https://www.youtube.com/watch?v=uXm2XNSavwo) about software supply chain attacks in 2018.

Some of the **supply chain media coverage** Microsoft mentions in the video:

* [Software maker fingered in Korean hackocalypse](https://www.theregister.co.uk/2011/08/12/estsoft_korean_megahack/) (The Register, 2011)
* [Rogue software update cause Malware attack on Japanese Nuclear Power Plant](https://thehackernews.com/2014/01/rogue-software-update-cause-malware_9.html) (The Hacker News, 2014)
* [Russian Hackers Targeting Oil and Gas Companies
](https://www.nytimes.com/2014/07/01/technology/energy-sector-faces-attacks-from-hackers-in-russia.html) (New York Times, 2014): "The manner in which the **Russian hackers** are targeting the companies also gives them the opportunity to **seize control of industrial control systems** from afar, in much **the same way** the United States and Israel were able to use the **Stuxnet computer worm** in 2009 to take control of an Iranian nuclear facility’s computer systems and destroy a fifth of the country’s uranium supply, [private cyber security] researchers said."
* [How installing League of Legends and Path of Exile left some with a RAT](https://arstechnica.com/information-technology/2015/01/how-installing-league-of-legends-and-path-of-exile-left-some-with-a-rat/) (Ars Technica, 2015)
* [Kingslayer: a supply chain attack](https://www.rsa.com/en-us/blog/2017-02/kingslayer-a-supply-chain-attack) (RSA Security, 2017)
* [Ask Partner Network compromised second time in two months](https://www.scmagazine.com/home/security-news/cybercrime/ask-partner-network-compromised-second-time-in-two-months/) (SCMagazine, 2017)
* [Hackers Program Bank ATMs to Spew Cash](https://www.wsj.com/articles/hackers-program-bank-atms-to-spew-cash-1479683814) (Wall Street Journal, 2016)
* [Microsoft says: Lock down your software supply chain before the malware scum get in](https://www.theregister.co.uk/2017/05/05/malware_attacking_payment_systems/) (The Register, 2017)
* [Microsoft: Petya ransomware attacks were spread by hacked software updater](https://www.zdnet.com/article/microsoft-petya-ransomware-attacks-were-spread-by-hacked-software-updater/) (ZDNet, 2017)
* [Poisoned peer-to-peer app kicked off Dofoil coin miner outbreak](https://www.microsoft.com/security/blog/2018/03/13/poisoned-peer-to-peer-app-kicked-off-dofoil-coin-miner-outbreak/) (Microsoft, 2018)

[Winnti umbrella]:#winnti-umbrella
[Bit9]:#bit9-breach
[ShadowPad]:#shadowpad
[ShadowHammer]:#shadowhammer
[PDF editor incident]:#pdf-editor-incident
[code signing introduction]: ../introduction

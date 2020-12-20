---
layout: post
title: "Evaluating the Sunburst Hack: Causes and Future Prevention"
image: '2020-12-21-bg'
date: 2020-12-21 10:00:00 +0000
author: Stefan Wenig
summary: "How hackers exploited one ISV's software to reach political targets - and how software industry practices need to improve"
---

Sunburst is already the most discussed hacker attack in living memory, maybe back to when Iran's nuclear program was pushed back years by Stuxnet. But what do we really know?

Several U.S. agencies were infiltrated using versions of SolarWind's Orion software that carried a backdoor payload. Given the scope of this software, it's not surprising that a successful attack on Orion would also pave the way for hacking customers. So rather that examining the exact nature of these backdoors and how they were exploited, let's look at how the software was hacked in the first place.

Tomislav Peričin of ReversingLabs did an [exhaustive analysis](https://blog.reversinglabs.com/blog/sunburst-the-next-level-of-stealth) of this hack. By decompiling several versions of Orion, he showed how the hackers inched their way from a careful proof of concept to a full-blown backdoor through incremental source code modifications.

## Two possible attack vectors

What's not so clear though is whether these changes were committed to the source code repository, where every developer could see them, or injected on the build system.

Looking forward, this does not really matter. Both ways are possible attack vectors, so we must consider them all.

## Attack vector 1: modifying the source code in the repository

Now here's a no-brainer: If an attacker manages to modify the source code without getting caught, the modifications will eventually turn up at customer sites.

So what can be done to avoid this?

In short: create and enforce a task-based review policy.

The code modifications were carefully placed where they would not cause suspicion. For instance, the code responsible for starting the backdoor thread was placed where legitimate background processing was done too. The string obfuscation should alarm careful readers, but that was done in another module, where nobody would have much business anyway.

Those were clever measures for sure, but they would not go undetected in a task-based review. Assume that the team has the following security measures:

| Policy | Implementation |
|--------|----------------|
| **All source code commits must reference issues** for developer tasks, such as issues or stories | This can be implemented in most version control systems. E.g. Git provides [server-side](https://git-scm.com/book/en/v2/Customizing-Git-An-Example-Git-Enforced-Policy) [hooks](https://stackoverflow.com/questions/14151775/how-do-i-set-a-pattern-for-git-commit-messages). On top of this, some Git servers provide configurations such as [regex rules](https://docs.gitlab.com/ee/push_rules/push_rules.html#commit-messages-with-a-specific-reference) for commit messages. 
| The source code system is configured to **accept merges on release-branches only after successful code reviews** | Again, you can use basic hooks, or features such as [branch](https://docs.github.com/en/free-pro-team@latest/github/administering-a-repository/configuring-protected-branches) [protection](https://docs.gitlab.com/ee/user/project/protected_branches.html). Or use [dedicated review software](https://en.wikipedia.org/wiki/List_of_tools_for_code_review).
| The code signing process only signs builds from release branches | If you do code signing from your CI system, make sure it is only configured for reviewed branches. **SignPath can verify the source of a build and enforce your branch policies directly**, so they cannot be sidestepped by careless misconfigurations or hackers with CI access.

It's easy to see how these hacks could avoid accidental detection. But to work around a carefully implemented review policy, the hackers would have to hack the issue tracking system too (quite possible), create plausible tasks for creating a new background process thread (hm, what for?) and string obfuscation - now that should trigger some alarms!

Also, make sure that your review guidelines container clear rules for triggering security reviews. A very fine example can be found [here](https://docs.gitlab.com/ee/development/code_review.html).

Thorough source code reviews require some effort. But you don't do it just for security, you do it for quality. Like most reasonable quality measures, they will pay off with reduced cost for support, troubleshooting and bug fixing. In 2020, there's hardly any excuse left for not doing them, so why not go all the way and enforce them?

## Attack vector 2: modifying the source code at build time

Now making sure that your source code repository contains only what it should is an obvious step. But what if the hackers didn't commit these changes after all? **What if the build infrastructure was compromised** to simply **replace a few files** before compiling the software? **What if it applied post-compilation transformations** to include the payload? 

These are routine activities for hackers, the tools are all there too. So if they can get into the build process, or modify the code before signing and releasing, that's rather easy to achieve.

This attack vector is much harder to close. It requires a **detailed analysis** of the entire **build infrastructure** *and* **every single project's build and code signing process**.

Having done this for some years for a living, we can now safely say one thing: **this is hard.**

Analyzing entire build pipelines for possible attacks from within the network is rarely done, and it's a daunting task. There is little know-how around, and still too little vendor support: CI systems are built for speed, scalability and flexibility first.

And there's a reason for this too: CI systems are used for so many things to day, some of them rather resource-intensive too. Think about executing Web test suites, for instance. Or DAST tests. They require a lot of analysis and trouble shooting, so there's a big incentive for handing out access permissions for components of the CI system too.

To be sure, it's easy to come to the conclusion that a process is safe. There is this token or password that you need for code signing, and we're only using it in this specific way, right? Probably not: relying on a single secret and it's proper handling will almost always leave some room for attacks. But who has the time and budget to do a full security audit for every project?

**At SignPath, this was our mission from the start:** Storing keys on HSMs is not the solution for all code signing risks. Neither is a code signing gateway that simply provides HSM access using some finer-grained access control and auditing.

Our customers need a simple way to make sure that **every signed and published release** of their software

* can be **traced back to a specific source code version**, without room for manipulation
* **meets all policy requirements**, including reviews and testing
* was built on **secure infrastructure**, without direct or indirect developer access

To find out more about code signing with SignPath, please [contact us](mailto:sales@signpath.io). 
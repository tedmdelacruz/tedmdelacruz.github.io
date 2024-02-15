---
title: "Remote code execution in a billion-dollar publicly traded company"
date: 2024-02-14T21:43:57+08:00
author: ted
draft: true
---

There are 4 things that have to happen in order to find [CVE-2023-22621](https://nvd.nist.gov/vuln/detail/CVE-2023-22621) in the wild:
 
- You need to find a website that is powered by [Strapi](https://strapi.io).
- The _super admin_ for this website, _somehow_, **has not been claimed yet**.
- The version of Strapi should be _at least_ **version 4.5.5 and below**.
- No other hacker _somehow_ saw any of the three aformentioned scenarios first.

The stars have aligned in my favor and I found exactly that in one of the websites of a _billion_ dollar company listed in the New York Stock Exchange. And I happen to be invited to their private [bug bounty program](https://en.wikipedia.org/wiki/Bug_bounty_program).

## Reconnaisance
I have a server that pings me of new subdomains of this company every 5pm Manila time so I can check them out after work.

Usually I don't find anything in my probes, and this one: **strapi.[redacted].com** also didn't trigger any alarms at first.
My automations pinged me about the subdomain of this website around early December 2023, but this website caught my attention during a manual inspection of the company assets that I did around early February 2024.

I couldn't believe it at first, but the _super admin_ registration for this website was open. And _somehow_, no other hacker has seen this before me:

![Admin Registration](/admin-registration.PNG)

Realizing this, was nothing short of exhilariting, since it's been months since I got a paid bug bounty.

## Escalation

Claiming the super admin of a website is nice and dandy, but like most other security researchers, I asked myself: "How can I escalate this to something even more severe?".

The next step was obvious, I googled the following: "strapi cve". One CVE instantly caught my attention: **[CVE-2023-22621](https://nvd.nist.gov/vuln/detail/CVE-2023-22621)**

It ticks all of the boxes:
- You need to have super admin access (I got that) ✔
- The version of Strapi should be 4.5.5 and below (This website is on Strapi v3.6.0) ✔

## Remote code execution
_WIP_



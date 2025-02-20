---
title: "Leaking employee emails at a large corporation for $250"
date: 2025-02-20T21:10:16+08:00
draft: false
summary: Information disclosure can be easy - and profitable. Revisiting one of my first paid bounties.
thumbnail: https://tedmdelacruz.github.io/users-endpoint-thumbnail.jpg
---

![Thumbnail](/users-endpoint-thumbnail.jpg)

> Revisiting some of my old reports at HackerOne. This particular report dates back October 2022, one of my first paid bounties. And surprisingly it was not even a very technical one.

A reputable games and entertainment platform in the Philippines at `[redacted].com`, sent me an _invitation to hack_ through [HackerOne](https://hackerone.com).

Here's how I managed to find an _information disclosure_ vulnerability at one of their domains by simply manually visiting `/api/users/`.

## Asset Discovery

As always, my first step is to enumerate the known subdomains of `[redacted].com`, and my favorite tool for that is [subfinder](https://github.com/projectdiscovery/subfinder). I run `subfinder` and pipe the results into a text file named `subdomains.txt`:

```plaintext
subfinder -d [redacted].com | tee subdomains.txt

               __    _____           __
   _______  __/ /_  / __(_)___  ____/ /__  _____
  / ___/ / / / __ \/ /_/ / __ \/ __  / _ \/ ___/
 (__  ) /_/ / /_/ / __/ / / / / /_/ /  __/ /
/____/\__,_/_.___/_/ /_/_/ /_/\__,_/\___/_/

                projectdiscovery.io

Use with caution. You are responsible for your actions
Developers assume no liability and are not responsible for any misuse or damage.
By using subfinder, you also agree to the terms of the APIs used.

[INF] Enumerating subdomains for [redacted].com
connect.[redacted].com
shuffle.game.[redacted].com
...
paas.bk.test.[redacted].com
version.common.[redacted].com
[INF] Found 1247 subdomains for [redacted].com in 33 seconds 662 milliseconds
```

Not all of these subdomains are live, so I probe these for live webservers using [httpx](https://github.com/projectdiscovery/httpx). At this point, I only care about webservers that return `HTTP 200 OK`. In order to proceed, I simply have to pipe the `stdout` of `subdomains.txt` using `cat` into `httpx` and match only live webservers like so:

```plaintext
cat subdomains.txt | httpx -mc 200 -o http.txt

    __    __  __       _  __
   / /_  / /_/ /_____ | |/ /
  / __ \/ __/ __/ __ \|   /
 / / / / /_/ /_/ /_/ /   |
/_/ /_/\__/\__/ .___/_/|_|
             /_/              

                projectdiscovery.io

Use with caution. You are responsible for your actions.
Developers assume no liability and are not responsible for any misuse or damage.
https://msdk.[redacted].com
https://ks.msdk.[redacted].com
...
https://auth.[redacted].com
```

Now I have about text file named `http.txt` containing hundreds of live subdomains of `[redacted].com`. Now comes the hard part: manual testing each one.

## Manual Testing

I stumbled upon this interesting subdomain: `translate.[redacted].com`. Looking at its functionality, it allows for cross-region teams and outsourced staff to log in and assist in translation efforts at `[redacted].com`.

The site allows for _anyone_ to log in with any Google account. I log in with my personal account and played around while proxying my network requests in the site through [Burp Suite](https://portswigger.net/burp).

One of the network requests stood out for me: `/api/users/<id>/projects/`. Interesting, there's no way that manually accessing `/api/users/` would give me a list of users, right? Right...?

![users endpoint](/users-endpoint.PNG)

Turns out accessing `GET /api/users/` reveals 3,900 internal emails of `[redacted].com` including employee and contractor emails.

I write a detailed report and submitted it through HackerOne. A month later, I receive a reply:

![reward](/users-endpoint-reward.PNG)

Not a mindblowing amount of money, but good enough for the effort involved!

## Takeaways
- Manually inspecting assets is always the way to go
- Even if it _sounds stupid_, try it anyway. Even if it's a hardened target.
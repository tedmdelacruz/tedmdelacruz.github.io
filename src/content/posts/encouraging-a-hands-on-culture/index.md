---
title: "Encouraging a “hands-on” culture in an engineering team"
excerpt: "How immersing engineers in actual real-world problems can help them become better problem-solvers, not just coders."
category: "Engineering"
date: 2026-09-05
author:
  name: "Ted Mathew dela Cruz"
  role: "Software developer & security researcher"
draft: false
---

> Originally written in August 2025

3rd March 2020, Tuesday.

It was a day for our weekly team meetup at the [Bukas](https://bukas.ph) office in RCBC Plaza, Makati City. After having lunch with the team, I went to Cebuana Lhuillier to test a feature that I worked on: the Dragonpay integration at Bukas.

![Cebuana Lhuillier Pawnshop](/dragonpay-1.jpg)

I prepared a test loan with a due balance of PHP 50.00 in our development environment, with the postback endpoint standing by and configured in our Dragonpay account.

I went to the counter, filled in the transaction form with my name, reference number of my test loan, and paid the amount in cash to the teller. I received a transaction receipt and went back to the office, hoping for the best.

![Transaction Receipt](/dragonpay-2.jpg)

A few minutes later, I received an SMS and email from Bukas acknowledging my payment. A rush of exhilaration filled my head. I checked the logs and admin records; my feature worked flawlessly.

My postback endpoint correctly identified the loan, asynchronously generated the PDF receipt, and sent the notifications perfectly.

I immediately thought, this way, _our borrowers can have way more options to pay for their loans at Bukas_. They can pay over-the-counter at any branch of Cebuana Lhuillier, Bayad Center, or 7-Eleven all around the country.

I thought:

> This is the kind of engineer that I strive to be: _hands-on_ and proactive. And I want to cultivate this kind of attitude in our growing tech team at Bukas.
---

As engineers, it's easy to get lost in the loop of daily stand-ups, sprint retrospectives, checking Linear tickets, writing code, and reviewing pull requests.

We tend to forget _why_ we build in the first place: _problem solving_.

And as problem-solvers, we should deeply understand the pain points of our users. And interestingly, sometimes our users are not even aware of their pain points.

One of the best things working at Bukas is our _collaborative culture_. Engineers are encouraged to be deeply involved in the planning phase, and to not just wait for Linear tickets to be assigned to them by the product managers.

![Collaboration](/collaboration.jpg)
> Brainstorming on the V2 app design circa 2019

## "Hands-on" virtue #1: Be Observant

There was one time at the office when my co-worker was showing me an issue in our admin application. I noticed that she had to painstakingly copy-and-paste a loan reference number from a Google Sheets document to search for a loan in our admin app.

So, I created an **internal browser extension** that adds _Bukas Search_ in the browser context menu. Our teams immediately found it useful, and it has been a staple utility tool at Bukas and Danacita.

![Bukas browser extension](/extension.png)

This experience made me realize that we, engineers, need to **observe** our users more often. So I spearheaded "workflow sync" meetings at Bukas: in-person or remote sessions of our engineering team sitting down to observe the workflows of the Operations, Collections, and Customer Service teams at Bukas. I worked with team leads to prepare for the exercises, clarify the agenda, and coordinate our schedules.

The syncs were insightful. Our co-workers presented how they worked, what their grievances were, and their known pain points, while our engineers, QA, and product managers took notes and brainstormed on what we could improve.

These sessions became a bi-yearly affair and initiated interesting and productive projects based on real problems that our engineers were able to observe first-hand. 

## "Hands-on" virtue #2: Be Immersed

Some of my fondest memories working at Bukas were being on-the-ground at the campuses of our partner institutions.

![On-site](/on-site-1.jpg)
> Me and Ian at the Lyceum of the Philippines campus

At Bukas, we encourage everyone to join the "campus caravans" at our partner schools. We believe that having our engineers interact with our end-users could bridge the "empathy gap" between us and our borrowers, reminding us that **our users are not just numbers in our analytics dashboards**; they are real people with real problems that we're hoping to help solve.

![On-site](/on-site-3.jpg)

## "Hands-on" virtue #3: Be Visible

Whenever a significant new feature gets shipped, we encourage our engineers to announce it in our Slack channels themselves. Not for credit or self-promotion, but for _accountability_. I always end these announcements with "Let me know if anything goes wrong!" so my co-workers know they can just ping me directly without having to file tickets or loop in a product manager. I create the tickets myself and loop in the product manager myself.

This small habit does something powerful over time: it puts a face and a name on every feature. When the finance team knows exactly who built the disbursement flow, they don't hesitate to reach out when something feels off. That's how you get the "hey, this might be nothing, but the numbers on this batch look weird" message at 2pm instead of a production incident at 2am.

It also changes how engineers relate to their own work. Ownership doesn't end at the pull request, it extends to how the feature lives and breathes once real people are using it. When you've personally told the whole company "this is mine, come to me," you pay closer attention. You check back. You care about the details beyond the code.

---

That Tuesday afternoon at Cebuana Lhuillier, I wasn't doing anything extraordinary. I was just paying PHP 50.00 at a counter. But that small act of testing my own feature in the real world — standing in line, filling out the form, waiting for the SMS — taught me more about our borrowers' experience than any test suite ever could.

Being hands-on is a series of small, deliberate choices: sitting with a co-worker long enough to notice their workaround, showing up at a campus even when you have a sprint to finish, putting your name on a feature and meaning it.

These things don't show up on the résumés of the engineers, but they shape the kind of engineering team you want to cultivate.

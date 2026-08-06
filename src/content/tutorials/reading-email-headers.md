---
title: "Reading Email Authentication Headers"
summary: "Walk-through of reading SPF, DKIM, and DMARC results in a raw email header to decide whether to trust or block the sender."
finding: "You can tell whether an email's sender is real from three header lines and a quick DNS check. No special tool needed beyond a way to view the header and the dig command."
stamp: "Recorded"
state: verified
discipline: grc
date: 2026-08-06
order: 10
tags: ["email", "authentication", "spf", "dkim", "dmarc", "phishing"]
draft: false
recording: /tutorials/reading-email-headers/demo.svg
---

When an email looks suspicious, the first thing to check is whether it really came from
the address it claims. That answer sits in three lines of the email's header. This walks
through reading those lines on one message, then checking the sending domain's public
records to decide what to do with it.

<div class="lab-instrument">
  <img src="/tutorials/reading-email-headers/demo.svg" alt="Terminal recording: reading a spoofed email's SPF/DKIM/DMARC verdicts and confirming the sending domain has no authentication posture." loading="lazy" decoding="async" />
  <p class="lab-instrument-caption">Reading the three authentication verdicts off one header, then confirming what the sending domain actually publishes with dig.</p>
</div>

## The three results that matter

Open the raw header and find the `Authentication-Results` line (or the equivalent
`Received-SPF` / `DKIM-Signature` blocks). You are looking for three verdicts:

- **SPF** (which servers may send for this domain): did the sending IP appear in the domain's published list of allowed senders (`v=spf1`)?
- **DKIM** (a signature on the message): did the message's signature check out against the domain's published key?
- **DMARC** (the domain's rule for handling mail that fails the checks above): did the domain publish a rule, and did this message follow it?

A single `fail` is not always a verdict on its own. The pattern that matters is the
combination: a domain with **no DMARC record, SPF fail, and DKIM fail** is not a spoofed
legitimate sender; it is an unauthenticated one. That distinction changes the action.

<div class="expand-stack">
  <details class="expand-item">
    <summary class="expand-term">Why "no DMARC" is different from "DMARC fail"</summary>
    <div class="expand-body">
      <p>
        <code>DMARC fail</code> means the domain published a policy and the message did not
        meet it: the domain is actively trying to protect its identity, and this message is
        not from it. <code>No DMARC record</code> means the domain never published a policy at
        all, so there is nothing to align against. The first is a spoof of a defended domain;
        the second is an unauthenticated domain. Both land in quarantine, but for different
        reasons and with different reporting upstream.
      </p>
    </div>
  </details>
  <details class="expand-item">
    <summary class="expand-term">Checking the DNS posture yourself</summary>
    <div class="expand-body">
      <p>Don't trust the header alone; confirm what the domain actually publishes:</p>
      <pre><code>dig +short TXT example.com
dig +short TXT _dmarc.example.com</code></pre>
      <p>
        If <code>example.com</code> has no <code>v=spf1</code> record and
        <code>_dmarc.example.com</code> returns nothing, the domain has no email-authentication
        posture. Any mail from it is unauthenticated by design, not by attack, though an
        attacker will happily use exactly such a domain, which is why the combination with
        the header verdict still matters.
      </p>
    </div>
  </details>
</div>

## The decision

With the three header verdicts and the DNS posture in hand, the decision is mechanical:

| Header verdict | DNS posture | Read as |
|----------------|-------------|---------|
| SPF fail · DKIM fail · no DMARC | No SPF/DMARC published | Unauthenticated domain: block or quarantine |
| SPF fail · DKIM pass · DMARC pass | Domain defended, message aligned | Legitimate, relayed; investigate the relay, not the sender |
| SPF pass · DKIM fail · DMARC fail | DMARC published | Spoofed: block, and it's a reportable event |

## What this teaches, and what it doesn't

**Teaches:** the check a security analyst runs before escalating a phishing report: three
header lines plus a DNS check, and a decision table that doesn't need a paid tool.

**Doesn't teach:** attribution. An unauthenticated domain is not an actor. A spoofed
defended domain is not a campaign. The header read tells you what to do with the message,
not who sent it or why.

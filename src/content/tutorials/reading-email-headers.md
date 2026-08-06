---
title: "Reading Email Authentication Headers"
summary: "Walk-through of reading SPF, DKIM, and DMARC results in a raw email header to decide whether to trust or block the sender."
finding: "You can decide whether an email's sender is authentic from three header lines and the domain's DNS posture — no tool required beyond a header view and dig."
stamp: "Recorded"
state: verified
discipline: grc
date: 2026-08-06
order: 10
tags: ["email", "authentication", "spf", "dkim", "dmarc", "phishing"]
draft: false
recording: /tutorials/reading-email-headers/demo.svg
---

Email authentication is the first thing a SOC analyst checks on a suspicious message, and
it's three lines in the header. This walks through reading them on one email, then checking
the domain's DNS posture to decide what to do with it.

<div class="lab-instrument">
  <img src="/tutorials/reading-email-headers/demo.svg" alt="Terminal recording: reading a spoofed email's SPF/DKIM/DMARC verdicts and confirming the sending domain has no authentication posture." loading="lazy" decoding="async" />
  <p class="lab-instrument-caption">Reading the three authentication verdicts off one header, then confirming the domain's DNS posture with dig.</p>
</div>

## The three results that matter

Open the raw header and find the `Authentication-Results` line (or the equivalent
`Received-SPF` / `DKIM-Signature` blocks). You are looking for three verdicts:

- **SPF** — did the sending IP appear in the domain's published `v=spf1` record?
- **DKIM** — did the cryptographic signature validate against the domain's published key?
- **DMARC** — did the domain publish a policy, and did the message align with it?

A single `fail` is not always a verdict on its own. The pattern that matters is the
combination: a domain with **no DMARC record, SPF fail, and DKIM fail** is not a spoofed
legitimate sender — it is an unauthenticated one. That distinction changes the action.

<div class="expand-stack">
  <details class="expand-item">
    <summary class="expand-term">Why "no DMARC" is different from "DMARC fail"</summary>
    <div class="expand-body">
      <p>
        <code>DMARC fail</code> means the domain published a policy and the message did not
        meet it — the domain is actively trying to protect its identity, and this message is
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
      <p>Don't trust the header alone — confirm what the domain actually publishes:</p>
      <pre><code>dig +short TXT example.com
dig +short TXT _dmarc.example.com</code></pre>
      <p>
        If <code>example.com</code> has no <code>v=spf1</code> record and
        <code>_dmarc.example.com</code> returns nothing, the domain has no email-authentication
        posture. Any mail from it is unauthenticated by design, not by attack — though an
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
| SPF fail · DKIM fail · no DMARC | No SPF/DMARC published | Unauthenticated domain — block or quarantine |
| SPF fail · DKIM pass · DMARC pass | Domain defended, message aligned | Legitimate, relayed — investigate the relay, not the sender |
| SPF pass · DKIM fail · DMARC fail | DMARC published | Spoofed — block, and it's a reportable event |

## What this teaches, and what it doesn't

**Teaches:** the read a SOC analyst runs before escalating a phishing report — three header
lines plus a DNS check, and a decision table that doesn't need a paid tool.

**Doesn't teach:** attribution. An unauthenticated domain is not an actor. A spoofed
defended domain is not a campaign. The header read tells you what to do with the message,
not who sent it or why.

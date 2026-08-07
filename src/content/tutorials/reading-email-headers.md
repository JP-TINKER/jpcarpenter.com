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

## What header auth catches, and what it doesn't

The three verdicts answer one question: did this message come from the domain it
claims? They do not answer a different one: is this message safe? That distinction matters more
now, because AI-powered scams are built around it.

- **Compromised real accounts.** A scam sent from a hijacked mailbox passes SPF,
  DKIM, and DMARC, because it is genuinely from that account. The header read says
  "authenticated," and it is, but the content is still a phish. For anything involving money or
  credentials, confirm the request on a second channel (call a known number, not the one
  in the email).
- **Lookalike domains.** An attacker registers a close cousin like `paypa1.com` (a Latin
  "l" swapped for a digit) or a homoglyph domain, then publishes valid SPF, DKIM, and
  DMARC for it. Every check passes, because the records are genuinely the attacker's.
  DMARC on the real brand has no authority over a different domain.
- **Abused legitimate platforms.** Mail sent through a real SaaS (a fundraising
  platform, a form service) authenticates as that platform, not as the brand it
  impersonates. The header is clean; the story is in the URLs.

AI makes the lure itself harder to spot: model-generated phishing reads
cleanly, personalizes at scale, and drops the old grammar tells. The header read is
still necessary (a spoofed domain still fails), but it is no longer sufficient.
Pair it with out-of-band verification and sender fingerprinting, and watch for newly
registered lookalike domains.

Sources: [Adaptive Security](https://www.adaptivesecurity.com/blog/how-ai-generated-phishing-bypasses-traditional-email-filters),
[Palisade](https://www.palisade.email/learning/why-do-phishing-emails-pass-spf-and-dkim),
[PowerDMARC](https://powerdmarc.com/what-is-dmarc/),
[IRONSCALES weekly recap (March 2026)](https://ironscales.com/blog/best-of-the-worst-march-27-2026),
[IRONSCALES: SPF Pass, DKIM Pass, DMARC Pass. Still Phishing.](https://ironscales.com/threat-intelligence/authenticated-supplier-invoice-cousin-domain-display-name-impersonation).

## What this teaches, and what it doesn't

**Teaches:** the check a security analyst runs before escalating a phishing report: three
header lines plus a DNS check, and a decision table that doesn't need a paid tool.

**Doesn't teach:** attribution, and it doesn't teach "safe." An unauthenticated
domain is not an actor. A spoofed defended domain is not a campaign. And a clean
authentication pass is not a clean bill of health: in the AI era, authenticated mail
can still be a scam. The header read tells you what to do with the message, not
who sent it or whether to trust it.


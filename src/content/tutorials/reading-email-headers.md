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

## The email we will read

A real phishing email is loaded in the reader above: a "Someone tried to log in to your account" alert, sent from `dalimnthefoob.co` and redacted from a real case (the same one traced in the <a href="/labs/phishing-header-forensics">phishing-header-forensics</a> lab).

<p class="try-prompt"><strong>Try it</strong>Tap <b>Read it</b> in the reader above. What do the three verdicts show?</p>

## Read the three verdicts

- **SPF** says the sending server was on the domain's allowed list. Here it says `fail`: the server was never authorized.
- **DKIM** says the message carried a valid signature. Here it says `fail (no signature for key)`: there was no signature to check.
- **DMARC** says the domain published a rule for mail that fails the other two. Here it says `fail (p=none - no policy published)`: the domain never published a rule at all.

All three fail, and the DMARC failure is "no policy," not "broke a policy." That combination is the whole point.

<p class="try-prompt"><strong>Try it</strong>Tap each row to highlight the line it comes from in the header above.</p>

## The combination, not the individual fails

A single `fail` is not always a verdict on its own. The pattern matters. Here, all three fail and the domain has no DMARC record. That is not a spoofed legitimate sender; it is an unauthenticated domain.

<p class="try-prompt"><strong>Ask yourself</strong>Is someone impersonating a brand that protects itself, or is no one defending this domain at all? That distinction changes the action.</p>

A spoofed defended domain means someone is impersonating a brand and broke its rule. An unauthenticated domain means no one is defending anything, which is exactly what an attacker wants when there is no rule to break.

<div class="expand-stack">
  <details class="expand-item">
    <summary class="expand-term">Why "no DMARC" is different from "DMARC fail"</summary>
    <div class="expand-body">
      <p>
        <code>DMARC fail</code> means the domain published a policy and the message did not meet it. <code>No DMARC record</code> means the domain never published a policy at all, so there is nothing to align against. The first is a spoof of a defended domain; the second is an unauthenticated domain. Both land in quarantine, but for different reasons.
      </p>
    </div>
  </details>
</div>

## Confirm what the domain publishes

Don't trust the header alone. The header tells you what the receiver saw; the DNS tells you what the domain actually publishes.

<pre><code>dig +short TXT dalimnthefoob.co
dig +short TXT _dmarc.dalimnthefoob.co</code></pre>

<p class="try-prompt"><strong>Try it</strong>Run both. What comes back? Nothing means the domain has no authentication posture at all, which confirms the header read.</p>

## Make the decision

From the combination, the decision is clear: unauthenticated domain, block or quarantine. The same method gives the other cases:

- All three fail and no DMARC published: unauthenticated domain. Block or quarantine.
- All three pass: the message came from the domain it claims, but that is not the same as safe. For money or credentials, confirm on a second channel.
- SPF and DKIM pass but DMARC is none: signed and allowed, but the domain publishes no rule. Treat as unknown until you confirm the sender.
- Otherwise mixed: read the three rows, then confirm the domain with dig.

## What this method cannot catch

The three verdicts answer "did this come from the domain it claims?" They do not answer "is this safe?" AI-powered scams are built around that gap:

- **Compromised real accounts** pass all three checks, because the mail is genuinely from the hijacked account. Still a phish. Confirm money or credential requests on a second channel.
- **Lookalike domains** (like `paypa1.com`) register their own valid SPF, DKIM, and DMARC, so every check passes. DMARC on the real brand has no authority over a different domain.
- **Abused legitimate platforms** authenticate as the platform, not the brand. The header is clean; the story is in the URLs.

<p class="try-prompt"><strong>Ask yourself</strong>What would an attacker need to make this email pass all three checks and still be a scam? (A hijacked real account is the usual answer.)</p>

Sources: [Adaptive Security](https://www.adaptivesecurity.com/blog/how-ai-generated-phishing-bypasses-traditional-email-filters), [Palisade](https://www.palisade.email/learning/why-do-phishing-emails-pass-spf-and-dkim), [PowerDMARC](https://powerdmarc.com/what-is-dmarc/), [IRONSCALES (March 2026)](https://ironscales.com/blog/best-of-the-worst-march-27-2026), [IRONSCALES: Still Phishing.](https://ironscales.com/threat-intelligence/authenticated-supplier-invoice-cousin-domain-display-name-impersonation)

## You can now do this

You have read a real phishing email end to end: three verdicts, a DNS check, a decision. Next time a suspicious email lands:

1. Open the raw header. Find `Authentication-Results`.
2. Read the three verdicts: SPF, DKIM, DMARC.
3. `dig` the sending domain and its `_dmarc.` subdomain.
4. Decide: all fail with no DMARC means block; all pass means confirm out-of-band for anything sensitive.

Three lines, a dig, a decision. No paid tool.

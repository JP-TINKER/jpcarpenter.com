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

We will work through one real phishing email. It is already loaded in the reader above: a "Someone tried to log in to your account" alert, sent from `dalimnthefoob.co` and redacted from a real case (the same one traced in the <a href="/labs/phishing-header-forensics">phishing-header-forensics</a> lab).

First, tap **Read it** in the reader above. You should see three verdicts: SPF, DKIM, and DMARC, each showing `fail`. We will read each one.

## Read the three verdicts

**SPF** says whether the sending server was on the domain's allowed list. Here it says `fail`: the message came from a server `dalimnthefoob.co` never authorized.

**DKIM** says whether the message carried a valid signature from the domain. Here it says `fail (no signature for key)`: there was no signature to check.

**DMARC** says whether the domain published a rule for what receivers should do with mail that fails the other two. Here it says `fail (p=none - no policy published)`: the domain never published a rule at all.

Notice that all three fail, and that the DMARC failure is "no policy," not "broke a policy." That combination is the whole point of this method.

## The combination, not the individual fails

A single `fail` is not always a verdict on its own. The pattern matters. Here, all three fail and the domain has no DMARC record. That is not a spoofed legitimate sender; it is an unauthenticated domain.

The distinction changes the action. A spoofed defended domain is one thing: someone is impersonating a brand that protects itself, and the message broke that brand's rule. An unauthenticated domain is another: no one is defending anything, which is exactly what an attacker wants when there is no rule to break.

<div class="expand-stack">
  <details class="expand-item">
    <summary class="expand-term">Why "no DMARC" is different from "DMARC fail"</summary>
    <div class="expand-body">
      <p>
        <code>DMARC fail</code> means the domain published a policy and the message did not meet it: the domain is actively trying to protect its identity, and this message is not from it. <code>No DMARC record</code> means the domain never published a policy at all, so there is nothing to align against. The first is a spoof of a defended domain; the second is an unauthenticated domain. Both land in quarantine, but for different reasons and with different reporting upstream.
      </p>
    </div>
  </details>
</div>

## Confirm what the domain actually publishes

Don't trust the header alone. The header tells you what the receiver saw; the DNS tells you what the domain actually publishes. Run both from a terminal:

<pre><code>dig +short TXT dalimnthefoob.co
dig +short TXT _dmarc.dalimnthefoob.co</code></pre>

You should see nothing back from either. That confirms the header read: this domain has no email-authentication posture at all.

## Make the decision

From the combination you just read, the decision is clear: unauthenticated domain, block or quarantine.

The same method gives you the other cases too:

- All three fail and no DMARC published: unauthenticated domain. Block or quarantine.
- All three pass: the message came from the domain it claims, but that is not the same as safe. For money or credentials, confirm the request on a second channel.
- SPF and DKIM pass but DMARC is none: signed and allowed, but the domain publishes no rule. Treat as unknown until you confirm the sender.
- Otherwise mixed: read the three rows individually, then confirm the domain with dig.

## What this method cannot catch

The three verdicts answer one question: did this message come from the domain it claims? They do not answer a different one: is this message safe? That distinction matters more now, because AI-powered scams are built around it.

- **Compromised real accounts.** A scam sent from a hijacked mailbox passes all three checks, because it is genuinely from that account. The header says "authenticated," and it is, but the content is still a phish. For anything involving money or credentials, confirm the request on a second channel (call a known number, not the one in the email).
- **Lookalike domains.** An attacker registers a close cousin like `paypa1.com` (a Latin "l" swapped for a digit) or a homoglyph domain, then publishes valid SPF, DKIM, and DMARC for it. Every check passes, because the records are genuinely the attacker's. DMARC on the real brand has no authority over a different domain.
- **Abused legitimate platforms.** Mail sent through a real SaaS (a fundraising platform, a form service) authenticates as that platform, not as the brand it impersonates. The header is clean; the story is in the URLs.

AI makes the lure itself harder to spot: model-generated phishing reads cleanly, personalizes at scale, and drops the old grammar tells. The header read is still necessary, but it is no longer sufficient.

Sources: [Adaptive Security](https://www.adaptivesecurity.com/blog/how-ai-generated-phishing-bypasses-traditional-email-filters), [Palisade](https://www.palisade.email/learning/why-do-phishing-emails-pass-spf-and-dkim), [PowerDMARC](https://powerdmarc.com/what-is-dmarc/), [IRONSCALES weekly recap (March 2026)](https://ironscales.com/blog/best-of-the-worst-march-27-2026), [IRONSCALES: SPF Pass, DKIM Pass, DMARC Pass. Still Phishing.](https://ironscales.com/threat-intelligence/authenticated-supplier-invoice-cousin-domain-display-name-impersonation).

## You can now do this

You have just read a real phishing email end to end: three header verdicts, a DNS check, and a decision. The next time a suspicious email lands, do the same:

1. Open the raw header and find the `Authentication-Results` line.
2. Read the three verdicts: SPF, DKIM, DMARC.
3. `dig` the sending domain and its `_dmarc.` subdomain.
4. Decide: all fail with no DMARC means block; all pass means confirm out-of-band for anything sensitive.

Three lines, a dig, a decision. No paid tool.

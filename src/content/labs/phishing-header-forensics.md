---
title: "Phishing Header Forensics"
summary: "Tracing a spoofed login-alert phishing email through SPF/DKIM/DMARC header forensics and IOC enrichment."
finding: "The sending domain had no email authentication posture at all: SPF, DKIM, and DMARC each failed, and the origin traced to a Poland-based hosting ISP rather than any mail provider it claimed to be."
stamp: "Evidence attached"
state: verified
discipline: security
date: 2026-08-01
order: 10
tags: ["phishing", "email-forensics", "grc"]
---

A walkthrough of one phishing email end to end: reading the raw headers, checking
authentication, and enriching the sending infrastructure. The same triage a SOC analyst runs
before deciding whether to escalate.

## The email

Subject line: "Someone tried to log in To Your Account," a generic account-alert lure claiming
to come from `dalimnthefoob.co`. Classic credential-phish shape: urgency, a login-alert
pretext, and a sender domain that doesn't match any real service it's impersonating.

## Header forensics

Running the raw header through MXToolbox's analyzer surfaced the authentication failure
immediately:

- No DMARC record found for the sending domain
- SPF alignment and authentication both fail
- DKIM alignment and authentication both fail

That's a domain with no email-authentication posture at all: not a spoofed *legitimate*
sender, just an unauthenticated one, relayed through a chain of Microsoft-hosted hops
(`mail.protection.outlook.com` → `outlook.office365.com` → two `prod.outlook.com` relay nodes)
before it landed.

<figure>
  <img src="/labs/phishing-header-analysis.png" alt="MXToolbox delivery information showing failed SPF, DKIM, and DMARC checks" />
  <figcaption>MXToolbox delivery information: SPF, DKIM, and DMARC all failed.</figcaption>
</figure>

## IP reputation and enrichment

The originating IP, `89.144.44.17`, traced to a Poland-based data center/hosting ISP
(MSCode.pl): a Data Center/Web Hosting/Transit usage type, not a residential or corporate
mail server. Checked against AbuseIPDB: no prior abuse reports at the time of the check, which
is itself a useful finding: a clean reputation doesn't mean clean traffic, it means the IOC
hadn't been reported yet.

<figure>
  <img src="/labs/phishing-ip-reputation.png" alt="AbuseIPDB lookup for the originating IP showing hosting-provider ISP, Poland geolocation, and no prior abuse reports" />
  <figcaption>AbuseIPDB enrichment on the originating IP.</figcaption>
</figure>

## What this confirms, and what it doesn't

**Confirms:** an unauthenticated, hosting-provider-originated email with no legitimate
SPF/DKIM/DMARC chain: enough on its own to justify blocking or quarantining.

**Doesn't confirm:** attribution to any specific actor or campaign. An absence of abuse
reports is a point-in-time reputation read, not a clean bill of health: IOCs need re-checking,
not one-and-done trust.

## Why it's here

This is the actual workflow behind "phishing investigation" on a resume line: read the
headers, check the auth chain, enrich the IP, write down what you found and what you
didn't. Neither tool here does the thinking for you: MXToolbox and AbuseIPDB just make the
lookups fast enough to do this for every reported email, not just the interesting ones.

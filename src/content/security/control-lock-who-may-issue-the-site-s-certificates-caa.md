---
kind: control
title: "Lock who may issue the site's certificates (CAA)"
summary: "Lock who may issue the site's certificates (CAA)"
date: 2026-09-04
order: 40
state: verified
---

**In plain terms:**
              CAA
              records in DNS say which certificate companies are allowed to issue a lock
              certificate for this domain.
            

**Why it matters here:** without CAA, any public CA can issue a cert
              for the name if someone tricks the issuance process. CAA makes "wrong issuer"
              fail closed at the CA, not after the fact.
            

**How:** DNS CAA on the apex names Let's Encrypt
              (`issue "letsencrypt.org"`) and routes issuance reports to
              `mailto:jp@jpcarpenter.com`. Verify with
              `dig CAA jpcarpenter.com`. If the site later moves to Cloudflare Pages,
              replace these with Cloudflare's CA set before cutover — a stale Let's Encrypt-only
              CAA will block their issuance.
            

**Sources**

- [RFC 8659, DNS Certification Authority Authorization (CAA) Resource Record](https://www.rfc-editor.org/rfc/rfc8659)
              
- [Let's Encrypt: CAA](https://letsencrypt.org/docs/caa/), how issuers
                check these records


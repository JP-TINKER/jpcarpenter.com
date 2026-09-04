---
kind: control
title: "Keep the site locked to HTTPS"
summary: "Keep the site locked to HTTPS"
date: 2026-09-04
order: 30
state: verified
---

**In plain terms:** visitors should always use the secure connection
              (the lock in the address bar).
              HSTS
              is a note to the browser: "for a long time, only use HTTPS for this name, and for
              its subdomains."
            

**Why it matters here:** without HSTS, a first visit or a bad link can
              still try plain HTTP. HSTS closes that gap after the browser has seen the policy.
              The `preload` flag is consent to join the browser vendors' shared list.
            

**How:** HTTPS is required; HTTP redirects to HTTPS. The site sends
              `Strict-Transport-Security: max-age=31536000; includeSubDomains; preload`
              from one nginx header snippet (HTML and hashed `/_astro/` assets get the
              same policy). The unused `www` DNS record was removed so the name list
              matches the certificate. The domain is submitted to the shared preload list
              (hstspreload.org status: `pending` — browsers pick it up after Chromium
              ships the entry; that lag is normal).
            

**Sources**

- [OWASP HTTP Strict Transport Security Cheat Sheet](https://cheatsheetseries.owasp.org/cheatsheets/HTTP_Strict_Transport_Security_Cheat_Sheet)
              
- [MDN: Strict-Transport-Security](https://developer.mozilla.org/en-US/docs/Web/HTTP/Reference/Headers/Strict-Transport-Security)
              
- [hstspreload.org](https://hstspreload.org/), submission rules and caveats


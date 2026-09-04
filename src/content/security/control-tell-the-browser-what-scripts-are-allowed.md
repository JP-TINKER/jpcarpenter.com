---
kind: control
title: "Tell the browser what scripts are allowed"
summary: "Tell the browser what scripts are allowed"
date: 2026-09-04
order: 20
state: verified
---

**In plain terms:** a
              Content-Security-Policy (CSP)
              is a packing list the browser must follow. This site's list says: only load scripts
              and styles from this same website, not from random other places, and do not run
              leftover "inline" script tags that often show up in attacks.
            

**Why it matters here:** even a simple page can be damaged if someone
              finds a way to inject script. A strict CSP makes that much harder. We also ask
              supporting browsers for
              Trusted Types,
              an extra guard against a common class of page-tampering bugs.
            

**How:** every script and stylesheet ships as its own file from this
              website. The policy uses `script-src 'self'` with no
              `'unsafe-inline'`, plus `form-action 'none'` (fill sheets
              on /resources do not submit) and `frame-ancestors 'none'` (do not embed this site in someone
              else's frame).
            

**Sources**

- [OWASP Content Security Policy Cheat Sheet](https://cheatsheetseries.owasp.org/cheatsheets/Content_Security_Policy_Cheat_Sheet.html)
              
- [MDN: Content Security Policy](https://developer.mozilla.org/en-US/docs/Web/HTTP/Guides/CSP)
              
- [MDN: Trusted Types API](https://developer.mozilla.org/en-US/docs/Web/API/Trusted_Types_API)


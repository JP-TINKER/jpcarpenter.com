---
kind: control
title: "Stop framing tricks and casual browser features"
summary: "Stop framing tricks and casual browser features"
date: 2026-09-04
order: 50
state: verified
---

**In plain terms:** other sites should not wrap this page in a
              picture-frame and trick someone into clicking the wrong thing. This site also
              turns off browser features a portfolio never needs (camera, microphone, location,
              payments, and similar).
            

**Why it matters here:** clickjacking and cross-window tricks are old,
              but still cheap for attackers. Turning off unused device APIs is free hygiene,
              there is no legitimate reason for this site to ask for your camera.
            

**How:** framing is denied; content-type sniffing is disabled;
              cross-origin opener and resource policies keep windows and assets on a short leash;
              Permissions-Policy is a long deny list.
            

**Sources**

- [OWASP HTTP Headers Cheat Sheet](https://cheatsheetseries.owasp.org/cheatsheets/HTTP_Headers_Cheat_Sheet.html)
              
- [MDN: Cross-Origin-Opener-Policy](https://developer.mozilla.org/en-US/docs/Web/HTTP/Reference/Headers/Cross-Origin-Opener-Policy)
              
- [MDN: Permissions-Policy](https://developer.mozilla.org/en-US/docs/Web/HTTP/Reference/Headers/Permissions-Policy)
              
- OWASP ASVS (Application Security Verification Standard), HTTP security header
                expectations, scaled to a personal static site (Level 1 thinking, not a bank).


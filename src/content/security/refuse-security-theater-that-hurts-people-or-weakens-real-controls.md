---
kind: refuse
title: "Security theater that hurts people or weakens real controls"
summary: "Security theater that hurts people or weakens real controls"
date: 2026-09-04
order: 160
state: verified
---

- Sitewide CAPTCHA / bot walls on a site with no login (see row above).
- Fake "military-grade" badges or seals with nothing to verify.
- Client-only "encryption" of public HTML, visitors already receive the page.
- Heavy challenge pages for every human on a low-traffic personal site (including
                self-hosted proof-of-work gates) unless availability is actually under attack.
              
- Third-party scripts "for convenience" that force permanent CSP exceptions.

**Sources**

- Prefer real controls over badges and puzzles that weaken browser protections;
                same judgment as the CAPTCHA row above.
              
- [OWASP HTTP Headers Cheat Sheet](https://cheatsheetseries.owasp.org/cheatsheets/HTTP_Headers_Cheat_Sheet.html)
               , configure headers that matter; skip decoration.


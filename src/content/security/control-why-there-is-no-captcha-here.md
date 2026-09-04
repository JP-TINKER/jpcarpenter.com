---
kind: control
title: "Why there is no CAPTCHA here"
summary: "Why there is no CAPTCHA here"
date: 2026-09-04
order: 150
state: verified
---

**In plain terms:** those "prove you are human" puzzles are useful on
              login forms and signup walls. This site has neither. A CAPTCHA on every visit would
              mostly annoy people, and most scrapers never run the puzzle anyway; they just
              download the page.
            

**Why it matters here:** adding a third-party CAPTCHA would require
              outside JavaScript and punch holes in the strict script policy above. That trades a
              real control for theater. If contact spam ever becomes a real problem, the honest
              next step is a first-party form with a honeypot (and a deliberate policy review),
              not a badge that weakens CSP.
            

**Sources**

- Judgment call: do not put CAPTCHA on first contact without evidence of abuse,
                especially when it would force weaker browser script rules.
              
- CSP integrity citations in "Tell the browser what scripts are allowed" above.


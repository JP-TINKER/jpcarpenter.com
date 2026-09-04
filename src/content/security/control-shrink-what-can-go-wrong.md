---
kind: control
title: "Shrink what can go wrong"
summary: "Shrink what can go wrong"
date: 2026-09-04
order: 10
state: verified
---

**In plain terms:** the fewer moving parts a website has, the fewer
              ways it can be broken. This site is a set of finished pages, like printed sheets,
              not a living application that talks to a database when you visit.
            

**Why it matters here:** there is no password page for an attacker to
              guess, and no admin panel hanging off the public site.
            

**How:** pages are finished files on the server, not an app that
              rebuilds itself from a database on every visit. Fewer moving parts first; fancy
              gadgets only if they earn their keep.
            

**Sources**

- OWASP thinking on reducing unnecessary surface:
                [Web Security Testing Guide](https://owasp.org/www-project-web-security-testing-guide/)
                (configuration / deployment testing).
              
- Same idea in practice: prefer a simple static site over stacking defenses on a
                complicated one.


---
kind: control
title: "Identity stitching (sameAs)"
summary: "Identity stitching (sameAs)"
date: 2026-09-04
order: 80
state: verified
---

**In plain terms:** the About page marks up a Person with LinkedIn and
              GitHub links as `sameAs`, so crawlers can treat the site, LinkedIn, and
              GitHub as one person instead of three strangers.
            

**Why it matters here:** recruiter tools lean on LinkedIn and GitHub.
              The personal site is the identity hub. `sameAs` is the cheap stitch.
              Microdata is used instead of JSON-LD because this site's CSP forbids inline script
              and a static host cannot rotate nonces.
            

**How:** schema.org Person microdata on [/about](/about),
              mirrored in [/about.md](/about.md).


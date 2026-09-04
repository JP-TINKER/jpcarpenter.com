---
kind: control
title: "Markdown identity card (same facts, no cloaking)"
summary: "Markdown identity card (same facts, no cloaking)"
date: 2026-09-04
order: 70
state: verified
---

**In plain terms:** there is a plain Markdown card at
              [/about.md](/about.md) with the same biography, credentials, and contact
              facts as the HTML About page. Browsers keep the HTML page. Agents that prefer
              `text/markdown` can take the card.
            

**Why it matters here:** this is how you "only show them what you want"
              without lying. Same facts, denser format. Different facts for bots would be cloaking
              and would burn trust with search engines.
            

**How:** `/about.md` ships as `text/markdown`.
              On the origin, nginx Accept negotiation serves that card for
              `/about` when the client asks for Markdown, and always sends
              `Vary: Accept`. Browsers still get HTML.
              [/llms.txt](/llms.txt) remains the denser whole-site summary.
            

**Limits**

- Anyone can fetch `/about.md` directly. It is not a secret channel.
- Without edge bot verification, a scraper can still take the HTML.


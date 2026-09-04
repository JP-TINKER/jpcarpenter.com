---
kind: control
title: "Header drift monitor (CI)"
summary: "Header drift monitor (CI)"
date: 2026-09-04
order: 158
state: verified
limits: "Watches live-origin header drift after deploy — not a merge/deploy gate, and not a full ZAP or XSS suite."
---

**In plain terms:** a small automated check fails if the live site stops sending the security headers this page claims (HSTS, CSP, framing deny, and related).

**Why it matters here:** posture pages go stale when config drifts. A scheduled/PR check against the live origin keeps claims checkable.

**How:** `npm run headers-ci` (and a GitHub Action on push/PR plus weekly cron) HEADs `/` and `/security` on the live origin and checks required headers against a pinned checklist.

**Limits**

- Not a penetration test.
- Does not block a local rsync deploy by itself — it reports drift on the origin after (or between) deploys.
- Does not prove instruments work under Trusted Types — that still needs a real click in a browser.

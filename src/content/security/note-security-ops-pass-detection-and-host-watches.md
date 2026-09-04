---
kind: note
title: "Security ops pass — detection and host watches"
summary: "Wired canary hit logs, host hygiene, CT and HSTS watches, and a headers CI monitor. Claims updated to match what actually runs."
date: 2026-09-04
order: 5
state: verified
---

Field note for 2026-09-04.

Shipped without changing visitor UX:

- Canary path watched every 15 minutes (durable hit log; email best-effort)
- fail2ban on SSH; unattended-upgrades on
- Daily Certificate Transparency poll
- Weekly HSTS preload status poll (still `pending` on the shared list)
- `headers-ci` against live origin + GitHub Action (monitor, not a deploy gate)

Honesty: mail can fail; CT depends on crt.sh; header CI is drift detection, not a full ZAP suite. Canary path stays unpublished here. Red-team follow-up same day: encoded-path canary match, CT subdomain query, flock on the watcher.

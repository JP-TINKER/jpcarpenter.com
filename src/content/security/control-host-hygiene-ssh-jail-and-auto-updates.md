---
kind: control
title: "Host hygiene (SSH jail and auto updates)"
summary: "Host hygiene (SSH jail and auto updates)"
date: 2026-09-04
order: 128
state: verified
limits: "Protects the VPS admin surface, not the static HTML itself. No HTTP fail2ban jail (would risk banning readers). Auto-updates install packages; a reboot may still be needed for some kernel/library fixes."
---

**In plain terms:** the server that serves the static files still has an SSH door. That door is keys-only (password guesses fail). fail2ban trims noisy repeat SSH spray from the logs. Security packages install on a schedule.

**Why it matters here:** a static site collapses web attack surface; the remaining high-value target is the host. Opportunistic SSH spray is common.

**How:** SSH password auth is off (keys only) — that is the access control. fail2ban watches the SSH jail (`maxretry` 5, `bantime` 1 hour) for log hygiene. unattended-upgrades installs security updates on a schedule (running processes may still need a restart). nginx `modules-enabled` is empty (verified default — unused dynamic modules are not loaded).

**Limits**

- Does not replace good key hygiene or registrar MFA.
- No HTTP-level fail2ban — rate limits already cover scrape hammering without banning browsers.
- Outside observers can confirm SSH auth methods; fail2ban and unattended-upgrades are host-internal (ops-verified).

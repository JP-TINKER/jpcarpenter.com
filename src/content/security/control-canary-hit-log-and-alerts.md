---
kind: control
title: "Canary hit log and alerts"
summary: "Canary hit log and alerts"
date: 2026-09-04
order: 125
state: verified
limits: "Detection only. Path unpublished. Mail is best-effort; the hit log is the durable record."
---

**In plain terms:** an unlinked decoy file on the site is watched. When something requests it, the server appends a line to a durable hit log. The box also tries to email that hit.

**Why it matters here:** a tripwire without a watcher is decoration. A durable hit log means many probes leave a trail even if mail is down — provided the cron still runs and someone reads the log.

**How:** a cron job every fifteen minutes reads new nginx access-log lines for requests under the decoy directory (plain or encoded), appends them to the hit log, and best-effort mails `jp@jpcarpenter.com`. The decoy path is not published on this page on purpose.

**Limits**

- Does not block scanners — detection only.
- Email delivery depends on outbound mail from the origin; the hit log always records.
- Log-rotate windows and unusual encodings can still delay or miss a line; the watcher is improved for common encoded forms, not proven against every nginx normalization quirk.
- Dirbusting can still discover the path; rotate if it becomes noise.

**Sources**

- Common defensive pattern: unlinked canary / honey paths as early warning without changing what real visitors see.

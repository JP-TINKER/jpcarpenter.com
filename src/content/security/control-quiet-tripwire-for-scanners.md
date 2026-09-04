---
kind: control
title: "Quiet tripwire for scanners"
summary: "Quiet tripwire for scanners"
date: 2026-09-04
order: 120
state: verified
---

**In plain terms:** there is an unlinked decoy file on the site. Normal
              readers never see it. If something requests it, that shows up in server logs,
              useful as an early "someone is poking around" signal.
            

**Why it matters here:** it does not stop an attack by itself. It helps
              detection. The address of the decoy is not published here on purpose, advertising
              a tripwire teaches scanners where to step.
            

**How:** a small unused file ships with the site; a cron job checks server access logs
for requests to it, appends hits to a durable log, and best-effort emails an alert.
The path itself is not published here.


**Sources**

- Common defensive pattern: unlinked "canary" or honey paths as an early warning
                when something probes beyond normal browsing, without changing what real
                visitors see.


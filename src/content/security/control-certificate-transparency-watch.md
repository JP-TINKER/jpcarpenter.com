---
kind: control
title: "Certificate Transparency watch"
summary: "Certificate Transparency watch"
date: 2026-09-04
order: 155
state: verified
limits: "Discovery after issuance, not prevention. CAA is prevention. crt.sh can lag or 502. Routine Let's Encrypt renewals also create new serials."
---

**In plain terms:** public Certificate Transparency logs list new certificates for a name. This site polls those logs daily and records any new serial it has not seen before, with best-effort email.

**Why it matters here:** CAA stops many wrong issuers. CT watch notices after the fact — including unexpected names — when the third-party log is reachable.

**How:** a daily job queries crt.sh for the apex and `%.jpcarpenter.com`, unions serials into a local state file, and appends/mail on new ones.

**Limits**

- Not a block — discovery only.
- Third-party log lag and outages exist.
- Expected renewals will alert unless filtered later — treat noise as part of the signal.

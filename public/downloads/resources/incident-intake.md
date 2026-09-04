# Incident intake form

**Incident ID:** `[INC-####]` · **Status:** Open / Contained / Closed  
**Detected (UTC):** `[time]` · **Reported (UTC):** `[time]` · **Reporter:** `[Name]`

**Use:** First fifteen minutes when something looks wrong. Facts only.  
**Not:** Legal notice language, breach determination, or a full IR plan.

## 1. Now (facts)

| Field | Answer |
|-------|--------|
| Systems / apps possibly touched | |
| Data classes possibly touched (PII, CHD, secrets, unknown) | |
| Customer / partner impact | None / Unknown / Yes → who |
| How discovered (alert, user report, vendor, other) | |
| Containment already taken | |

## 2. Observed artifacts (IDs only)

| Type | ID / path | Preserved? |
|------|-----------|------------|
| Alert / ticket | | |
| Email / chat thread | | |
| Log query / SIEM case | | |
| Screenshots / packet capture | | |

Do **not** alter clocks, wipe disks, or “clean up” until the owner says so.

## 3. Severity sketch (with uncertainty)

Use your org’s definitions. Placeholder scale (edit to match policy):

| Level | Meaning (edit me) |
|-------|-------------------|
| High | Likely legal/regulatory impact or day-to-day ops disrupted |
| Medium | Harm or delay to one or more business units |
| Low | Clear policy violation; limited business impact |

**Current guess:** High / Medium / Low · **Confidence:** Low / Med / High  
**Why (two lines max):**  

## 4. Ownership and cadence

| Role | Name | Next update due |
|------|------|-----------------|
| Incident lead | | `[+30 / 60 / 120 min]` |
| Comms / legal (if High/Med) | | |
| Engineering owner | | |

## 5. Hand-off checklist (before you leave the channel)

- [ ] Facts vs hypotheses are labeled separately  
- [ ] Evidence list started  
- [ ] Severity guess recorded with uncertainty  
- [ ] Next update time posted  

## Credits

Notification fields and severity banding reflect common IR practice in public FOSS packs (including StrongDM [Comply](https://github.com/strongdm/comply) Security Incident Response Policy, Apache-2.0). Form wording is original. Pair with the fill-in [Incident response policy](/resources/incident-response-policy) template when you need the governing document.

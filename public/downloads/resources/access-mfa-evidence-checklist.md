# Access and MFA evidence checklist

**Owner (fill in):** `[Name / role]`  
**System / IdP:** `[Okta / Entra / Google / other]`  
**Review window:** `[start date]` → `[end date]`  
**Population in scope:** `[admins / break-glass / all privileged roles]`

**Use:** Kick off an access review or challenge an MFA claim with dated artifacts.  
**Not:** Legal advice, an audit opinion, or a guarantee of control effectiveness.

## 1. Scope lock

| Item | Your answer | Evidence link / export ID |
|------|-------------|---------------------------|
| Roles treated as privileged | | |
| Break-glass / emergency accounts named | | |
| Service accounts / shared mailboxes in scope? Y/N | | |
| Out of scope (and why) | | |

## 2. Ask for (minimum pack)

Copy this into a ticket or email. Require **dated** exports.

1. **Privileged population export** from the IdP (role or group membership), generated on `[date]`.
2. **MFA enrollment / method report** for that same population (last 90 days or current state).
3. **Sample authentication logs** for **one named admin**: successful login + MFA challenge/success, same session window.
4. **Exception register** for accounts that skip MFA (owner, reason, expiry, compensating control).
5. **Last access-review sign-off** for privileged roles (approver, date, population size).
6. **Joiner / mover / leaver** sample: one recent hire and one recent exit with ticket IDs showing access granted and revoked.

## 3. Pass / fail cues

| Signal | Usually means |
|--------|----------------|
| Break-glass without MFA and no expiry | Residual risk accepted silently |
| Enrollment report omits service accounts | Incomplete population |
| MFA claim, no challenge log for a named admin | Assertion without proof |
| Access review older than your stated cadence | Process drift |
| Stale exceptions with no compensating control | Exception became culture |

## 4. Reviewer worksheet

| Check | Pass | Fail | Notes |
|-------|------|------|-------|
| Population export matches stated roles | | | |
| MFA coverage ≥ stated policy for humans | | | |
| Every MFA exception has owner + expiry | | | |
| Sample admin log shows challenge, not just password | | | |
| Recent leaver access closed within policy SLA | | | |

**Overall:** Pass / Conditional / Fail  
**Follow-ups:**  

## Credits

Shape aligned with common access-control and onboarding/offboarding practice in public FOSS policy packs (including StrongDM [Comply](https://github.com/strongdm/comply) Apache-2.0 themes). Wording is original. Not a copy of any vendor questionnaire.

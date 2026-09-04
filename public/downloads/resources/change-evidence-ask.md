# Change evidence ask sheet

**Change ID:** `[CHG-####]` · **Title:** `[short]`  
**Risk class:** `[Standard / Normal / Emergency]` · **Environment:** `[prod / staging]`  
**Window:** `[start]` → `[end]` · **Approver:** `[Name]`

**Use:** Pull proof for **one** production change (audit sample or peer spot check).  
**Not:** A full change-management program or CAB minutes substitute.

## 1. Ticket (planning)

| Field | Value / link |
|-------|----------------|
| Change ID and title | |
| Risk / priority rationale | |
| Business justification | |
| Implementation plan (steps) | |
| Test plan | |
| Rollback plan | |
| Communications plan (who is told) | |
| Scheduled window | |
| Approver(s) and approval timestamp **before** deploy | |

## 2. Code / config

| Field | Value / link |
|-------|----------------|
| PR or commit URL | |
| Reviewers | |
| Branch protection / required checks still on? Y/N | |
| Secrets or customer-data handling changed? Y/N | |

## 3. Deploy

| Field | Value / link |
|-------|----------------|
| Pipeline / run ID | |
| Deploy timestamp (UTC) | |
| Who pressed go (or automation identity) | |
| Exact environment / cluster / account | |

## 4. Verify

| Field | Value / link |
|-------|----------------|
| Post-deploy check or monitoring note | |
| Customer impact observed? | |
| Rollback used? If yes, ticket link | |
| Post-change review / lessons (if required by risk class) | |

## 5. Pass / fail cues

| Red flag | Why it matters |
|----------|----------------|
| Hotfix with no ticket | No planning trail |
| Approve-after-deploy | Control inverted |
| Screenshots instead of ticket / run IDs | Not reproducible |
| No named rollback | Recoverability unproven |
| Security-architecture change without security review | Scope creep |

**Sample result:** Pass / Conditional / Fail  
**Notes:**  

## Credits

Procedure stages (plan → evaluate → review → approve → communicate → implement → document → post-review) follow the public System Change Policy pattern in StrongDM [Comply](https://github.com/strongdm/comply) (Apache-2.0). Sheet wording and evidence fields are original.

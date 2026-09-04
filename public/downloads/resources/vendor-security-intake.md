# Vendor security intake

**Requester:** `[Name]` · **Business owner:** `[Name]` · **Date:** `[YYYY-MM-DD]`  
**Vendor / product:** `[Legal name · product]` · **Use case:** `[one sentence]`

**Use:** First pass before a new SaaS (or significant expansion) touches production data.  
**Not:** A substitute for legal review, procurement, or a full third-party risk program.

## A. Company and data scope

| Field | Answer |
|-------|--------|
| Legal entity + HQ | |
| Product / SKU in scope | |
| Data classes touched (PII, CHD, secrets, none) | |
| Processing regions | |
| Subprocessors list (link or attach) | |
| DPA / BAA status | Draft / Signed / N/A |
| Will they access *our* network, IdP, or cloud? Y/N | |

## B. Security claims (ask for proof, not marketing)

| Claim | Proof requested | Received? | Notes |
|-------|-----------------|-----------|-------|
| SOC 2 Type II or ISO 27001 | Report under NDA (date + scope) | | |
| MFA for vendor staff with prod access | Policy excerpt or attestation | | |
| Encryption in transit | TLS requirement stated | | |
| Encryption at rest | Where (DB, object store, backups) | | |
| Incident notify window | Contract clause (hours) | | |
| Data deletion / exit | How + timeline after churn | | |

## C. Access into *our* environment

| Item | Detail |
|------|--------|
| Accounts, API keys, OAuth apps, VPN, agents | |
| Named owner who can revoke in one business day | |
| Least privilege justification | |
| Review / rotate cadence | |

## D. Risk call (internal)

| Question | Answer |
|----------|--------|
| Inherent risk (H/M/L) and why | |
| Residual risk after contract + controls | |
| Compensating controls if residual is high | |
| Approve / defer / reject | |
| Approver + date | |

## E. Red flags

- Marketing PDF instead of a dated report under NDA  
- No incident notify clause  
- Subprocessors unknown  
- Persistent access into your environment with no named owner  

## Credits

Intake shape follows common vendor-management practice in public FOSS packs (including StrongDM [Comply](https://github.com/strongdm/comply) Vendor Management Policy, Apache-2.0). Questionnaire wording is original.

# System change policy

**Document ID:** `[ORG]-SCP-001` · **Version:** `0.1` · **Owner:** `[CIO / Engineering lead / Security]`  
**Effective:** `[YYYY-MM-DD]` · **Next review:** `[YYYY-MM-DD]`

**How to use:** Fill brackets. Tie risk classes to your CAB or async approval rules.  
**Not:** Legal advice. Evidence for a single change: [Change evidence ask sheet](/resources/change-evidence-ask).

## 1. Purpose

Ensure changes to information systems are planned, evaluated, reviewed, approved, communicated, implemented, documented, and reviewed afterward so failures are recoverable and lessons stick.

## 2. Scope

All changes to production (and designated staging) information and communications technology controlled by `[Organization]`, including infrastructure, applications, security architecture, and customer-data handling paths. Applies to employees, contractors, and service providers with change rights.

## 3. Policy

1. Changes that affect **security architecture** or **customer data handling** require a written request and approval by `[ISM]` and `[CIO / equivalent]` before implementation (except documented emergencies — see §5).  
2. All change requests are documented in `[ticket system]`.  
3. Requests are prioritized by benefit, urgency, effort, and operational impact.  
4. Implemented changes are communicated to affected users.  
5. Emergency changes still get a ticket; approval may be after-the-fact within **`[N]` business days**, with a mandatory post-review.

## 4. Procedure

| Stage | Required |
|-------|----------|
| **Plan** | Implementation design, schedule, communications, test plan, rollback plan |
| **Evaluate** | Priority, risk introduced, change type, step-by-step process |
| **Review** | `[CIO / ISM / Eng lead / business owner]` as applicable to risk class |
| **Approve** | Named approver(s) recorded **before** deploy (except emergency path) |
| **Communicate** | Users / on-call / customers as needed |
| **Implement** | Test then deploy; record pipeline / run IDs |
| **Document** | Ticket closed with outcomes and issues |
| **Post-review** | Impact and lessons for Normal+ / High risk or failed changes |

## 5. Risk classes (edit)

| Class | Examples | Approval |
|-------|----------|----------|
| Standard | Low-risk, pre-approved catalog changes | Auto or peer |
| Normal | Most production changes | `[approver role]` |
| Emergency | Active incident or severe outage | Deploy then ratify |

## 6. Evidence

For audit samples, collect ticket ID, approval timestamp, PR/commit, deploy run ID, post-deploy verification, and rollback path. Use the change evidence ask sheet.

## Credits / NOTICE

Stages and approval emphasis inspired by the System Change Policy in StrongDM [Comply](https://github.com/strongdm/comply) (`themes/comply-soc2/policies/change.md`, Apache License 2.0). Rewritten with placeholders; not a verbatim copy.

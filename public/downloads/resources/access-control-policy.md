# Access control policy

**Document ID:** `[ORG]-AOTP-001` · **Version:** `0.1` · **Owner:** `[Role]`  
**Effective:** `[YYYY-MM-DD]` · **Next review:** `[YYYY-MM-DD]`  
**Applies to:** Employees, contractors, and others granted access to `[Organization]` systems.

**How to use:** Replace every `[bracket]`. Delete sections that do not apply. Have Legal/HR review before publishing.  
**Not:** Legal advice. Adapted structure from public FOSS policy packs; wording rewritten for fill-in use.

## 1. Purpose

Define how `[Organization]` grants, changes, and removes access to technical systems so that least privilege is the default and departed users lose access on a known timeline.

## 2. Scope

- All production and staging systems managed by `[Organization]`  
- Identity providers: `[IdP names]`  
- Populations: full-time, part-time, contractors, and vendors with accounts  

## 3. Roles

| Role | Responsibility |
|------|----------------|
| `[Hiring manager / people lead]` | Notify HR/IT of joiners, movers, leavers |
| `[HR]` | Confirm employment status; trigger offboarding |
| `[IT / IAM]` | Create, change, and revoke accounts per checklist |
| Resource owner | Approve permissions for systems they own |
| `[Security]` | Spot-check privileged access and MFA exceptions |

## 4. Policy

### 4.1 Onboarding

1. Hiring manager notifies HR of hire date and role.  
2. HR notifies IT with role, start date, and manager.  
3. IT builds an **access checklist** for that role (systems + permission level).  
4. Each resource owner **approves** account creation and permissions.  
5. IT provisions only what is on the approved checklist.  
6. MFA is enrolled before production access is granted, except entries on the [exception log](/resources/policy-exception-log).

### 4.2 Offboarding

1. Manager notifies HR when employment ends (voluntary or not).  
2. HR instructs IT to revoke access.  
3. IT disables or deletes access within **`[N]` business days** of notice (default target: same day for involuntary; `[N]` for planned exit).  
4. Privileged and break-glass accounts are confirmed closed and logged.

### 4.3 Role change

When someone’s job changes, follow onboarding **and** offboarding steps for the systems that no longer apply. Do not leave old privileges “just in case.”

### 4.4 Periodic review

`[IT]` and `[HR/Security]` review privileged accounts and permission levels at least **`[monthly / quarterly]`**. Findings go to the resource owner. Unowned accounts are disabled.

### 4.5 Evidence (what “done” looks like)

- Dated IdP export of privileged population  
- MFA enrollment report for that population  
- Ticket IDs for recent joiner and leaver  
- Exception register with owners and expiry  

Use the [Access and MFA evidence checklist](/resources/access-mfa-evidence-checklist) for spot checks.

## 5. Related documents

- Policy exception log  
- Incident response policy  
- Acceptable use (if separate)

## Credits / NOTICE

Structure inspired by the Access Onboarding and Termination Policy in StrongDM [Comply](https://github.com/strongdm/comply) (`themes/comply-soc2/policies/access.md`, Apache License 2.0). This template is a rewrite with placeholders, not a verbatim copy. Comply copyright remains with its authors; your filled policy is your organization’s document.

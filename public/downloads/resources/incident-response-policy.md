# Security incident response policy

**Document ID:** `[ORG]-SIRP-001` · **Version:** `0.1` · **Owner:** `[Information Security Manager / role]`  
**Effective:** `[YYYY-MM-DD]` · **Next review:** `[YYYY-MM-DD]`  
**Report channel:** `[security@example.com / pager / #channel]`

**How to use:** Fill brackets. Align severity and notify windows with Legal and contracts. Test twice a year.  
**Not:** Legal advice or a breach-notification opinion. Pair day-of capture with the [Incident intake form](/resources/incident-intake).

## 1. Purpose

Ensure `[Organization]` detects security weaknesses and incidents early, responds quickly, preserves evidence, and communicates with the right people.

## 2. Scope

All users of `[Organization]` information systems: employees, contractors, and external parties who touch systems or data we control.

## 3. Definitions (edit to match your program)

| Term | Working definition |
|------|--------------------|
| Vulnerability | Weakness in a system, procedure, or admin control that could be exploited |
| Incident | Suspected or confirmed unauthorized access, disclosure, disruption, or significant policy violation |
| Breach | Incident that Legal/Security determines meets contractual or legal breach criteria |

## 4. Policy

1. Users must report suspected vulnerabilities or incidents to `[ISM / on-call]` as soon as possible and **no later than `[24]` hours** via `[channel]`.  
2. Users are trained on how to report. Failure to report may be treated as a security violation and referred to `[HR]`.  
3. Artifacts (logs, files, captures) are preserved; do not destroy potential evidence.  
4. All confirmed incidents follow the procedure below.  
5. This procedure is **reviewed at least annually** and **tested at least twice per year**.  
6. Incident logs are reviewed **`[monthly]`** for response quality.

## 5. Prepare (before an incident)

1. Define on-call schedule and name the incident lead for each window.  
2. Publish current contact channels where staff can find them.  
3. Name sponsors: Engineering, Legal, HR, Comms / leadership as needed.  
4. Keep this policy and the intake form where staff can reach them offline if SSO is down.

## 6. Execute (when something is reported)

### 6.1 Notify

Reporter (or their manager) sends: description; date/time/location; who found it; how; known evidence; affected systems. Use the intake form.

### 6.2 Triage

Within **`[48]` hours**, the incident lead confirms facts, assesses impact, and assigns severity:

| Severity | Meaning (edit) | Typical response |
|----------|----------------|------------------|
| High | Potentially catastrophic or likely legal/regulatory impact; ops disrupted | Immediate containment; Legal/Comms engaged |
| Medium | Harm or material delay to one or more units | Contain; business owners engaged |
| Low | Policy violation with limited business impact | Ticketed remediation; document |

### 6.3 Contain, investigate, recover

- Preserve forensic evidence before remediation when feasible.  
- Document technical steps in the incident log: description, severity, root cause, evidence, mitigations, status, disclosures.  
- For High/Medium: build a communications plan with Legal and Comms before external statements.  
- After resolve: post-mortem with root cause and lessons; update controls or training as needed.  
- Leadership may engage external counsel, forensics, or law enforcement when appropriate.

## 7. Related documents

- Incident intake form  
- Vendor management / DPA notify clauses  
- Access control policy

## Credits / NOTICE

Section layout and severity banding inspired by the Security Incident Response Policy in StrongDM [Comply](https://github.com/strongdm/comply) (`themes/comply-soc2/policies/incident.md`, Apache License 2.0). Rewritten with placeholders; not a verbatim copy.

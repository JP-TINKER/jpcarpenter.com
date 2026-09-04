/**
 * Evidence Ask — curated control topics for the home instrument.
 * Illustrative public framework anchors only. Not an audit opinion.
 * CREDITS (shape): auditcore checklist + scf-explorer crosswalk.
 * Library craft: Made to Stick (concrete asks), plain-language BLUF, Adi2 selected/focus states in CSS.
 */

export type EvidenceTopic = {
  id: string;
  label: string;
  /** One plain sentence: what this topic is about. */
  bluf: string;
  frameworks: {
    pci: string;
    soc2: string;
    iso: string;
  };
  /** Concrete artifacts a visitor can picture. */
  asks: string[];
  /** What usually fails in the running system. */
  gap: string;
  /** Lab content ids (filename stems) to keep visible when this topic is active. */
  labIds: string[];
};

export const EVIDENCE_ASK_NOTE =
  'Illustrative mapping for how I work. Not a certification claim, legal advice, or audit opinion.';

export const EVIDENCE_TOPICS: EvidenceTopic[] = [
  {
    id: 'access',
    label: 'Access',
    bluf: 'Who can get in, how they prove it, and what break-glass looks like on a bad day.',
    frameworks: {
      pci: 'PCI DSS Req 8',
      soc2: 'SOC 2 CC6',
      iso: 'ISO 27001 A.5.15 / A.8.5',
    },
    asks: [
      'IdP MFA enrollment report for admin and break-glass roles, last 90 days',
      'Joiner / mover / leaver tickets for privileged accounts in the same window',
      'Sample MFA challenge logs that match a named admin login',
      'Written exception list for any account that skips MFA, with owner and review date',
    ],
    gap: 'Policy says MFA for admins. Break-glass still logs in without a second factor.',
    labIds: [],
  },
  {
    id: 'vendors',
    label: 'Vendors',
    bluf: 'What a third party promised in writing versus what their access and data flows do.',
    frameworks: {
      pci: 'PCI DSS Req 12.8',
      soc2: 'SOC 2 CC9',
      iso: 'ISO 27001 A.5.19 / A.5.21',
    },
    asks: [
      'Signed DPA or security schedule naming regions and subprocessors',
      'Current vendor access list (accounts, API keys, VPN) with last-used dates',
      'Latest SOC 2 or pen-test summary the vendor will share under NDA',
      'Ticket or change that granted production access, with who approved it',
    ],
    gap: 'Questionnaire says data stays in-region. Nightly replica lands somewhere else.',
    labIds: [],
  },
  {
    id: 'segment',
    label: 'Segment',
    bluf: 'Whether the diagram of isolation matches routes, firewalls, and what can actually talk.',
    frameworks: {
      pci: 'PCI DSS Req 1',
      soc2: 'SOC 2 CC6.6',
      iso: 'ISO 27001 A.8.20 / A.8.22',
    },
    asks: [
      'Current network diagram with CDE or crown-jewel trust zones labeled',
      'Firewall or security-group rules for paths into that zone (export, not screenshot only)',
      'Packet or flow proof that a denied path stays denied (TTL / ACL test notes)',
      'Change ticket for the last rule that opened a path into the zone',
    ],
    gap: 'Diagram shows an island. Route table still allows a flat hop from the jump host.',
    labIds: ['network-segmentation'],
  },
  {
    id: 'logging',
    label: 'Logging',
    bluf: 'Whether the events you would need in an incident exist, are complete, and someone owns them.',
    frameworks: {
      pci: 'PCI DSS Req 10',
      soc2: 'SOC 2 CC7',
      iso: 'ISO 27001 A.8.15 / A.8.16',
    },
    asks: [
      'List of systems in scope and which log source covers each',
      'Sample auth failure and privileged success events with synchronized timestamps',
      'Retention setting for those sources (config export or console screenshot with URL)',
      'Alert rule that fires on repeated admin MFA failures, with last trigger time',
    ],
    gap: 'SIEM is “on,” but the IdP was never added, so the attack leaves no trail there.',
    labIds: [],
  },
  {
    id: 'change',
    label: 'Change',
    bluf: 'How production actually moves: ticket, approval, deploy evidence, and who can skip the line.',
    frameworks: {
      pci: 'PCI DSS Req 6.5',
      soc2: 'SOC 2 CC8',
      iso: 'ISO 27001 A.8.32',
    },
    asks: [
      'Last five production deploys with ticket IDs, approver, and deploy timestamp',
      'Pipeline config that blocks deploy without a passing check (export or link)',
      'Emergency-change procedure and the last time it was used',
      'Diff or release notes for one change that touched auth or network rules',
    ],
    gap: 'CAB approved Friday. Prod was hotfixed Thursday night with no ticket.',
    labIds: [],
  },
  {
    id: 'email',
    label: 'Email',
    bluf: 'Whether the domain’s authentication story matches what headers say on a real message.',
    frameworks: {
      pci: 'PCI DSS (email channel in scope)',
      soc2: 'SOC 2 CC6 / CC7',
      iso: 'ISO 27001 A.5.14 / A.8.24',
    },
    asks: [
      'Published SPF, DKIM, and DMARC DNS records for the sending domain',
      'Raw headers from a recent real message (not a marketing PDF)',
      'DMARC aggregate sample or report summary for the last 30 days',
      'Documented owner for spoofing / quarantine response',
    ],
    gap: 'Marketing says the brand is protected. DMARC is p=none and nobody reads the reports.',
    labIds: ['phishing-header-forensics'],
  },
];

export const DEFAULT_TOPIC_ID = EVIDENCE_TOPICS[0].id;

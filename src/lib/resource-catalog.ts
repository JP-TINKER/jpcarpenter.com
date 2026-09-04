/** Companion free forms for small SaaS — panic downloads under /resources.
 *
 * Lead magnet is Product A: /products/small-saas-compliance-starter
 * This shelf is deadline tools, not another policy library.
 */

export type ResourceKind = 'checklist' | 'policy' | 'form' | 'worksheet' | 'pack';

export type ResourceStatus = 'ready' | 'planned';

export type ResourceAssetFormat = 'web' | 'docx' | 'pdf';

export interface ResourceDownloadOption {
  label: string;
  href: string;
  format: ResourceAssetFormat;
  primary?: boolean;
}

export interface ResourceTemplateField {
  label: string;
  kind?: 'text' | 'textarea' | 'date' | 'time' | 'checkboxes';
  hint?: string;
  options?: string[];
}

export interface ResourceTemplateSection {
  title: string;
  note?: string;
  fields: ResourceTemplateField[];
}

export interface ResourceTemplatePreview {
  kicker: string;
  intro: string;
  limits: string[];
  sections: ResourceTemplateSection[];
}

export interface ResourceOffering {
  id: string;
  title: string;
  summary: string;
  kind: ResourceKind;
  status: ResourceStatus;
  order: number;
  download?: string;
  downloads?: ResourceDownloadOption[];
  preview?: ResourceTemplatePreview;
}

export const RESOURCE_CATALOG: ResourceOffering[] = [
  // —— Ready companion forms (keep) ——
  {
    id: 'vendor-security-intake',
    title: 'Vendor security questionnaire (intake)',
    summary:
      'One-page TPRM intake + evidence asks before SaaS touches production or customer data.',
    kind: 'form',
    status: 'ready',
    order: 10,
    downloads: [
      { label: 'Use web form on this page', href: '#resource-template', format: 'web', primary: true },
      { label: 'Download DOCX', href: '/downloads/resources/vendor-security-intake.docx', format: 'docx' },
      { label: 'Download PDF', href: '/downloads/resources/vendor-security-intake.pdf', format: 'pdf' },
    ],
    preview: {
      kicker: 'TPRM intake',
      intro:
        'Capture the business reason, data touch, and evidence asks before Procurement or Engineering drifts into yes-by-default.',
      limits: [
        'First-pass intake only; not a SIG, CAIQ, DPA, or legal review.',
        'Use the vendor’s real attestations and summaries; do not invent control coverage.',
      ],
      sections: [
        {
          title: 'Request context',
          note: 'What is being bought, by whom, and why now.',
          fields: [
            { label: 'Requester / team' },
            { label: 'Vendor / product name' },
            { label: 'Business use case', kind: 'textarea', hint: 'What job does this tool do?' },
            { label: 'Target go-live date', kind: 'date' },
          ],
        },
        {
          title: 'Data and access',
          note: 'Enough scoping to know whether security needs to block or dig deeper.',
          fields: [
            {
              label: 'Data classes involved',
              kind: 'checkboxes',
              options: ['Customer content', 'PII', 'Secrets / credentials', 'Card data', 'No sensitive data'],
            },
            { label: 'Hosting region / residency constraints' },
            { label: 'Production access path', kind: 'textarea', hint: 'SSO, API keys, agents, browser extension, etc.' },
          ],
        },
        {
          title: 'Required evidence',
          note: 'Ask only for what drives the go / no-go.',
          fields: [
            {
              label: 'Evidence requested',
              kind: 'checkboxes',
              options: ['SOC 2 report', 'ISO certificate', 'Pen-test summary', 'Subprocessor list', 'DPA / terms'],
            },
            { label: 'Residual risk notes', kind: 'textarea', hint: 'What still bothers you after the evidence?' },
          ],
        },
        {
          title: 'Review verdict',
          note: 'Force an accountable decision instead of a vague email thread.',
          fields: [
            {
              label: 'Disposition',
              kind: 'checkboxes',
              options: ['Approve', 'Approve with conditions', 'Escalate', 'Do not approve'],
            },
            { label: 'Reviewer / approver' },
          ],
        },
      ],
    },
  },
  {
    id: 'access-mfa-evidence-checklist',
    title: 'Access and MFA evidence ask list',
    summary:
      'Dated asks for privileged population, MFA enrollment, and sample auth logs.',
    kind: 'checklist',
    status: 'ready',
    order: 20,
    downloads: [
      {
        label: 'Use web form on this page',
        href: '#resource-template',
        format: 'web',
        primary: true,
      },
      {
        label: 'Download DOCX',
        href: '/downloads/resources/access-mfa-evidence-checklist.docx',
        format: 'docx',
      },
      {
        label: 'Download PDF',
        href: '/downloads/resources/access-mfa-evidence-checklist.pdf',
        format: 'pdf',
      },
    ],
    preview: {
      kicker: 'Access / MFA evidence',
      intro:
        'Turn a fuzzy “everyone has MFA” claim into a dated ask list with export IDs, populations, and reviewer sign-off.',
      limits: [
        'This worksheet organizes evidence asks; it does not prove controls by itself.',
        'If populations or logs are incomplete, note the gap instead of smoothing it over.',
      ],
      sections: [
        {
          title: 'Review window',
          note: 'Define the exact slice of time and system boundary.',
          fields: [
            { label: 'Control owner / reviewer' },
            { label: 'System / IdP in scope' },
            { label: 'Review period start', kind: 'date' },
            { label: 'Review period end', kind: 'date' },
          ],
        },
        {
          title: 'Population and access model',
          note: 'Name the privileged set before you ask for screenshots.',
          fields: [
            { label: 'Privileged population definition', kind: 'textarea', hint: 'Admins, break-glass, CI/CD, service accounts...' },
            {
              label: 'Evidence needed',
              kind: 'checkboxes',
              options: ['User export', 'Admin role export', 'MFA enrollment export', 'Sample auth logs', 'Exception list'],
            },
          ],
        },
        {
          title: 'Ask for evidence',
          note: 'Make the request copy specific enough that IAM can answer once.',
          fields: [
            { label: 'Dated ask text', kind: 'textarea', hint: 'Owner, export ID, timestamp, and storage location.' },
            { label: 'Evidence links / export IDs', kind: 'textarea', hint: 'Paste links or identifiers after receipt.' },
          ],
        },
        {
          title: 'Reviewer decision',
          note: 'Separate clean evidence from narrative confidence.',
          fields: [
            {
              label: 'Result',
              kind: 'checkboxes',
              options: ['Sufficient', 'Gap found', 'Exception accepted', 'Needs follow-up'],
            },
            { label: 'Gap / follow-up notes', kind: 'textarea' },
          ],
        },
      ],
    },
  },
  {
    id: 'incident-intake',
    title: 'Incident first-hour intake',
    summary: 'Facts, UTC times, systems, severity sketch, owners.',
    kind: 'form',
    status: 'ready',
    order: 30,
    downloads: [
      { label: 'Use web form on this page', href: '#resource-template', format: 'web', primary: true },
      { label: 'Download DOCX', href: '/downloads/resources/incident-intake.docx', format: 'docx' },
      { label: 'Download PDF', href: '/downloads/resources/incident-intake.pdf', format: 'pdf' },
    ],
    preview: {
      kicker: 'First-hour incident intake',
      intro:
        'Capture the first facts while they are still facts: UTC timing, systems, commander, and next update.',
      limits: [
        'Use this for opening facts, not blame, legal findings, or postmortem narrative.',
        'If something is unknown, leave it unknown instead of guessing under pressure.',
      ],
      sections: [
        {
          title: 'Opening facts',
          note: 'Write the first report exactly enough to survive handoff.',
          fields: [
            { label: 'Reporter / source' },
            { label: 'Date discovered (UTC)', kind: 'date' },
            { label: 'Time discovered (UTC)', kind: 'time' },
            { label: 'What happened', kind: 'textarea', hint: 'Facts only.' },
          ],
        },
        {
          title: 'Systems and impact',
          note: 'Scope the blast radius without pretending certainty.',
          fields: [
            { label: 'Systems / services involved', kind: 'textarea' },
            {
              label: 'Observed impact',
              kind: 'checkboxes',
              options: ['Availability', 'Customer data', 'Internal data', 'Payments', 'Unknown'],
            },
            { label: 'Severity sketch / why', kind: 'textarea' },
          ],
        },
        {
          title: 'Roles and communication',
          note: 'One commander, one comms owner, one next update time.',
          fields: [
            { label: 'Incident commander' },
            { label: 'Comms owner' },
            { label: 'Next update due (UTC)', kind: 'time' },
          ],
        },
        {
          title: 'Containment and handoff',
          note: 'Record the next concrete actions before the thread fragments.',
          fields: [
            { label: 'Immediate containment actions', kind: 'textarea' },
            { label: 'Evidence preserved / links', kind: 'textarea' },
          ],
        },
      ],
    },
  },
  {
    id: 'authenticated-phishing-campaign-kit',
    title: 'Authenticated phishing campaign kit',
    summary:
      'Rollout brief, talk track, roster/ack, and post-checklist for the authenticated-phishing lesson.',
    kind: 'pack',
    status: 'ready',
    order: 35,
    downloads: [
      { label: 'Use web form on this page', href: '#resource-template', format: 'web', primary: true },
      {
        label: 'Download DOCX',
        href: '/downloads/resources/authenticated-phishing-campaign-kit.docx',
        format: 'docx',
      },
      {
        label: 'Download PDF',
        href: '/downloads/resources/authenticated-phishing-campaign-kit.pdf',
        format: 'pdf',
      },
    ],
    preview: {
      kicker: 'Training campaign kit',
      intro:
        'Fill [Company] paths first, then run the interactive lesson. Use this sheet for the brief, talk track, roster, and post-checklist.',
      limits: [
        'Awareness rollout kit only — not a live phishing simulation platform or LMS.',
        'Does not replace mail filtering, MFA, or incident response.',
        'Replace every [bracket] placeholder before you send this to staff.',
      ],
      sections: [
        {
          title: '1. Campaign brief',
          note: 'One page: purpose, audience, timing, success metric.',
          fields: [
            { label: 'Company', hint: '[Company]' },
            { label: 'Security owner', hint: '[Security owner]' },
            { label: 'Report channel', hint: '[Report channel]' },
            { label: 'Escalation path', hint: '[Escalation path]' },
            { label: 'Timing / window', kind: 'date' },
            {
              label: 'Success metric',
              kind: 'textarea',
              hint: 'Default: staff can name verify OOB / report / escalate when auth passes but the ask is wrong.',
            },
          ],
        },
        {
          title: '2. Facilitator talk track',
          note: '5–10 minutes. Calm analyst voice — not LMS cheerleading.',
          fields: [
            {
              label: 'Talk track notes / local examples',
              kind: 'textarea',
              hint: 'Open with: auth ≠ safe. Show compromised / lookalike / abused platform. Point to report channel.',
            },
            {
              label: 'Lesson link confirmed',
              kind: 'checkboxes',
              options: ['/tutorials/authenticated-phishing reviewed before the huddle'],
            },
          ],
        },
        {
          title: '3. Learner acknowledgment / roster',
          note: 'Capture completion without pretending this is an LMS gradebook.',
          fields: [
            {
              label: 'Roster (name · team · date · initials)',
              kind: 'textarea',
              hint: 'One person per line.',
            },
            {
              label: 'Acknowledgment language used',
              kind: 'textarea',
              hint: 'I completed the lesson and know how to reach [Report channel] / [Security owner].',
            },
          ],
        },
        {
          title: '4. Post-campaign checklist',
          note: 'What to file, what to fix — training is not the only control.',
          fields: [
            {
              label: 'Done',
              kind: 'checkboxes',
              options: [
                'Roster filed',
                'Report channel confirmed',
                'Finance/ops briefed on escalation',
                'Lesson linked for new hires',
                'Gaps noted for filtering / MFA / process',
              ],
            },
            { label: 'After-action notes', kind: 'textarea' },
          ],
        },
      ],
    },
  },
  {
    id: 'deepfake-exec-request-campaign-kit',
    title: 'Deepfake / urgent exec request campaign kit',
    summary: 'Planned manager kit: exec-approval protocol, exception log pairing, after-action notes.',
    kind: 'pack',
    status: 'planned',
    order: 36,
  },
  {
    id: 'oauth-mfa-fatigue-campaign-kit',
    title: 'OAuth consent / MFA fatigue campaign kit',
    summary: 'Planned manager kit: admin review checklist, exception expiry, suspicious MFA report path.',
    kind: 'pack',
    status: 'planned',
    order: 37,
  },
  {
    id: 'change-evidence-ask',
    title: 'Change evidence pack (ticket → deploy)',
    summary: 'Minimum evidence for one production change.',
    kind: 'checklist',
    status: 'ready',
    order: 40,
    downloads: [
      { label: 'Download DOCX', href: '/downloads/resources/change-evidence-ask.docx', format: 'docx', primary: true },
      { label: 'Download PDF', href: '/downloads/resources/change-evidence-ask.pdf', format: 'pdf' },
    ],
  },
  {
    id: 'policy-exception-log',
    title: 'Policy exception and risk-acceptance log',
    summary: 'Register so MFA skips and waivers expire.',
    kind: 'form',
    status: 'ready',
    order: 50,
    downloads: [
      { label: 'Download DOCX', href: '/downloads/resources/policy-exception-log.docx', format: 'docx', primary: true },
      { label: 'Download PDF', href: '/downloads/resources/policy-exception-log.pdf', format: 'pdf' },
    ],
  },

  // —— Planned companions (only what small SaaS will seek next) ——
  {
    id: 'customer-security-questionnaire',
    title: 'Customer security questionnaire (sales / RFP)',
    summary: 'Lightweight answers when a prospect asks “are you secure?”',
    kind: 'form',
    status: 'planned',
    order: 60,
  },
  {
    id: 'user-access-review-worksheet',
    title: 'User access review (UAR) campaign worksheet',
    summary: 'Population, decisions, removals, exceptions with expiry.',
    kind: 'worksheet',
    status: 'planned',
    order: 70,
  },
  {
    id: 'offboarding-checklist',
    title: 'Offboarding / access revocation checklist',
    summary: 'IdP, email, laptop, SaaS, secrets — one leaver.',
    kind: 'checklist',
    status: 'planned',
    order: 80,
  },
  {
    id: 'soc2-pbc-list',
    title: 'SOC 2 PBC / evidence request list',
    summary: 'Ask list: control area → artifact → owner → due.',
    kind: 'checklist',
    status: 'planned',
    order: 90,
  },

  // —— Policy starters (commodity — bottom only) ——
  {
    id: 'access-control-policy',
    title: 'Access control policy (starter)',
    summary: 'Joiner / mover / leaver and periodic review.',
    kind: 'policy',
    status: 'ready',
    order: 300,
    downloads: [
      { label: 'Download DOCX', href: '/downloads/resources/access-control-policy.docx', format: 'docx', primary: true },
      { label: 'Download PDF', href: '/downloads/resources/access-control-policy.pdf', format: 'pdf' },
    ],
  },
  {
    id: 'incident-response-policy',
    title: 'Incident response policy (starter)',
    summary: 'Detect → recover. Pair with first-hour intake.',
    kind: 'policy',
    status: 'ready',
    order: 310,
    downloads: [
      { label: 'Download DOCX', href: '/downloads/resources/incident-response-policy.docx', format: 'docx', primary: true },
      { label: 'Download PDF', href: '/downloads/resources/incident-response-policy.pdf', format: 'pdf' },
    ],
  },
  {
    id: 'change-management-policy',
    title: 'Change management policy (starter)',
    summary: 'Plan → review. Pair with change evidence pack.',
    kind: 'policy',
    status: 'ready',
    order: 320,
    downloads: [
      { label: 'Download DOCX', href: '/downloads/resources/change-management-policy.docx', format: 'docx', primary: true },
      { label: 'Download PDF', href: '/downloads/resources/change-management-policy.pdf', format: 'pdf' },
    ],
  },
  {
    id: 'vendor-management-policy',
    title: 'Vendor management policy (starter)',
    summary: 'Minimum IT vendor rules. Pair with intake.',
    kind: 'policy',
    status: 'ready',
    order: 330,
    downloads: [
      { label: 'Download DOCX', href: '/downloads/resources/vendor-management-policy.docx', format: 'docx', primary: true },
      { label: 'Download PDF', href: '/downloads/resources/vendor-management-policy.pdf', format: 'pdf' },
    ],
  },
];

export const RESOURCE_KIND_LABEL: Record<ResourceKind, string> = {
  checklist: 'Checklist',
  policy: 'Policy',
  form: 'Form',
  worksheet: 'Worksheet',
  pack: 'Pack',
};

export const RESOURCE_FORMAT_LABEL: Record<ResourceAssetFormat, string> = {
  web: 'Web form',
  docx: 'DOCX',
  pdf: 'PDF',
};

export function primaryDownloads(resource: ResourceOffering): ResourceDownloadOption[] {
  if (resource.downloads && resource.downloads.length > 0) return resource.downloads;
  if (resource.download) {
    return [{ label: `Download ${RESOURCE_KIND_LABEL[resource.kind]}`, href: resource.download, format: 'pdf' }];
  }
  return [];
}

export function catalogById(id: string): ResourceOffering | undefined {
  return RESOURCE_CATALOG.find((r) => r.id === id);
}

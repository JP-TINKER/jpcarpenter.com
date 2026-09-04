export const GRC_PROJECT_CATEGORIES = [
  'risk',
  'frameworks',
  'identity',
  'assurance',
  'detect',
  'endpoint',
  'privacy',
] as const;

export type GrcProjectCategory = (typeof GRC_PROJECT_CATEGORIES)[number];

/** @deprecated Prefer GRC_PROJECT_CATEGORIES; personal lives under The Bench. */
export const PROJECT_CATEGORIES = [...GRC_PROJECT_CATEGORIES, 'personal'] as const;

export type ProjectCategory = (typeof PROJECT_CATEGORIES)[number];

export const PROJECT_CATEGORY_META: Record<
  ProjectCategory,
  { label: string; bluf: string; short: string }
> = {
  risk: {
    label: 'Risk and third parties',
    short: 'Risk',
    bluf: 'Registers, vendors, and closing findings.',
  },
  frameworks: {
    label: 'Frameworks and scope',
    short: 'Frameworks',
    bluf: 'CSF, SOC 2, PCI, ISO shaped as collectable work.',
  },
  identity: {
    label: 'Identity and access',
    short: 'Identity',
    bluf: 'MFA, federation, and Conditional Access evidence.',
  },
  assurance: {
    label: 'Assurance and change',
    short: 'Assurance',
    bluf: 'Tickets, cloud proof, audit writing, GRC tooling.',
  },
  detect: {
    label: 'Detect and respond',
    short: 'Detect',
    bluf: 'Phishing cases, IR tabletops, email auth tests.',
  },
  endpoint: {
    label: 'Endpoint and data',
    short: 'Endpoint',
    bluf: 'Fleet evidence and DLP exception hygiene.',
  },
  privacy: {
    label: 'Privacy and trust narrative',
    short: 'Privacy',
    bluf: 'Data flows and subprocessors in plain English.',
  },
  personal: {
    label: 'The Bench',
    short: 'Bench',
    bluf: 'Personal builds. Not GRC evidence.',
  },
};

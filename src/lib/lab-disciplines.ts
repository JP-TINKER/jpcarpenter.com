export const LAB_DISCIPLINES = ['grc', 'networking', 'security', 'instruments'] as const;

export type LabDiscipline = (typeof LAB_DISCIPLINES)[number];

export const LAB_DISCIPLINE_META: Record<
  LabDiscipline,
  { label: string; description: string }
> = {
  grc: {
    label: 'GRC',
    description: 'Risk, controls, evidence quality, and the claims organizations sign.',
  },
  networking: {
    label: 'Networking',
    description: 'Configured systems with packet-level or routing evidence attached.',
  },
  security: {
    label: 'Security',
    description: 'Forensics, privacy, and defensive analysis grounded in observable artifacts.',
  },
  instruments: {
    label: 'Instruments',
    description: 'Working craft demonstrations with real input, output, and stated limits.',
  },
};

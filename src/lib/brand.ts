/** Shared JP Carpenter identity for campaign pages and downloadable packs. */

export const BRAND = {
  name: 'JP Carpenter',
  site: 'https://jpcarpenter.com',
  email: 'jp@jpcarpenter.com',
  linkedin: 'https://www.linkedin.com/in/joseph-carpenter-597487271',
  role: 'Security and Compliance Analyst',
  markPath: '/brand/mark.svg',
  /** Quiet footer on every working template. */
  footerLine: 'JP Carpenter · jpcarpenter.com · Working template · Not legal advice',
  /** DOCX/PDF document properties. */
  keywords: 'JP Carpenter, security awareness, GRC, small SaaS, training campaign',
} as const;

export function brandedDescription(subject: string): string {
  const clean = subject.replace(/\s+/g, ' ').trim().replace(/\.$/, '');
  return `${clean}. By JP Carpenter. Working template — not legal advice.`;
}

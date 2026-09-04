/** Training campaigns: public interactive lesson + company-ready manager kit.
 *
 * Generic placeholders only — no employer names in public kits.
 * Brand: JP Carpenter in metadata + discrete stamp on every document.
 */

export type CampaignStatus = 'ready' | 'planned';

export interface TrainingCampaign {
  id: string;
  title: string;
  tagline: string;
  summary: string;
  status: CampaignStatus;
  order: number;
  /** Public interactive lesson. */
  lessonHref: string;
  lessonSlug: string;
  /** Manager kit under /resources. */
  kitHref?: string;
  kitId?: string;
  audience: string;
  topics: string[];
  limits: string[];
  /** Company fill fields expected in the kit. */
  fillFields: string[];
}

export const TRAINING_CAMPAIGNS: TrainingCampaign[] = [
  {
    id: 'authenticated-phishing',
    title: 'Authenticated phishing still wins',
    tagline: 'When SPF, DKIM, and DMARC pass — and the message is still a phish.',
    summary:
      'Interactive lesson plus a company-ready manager kit. Teach the hard case: compromised mailboxes, lookalike domains, and abused platforms that authenticate cleanly.',
    status: 'ready',
    order: 10,
    lessonHref: '/tutorials/authenticated-phishing',
    lessonSlug: 'authenticated-phishing',
    kitHref: '/resources/authenticated-phishing-campaign-kit',
    kitId: 'authenticated-phishing-campaign-kit',
    audience: 'All staff with email access; facilitators and security owners for the kit',
    topics: [
      'Authenticated phishing',
      'Compromised real accounts',
      'Lookalike domains',
      'Abused legitimate platforms',
      'Out-of-band verification',
    ],
    limits: [
      'Awareness lesson and rollout kit — not a live phishing simulation platform.',
      'Does not replace mail filtering, MFA, or incident response.',
      'Fill [Company], [Report channel], and owner fields before you run it.',
    ],
    fillFields: ['[Company]', '[Report channel]', '[Security owner]', '[Escalation path]'],
  },
  {
    id: 'deepfake-exec-request',
    title: 'Deepfake / urgent exec request',
    tagline: 'Voice, Teams, or payment pressure that sounds like leadership.',
    summary:
      'Planned campaign: decision ladder for urgent executive impersonation — check, ask, verify out of band before money or access moves.',
    status: 'planned',
    order: 20,
    lessonHref: '/tutorials/deepfake-exec-request',
    lessonSlug: 'deepfake-exec-request',
    kitId: 'deepfake-exec-request-campaign-kit',
    kitHref: '/resources/deepfake-exec-request-campaign-kit',
    audience: 'Finance, ops, and anyone who can approve payments or access',
    topics: ['Deepfake / vishing', 'Executive impersonation', 'Payment pressure', 'Verify out of band'],
    limits: [
      'Scenario training only — no generated deepfake media ships with this kit.',
      'Pair with your payment and exception controls; do not invent approval paths.',
    ],
    fillFields: ['[Company]', '[Exec verify channel]', '[Finance owner]', '[Exception log]'],
  },
  {
    id: 'oauth-mfa-fatigue',
    title: 'OAuth consent / MFA fatigue',
    tagline: 'Strange consent screens and endless MFA prompts that want a yes.',
    summary:
      'Planned campaign: consent-screen and MFA-prompt decision drill for everyday users and SaaS admins.',
    status: 'planned',
    order: 30,
    lessonHref: '/tutorials/oauth-mfa-fatigue',
    lessonSlug: 'oauth-mfa-fatigue',
    kitId: 'oauth-mfa-fatigue-campaign-kit',
    kitHref: '/resources/oauth-mfa-fatigue-campaign-kit',
    audience: 'All SaaS users; IdP admins for the kit review checklist',
    topics: ['OAuth consent phishing', 'MFA fatigue', 'App permissions', 'Report suspicious prompts'],
    limits: [
      'Training and admin checklist only — not an IdP configuration guide.',
      'Does not grant or revoke real OAuth grants; practice the decision path.',
    ],
    fillFields: ['[Company]', '[IdP admin]', '[Report channel]', '[Exception expiry]'],
  },
];

export function campaignById(id: string): TrainingCampaign | undefined {
  return TRAINING_CAMPAIGNS.find((c) => c.id === id);
}

export function readyCampaigns(): TrainingCampaign[] {
  return TRAINING_CAMPAIGNS.filter((c) => c.status === 'ready').sort((a, b) => a.order - b.order);
}

export function plannedCampaigns(): TrainingCampaign[] {
  return TRAINING_CAMPAIGNS.filter((c) => c.status === 'planned').sort((a, b) => a.order - b.order);
}

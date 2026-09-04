/** Free GRC products for small SaaS — lead magnets, not a policy library.
 *
 * Product A (ship): Small SaaS Compliance Starter — routing + fill tabs.
 * Product B (next): ISO 42001 readiness lite — ten files, no cert claims.
 * Companion forms stay on /resources for deadline downloads.
 */

export type ProductStatus = 'ready' | 'planned';

export interface FreeProduct {
  id: string;
  title: string;
  tagline: string;
  summary: string;
  status: ProductStatus;
  order: number;
  href: string;
  /** Zip or folder index when ready. */
  download?: string;
  audience: string;
  includes: string[];
  limits: string[];
}

export const FREE_PRODUCTS: FreeProduct[] = [
  {
    id: 'small-saas-compliance-starter',
    title: 'Small SaaS Compliance Starter',
    tagline: 'Which program this quarter — and the tabs to track it.',
    summary:
      'Free Notion/Sheets-shaped pack for 10–50 person cloud SaaS: cross-framework routing, scope, risk register, control map, evidence calendar, RACI, Type 1→Type 2 worksheet. Not a SOC 2 report. Not an ISO certificate.',
    status: 'ready',
    order: 10,
    href: '/products/small-saas-compliance-starter',
    download: '/downloads/products/small-saas-compliance-starter.zip',
    audience: 'Founders and first security/compliance hires at small B2B SaaS',
    includes: [
      'If/then routing (SOC 2 vs CSF vs 42001 vs PCI noise)',
      'Scope one-pager columns',
      'Risk register columns',
      'Control map',
      'Monthly evidence calendar',
      'RACI',
      'Type 1 → Type 2 worksheet',
    ],
    limits: [
      'Does not attest SOC 2 — a licensed CPA issues the report',
      'Does not certify ISO 27001 or ISO 42001',
      'Templates need your facts and management review',
      'Not a substitute for counsel or your auditor',
    ],
  },
  {
    id: 'iso-42001-readiness-lite',
    title: 'ISO 42001 Readiness Lite',
    tagline: 'Ten files for AI-feature SaaS. Readiness, not certification.',
    summary:
      'Planned free pack: lite gap, AI inventory, scope, ethics, model card, supplier asks, risk register, RACI, impact lite, readiness-not-certified statement. Compete on files a founder will finish — not Ankit-scale control dumps.',
    status: 'planned',
    order: 20,
    href: '/products/iso-42001-readiness-lite',
    audience: 'Same small SaaS, plus shipping AI features or vendor models',
    includes: [
      'Ten fillable files (named on the product page)',
      'NIST AI RMF as voluntary spine',
      'Loud not-certified limits on every file',
    ],
    limits: [
      'Not ISO 42001 certified — ISO does not certify orgs; accredited bodies do',
      'No Statement of Applicability in the lite pack (cert smell)',
      'Documentation is readiness, not the finish line',
    ],
  },
];

export function productById(id: string): FreeProduct | undefined {
  return FREE_PRODUCTS.find((p) => p.id === id);
}

/** Portfolio = free GRC products for small SaaS (not an 18-pack checklist). */

import type { GrcProjectCategory } from './project-categories';

export interface PlannedProject {
  id: string;
  title: string;
  summary: string;
  category: GrcProjectCategory;
  order: number;
  /** Link when a product page exists. */
  href?: string;
  status?: 'ready' | 'planned';
}

/**
 * Keep this list tiny. Product A is live. Product B is next.
 * Deadline forms live under Resources — not here.
 */
export const PLANNED_PROJECTS: PlannedProject[] = [
  {
    id: 'small-saas-compliance-starter',
    title: 'Small SaaS Compliance Starter',
    summary:
      'Free routing + Sheets/Notion tabs for 10–50 person SaaS. Live download pack.',
    category: 'frameworks',
    order: 10,
    href: '/products/small-saas-compliance-starter',
    status: 'ready',
  },
  {
    id: 'iso-42001-readiness-lite',
    title: 'ISO 42001 Readiness Lite',
    summary:
      'Ten fillable files for AI-feature SaaS. No cert claims. Planned next free product.',
    category: 'frameworks',
    order: 20,
    href: '/products/iso-42001-readiness-lite',
    status: 'planned',
  },
];

export function plannedByCategory(category: GrcProjectCategory): PlannedProject[] {
  return PLANNED_PROJECTS.filter((p) => p.category === category).sort(
    (a, b) => a.order - b.order,
  );
}

export function plannedCategoriesWithItems() {
  const cats = [...new Set(PLANNED_PROJECTS.map((p) => p.category))];
  return cats.map((id) => ({
    id,
    items: plannedByCategory(id),
  })).filter((g) => g.items.length > 0);
}

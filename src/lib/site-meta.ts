/** Site chrome facts that must not be inferred from build time. */

/**
 * ISO date (UTC). Manual stamp — bump when you actually review posture or public copy.
 * Do not replace this with `new Date()` at build.
 */
export const LAST_REVIEWED = '2026-09-04';

export function formatLastReviewed(iso = LAST_REVIEWED): string {
  return new Date(`${iso}T00:00:00Z`).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    timeZone: 'UTC',
  });
}

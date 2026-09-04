import { defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';
import { z } from 'astro/zod';

/** Fields shared by the labs, projects, and tutorials collections.
 *
 *  `finding` is what the work established, in one line, distinct from `summary`, which
 *  says what the work is. Listings lead with the finding because that is what a reviewer
 *  is actually scanning for.
 *
 *  `stamp` and `state` drive the margin note. They are how an entry declares its honest
 *  status: evidence attached, instrument, or designed-but-never-run. Nothing is allowed
 *  to look finished when it isn't.
 */
const evidenceFields = {
  title: z.string(),
  summary: z.string(),
  finding: z.string().optional(),
  stamp: z.string().optional(),
  state: z.enum(['verified', 'open']).optional(),
  date: z.date(),
  /** Editorial position in listings; lower sorts first. Ties fall back to date. */
  order: z.number().optional().default(50),
  tags: z.array(z.string()).optional(),
};

// Every collection folder carries the same two entry docs at its root (00-INDEX.md,
// 01-README.md, PDRA/Bench filing convention), which must never be picked up as content
// entries themselves. Keep this exclusion identical across all five collections.
const entryDocs = ['!00-INDEX.md', '!01-README.md'];

const labs = defineCollection({
  loader: glob({ pattern: ['**/*.{md,mdx}', ...entryDocs], base: './src/content/labs' }),
  schema: z.object({
    ...evidenceFields,
    /** Broad visitor-facing evidence domain; unlike tags, this is required and scannable. */
    discipline: z.enum(['grc', 'networking', 'security', 'instruments']),
  }),
});

const writing = defineCollection({
  loader: glob({ pattern: ['**/*.{md,mdx}', ...entryDocs], base: './src/content/writing' }),
  schema: z.object({
    title: z.string(),
    description: z.string(),
    date: z.date(),
    draft: z.boolean().optional().default(false),
    // Real revision count for the document-control header, bump it if you substantially
    // rewrite a published post. Not a fabricated credential, just honest version tracking.
    revision: z.number().int().positive().optional().default(1),
  }),
});

const projects = defineCollection({
  // Personal bench builds. Free GRC packs live in product-catalog.ts (/products).
  // Labs remain the place for finished professional evidence.
  loader: glob({ pattern: ['**/*.{md,mdx}', ...entryDocs], base: './src/content/projects' }),
  schema: z.object({
    ...evidenceFields,
    category: z
      .enum([
        'risk',
        'frameworks',
        'identity',
        'assurance',
        'detect',
        'endpoint',
        'privacy',
        'personal',
      ])
      .optional()
      .default('personal'),
  }),
});

const resources = defineCollection({
  // Downloadable GRC documents. Pages are how-to; files live under /downloads.
  loader: glob({ pattern: ['**/*.{md,mdx}', ...entryDocs], base: './src/content/resources' }),
  schema: z.object({
    title: z.string(),
    summary: z.string(),
    date: z.date(),
    order: z.number().optional().default(50),
    kind: z.enum(['checklist', 'policy', 'form', 'worksheet', 'pack']).default('checklist'),
    status: z.enum(['ready', 'planned']).optional().default('ready'),
    /** Public path to the downloadable working copy. */
    download: z.string().optional(),
  }),
});

// Tutorials teach. Where Labs prove and Writing argues, a Tutorial walks a reader through
// doing the thing, paired with a terminal recording (animated SVG by default; the
// interactive asciinema player is opt-in and requires a CSP review, see
// src/content/tutorials/01-README.md). Reuses the Labs discipline split so a reviewer finds GRC,
// networking, security, and instrument lessons in the same plain-language buckets.
const tutorials = defineCollection({
  loader: glob({ pattern: ['**/*.{md,mdx}', ...entryDocs], base: './src/content/tutorials' }),
  schema: z.object({
    ...evidenceFields,
    discipline: z.enum(['grc', 'networking', 'security', 'instruments']),
    draft: z.boolean().optional().default(false),
    /** Path under /public to the rendered animated SVG, e.g. /tutorials/my-slug/demo.svg.
     *  Optional, a tutorial can be prose-only. Referenced in the body, not auto-injected. */
    recording: z.string().optional(),
  }),
});

/** Public posture page entries — controls, refuse rows, and dated field notes. */
const security = defineCollection({
  loader: glob({ pattern: ['**/*.{md,mdx}', ...entryDocs], base: './src/content/security' }),
  schema: z.object({
    kind: z.enum(['control', 'refuse', 'note']),
    title: z.string(),
    /** Expand-row label (controls/refuse) or one-line note blurb. */
    summary: z.string(),
    date: z.date(),
    order: z.number().optional().default(50),
    state: z.enum(['verified', 'open']).optional().default('verified'),
    /** Optional one-line honesty limit shown in listings. */
    limits: z.string().optional(),
    draft: z.boolean().optional().default(false),
  }),
});

export const collections = { labs, writing, projects, tutorials, resources, security };

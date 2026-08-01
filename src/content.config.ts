import { defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';
import { z } from 'astro/zod';

const labs = defineCollection({
  loader: glob({ pattern: '**/*.{md,mdx}', base: './src/content/labs' }),
  schema: z.object({
    title: z.string(),
    summary: z.string(),
    date: z.date(),
    tags: z.array(z.string()).optional(),
  }),
});

const writing = defineCollection({
  // AUTHORING.md documents the frontmatter shape for real posts — it is not a post itself.
  loader: glob({ pattern: ['**/*.{md,mdx}', '!AUTHORING.md'], base: './src/content/writing' }),
  schema: z.object({
    title: z.string(),
    description: z.string(),
    date: z.date(),
    draft: z.boolean().optional().default(false),
    // Real revision count for the document-control header — bump it if you substantially
    // rewrite a published post. Not a fabricated credential, just honest version tracking.
    revision: z.number().int().positive().optional().default(1),
  }),
});

const projects = defineCollection({
  // Personal builds unrelated to work — physical/craft or hobby-tech. No professional-evidence
  // framing (that's Labs' job). AUTHORING.md documents frontmatter; it is not an entry itself.
  loader: glob({ pattern: ['**/*.{md,mdx}', '!AUTHORING.md'], base: './src/content/projects' }),
  schema: z.object({
    title: z.string(),
    summary: z.string(),
    date: z.date(),
    tags: z.array(z.string()).optional(),
  }),
});

export const collections = { labs, writing, projects };

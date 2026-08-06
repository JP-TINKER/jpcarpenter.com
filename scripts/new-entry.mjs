#!/usr/bin/env node
/**
 * Scaffold a new Writing / Labs / Projects markdown entry.
 *
 * Usage:
 *   npm run new -- writing "Read what you sign"
 *   npm run new -- lab "Phishing header forensics" --discipline grc
 *   npm run new -- project "Shop stool"
 *   npm run new -- writing my-slug --title "Custom title"
 *
 * Creates a draft-ready file and prints next steps. Does not publish.
 */

import { mkdirSync, writeFileSync, existsSync } from 'node:fs';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');

const KINDS = {
  writing: {
    aliases: ['writing', 'post', 'posts', 'w'],
    dir: 'src/content/writing',
    url: (slug) => `/writing/${slug}`,
    fieldsHelp: 'src/content/writing/01-README.md',
  },
  lab: {
    aliases: ['lab', 'labs', 'l'],
    dir: 'src/content/labs',
    url: (slug) => `/labs/${slug}`,
    fieldsHelp: 'src/content/labs/01-README.md',
  },
  project: {
    aliases: ['project', 'projects', 'p'],
    dir: 'src/content/projects',
    url: (slug) => `/projects/${slug}`,
    fieldsHelp: 'src/content/projects/01-README.md',
  },
  tutorial: {
    aliases: ['tutorial', 'tutorials', 't'],
    dir: 'src/content/tutorials',
    url: (slug) => `/tutorials/${slug}`,
    fieldsHelp: 'src/content/tutorials/01-README.md',
  },
};

const DISCIPLINES = new Set(['grc', 'networking', 'security', 'instruments']);

function usage(code = 1) {
  console.log(`Usage:
  npm run new -- <writing|lab|tutorial|project> <title-or-slug> [--title "..."] [--discipline grc|networking|security|instruments]

Examples:
  npm run new -- writing "Read what you sign"
  npm run new -- lab "VLAN routing proof" --discipline networking
  npm run new -- tutorial "Reading email authentication headers" --discipline grc
  npm run new -- project "Shop stool"
`);
  process.exit(code);
}

function slugify(input) {
  return input
    .trim()
    .toLowerCase()
    .replace(/['’]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 80);
}

function todayUTC() {
  return new Date().toISOString().slice(0, 10);
}

function titleFromSlug(slug) {
  return slug
    .split('-')
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(' ');
}

function parseArgs(argv) {
  const args = [...argv];
  const opts = { title: null, discipline: 'security' };
  const positional = [];

  while (args.length) {
    const a = args.shift();
    if (a === '--help' || a === '-h') usage(0);
    if (a === '--title') {
      opts.title = args.shift();
      continue;
    }
    if (a === '--discipline') {
      opts.discipline = args.shift();
      continue;
    }
    if (a.startsWith('--')) {
      console.error(`Unknown flag: ${a}`);
      usage(1);
    }
    positional.push(a);
  }

  if (positional.length < 2) usage(1);

  const kindRaw = positional[0].toLowerCase();
  const kindEntry = Object.entries(KINDS).find(([, v]) => v.aliases.includes(kindRaw));
  if (!kindEntry) {
    console.error(`Unknown kind "${positional[0]}". Use writing, lab, tutorial, or project.`);
    usage(1);
  }

  const [key, meta] = kindEntry;
  const nameOrSlug = positional.slice(1).join(' ').trim();
  if (!nameOrSlug) usage(1);

  const looksLikeSlug =
    /^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(nameOrSlug) && !/\s/.test(nameOrSlug);
  const slug = looksLikeSlug && !opts.title ? nameOrSlug : slugify(nameOrSlug);
  const title = opts.title || (looksLikeSlug ? titleFromSlug(slug) : nameOrSlug.trim());

  if (!slug) {
    console.error('Could not build a URL slug from that title.');
    process.exit(1);
  }

  if ((key === 'lab' || key === 'tutorial') && !DISCIPLINES.has(opts.discipline)) {
    console.error(`--discipline must be one of: ${[...DISCIPLINES].join(', ')}`);
    process.exit(1);
  }

  return { key, meta, slug, title, discipline: opts.discipline };
}

function renderWriting(title) {
  return `---
title: ${JSON.stringify(title)}
description: "One-line claim this post makes — not a teaser."
date: ${todayUTC()}
draft: true
revision: 1
---

Write the post in plain Markdown.
`;
}

function renderLab(title, discipline, slug) {
  return `---
title: ${JSON.stringify(title)}
summary: "What this lab is, in one line."
finding: "The one sentence a reviewer should walk away with."
stamp: "Evidence attached"
state: verified
discipline: ${discipline}
date: ${todayUTC()}
order: 50
tags: []
---

Write the lab in plain Markdown.

Screenshots: put files in \`public/labs/${slug}/\` and reference as \`/labs/${slug}/file.png\`.
`;
}

function renderProject(title) {
  return `---
title: ${JSON.stringify(title)}
summary: "What this build is, in one line."
finding: "The one sentence a reader should walk away with."
stamp: "Build"
date: ${todayUTC()}
order: 50
tags: []
---

Write the project in plain Markdown. No professional-evidence framing — that's Labs' job.
`;
}

function renderTutorial(title, discipline, slug) {
  return `---
title: ${JSON.stringify(title)}
summary: "What this tutorial is, in one line."
finding: "The one skill a reader walks away with."
stamp: "Not yet recorded"
state: open
discipline: ${discipline}
date: ${todayUTC()}
order: 50
tags: []
draft: true
recording: /tutorials/${slug}/demo.svg
---

Lead with 2–3 sentences and the recording. A reader who skims should still know what
they'll be able to do after this page.

<div class="lab-instrument">
  <img src="/tutorials/${slug}/demo.svg" alt="Terminal recording: describe what this shows." loading="lazy" decoding="async" />
  <p class="lab-instrument-caption">One line on what this recording shows.</p>
</div>

## The steps

Write the procedure as numbered steps or short sections.

## The decision

If the tutorial is about a judgment, end with a small table or rule that makes the
decision mechanical.

## What this teaches, and what it doesn't

Be honest about the limits.

---

## Recording

Record the terminal session and render the animated SVG, then drop it in
\`public/tutorials/${slug}/\`. See \`01-README.md\` ("Recording workflow") for the exact
commands. Delete this whole body and the comments above once you've copied the file.
`;
}

function main() {
  const { key, meta, slug, title, discipline } = parseArgs(process.argv.slice(2));
  const dir = join(root, meta.dir);
  const file = join(dir, `${slug}.md`);

  if (existsSync(file)) {
    console.error(`Already exists: ${file}`);
    process.exit(1);
  }

  mkdirSync(dir, { recursive: true });

  let body;
  if (key === 'writing') body = renderWriting(title);
  else if (key === 'lab') {
    body = renderLab(title, discipline, slug);
    mkdirSync(join(root, 'public', 'labs', slug), { recursive: true });
  } else if (key === 'tutorial') {
    body = renderTutorial(title, discipline, slug);
    mkdirSync(join(root, 'public', 'tutorials', slug), { recursive: true });
  } else body = renderProject(title);

  writeFileSync(file, body, 'utf8');

  const rel = file.slice(root.length + 1);
  console.log(`Created ${rel}`);
  console.log(`URL (after publish): ${meta.url(slug)}`);
  console.log(`
Next:
  1. Open the file — fill frontmatter + body
  2. Preview:  npm run dev
  3. Writing:  set draft: false when ready
  4. Ship:     npm run build && npm run deploy

Fields: ${meta.fieldsHelp}
Cheat sheet: EDIT.md
`);
}

main();

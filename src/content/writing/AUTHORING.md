# Writing — authoring guide

This folder holds real posts for the `writing` content collection, defined in
`src/content.config.ts`. This file itself is **not** a post — the collection's glob
loader pattern explicitly excludes `AUTHORING.md`, so it never renders on `/writing`.

## Adding a post

Create a new `.md` (or `.mdx`) file in this directory, e.g. `src/content/writing/my-post.md`,
with frontmatter matching the `writing` schema:

```md
---
title: "Post title"
description: "One-line summary shown in the listing and RSS feed."
date: 2026-08-01
draft: false
revision: 1
---

Post body in Markdown goes here.
```

- `title` (string, required)
- `description` (string, required) — one line, used in the listing and RSS feed
- `date` (date, required) — `YYYY-MM-DD`
- `draft` (boolean, optional, defaults to `false`) — set `true` to keep a post out of
  the listing and RSS feed while it's still being written (draft filtering happens in
  `src/pages/writing/index.astro` and `src/pages/writing/rss.xml.js`, not in the schema)
- `revision` (number, optional, defaults to `1`) — shown in the document-control header
  on the post page (`Rev. N · Status: Published · Reviewed {date}`). Bump it by hand if
  you substantially rewrite a published post; leave it at `1` for a normal first publish.

The URL slug comes from the filename (`my-post.md` → `/writing/my-post`), unless you set
an explicit `slug` field in frontmatter.

## Glossary pattern for jargon (SOC 2, NIST CSF, etc.)

Plain markdown supports inline HTML, so wrap acronyms in a native `<abbr>` tag with the
definition in `title` — no JS, works everywhere, shows a dotted underline + native tooltip
(styled in `global.css`):

```md
Most vendors ask for a <abbr title="Service Organization Control 2 — an auditing standard for how a service provider handles customer data">SOC 2</abbr> report before they'll sign.
```

A few you'll probably reach for — write the real definition yourself when you use them,
these are just starting points:

- **SOC 2** — Service Organization Control 2, an auditing standard for how a service
  provider handles customer data.
- **NIST CSF** — NIST Cybersecurity Framework, a voluntary framework of security
  practices organized into five functions (Identify, Protect, Detect, Respond, Recover).
- **ISO 27001** — an international standard for information security management systems.
- **PCI-DSS** — Payment Card Industry Data Security Standard, required for anyone
  storing/processing/transmitting card data.
- **GDPR** — the EU's General Data Protection Regulation, covering personal data handling.

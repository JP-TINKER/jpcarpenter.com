# Projects — authoring guide

This folder holds real entries for the `projects` content collection, defined in
`src/content.config.ts`. This file itself is **not** an entry — the collection's glob
loader pattern explicitly excludes `AUTHORING.md`, so it never renders on `/projects`.

`projects` is for personal builds unrelated to work — physical/craft (woodworking,
hardware) or hobby-tech, mixed freely. No professional-evidence framing here; that's
what Labs is for. Just things Joe made because he wanted to.

## Adding a project

Create a new `.md` (or `.mdx`) file in this directory, e.g. `src/content/projects/my-build.md`,
with frontmatter matching the `projects` schema:

```md
---
title: "Project title"
summary: "One-line description of what it is."
date: 2026-08-01
tags: ["woodworking"]
---

Project write-up in Markdown goes here.
```

- `title` (string, required)
- `summary` (string, required) — one line, used in the listing
- `date` (date, required) — `YYYY-MM-DD`
- `tags` (array of strings, optional)

The URL slug comes from the filename (`my-build.md` → `/projects/my-build`), unless you
set an explicit `slug` field in frontmatter.

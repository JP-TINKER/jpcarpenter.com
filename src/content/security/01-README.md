# Security posture entries

Markdown behind `/security`. Three kinds:

| `kind` | Section on the page | When to use |
|--------|---------------------|-------------|
| `note` | Field notes (newest first) | Short dated posts about what changed |
| `control` | Controls in force | A live defense, teachable expand row |
| `refuse` | What we refuse | Explicit non-goals / theater |

## Add a field note (usual post)

```bash
npm run new -- security "Wired canary alerts"
```

Or copy `_templates/security-entry.md` into this folder.

## Frontmatter

```yaml
kind: note          # note | control | refuse
title: "Short title"
summary: "One line for the expand label or note blurb"
date: 2026-09-04
order: 50           # lower sorts first within controls/refuse
state: verified     # verified | open
limits: "Optional honesty limit"
draft: false
```

## Honesty

- State what the control does **and** does not do (`limits` or a Limits section).
- Do **not** publish the canary path.
- Public name is **JP**, never Joe.
- Bump `src/lib/site-meta.ts` `LAST_REVIEWED` when you review the page.

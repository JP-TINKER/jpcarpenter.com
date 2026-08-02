# Content — front door

Everything on the site that isn't a fixed page (`/`, `/about`) lives here as Markdown, one
file per entry. Edit a file, save, rebuild — that's the whole publishing path. No CMS, no
database, no admin login.

## The three collections

| Folder | Renders at | Job |
|--------|-----------|-----|
| `labs/` | `/labs/<slug>` | Security-adjacent work with real evidence attached — proof of competence |
| `writing/` | `/writing/<slug>` | Sparse, specific claims worth defending — not a blog treadmill |
| `projects/` | `/projects/<slug>` | Personal builds unrelated to work — no professional-evidence framing |

Full schema, examples, and pre-publish guardrails live in each folder's own `01-README.md`.
Start there, not here — this file is only the map.

## Adding an entry

1. Copy the matching skeleton from `_templates/` into the real collection folder and rename
   it to your slug, e.g. `_templates/labs-entry.md` → `labs/my-new-lab.md`.
2. Fill in the frontmatter and write the body. The `01-README.md` in that folder documents
   every field.
3. Preview: `npm run dev`, open the printed localhost URL.
4. Publish: `npm run build` (must exit 0), then commit and push.

## Files in this folder

| File | Purpose |
|------|---------|
| `README.md` | This map |
| `_templates/` | Copy-paste skeletons for each collection — not content themselves |
| `labs/`, `writing/`, `projects/` | The three collections above |

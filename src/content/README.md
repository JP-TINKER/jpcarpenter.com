# Content — front door

Everything on the site that isn't a fixed page (`/`, `/about`, `/security`, `/products`,
`/bench`, and the `/projects` product list) lives here as Markdown, one
file per entry. Edit a file, save, rebuild — that's the whole publishing path. No CMS, no
database, no admin login.

## The collections

| Folder | Renders at | Job |
|--------|-----------|-----|
| `labs/` | `/labs/<slug>` | Security-adjacent work with real evidence attached — proof of competence |
| `writing/` | `/writing/<slug>` | Sparse, specific claims worth defending — not a blog treadmill |
| `projects/` | `/projects/<slug>` | Personal builds. Listed on `/bench`. `/projects` itself is the free-product list |
| `tutorials/` | `/tutorials/<slug>` | Walk-throughs with a recording; teach the procedure |
| `resources/` | `/resources/<slug>` | Deadline forms and commodity policy starters |

Full schema, examples, and pre-publish guardrails live in each folder's own `01-README.md`.
Start there, not here — this file is only the map.

## Adding an entry

**Easiest (preferred):** from the repo root, scaffold with one command — see [`EDIT.md`](../../EDIT.md).

```bash
npm run new -- writing "Your title here"
npm run new -- lab "Lab title" --discipline security
npm run new -- tutorial "Tutorial title" --discipline grc
npm run new -- project "Project title"
```

Manual fallback: copy a skeleton from `_templates/` into the collection folder and rename it
to your slug, e.g. `_templates/labs-entry.md` → `labs/my-new-lab.md`. Resources have no
scaffold yet. Add those files by hand next to `01-README.md`.

Then:

1. Fill in the frontmatter and write the body. The `01-README.md` in that folder documents
   every field.
2. Preview: `npm run dev`, open the printed localhost URL.
3. Writing: set `draft: false` when ready.
4. Publish: `npm run build && npm run deploy`.

## Files in this folder

| File | Purpose |
|------|---------|
| `README.md` | This map |
| `_templates/` | Copy-paste skeletons for each collection — not content themselves |
| `labs/`, `writing/`, `projects/`, `tutorials/`, `resources/` | The collections above |

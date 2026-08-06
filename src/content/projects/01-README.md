# Projects — how to add or edit an entry

This folder holds personal builds unrelated to work — physical/craft (woodworking,
hardware) or hobby-tech, mixed freely. **No professional-evidence framing here** — that's
what `../labs/` is for. Just things made because they were wanted, published honestly,
including when a build is unfinished (see `android-tv-box-security-assessment.md`, which
is published as "designed, not yet run" rather than dressed up as complete).

## Add an entry

**Preferred** — from the repository root:

```bash
npm run new -- project "My build"
```

Cheat sheet: [`EDIT.md`](../../../EDIT.md).

Manual fallback: copy `../_templates/projects-entry.md` here and rename it to your slug.
The filename becomes the URL — `my-build.md` → `/projects/my-build`.

Then:

1. Fill in the frontmatter (table below) and write the body in Markdown.
2. If there are photos, see "Adding a photo" below before you touch `public/`.
3. Preview: `npm run dev` and open the printed URL.
4. Ship: `npm run build && npm run deploy`.

## Edit an existing entry

Open the `.md` file, change it, save, rebuild.

## Frontmatter fields

| Field | Required | Meaning |
|-------|----------|---------|
| `title` | yes | Entry title |
| `summary` | yes | One line describing what this **is** — fallback if `finding` is omitted |
| `finding` | no | What the build actually achieved or turned up, in one line — listings lead with this over the summary |
| `stamp` | no | Free-text status badge (e.g. `Build`, `In progress`, `Done`) — not a locked list, write the true state |
| `state` | no | `open` draws the stamp dashed for anything unfinished/in progress; omit for ordinary finished work |
| `date` | yes | `YYYY-MM-DD`, treated as UTC |
| `order` | no (default `50`) | Lower sorts first in listings; ties fall back to date |
| `tags` | no | Array of strings |

## Adding a photo

1. Put the image in `public/projects/<your-slug>/` — a per-entry folder keeps filenames
   from colliding as this grows.
2. Reference it with the exhibit pattern already styled in `global.css`:
   ```md
   <figure>
     <img src="/projects/your-slug/photo.jpg" alt="Describe what the photo shows" />
     <figcaption>One-line caption.</figcaption>
   </figure>
   ```
3. If a photo shows a real space (home, workshop) rather than just the object, do a quick
   pass for anything you wouldn't want public in the background — mail, screens, faces of
   people who haven't agreed to be shown.

## Before you push — guardrails

The site's Content-Security-Policy (`public/_headers`) has no `unsafe-inline` anywhere and
only allows images from this domain. Markdown bodies are passed straight through to HTML
with no sanitization, so:

- **Images:** only local files under `public/`, referenced as `/path/to/file.jpg`. A
  remote `<img src="https://...">` will be silently blocked by the browser at view time
  (CSP `img-src 'self'`), not caught by `npm run build`.
- **No inline `<script>` or `<style>` tags** in an entry body — they'll break the page's
  CSP for every visitor, not just fail quietly.
- **No `<iframe>` embeds** — the CSP blocks framed content entirely. Adding one requires a
  deliberate CSP and threat-model review.
- **Honesty over completeness.** An unfinished build labeled honestly (`state: open`,
  stamp "In progress") is worth more here than a finished-looking write-up for something
  that hasn't actually been done yet.

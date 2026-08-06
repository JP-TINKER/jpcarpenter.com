# Labs — how to add or edit an entry

This collection is for security-adjacent work with real evidence attached — proof of
competence, not a credentials list. An entry lands here when there's something real to
show: notes, artifacts, and the honest limits of what the work actually proves. Where a
lab is designed but not yet run, it says so — see `android-tv-box-security-assessment` in
`../projects/` for the precedent (published as "designed, not yet run" rather than faked).

## Add an entry

**Preferred** — from the repository root:

```bash
npm run new -- lab "My new lab" --discipline security
```

`discipline` must be one of: `grc` | `networking` | `security` | `instruments`.
Cheat sheet: [`EDIT.md`](../../../EDIT.md).

Manual fallback: copy `../_templates/labs-entry.md` here and rename it to your slug.
The filename becomes the URL — `my-new-lab.md` → `/labs/my-new-lab`.

Then:

1. Fill in the frontmatter (table below) and write the body in Markdown.
2. If there are screenshots, see "Adding a screenshot" below before you touch `public/`.
3. Preview: `npm run dev` and open the printed URL.
4. Ship: `npm run build && npm run deploy`.

## Edit an existing entry

Open the `.md` file, change it, save, rebuild. If new evidence changes an entry's honest
status (e.g. a "designed, not yet run" lab actually gets run), update `stamp` and `state`
to match — that update *is* the point of the stamp.

## Expand-to-learn (running theme)

Educational Labs should skim first. Use the shared expand stack instead of long prose walls:

```html
<div class="expand-stack">
  <details class="expand-item">
    <summary class="expand-term">Short label</summary>
    <div class="expand-body">
      <p>Depth goes here. Keep each open panel to a few short paragraphs.</p>
    </div>
  </details>
</div>
```

Lead with 2–3 sentences and the instrument(s). Put teaching, entropy tables, defenses,
sources, and "why this is here" behind expand rows. Same pattern as the tracker glossary
on `/labs/browser-exposure` (classes live in `global.css`).

## Frontmatter fields

| Field | Required | Meaning |
|-------|----------|---------|
| `title` | yes | Entry title |
| `summary` | yes | One line describing what the work **is** — fallback if `finding` is omitted |
| `finding` | no | What the work **established**, in one line. Listings lead with this, not the summary, because that's what a reviewer actually scans for |
| `stamp` | no | Free-text status badge next to the entry (see vocabulary below) |
| `state` | no | `verified` draws the stamp with a solid accent border; `open` draws it dashed; omit for neutral |
| `discipline` | yes | One broad visitor-facing domain: `grc`, `networking`, `security`, or `instruments` |
| `date` | yes | `YYYY-MM-DD`, treated as UTC |
| `order` | no (default `50`) | Lower sorts first in listings; ties fall back to date |
| `tags` | no | Array of strings |

### `stamp` vocabulary in use so far

This is **not** a locked enum — `stamp` is free text, because an honest description of a
piece of work's real status is the whole design concept of this site (see the margin-note
pattern in `../../../doctrine` if you have Bench open). Write the true state in your own
words. What's in use today, for consistency:

| Stamp | Used when |
|-------|-----------|
| `Evidence attached` | Real artifacts, screenshots, or output back the claim (`state: verified`) |
| `Instrument` | A working tool/demo is the evidence — nothing else needed |
| `Not yet run` | Designed but not executed — no real findings yet (`state: open`) |

### Discipline is not a tag

`discipline` controls the plain-language section where a reviewer finds the entry. Pick the
one domain the work most directly proves. Use `tags` for narrower topics such as `vlan`,
`phishing`, or `javascript`. `instruments` is deliberately separate so a craft demonstration
does not masquerade as professional security evidence.

## Adding a screenshot

1. Put the image in `public/labs/<your-slug>/` — a per-entry folder keeps filenames from
   colliding as this grows. Existing entries predate this convention and sit flat in
   `public/labs/`; new ones should use the subfolder.
2. Reference it with the exhibit pattern already styled in `global.css`:
   ```md
   <figure>
     <img src="/labs/your-slug/screenshot.png" alt="Describe what the screenshot shows" />
     <figcaption>One-line caption for what this proves.</figcaption>
   </figure>
   ```

### Redaction checklist — before any screenshot goes in `public/`

- [ ] Browser chrome, tabs, and bookmarks bar cropped out — not just the interesting pane
- [ ] No home/public IP address visible
- [ ] No MAC addresses visible
- [ ] No real hostnames visible (check window titles and terminal prompts, not just the
      main content)
- [ ] No account identifiers, email addresses, or other third-party personal information
      visible anywhere in the frame
- [ ] No message timestamps, calendar dates, or other activity clues visible unless the date
      is necessary evidence and safe to publish
- [ ] Image metadata stripped if the capture tool embeds anything (e.g.
      `exiftool -all= file.png`)

## Before you push — guardrails

The site's Content-Security-Policy (`public/_headers`) has no `unsafe-inline` anywhere and
only allows images from this domain. Markdown bodies are passed straight through to HTML
with no sanitization, so:

- **Images:** only local files under `public/`, referenced as `/path/to/file.png`. A
  remote `<img src="https://...">` will be silently blocked by the browser at view time
  (CSP `img-src 'self'`), not caught by `npm run build`.
- **No inline `<script>` or `<style>` tags** in an entry body — they'll break the page's
  CSP for every visitor, not just fail quietly.
- **No `<iframe>` embeds** — the CSP blocks framed content entirely. Adding one requires a
  deliberate CSP and threat-model review.
- **Honesty over completeness.** Only use `state: verified` / "Evidence attached" when
  there's real evidence attached. An honestly-labeled unfinished entry is worth more here
  than a finished-looking one that oversells the work.

### Verify before pushing

```bash
npm run build
node ../../Tools/Bench/scripts/headers-verify.mjs dist     # CSP holds on every page
node ../../Tools/Bench/scripts/responsive-audit.mjs dist out # no overflow, touch targets OK
node ../../Tools/Bench/scripts/probe-paths.mjs dist          # no sensitive files shipped
```

All three must exit 0. If they do, commit and push — the site is safe to publish.

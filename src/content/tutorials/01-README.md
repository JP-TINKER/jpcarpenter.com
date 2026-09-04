# Tutorials — how to add or edit an entry

This collection is for **teaching**: a reader follows the page and the recording and can
do the thing themselves. Where Labs prove competence and Writing argues a claim, a
Tutorial walks through the work. It pairs with a terminal recording so the reader can
pause, rewind, and copy commands — the teacher pattern, not the influencer one.

## What belongs here

- A repeatable procedure a reader can follow: reading email-auth headers, running a
  header scan, configuring a firewall rule, triaging a phishing report.
- Paired with a terminal recording (animated SVG by default). Prose-only is allowed
  when the procedure genuinely has no terminal component, but lead with the recording
  whenever you can — it is the point of the surface.
- Grouped by the same four plain-language domains as Labs: `grc`, `networking`,
  `security`, `instruments`.

## What does not belong here

- Evidence of your own competence with no teaching intent — that is Labs.
- An opinion piece defending a claim — that is Writing.
- A personal build — that is Projects.

## Add an entry

**Preferred** — from the repository root:

```bash
npm run new -- tutorial "Reading email authentication headers" --discipline grc
```

`discipline` must be one of: `grc` | `networking` | `security` | `instruments`.
Cheat sheet: [`EDIT.md`](../../../EDIT.md).

Manual fallback: copy `../_templates/tutorials-entry.md` here and rename it to your
slug. The filename becomes the URL — `my-tutorial.md` → `/tutorials/my-tutorial`.

Then:

1. Fill in the frontmatter (table below) and write the body in Markdown.
2. Record the terminal session and render the animated SVG — see "Recording workflow"
   below for the exact commands. Drop the `.svg` into
   `public/tutorials/<your-slug>/`.
3. Reference the recording in the body with the recording pattern (below).
4. Preview: `npm run dev` and open the printed URL.
5. Ship: `npm run build && npm run deploy`.

## Frontmatter fields

| Field | Required | Meaning |
|-------|----------|---------|
| `title` | yes | Entry title |
| `summary` | yes | One line describing what the tutorial **is** — fallback if `finding` is omitted |
| `finding` | no | The one skill a reader walks away with, in one line. Listings lead with this |
| `stamp` | no | Free-text status badge (see vocabulary below) |
| `state` | no | `verified` draws the stamp solid; `open` draws it dashed; omit for neutral |
| `discipline` | yes | `grc`, `networking`, `security`, or `instruments` |
| `date` | yes | `YYYY-MM-DD`, treated as UTC |
| `order` | no (default `50`) | Lower sorts first; ties fall back to date |
| `tags` | no | Array of strings |
| `draft` | no (default `false`) | `true` hides the entry from the listing and route |
| `recording` | no | Path to the rendered SVG, e.g. `/tutorials/my-slug/demo.svg`. For reference; the body still renders the `lab-instrument` div so you control placement and caption |

### `stamp` vocabulary

Free text — write the true state. For consistency so far:

| Stamp | Used when |
|-------|-----------|
| `Recorded` | A real terminal recording backs the walkthrough (`state: verified`) |
| `Walkthrough` | Prose-only walkthrough, no recording (neutral) |
| `Not yet recorded` | Page written, recording still to do (`state: open`) |

## Recording pattern in the body

Tutorials are plain `.md` files (same as Labs), so use the raw HTML pattern — Markdown
passes HTML through, and it's styled by `global.css` (reuses the `lab-instrument` figure
+ caption, so no new CSS):

```html
<div class="lab-instrument">
  <img src="/tutorials/your-slug/demo.svg" alt="Terminal recording: describe what happens" loading="lazy" decoding="async" />
  <p class="lab-instrument-caption">One line on what this shows.</p>
</div>
```

If you use `.mdx` instead, wrap the same markup in a figure with class `lab-instrument`.
Plain `.md` plus the raw HTML above is the default and matches the Labs convention.

## Teaching shape — skim first, depth behind expand rows

Lead with 2–3 sentences and the recording. Put the why, the edge cases, and the "what this
doesn't prove" behind the shared expand stack (same pattern as Labs):

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

## Before you push — guardrails

The site's CSP (`public/_headers`) has no `unsafe-inline` anywhere, `script-src 'self'`,
`worker-src 'none'`, and `require-trusted-types-for 'script'`. That is why the default
recording format is an **animated SVG rendered as an `<img>`** — it needs no script, no
worker, and no Trusted Types policy. Markdown bodies are passed straight through to HTML
with no sanitization, so:

- **Images / SVGs:** only local files under `public/`, referenced as `/path/to/file.svg`.
  A remote `<img src="https://...">` is silently blocked by the browser (CSP `img-src
  'self'`).
- **No inline `<script>` or `<style>` tags** in an entry body — they break the page's
  CSP for every visitor.
- **No `<iframe>` embeds** — the CSP blocks framed content entirely.
- **Interactive asciinema player** (copy-paste, rewind) is available but opt-in: it uses
  `innerHTML` and a web worker, both blocked by the current CSP. Enabling it requires a
  deliberate CSP + Trusted Types review and a justification in
  `~/Desktop/Tools/Bench/HANDOFF.md`. See
  "Recording workflow — opt-in player" below.

### Redaction checklist — before any recording ships

A terminal recording captures more than the commands. Before the `.svg` goes in `public/`:

- [ ] No real hostnames in the shell prompt (set a neutral `PS1` before recording)
- [ ] No home/public IP address visible
- [ ] No MAC addresses, account IDs, emails, or third-party personal information
- [ ] No message timestamps or calendar dates unless safe to publish
- [ ] No contents of real secrets, keys, or tokens — even transiently

### Verify before pushing

```bash
npm run build
node ../../Tools/Bench/scripts/headers-verify.mjs dist     # CSP holds on every page
node ../../Tools/Bench/scripts/responsive-audit.mjs dist out # no overflow, touch targets OK
node ../../Tools/Bench/scripts/probe-paths.mjs dist          # no sensitive files shipped
```

All three must exit 0. If they do, `npm run build && npm run deploy` to ship to Njalla.

## Recording workflow

The default format is an **animated SVG rendered as an `<img>`** — no script, no worker,
no Trusted Types policy, so it stays inside the site's strict CSP. The interactive
asciinema player (copy-paste, rewind) is opt-in and needs a CSP review — see the end of
this section.

### 1. Record the terminal session

Install asciinema once (`sudo apt install asciinema` on Debian/Ubuntu, or
`brew install asciinema` on macOS). Record with idle collapsing so dead air doesn't pad
playback:

```bash
asciinema rec -i 2 src/content/tutorials/<your-slug>/demo.cast
```

Do the steps. Stop with `Ctrl-D`. The `.cast` is plain text — keep it under
`src/content/tutorials/<your-slug>/` for provenance if you like; it is not what ships to
the browser.

### 2. Render the animated SVG (default, CSP-clean)

svg-term-cli is already a devDependency (pinned). Render from the `.cast` with the render
script (wraps svg-term-cli and injects a reduced-motion guard):

```bash
node scripts/render-tutorial-svg.mjs <your-slug>
# e.g. node scripts/render-tutorial-svg.mjs reading-email-headers
```

Or call svg-term-cli directly (without the guard):

```bash
node_modules/.bin/svg-term --in src/content/tutorials/<your-slug>/demo.cast \
  --out public/tutorials/<your-slug>/demo.svg --padding 12
```

Reference it in the body with the raw `lab-instrument` HTML (see "Recording pattern
in the body" above). The SVG ships as a self-hosted image under `img-src 'self'` — no CSP
change. svg-term-cli's output is script-free; `scripts/render-tutorial-svg.mjs` injects
a `prefers-reduced-motion` guard that freezes the animation for readers who request
reduced motion (the full text is also in the body, so nothing is lost).

### 3. Render a GIF (only where SVG isn't accepted)

For places that only accept images (some social, some email previews), render a GIF with
`agg` (`cargo install --git https://github.com/asciinema/agg`, needs Rust):

```bash
agg src/content/tutorials/<your-slug>/demo.cast public/tutorials/<your-slug>/demo.gif
```

GIFs are heavier, blurrier, and lose copy-paste — use only when you must, and don't ship
them as the on-site recording. The SVG is the on-site format.

### Before you hit record — redaction

A terminal recording captures more than the commands. Set a neutral prompt and clear the
screen first:

```bash
export PS1='$ '
clear
```

Check the frame for: real hostnames, home/public IPs, MAC addresses, account IDs, emails,
timestamps, and any secret or token that scrolls past. Re-record if any of it appears.

### Opt-in: the interactive asciinema player

The player gives the reader pause, rewind, and copy-paste — the best teacher UX. It is
**not** enabled by default because it conflicts with the current CSP:

- `worker-src 'none'` — the **split** player uses a web worker; the **standalone** IIFE
  bundle (`asciinema-player.min.js`) does not. Use the standalone bundle.
- `require-trusted-types-for 'script'` — the player uses `innerHTML` to render terminal
  lines, which throws under strict Trusted Types unless a policy is configured.

Enabling it requires: a small Trusted Types policy wrapping the player's DOM writes,
confirming the standalone bundle has no other CSP violations, and logging the exception
in `~/Desktop/Tools/Bench/HANDOFF.md`. That is a deliberate change to the security posture
(`doctrine/security-doctrine.md`, control 1), not a tutorial task — raise it with Bench
before doing it.

Until then, the animated SVG is the format. It's the teacher move: crisp at any zoom,
tiny file size, respects reduced-motion. The only thing it loses is copy-paste — and a
tutorial page with the commands written out in code blocks covers that.

### References

- asciinema getting started: https://docs.asciinema.org/getting-started/
- asciinema player quick start: https://docs.asciinema.org/manual/player/quick-start/
- svg-term-cli: https://github.com/OrKoN/svg-term-cli
- agg (cast → gif): https://github.com/asciinema/agg

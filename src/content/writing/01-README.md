# Writing — how to add or edit a post

This collection is for sparse, specific claims worth defending — not a blog treadmill. A
post goes up because there's a claim on the record that a reader can agree or disagree
with, not because it's been a while. An empty `/writing` page with an honest "nothing
published yet" state says more than four stale posts would.

## Add a post

**Preferred** — from the repository root:

```bash
npm run new -- writing "Read what you sign"
```

That creates this folder’s `<slug>.md` with today’s date and `draft: true`. Full cheat sheet:
[`EDIT.md`](../../../EDIT.md).

Manual fallback: copy `../_templates/writing-post.md` here and rename it to your slug.
The filename becomes the URL — `read-what-you-sign.md` → `/writing/read-what-you-sign`.

Then:

1. Fill in the frontmatter (table below) and write the body in Markdown.
2. Preview: `npm run dev` and open the printed URL.
3. When ready: set `draft: false` (or delete the draft line), then
   `npm run build && npm run deploy`.

## Edit an existing post

Open the `.md` file, change it, save. If it's a substantial rewrite of something already
published, bump `revision` by one — it shows in the document-control header on the post
page (`Rev. N · Status: Published · Reviewed {date}`) as honest version tracking, not a
fabricated credential.

## Frontmatter fields

| Field | Required | Meaning |
|-------|----------|---------|
| `title` | yes | Post title |
| `description` | yes | One-line summary — shown in the `/writing` listing and the RSS feed |
| `date` | yes | `YYYY-MM-DD`, treated as UTC |
| `draft` | no (default `false`) | `true` keeps it out of `/writing` and RSS while unfinished |
| `revision` | no (default `1`) | Bump by hand on a substantial rewrite of a published post |

## Glossary pattern for jargon

Plain Markdown supports inline HTML, so wrap acronyms in a native `<abbr>` tag with the
definition in `title` — no JavaScript, works everywhere, shows a dotted underline plus a
native tooltip (styled in `../../styles/global.css`):

```md
Most vendors ask for a <abbr title="Service Organization Control 2 — an auditing standard for how a service provider handles customer data">SOC 2</abbr> report before they'll sign.
```

A few you'll probably reach for — write the real definition yourself when you use them:

- **SOC 2** — Service Organization Control 2, an auditing standard for how a service
  provider handles customer data.
- **NIST CSF** — NIST Cybersecurity Framework, a voluntary framework of security
  practices organized into five functions (Identify, Protect, Detect, Respond, Recover).
- **ISO 27001** — an international standard for information security management systems.
- **PCI-DSS** — Payment Card Industry Data Security Standard, required for anyone
  storing/processing/transmitting card data.
- **GDPR** — the EU's General Data Protection Regulation, covering personal data handling.

## Before you push — guardrails

The site's Content-Security-Policy (`public/_headers`) has no `unsafe-inline` anywhere and
only allows images from this domain. Markdown bodies are passed straight through to HTML
with no sanitization, so:

- **Images:** only local files under `public/`, referenced as `/path/to/file.png`. A
  remote `<img src="https://...">` will be silently blocked by the browser at view time
  (CSP `img-src 'self'`), not caught by `npm run build`.
- **No inline `<script>` or `<style>` tags** in a post body — they'll break the page's CSP
  for every visitor, not just fail quietly.
- **No `<iframe>` embeds** (YouTube, etc.) — the CSP blocks framed content entirely. Adding
  one requires a deliberate CSP and threat-model review.
- **Say what's true.** If a claim is provisional, say so in the text — this collection's
  whole credibility rests on not overstating.

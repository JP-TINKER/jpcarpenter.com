---
# Copy this file into ../tutorials/ and rename it to your slug, e.g. my-tutorial.md.
# The filename becomes the URL: my-tutorial.md -> /tutorials/my-tutorial
# Full field docs: ../tutorials/01-README.md

title: "Your title here"

# One line describing what the tutorial IS. Shown as a fallback if `finding` is left out.
summary: "What this tutorial is, in one line."

# The one skill a reader walks away with, in one line — not a description of what it is.
# Listings lead with this because it's what a reviewer is actually scanning for.
finding: "The one skill a reader walks away with."

# Free text, shown as the status badge next to the entry. Not a locked list — write the
# true state in your own words. See ../tutorials/01-README.md for the vocabulary in use
# so far (Recorded / Walkthrough / Not yet recorded).
stamp: "Not yet recorded"

# Optional. "verified" draws the stamp with a solid accent border (recording attached).
# "open" draws it dashed (unfinished). Leave unset for a neutral stamp.
state: open

# Required visitor-facing domain: grc | networking | security | instruments.
discipline: grc

# YYYY-MM-DD. Treated as UTC everywhere on the site.
date: 2026-01-01

# Lower numbers sort first in listings. Ties fall back to date. Default is 50 if omitted.
order: 50

tags: ["tag-one", "tag-two"]

# true hides this entry from the listing and route until you're ready. Default false.
draft: true

# Optional: path to the rendered animated SVG, e.g. /tutorials/your-slug/demo.svg.
# For reference only — the body still renders the lab-instrument div, so you control placement.
recording: /tutorials/your-slug/demo.svg
---

Lead with 2–3 sentences and the recording. A reader who skims should still know what
they'll be able to do after this page.

<div class="lab-instrument">
  <img src="/tutorials/your-slug/demo.svg" alt="Terminal recording: describe what the recording shows." loading="lazy" decoding="async" />
  <p class="lab-instrument-caption">One line on what this recording shows.</p>
</div>

## The steps

Write the procedure as numbered steps or short sections. Keep each step to what a reader
does, not what you did.

## The decision

If the tutorial is about a judgment (triage, verdict, config choice), end with a small
table or rule that makes the decision mechanical.

## What this teaches, and what it doesn't

Be honest about the limits. Teaching the procedure without its scope is how people
over-trust a method.

---

## Recording

Record the terminal session and render the animated SVG, then drop it in
`public/tutorials/your-slug/`. See `src/content/tutorials/01-README.md` for the exact commands.
Delete this whole body and the comments above once you've copied the file.

---
# Copy this file into ../labs/ and rename it to your slug, e.g. my-new-lab.md.
# The filename becomes the URL: my-new-lab.md -> /labs/my-new-lab
# Full field docs: ../labs/01-README.md

title: "Your title here"

# One line describing what the work IS. Shown as a fallback if `finding` is left out.
summary: "What this lab is, in one line."

# What the work ESTABLISHED, in one line — not a description of what it is. Listings lead
# with this because it's what a reviewer is actually scanning for. Optional, but write one.
finding: "The one sentence a reviewer should walk away with."

# Free text, shown as the status badge next to the entry. Not a locked list — write the
# true state in your own words. See ../labs/01-README.md for the vocabulary in use so far
# (Evidence attached / Instrument / Not yet run).
stamp: "Evidence attached"

# Optional. "verified" draws the stamp with a solid accent border (evidence attached).
# "open" draws it dashed (unfinished / designed but not run). Leave unset for a neutral
# stamp (e.g. an instrument that's neither claim).
state: verified

# Required visitor-facing domain: grc | networking | security | instruments.
# Choose what the work actually proves; do not use this as a promotional label.
discipline: security

# YYYY-MM-DD. Treated as UTC everywhere on the site.
date: 2026-01-01

# Lower numbers sort first in listings. Ties fall back to date. Default is 50 if omitted.
order: 50

tags: ["tag-one", "tag-two"]
---

Write the lab in plain Markdown below this line.

## Adding a screenshot

Put the image file in `public/labs/<your-slug>/`, then reference it like this:

```md
<figure>
  <img src="/labs/your-slug/screenshot.png" alt="Describe what the screenshot shows" />
  <figcaption>One-line caption for what this proves.</figcaption>
</figure>
```

Before adding any screenshot, read the redaction checklist in `../labs/01-README.md` —
crop browser chrome and bookmarks, and check for MAC addresses, internal IPs, hostnames,
and any third-party personal information before it goes in `public/`.

Delete this whole body and the comments above once you've copied the file.

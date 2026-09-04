# Tidy up jpcarpenter

- hat: Bench (site tendril)
- id: jpcarpenter
- ask: |
    Tidy up ~/Desktop/Current/jpcarpenter source. Stale artifacts first, house style second, agreed elegance last.
- scope:
  - src/
  - scripts/
  - astro.config.mjs
  - package.json
  - tsconfig.json
  - .gitignore
  - .github/
  - README.md
  - EDIT.md
  - public/_headers
  - public/robots.txt
  - public/llms.txt
  - public/terms.txt
  - public/about.md
  - public/.well-known/security.txt
  - public/brand/*.md
- out_of_scope:
  - dist/
  - node_modules/
  - .astro/
  - .git/
  - public/downloads/
  - public/fonts/
  - public/brand images and SVG marks
  - public/labs/*.png
  - public favicons and apple-touch-icon
  - Bench hat repo ~/Desktop/Tools/Bench (except doctrine cited as law)
- status: capped
- round: 3
- seats: [composer-2.5-fast, cursor-grok-4.6-high, gpt-5.2]
- frozen: []

## inventory

- root: `/home/r.j.tinker/Desktop/Current/jpcarpenter`
- stack: Astro 7, npm scripts `dev` / `build` / `preview` / `new` / `render-tutorial` / `deploy` / `verify-mobile`
- tests: `npm run verify-mobile`. `npm run build` green after apply-1.
- linter: none in package.json
- hat law: `~/Desktop/Tools/Bench/AGENTS.md` · `~/Desktop/Tools/Bench/doctrine/joe-frontend-rules.md`
- writing collection: INDEX + README only, no posts (intentional)

## round-1
- seats: A DIRTY, B DIRTY, C DIRTY (C scope_held no; findings still used where they overlapped)
- held for Operator (non-empty maintainer scripts, not deleted): `scripts/gen-email-auth-cast.mjs`, `scripts/build-branded-resource.sh`

### reconcile
- must_fix applied: empty `src/data/`; dead `project-catalog.ts` + `project-categories.ts`; unused `TutorialRecording.astro`; unused `readyProducts`/`plannedProducts`/`campaignById`; README CAA email + design law + Cloudflare repo; content maps (five collections, tutorials INDEX, projects listing, content.config comments, tutorials template, resources INDEX); SAMPLER 404; brand README grounds; llms.txt `/tutorials`; EDIT.md tutorials; new-entry header; `--window` example; Space Mono on resources CSS; HANDOFF cites
- notes_agreed: none as must-fix
- notes_dropped: instrument helper duplication; `/projects` vs `/products` twin listing; CI workflow; canvas Space Mono on gauges

## apply-1
- files_touched:
  - deleted: `src/lib/project-catalog.ts`, `src/lib/project-categories.ts`, `src/components/TutorialRecording.astro`, `src/data/`
  - edited: `src/lib/product-catalog.ts`, `src/lib/training-campaigns.ts`, `README.md`, `EDIT.md`, `src/content/README.md`, `src/content/tutorials/00-INDEX.md`, `src/content/tutorials/01-README.md`, `src/content/_templates/tutorials-entry.md`, `src/content/projects/00-INDEX.md`, `src/content.config.ts`, `src/pages/resources/index.astro`, `src/components/ResourceTemplatePreview.astro`, `scripts/new-entry.mjs`, `public/llms.txt`, `public/brand/SAMPLER.md`, `public/brand/README.md`
  - added: `src/content/resources/00-INDEX.md`
- tests: `npm run build` pass (empty writing collection warns as before)

## round-3
- seats: A CLEAN, B DIRTY (map lies), C DIRTY (inline style CSP)
- apply-3: README sage chrome, labs/writing INDEX relative URLs, resources 01-README chooser truth, ResourceDownloadChooser class instead of inline style
- leftover notes: Space Mono canvas fallbacks, twin product listings, unused BRAND keys, unused singular `download` on catalog, `--font-mono` named Atkinson, Ankit-scale copy
- Operator hold: `scripts/gen-email-auth-cast.mjs`, `scripts/build-branded-resource.sh`
- tests after apply-3: `npm run build` pass, `npm run verify-mobile` pass

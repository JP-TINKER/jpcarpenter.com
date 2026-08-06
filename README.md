# jpcarpenter.com

Static-first rebuild of [jpcarpenter.com](https://jpcarpenter.com) with **Astro** (MIT).

## Stack

| Piece | Choice |
|-------|--------|
| Generator | Astro 7 (MIT) |
| Fonts | Space Grotesk + Space Mono via `@fontsource` (self-hosted) |
| Instrument | TINKER-SCOPE Model 1A (island; JS only here) |
| Hosting target | Cloudflare Pages (default choice — $0/mo, git-connected, tight CSP support) |

## Setup (needs Node 20+)

```bash
# if you don't have Node yet (pick one):
#   curl -fsSL https://deb.nodesource.com/setup_22.x | sudo -E bash - && sudo apt install -y nodejs
#   or: https://github.com/nvm-sh/nvm#installing-and-updating then nvm install --lts

cd jpcarpenter
npm install
npm run dev
```

Open the printed localhost URL. Build for deploy: `npm run build` → `dist/`.

## Adding content (no Bench session needed)

**Start here:** [`EDIT.md`](EDIT.md) — four commands to add a post and put it live.

Every article, lab, or project is a Markdown file. No CMS, no admin login.

```bash
npm run new -- writing "Your title here"   # creates a draft under src/content/writing/
npm run dev                                # preview locally
# set draft: false in the file when ready
npm run build && npm run deploy            # build + upload to Njalla
```

Field docs and guardrails (images, CSP, redaction) live in each collection’s
`01-README.md` under [`src/content/`](src/content/README.md). Optional deeper verify
before deploy:

```bash
node ~/Desktop/Tools/Bench/scripts/headers-verify.mjs dist
node ~/Desktop/Tools/Bench/scripts/responsive-audit.mjs dist out
node ~/Desktop/Tools/Bench/scripts/probe-paths.mjs dist
```

## Headshot

The About page has a reserved, optional slot for a photo. Drop a file at
`public/about/headshot.jpg` (`.jpeg`/`.png`/`.webp` also work) and rebuild — it appears
automatically, framed plainly (no circular crop, no glow ring), matching the rest of the
site's evidence-figure treatment. No file there, nothing renders — no broken-image state
either way. Use a real photo, not stock.

## Deploy (live host: Njalla)

Production is nginx on Njalla (`/var/www/jpcarpenter.com`). After a clean build:

```bash
npm run build && npm run deploy
```

`npm run deploy` confirms, then `tar | ssh` uploads `dist/` and fixes
`root:www-data` / 755·644 perms (remote has no rsync). Needs working SSH to
`root@80.78.27.111`. Details: [`EDIT.md`](EDIT.md).

## Deploy (Cloudflare Pages — deferred)

Cloudflare Pages remains a valid later option if you want to drop the VPS.

1. Connect the repository in Cloudflare dashboard → Workers & Pages → Create → Pages →
   Connect to Git → pick the repo above. Build command `npm run build`, output directory
   `dist`, Node version 20+ (or add `NODE_VERSION=22` as an env var). `public/_headers` and
   `public/robots.txt` ship automatically as part of the build output — no extra Pages
   config needed for headers/CSP.
2. Under Custom domains, add `jpcarpenter.com` (and `www` if
   you want it, redirecting to the bare domain). Cloudflare will prompt the DNS records to
   add if the zone isn't already on Cloudflare.
3. Once the zone is on Cloudflare (or wherever DNS lives), add CAA records so only the
   CAs Cloudflare actually uses can issue for this domain. All four are needed — Cloudflare
   picks between them per certificate, so omitting one can fail a renewal later:

   | Name | Tag | Value |
   |------|-----|-------|
   | `jpcarpenter.com` | `issue` | `letsencrypt.org` |
   | `jpcarpenter.com` | `issue` | `pki.goog; cansignhttpexchanges=yes` |
   | `jpcarpenter.com` | `issue` | `ssl.com` |
   | `jpcarpenter.com` | `issue` | `sectigo.com` |
   | `jpcarpenter.com` | `iodef` | `mailto:joe@jpcarpenter.com` |

   Note: with Universal SSL on, Cloudflare adds its own CAA records as soon as you add any,
   so these lock out other CAs rather than restricting Cloudflare itself.
4. Verify after cutover:
   ```bash
   curl -sI https://jpcarpenter.com | grep -Ei 'strict-transport|content-security|x-frame|x-content-type|referrer-policy|permissions-policy|cross-origin'
   dig +short CAA jpcarpenter.com
   curl -s https://jpcarpenter.com/.well-known/security.txt
   ```

## Pre-deploy verification

Three checks run locally against a real build, so nothing waits on DNS:

```bash
npm run build
node ../../Tools/Bench/scripts/headers-verify.mjs dist        # serves dist with public/_headers, fails on any CSP violation
node ../../Tools/Bench/scripts/responsive-audit.mjs dist out --shots   # overflow + touch targets, 320px to 2560px
node ../../Tools/Bench/scripts/probe-paths.mjs dist            # checks 40+ probe paths, dist walk for sensitive files
```

The first two need Playwright's Firefox; point `PLAYWRIGHT_PKG` at an installed copy if
this project does not have one. The third is pure Node, no browser needed.

All three exit non-zero on failure, so they can run in a pre-commit hook or CI gate.

## Security posture

The site is static: no server-side code, no database, no forms, no auth, no third-party
JS. The Content-Security-Policy in `public/_headers` runs `script-src 'self'` with no
`'unsafe-inline'` and no nonces — there are zero inline scripts in the build, so the
policy is tighter than the nonce approach. `require-trusted-types-for 'script'` is
enforced as defense-in-depth (Firefox/Chromium); Safari ignores it but `script-src
'self'` holds regardless. `public/.well-known/security.txt` is present (RFC 9116).

Full red-team report: `../../Tools/Bench/brand-ops/security-redteam-2026-08-01.md`.

## Design law

The public interface follows a restrained review-desk system: warm materials, one sage
accent, evidence-led rows, and honest status labels.

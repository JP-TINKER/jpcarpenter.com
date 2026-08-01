# jpcarpenter.com

Static-first rebuild of [jpcarpenter.com](https://jpcarpenter.com) with **Astro** (MIT).

**Agent:** Bench (`~/Desktop/Tools/Bench/`) · tendril attaches here via `scripts/attach-site.sh`.

## Stack

| Piece | Choice |
|-------|--------|
| Generator | Astro 7 (MIT) |
| Fonts | Space Grotesk + Space Mono via `@fontsource` (self-hosted) |
| Instrument | TINKER-SCOPE Model 1A (island; JS only here) |
| Hosting target | Cloudflare Pages (default choice — $0/mo, git-connected, tight CSP support) |

Ghost on Njalla is stopped + disabled (not serving traffic) but the VPS still exists until
DNS cutover to Cloudflare Pages is confirmed working. Export backup:
`~/Desktop/Current/jpcarpenter-export/` (keep outside this repo).

## Setup (needs Node 20+)

```bash
# if you don't have Node yet (pick one):
#   curl -fsSL https://deb.nodesource.com/setup_22.x | sudo -E bash - && sudo apt install -y nodejs
#   or: https://github.com/nvm-sh/nvm#installing-and-updating then nvm install --lts

cd ~/Desktop/Current/jpcarpenter
npm install
npm run dev
```

Open the printed localhost URL. Build for deploy: `npm run build` → `dist/`.

## Deploy (Cloudflare Pages) — Joe's steps, needs your accounts

This repo is git-initialized locally (`git log`) but has no remote yet. These steps need
your GitHub and Cloudflare accounts — I can't complete them without your credentials, so
here's exactly what to click/run:

1. **Push to GitHub** (create a new empty repo first, e.g. `joepcarpenter/jpcarpenter`, no
   README/license — you already have one):
   ```bash
   cd ~/Desktop/Current/jpcarpenter
   git remote add origin git@github.com:joepcarpenter/jpcarpenter.git
   git push -u origin main
   ```
   Or re-auth the CLI first if you want to use it: `gh auth login` (existing token expired),
   then `gh repo create joepcarpenter/jpcarpenter --private --source=. --push`.
2. **Connect Cloudflare Pages**: Cloudflare dashboard → Workers & Pages → Create → Pages →
   Connect to Git → pick the repo above. Build command `npm run build`, output directory
   `dist`, Node version 20+ (or add `NODE_VERSION=22` as an env var). `public/_headers` and
   `public/robots.txt` ship automatically as part of the build output — no extra Pages
   config needed for headers/CSP.
3. **Custom domain**: Pages project → Custom domains → add `jpcarpenter.com` (and `www` if
   you want it, redirecting to the bare domain). Cloudflare will prompt the DNS records to
   add if the zone isn't already on Cloudflare.
4. **CAA record**: once the zone is on Cloudflare (or wherever DNS lives), add a CAA record
   locking certificate issuance to your chosen CA (Cloudflare issues via Let's Encrypt/Google
   Trust Services by default — a CAA record naming those is enough; ask if you want the exact
   record values).
5. **Verify after cutover**:
   ```bash
   curl -sI https://jpcarpenter.com | grep -Ei 'strict-transport|content-security|x-frame|x-content-type|referrer-policy|permissions-policy|cross-origin'
   ```
   All of `checklists/headers-csp.md`'s required rows should be present.
6. **After DNS is confirmed working on Cloudflare Pages**: stop paying for/using the Njalla
   VPS (Ghost is already stopped+disabled there) — destroying it is a deliberate, separate
   step, not automatic.

## Design law

Bench doctrine — `design-system.md` + `joe-frontend-rules.md`. Ancestry: Wright/Rams. Not the drifted Ghost cream/Playfair CSS.

## Cut the tendril

```bash
bash ~/Desktop/Tools/Bench/scripts/detach-site.sh
```

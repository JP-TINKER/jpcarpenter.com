# jpcarpenter.com

Static-first rebuild of [jpcarpenter.com](https://jpcarpenter.com) with **Astro** (MIT).

**Agent:** Bench (`~/Desktop/Tools/Bench/`) · tendril attaches here via `scripts/attach-site.sh`.

## Stack

| Piece | Choice |
|-------|--------|
| Generator | Astro 7 (MIT) |
| Fonts | Space Grotesk + Space Mono via `@fontsource` (self-hosted) |
| Instrument | TINKER-SCOPE Model 1A (island; JS only here) |
| Hosting target | Cloudflare Pages / Netlify (after verify) |

Live Ghost on Njalla stays until DNS cutover. Export backup: `~/Desktop/Current/jpcarpenter-export/` (keep outside this repo).

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

## Design law

Bench doctrine — `design-system.md` + `joe-frontend-rules.md`. Ancestry: Wright/Rams. Not the drifted Ghost cream/Playfair CSS.

## Cut the tendril

```bash
bash ~/Desktop/Tools/Bench/scripts/detach-site.sh
```

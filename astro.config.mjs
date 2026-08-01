import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';

export default defineConfig({
  site: 'https://jpcarpenter.com',
  trailingSlash: 'never',
  build: {
    // 'never' forces every stylesheet to ship as an external, self-hosted, hashed .css
    // file instead of an inline <style> block. That's what lets the CSP in public/_headers
    // run script-src/style-src 'self' with zero 'unsafe-inline' and no nonces — a static
    // site can't rotate a per-response nonce, so "no inline styles at all" is the honest
    // strict-CSP path here instead of a permanent exception.
    inlineStylesheets: 'never',
  },
  integrations: [sitemap()],
  // assetsInlineLimit also governs Astro's script/small-asset inlining (not just Vite's own
  // asset handling) — set to 0 so every script ships as an external, hashed file too and no
  // image can end up as a data: URI that CSP img-src 'self' wouldn't cover.
  vite: {
    build: {
      assetsInlineLimit: 0,
    },
  },
});

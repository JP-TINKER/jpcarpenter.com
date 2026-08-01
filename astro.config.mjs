import { defineConfig } from 'astro/config';

export default defineConfig({
  site: 'https://jpcarpenter.com',
  trailingSlash: 'never',
  build: {
    inlineStylesheets: 'auto',
  },
});

import { defineConfig } from 'astro/config';

export default defineConfig({
  site: 'https://tech.imnotyourson.com',
  markdown: {
    shikiConfig: {
      theme: 'github-dark',
      wrap: true,
    },
  },
});

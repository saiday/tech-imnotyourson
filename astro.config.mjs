import { defineConfig } from 'astro/config';

export default defineConfig({
  site: 'https://tech.imnotyourson.com',
  server: {
    host: '0.0.0.0',
  },
  markdown: {
    shikiConfig: {
      theme: 'github-dark',
      wrap: true,
    },
  },
});

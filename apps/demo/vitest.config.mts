import { playwright } from '@vitest/browser-playwright';
import { defineConfig } from 'vitest/config';
import viteConfig from './vite.config.mjs';

export default defineConfig({
  ...viteConfig,
  test: {
    watch: false,
    include: ['src/**/*.spec.ts'],
    setupFiles: ['src/test-setup.ts'],
    reporters: ['default'],
    browser: {
      enabled: true,
      provider: playwright(),
      instances: [
        { browser: 'chromium', viewport: { width: 1920, height: 1080 } },
      ],
    },
  },
});

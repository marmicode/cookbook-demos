import { defineConfig } from 'vitest/config';
import viteConfig from './vite.config.mjs';
import { playwright } from '@vitest/browser-playwright';

const testPatterns = ['src/**/*.spec.ts'];
const browserTestPatterns = ['src/**/*.browser.spec.ts'];

export default defineConfig({
  ...viteConfig,
  test: {
    watch: false,
    include: [],
    setupFiles: ['src/test-setup.ts'],
    reporters: ['default'],
    coverage: {
      reportsDirectory: '../../coverage/apps/demo',
      provider: 'v8' as const,
    },
    testTimeout: 3_000,
    projects: [
      {
        extends: true,
        test: {
          name: 'emulated',
          environment: 'jsdom',
          include: testPatterns,
          exclude: browserTestPatterns,
        },
      },
      {
        extends: true,
        test: {
          name: 'browser',
          include: browserTestPatterns,
          browser: {
            enabled: true,
            headless: true,
            provider: playwright(),
            instances: [{ browser: 'chromium' }],
          },
        },
      },
    ],
  },
});

import { join } from 'node:path';
import { nxViteTsPaths } from '@nx/vite/plugins/nx-tsconfig-paths.plugin';
import { workspaceRoot } from '@nx/devkit';
import { defineConfig } from 'vite';

const projectPath = process.cwd().replace(workspaceRoot, '');

export default defineConfig({
  root: __dirname,
  cacheDir: join(workspaceRoot, 'node_modules/.vite', projectPath),
  plugins: [nxViteTsPaths()],
  test: {
    watch: false,
    globals: true,
    environment: 'node',
    include: ['**/*.{test,spec}.{js,mjs,cjs,ts,mts,cts,jsx,tsx}'],
    reporters: ['default'],
    coverage: {
      provider: 'v8',
      reportsDirectory: join(workspaceRoot, 'coverage', projectPath),
    },
  },
});

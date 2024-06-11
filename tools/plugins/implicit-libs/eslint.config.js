import { FlatCompat } from '@eslint/eslintrc';
import js from '@eslint/js';
// eslint-disable-next-line @nx/enforce-module-boundaries
import baseConfig from '../../../eslint.config.js';

const __dirname = import.meta.url.replace('file://', '');

const compat = new FlatCompat({
  baseDirectory: __dirname,
  recommendedConfig: js.configs.recommended,
});

export default [
  ...baseConfig,
  {
    files: ['**/*.ts', '**/*.tsx', '**/*.js', '**/*.jsx'],
    rules: {},
  },
  {
    files: ['**/*.ts', '**/*.tsx'],
    rules: {},
  },
  {
    files: ['**/*.js', '**/*.jsx'],
    rules: {},
  },
  ...compat.config({ parser: 'jsonc-eslint-parser' }).map((config) => ({
    ...config,
    files: ['**/*.json'],
    rules: {
      ...config.rules,
      '@nx/dependency-checks': 'error',
    },
  })),
  ...compat.config({ parser: 'jsonc-eslint-parser' }).map((config) => ({
    ...config,
    files: ['./package.json'],
    rules: {
      ...config.rules,
      '@nx/nx-plugin-checks': 'error',
    },
  })),
];

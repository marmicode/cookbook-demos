const { FlatCompat } = require('@eslint/eslintrc');
const nxEslintPlugin = require('@nx/eslint-plugin');
const js = require('@eslint/js');

const compat = new FlatCompat({
  baseDirectory: __dirname,
  recommendedConfig: js.configs.recommended
});

module.exports = [
  { plugins: { '@nx': nxEslintPlugin } },
  ...compat.config({ parser: 'jsonc-eslint-parser' }).map((config) => ({
    ...config,
    files: ['**/*.json'],
    rules: {
      ...config.rules
    }
  })),
  {
    files: ['**/*.ts', '**/*.tsx', '**/*.js', '**/*.jsx'],
    rules: {
      '@typescript-eslint/no-unused-vars': [
        'warn',
        {
          argsIgnorePattern: '^_',
          destructuredArrayIgnorePattern: '^_'
        }
      ]
    }
  },
  {
    files: ['**/*.ts', '**/*.tsx', '**/*.js', '**/*.jsx'],
    rules: {
      '@nx/enforce-module-boundaries': [
        'error',
        {
          enforceBuildableLibDependency: true,
          allow: [],
          depConstraints: [
            {
              sourceTag: 'type:app',
              onlyDependOnLibsWithTags: [
                'type:feature',
                'type:ui',
                'type:domain',
                'type:infra',
                'type:model',
                'type:util'
              ]
            },
            {
              sourceTag: 'type:feature',
              onlyDependOnLibsWithTags: [
                'type:feature',
                'type:ui',
                'type:domain',
                'type:infra',
                'type:model',
                'type:util'
              ]
            },
            {
              sourceTag: 'type:ui',
              onlyDependOnLibsWithTags: ['type:ui', 'type:model', 'type:util']
            },
            {
              sourceTag: 'type:domain',
              onlyDependOnLibsWithTags: [
                'type:domain',
                'type:infra',
                'type:model',
                'type:util'
              ]
            },
            {
              sourceTag: 'type:infra',
              onlyDependOnLibsWithTags: [
                'type:infra',
                'type:model',
                'type:util'
              ]
            },
            {
              sourceTag: 'type:model',
              onlyDependOnLibsWithTags: ['type:model', 'type:util']
            },
            {
              sourceTag: 'type:util',
              onlyDependOnLibsWithTags: ['type:util']
            }
          ]
        }
      ]
    }
  },
  ...compat.config({ extends: ['plugin:@nx/typescript'] }).map((config) => ({
    ...config,
    files: ['**/*.ts', '**/*.tsx'],
    rules: {
      ...config.rules
    }
  })),
  ...compat.config({ extends: ['plugin:@nx/javascript'] }).map((config) => ({
    ...config,
    files: ['**/*.js', '**/*.jsx'],
    rules: {
      ...config.rules
    }
  }))
];

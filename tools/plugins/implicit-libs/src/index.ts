import { CreateNodes } from '@nx/devkit';
import { dirname, join } from 'node:path';
import { getProjectInfo, hasFileMatching, hasIndexInParentTree } from './utils';

export const createNodes: CreateNodes = [
  'libs/**/index.ts',
  async (indexFilePath: string, _, { workspaceRoot }) => {
    const projectPath = dirname(indexFilePath);

    if (await hasIndexInParentTree(join(workspaceRoot, indexFilePath))) {
      return {};
    }

    const { name, platform, scope, type } = getProjectInfo(projectPath);
    const projectName = name ? `${name}-${type}` : type;

    const hasTests = await hasFileMatching(
      join(workspaceRoot, projectPath, '**/*.spec.ts')
    );

    return {
      projects: {
        [projectPath]: {
          name: `${platform}-${scope}-${projectName}`,
          projectType: 'library',
          tags: [`platform:${platform}`, `scope:${scope}`, `type:${type}`],
          targets: {
            ...createLintTarget(projectPath),
            ...(hasTests ? createTestTarget(projectPath) : {}),
          },
        },
      },
    };
  },
];

function createLintTarget(projectPath: string) {
  let currentPath = join('{workspaceRoot}', projectPath);
  let eslintConfigPaths = [];
  while (currentPath !== '.') {
    eslintConfigPaths = [
      ...eslintConfigPaths,
      join(currentPath, '.eslintrc.json'),
    ];
    currentPath = dirname(currentPath);
  }

  return {
    lint: {
      command: 'eslint .',
      options: {
        cwd: projectPath,
      },
      cache: true,
      inputs: [
        'default',
        '^default',
        ...eslintConfigPaths,
        '{workspaceRoot}/tools/eslint-rules/**/*',
        {
          externalDependencies: ['eslint'],
        },
      ],
      outputs: ['{options.outputFile}'],
    },
  };
}

function createTestTarget(projectPath: string) {
  return {
    test: {
      command: 'vitest',
      options: {
        cwd: projectPath,
        root: '.',
      },
      cache: true,
      inputs: [
        'default',
        '^production',
        {
          externalDependencies: ['vitest'],
        },
        {
          env: 'CI',
        },
      ],
      outputs: [`{workspaceRoot}/coverage/${projectPath}`],
    },
  };
}

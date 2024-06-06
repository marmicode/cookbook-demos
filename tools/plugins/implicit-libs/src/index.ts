import {
  CreateNodesResultV2,
  CreateNodesV2,
  ProjectConfiguration,
} from '@nx/devkit';
import { dirname, join } from 'node:path';
import { getProjectInfo, hasFileMatching, hasIndexInParentTree } from './utils';
import { Optional } from 'nx/src/project-graph/plugins';

export const createNodesV2: CreateNodesV2 = [
  'libs/**/index.ts',
  async (
    indexFilePaths,
    _,
    { workspaceRoot }
  ): Promise<CreateNodesResultV2> => {
    const results = await Promise.all(
      indexFilePaths.map(async (indexFilePath) => {
        const projectPath = dirname(indexFilePath);
        const projectConfiguration = await createImplicitLibProjectConfig(
          projectPath,
          { workspaceRoot }
        );
        return projectConfiguration
          ? {
              indexFilePath,
              projectPath,
              projectConfiguration,
            }
          : undefined;
      })
    );

    return results
      .filter(isDefined)
      .map(({ indexFilePath, projectConfiguration, projectPath }) => [
        indexFilePath,
        {
          projects: {
            [projectPath]: projectConfiguration,
          },
        },
      ]);
  },
];

function isDefined<T>(value: T | undefined): value is T {
  return value !== undefined;
}

async function createImplicitLibProjectConfig(
  projectPath: string,
  { workspaceRoot }: { workspaceRoot: string }
): Promise<Optional<ProjectConfiguration, 'root'> | undefined> {
  const projectRoot = join(workspaceRoot, projectPath);
  if (await hasIndexInParentTree(projectRoot)) {
    return;
  }

  const { name, platform, scope, type } = getProjectInfo(projectPath);
  const projectName = name ? `${name}-${type}` : type;
  const hasTests = await hasFileMatching(join(projectRoot, '**/*.spec.ts'));
  return {
    name: `${platform}-${scope}-${projectName}`,
    projectType: 'library',
    tags: [`platform:${platform}`, `scope:${scope}`, `type:${type}`],
    targets: {
      ...createLintTarget(projectPath),
      ...(hasTests ? createTestTarget(projectPath) : {}),
    },
  };
}

function createLintTarget(projectPath: string) {
  let currentPath = join('{workspaceRoot}', projectPath);
  let eslintConfigPaths: string[] = [];
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

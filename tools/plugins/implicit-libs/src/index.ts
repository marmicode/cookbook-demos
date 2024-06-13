import {
  CreateNodesResultV2,
  CreateNodesV2,
  ProjectConfiguration,
} from '@nx/devkit';
import { dirname, join } from 'node:path';
import { Optional } from 'nx/src/project-graph/plugins';
import { getProjectInfo, hasFileMatching, hasIndexInParentTree } from './utils';

export const createNodesV2: CreateNodesV2 = [
  'libs/**/index.ts',
  async (indexPathList, _, { workspaceRoot }): Promise<CreateNodesResultV2> => {
    const results = await Promise.all(
      indexPathList.map((indexPath) =>
        createImplicitLibProjectConfig(indexPath, { workspaceRoot })
      )
    );

    return results
      .filter(isDefined)
      .map(({ indexPath, projectConfiguration, projectPath }) => [
        indexPath,
        {
          projects: {
            [projectPath]: projectConfiguration,
          },
        },
      ]);
  },
];

async function createImplicitLibProjectConfig(
  indexPath: string,
  { workspaceRoot }: { workspaceRoot: string }
) {
  const projectPath = dirname(indexPath);
  const projectRoot = join(workspaceRoot, projectPath);
  if (await hasIndexInParentTree(projectRoot)) {
    return;
  }

  const projectInfo = getProjectInfo(projectPath);
  if (projectInfo === undefined) {
    return;
  }

  const { name, platform, scope, type } = projectInfo;
  const projectName = name ? `${name}-${type}` : type;
  const hasTests = await hasFileMatching(join(projectRoot, '**/*.spec.ts'));
  return {
    indexPath,
    projectPath,
    projectConfiguration: {
      name: `${platform}-${scope}-${projectName}`,
      projectType: 'library',
      tags: [`platform:${platform}`, `scope:${scope}`, `type:${type}`],
      targets: {
        ...createLintTarget(projectPath),
        ...(hasTests ? createTestTarget(projectPath) : {}),
      },
    } satisfies Optional<ProjectConfiguration, 'root'>,
  };
}

function createLintTarget(
  projectPath: string
): ProjectConfiguration['targets'] {
  let currentPath = join('{workspaceRoot}', projectPath);
  let eslintConfigPaths: string[] = [];
  while (currentPath !== '.') {
    eslintConfigPaths = [
      ...eslintConfigPaths,
      join(currentPath, 'eslint.config.js'),
    ];
    currentPath = dirname(currentPath);
  }

  return {
    lint: {
      command: 'eslint .',
      options: {
        cwd: projectPath,
      },
      metadata: {
        technologies: ['eslint'],
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

function createTestTarget(
  projectPath: string
): ProjectConfiguration['targets'] {
  return {
    test: {
      command: 'vitest',
      options: {
        cwd: projectPath,
        root: '.',
      },
      metadata: {
        technologies: ['vitest'],
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

function isDefined<T>(value: T | undefined): value is T {
  return value !== undefined;
}

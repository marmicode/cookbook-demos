import { CreateNodes } from '@nx/devkit';

export const createNodes: CreateNodes = [
  'libs/*/*/*/index.ts',
  (indexPath: string) => {
    const [libs, platform, scope, name] = indexPath.split('/');
    const projectRoot = `${libs}/${platform}/${scope}/${name}`;
    const projectName = `${platform}-${scope}-${name}`;
    const nameParts = name.split('-');
    const type = nameParts.at(-1);

    return {
      projects: {
        [projectName]: {
          name: projectName,
          root: projectRoot,
          tags: [`platform:${platform}`, `scope:${scope}`, `type:${type}`],
          targets: {
            lint: {
              command: 'eslint .',
              options: {
                cwd: projectRoot,
              },
              cache: true,
              inputs: [
                'default',
                '^default',
                '{workspaceRoot}/.eslintrc.json',
                `{workspaceRoot}/${libs}/${platform}/.eslintrc.json`,
                '{workspaceRoot}/tools/eslint-rules/**/*',
                {
                  externalDependencies: ['eslint'],
                },
              ],
              outputs: ['{options.outputFile}'],
            },
            test: {
              command: 'vitest',
              options: {
                cwd: projectRoot,
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
              outputs: [`{workspaceRoot}/coverage/${libs}/${platform}/${name}`],
            },
          },
        },
      },
    };
  },
];

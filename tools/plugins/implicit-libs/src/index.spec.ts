import { glob } from 'glob';
import { mkdir, mkdtemp, writeFile } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { dirname, join } from 'node:path';
import { createNodesV2 } from './index';

describe('implicit-libs', () => {
  it('should match projects in `libs`', async () => {
    const { workspaceRoot, writeEmptyFile } = await setUp();

    await writeEmptyFile('libs/web/catalog/search-ui/index.ts');

    expect(await glob(`${workspaceRoot}/${createNodesV2[0]}`)).toEqual([
      expect.stringContaining('libs/web/catalog/search-ui/index.ts'),
    ]);
  });

  it('should not match projects outside `libs`', async () => {
    const { workspaceRoot, writeEmptyFile } = await setUp();

    await writeEmptyFile('apps/web/catalog/search-ui/index.ts');

    expect(await glob(`${workspaceRoot}/${createNodesV2[0]}`)).toEqual([]);
  });

  it('should infer project info from the project path', async () => {
    const { runCreateNodes } = await setUpWithLibrary();

    const results = await runCreateNodes('libs/web/catalog/search-ui/index.ts');

    expect.soft(results).toHaveLength(1);
    expect.soft(results[0]).toMatchObject([
      'libs/web/catalog/search-ui/index.ts',
      {
        projects: {
          'libs/web/catalog/search-ui': {
            name: 'web-catalog-search-ui',
            projectType: 'library',
          },
        },
      },
    ]);
  });

  it('should infer project info from the project path without name', async () => {
    const { runCreateNodes, writeEmptyFile } = await setUp();

    await writeEmptyFile('libs/web/catalog/ui/index.ts');

    const [[_, projectConfiguration]] = await runCreateNodes(
      'libs/web/catalog/ui/index.ts'
    );

    expect(projectConfiguration).toMatchObject({
      projects: {
        'libs/web/catalog/ui': {
          name: 'web-catalog-ui',
        },
      },
    });
  });

  it('should infer tags from the project path', async () => {
    const { runCreateNodes } = await setUpWithLibrary();

    const [[_, projectConfiguration]] = await runCreateNodes(
      'libs/web/catalog/search-ui/index.ts'
    );

    expect(projectConfiguration).toMatchObject({
      projects: {
        'libs/web/catalog/search-ui': {
          tags: ['platform:web', 'scope:catalog', 'type:ui'],
        },
      },
    });
  });

  it('should not infer anything if there is an index.ts in a parent folder', async () => {
    const { writeEmptyFile, runCreateNodes } = await setUpWithLibrary();

    await writeEmptyFile('libs/web/catalog/index.ts');

    const result = await runCreateNodes('libs/web/catalog/search-ui/index.ts');

    expect(result).toEqual([]);
  });

  it('should infer lint target', async () => {
    const { runCreateNodes } = await setUpWithLibrary();

    const [[_, projectConfiguration]] = await runCreateNodes(
      'libs/web/catalog/search-ui/index.ts'
    );

    expect(projectConfiguration).toMatchObject({
      projects: {
        'libs/web/catalog/search-ui': {
          targets: {
            lint: {
              command: 'eslint .',
              options: {
                cwd: 'libs/web/catalog/search-ui',
              },
              cache: true,
              inputs: [
                'default',
                '^default',
                '{workspaceRoot}/libs/web/catalog/search-ui/.eslintrc.json',
                '{workspaceRoot}/libs/web/catalog/.eslintrc.json',
                '{workspaceRoot}/libs/web/.eslintrc.json',
                '{workspaceRoot}/libs/.eslintrc.json',
                '{workspaceRoot}/.eslintrc.json',
                '{workspaceRoot}/tools/eslint-rules/**/*',
                {
                  externalDependencies: ['eslint'],
                },
              ],
              outputs: ['{options.outputFile}'],
            },
          },
        },
      },
    });
  });

  it('should infer test target if there are tests', async () => {
    const { runCreateNodes, writeEmptyFile } = await setUpWithLibrary();

    await writeEmptyFile('libs/web/catalog/search-ui/index.spec.ts');

    const [[_, projectConfiguration]] = await runCreateNodes(
      'libs/web/catalog/search-ui/index.ts'
    );

    expect(projectConfiguration).toMatchObject({
      projects: {
        'libs/web/catalog/search-ui': {
          targets: {
            test: {
              command: 'vitest',
              options: {
                cwd: 'libs/web/catalog/search-ui',
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
              outputs: ['{workspaceRoot}/coverage/libs/web/catalog/search-ui'],
            },
          },
        },
      },
    });
  });

  it('should not infer test target if there are no tests', async () => {
    const { runCreateNodes } = await setUpWithLibrary();

    const [[_, projectConfiguration]] = await runCreateNodes(
      'libs/web/catalog/search-ui/index.ts'
    );

    expect(
      projectConfiguration.projects?.['libs/web/catalog/search-ui'].targets
        ?.test
    ).toBeUndefined();
  });
});

async function setUpWithLibrary() {
  const { writeEmptyFile, ...utils } = await setUp();

  await writeEmptyFile('libs/web/catalog/search-ui/index.ts');

  return { writeEmptyFile, ...utils };
}

async function setUp() {
  const workspaceRoot = await mkdtemp(join(tmpdir(), 'fake-nx-workspace'));

  return {
    async runCreateNodes(filePath: string) {
      return createNodesV2[1](
        [filePath],
        {},
        {
          nxJsonConfiguration: {},
          workspaceRoot,
        }
      );
    },
    async writeEmptyFile(filePath: string) {
      filePath = join(workspaceRoot, filePath);
      await mkdir(dirname(filePath), { recursive: true });
      await writeFile(filePath, '');
    },
    workspaceRoot,
  };
}

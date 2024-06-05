import { mkdir, mkdtemp, writeFile } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { getProjectInfo, hasFileMatching, hasIndexInParentTree } from './utils';

describe(hasIndexInParentTree.name, () => {
  it('should return true if direct parent folder has index.ts', async () => {
    const { rootPath } = await setUp();
    await writeFile(`${rootPath}/libs/web/catalog/index.ts`, '');

    expect(
      await hasIndexInParentTree(
        `${rootPath}/libs/web/catalog/search-ui/index.ts`
      )
    ).toBe(true);
  });

  it('should return true if grand parent folder has index.ts', async () => {
    const { rootPath } = await setUp();
    await writeFile(`${rootPath}/libs/web/index.ts`, '');

    expect(
      await hasIndexInParentTree(
        `${rootPath}/libs/web/catalog/search-ui/index.ts`
      )
    ).toBe(true);
  });

  it('should return false if no parent folder has an index.ts', async () => {
    const { rootPath } = await setUp();
    expect(
      await hasIndexInParentTree(
        `${rootPath}/libs/web/catalog/search-ui/index.ts`
      )
    ).toBe(false);
  });

  async function setUp() {
    const rootPath = await mkdtemp(join(tmpdir(), 'fake-nx-workspace'));

    await mkdir(`${rootPath}/libs/web/catalog/search-ui`, { recursive: true });
    await writeFile(`${rootPath}/libs/web/catalog/search-ui/index.ts`, '');

    return {
      rootPath,
    };
  }
});

describe(getProjectInfo.name, () => {
  it('should compute platform, scope, name, and type', () => {
    expect(getProjectInfo('libs/web/catalog/search-ui')).toEqual({
      platform: 'web',
      scope: 'catalog',
      name: 'search',
      type: 'ui',
    });
  });

  it('should compute platform, scope, and type if no name', () => {
    expect(getProjectInfo('libs/web/catalog/ui')).toEqual({
      platform: 'web',
      scope: 'catalog',
      type: 'ui',
    });
  });

  it.each(['libs/my-lib', `libs/web/my-lib`])(
    'should throw an error if lib is too shallow: %s',
    (libPath) => {
      expect(() => getProjectInfo(libPath)).toThrow('Invalid project path');
    }
  );

  it('should throw an error if lib is too deep', () => {
    expect(() => getProjectInfo('libs/too-deep/web/catalog/search-ui')).toThrow(
      'Invalid project path'
    );
  });

  it("should throw if path doesn't end with a valid type", () => {
    expect(() => getProjectInfo('libs/web/catalog/search')).toThrow(
      'Invalid project path'
    );
  });
});

describe(hasFileMatching.name, () => {
  it('should return true if there is a file matching', async () => {
    const { rootPath } = await setUp();
    await mkdir(`${rootPath}/lib`);
    await writeFile(`${rootPath}/lib/demo.spec.ts`, '');
    expect(await hasFileMatching(`${rootPath}/**/*.spec.ts`)).toBe(true);
  });

  it('should return false if there is no file matching', async () => {
    const { rootPath } = await setUp();
    expect(await hasFileMatching(`${rootPath}/**/*.spec.ts`)).toBe(false);
  });

  async function setUp() {
    const rootPath = await mkdtemp(join(tmpdir(), 'fake-project'));
    return {
      rootPath,
    };
  }
});

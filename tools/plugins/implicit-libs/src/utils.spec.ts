import { mkdir, mkdtemp, writeFile } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { getProjectInfo, hasFileMatching, hasIndexInParentTree } from './utils';
import { logger } from '@nx/devkit';

describe(hasIndexInParentTree.name, () => {
  it('should return true if direct parent folder has index.ts', async () => {
    const { rootPath } = await setUp();
    await writeFile(`${rootPath}/libs/web/catalog/index.ts`, '');

    expect(
      await hasIndexInParentTree(`${rootPath}/libs/web/catalog/search-ui`)
    ).toBe(true);
  });

  it('should return true if grand parent folder has index.ts', async () => {
    const { rootPath } = await setUp();
    await writeFile(`${rootPath}/libs/web/index.ts`, '');

    expect(
      await hasIndexInParentTree(`${rootPath}/libs/web/catalog/search-ui`)
    ).toBe(true);
  });

  it('should return false if no parent folder has an index.ts', async () => {
    const { rootPath } = await setUp();
    expect(
      await hasIndexInParentTree(`${rootPath}/libs/web/catalog/search-ui`)
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

  it('should compute name even if it contains dashes', () => {
    expect(getProjectInfo('libs/web/catalog/my-lib-ui')).toEqual({
      platform: 'web',
      scope: 'catalog',
      name: 'my-lib',
      type: 'ui',
    });
  });

  it.each(['libs/my-lib', `libs/web/my-lib`])(
    'should return undefined if lib is too shallow: %s',
    (libPath) => {
      setUp();
      expect(getProjectInfo(libPath)).toBeUndefined();
      expect(logger.warn).toBeCalledWith(
        expect.stringContaining('Invalid project path')
      );
    }
  );

  it('should return undefined if lib is too deep', () => {
    setUp();
    expect(
      getProjectInfo('libs/too-deep/web/catalog/search-ui')
    ).toBeUndefined();
    expect(logger.warn).toBeCalledWith(
      expect.stringContaining('Invalid project path')
    );
  });

  it("should return undefined if lib doesn't end with a valid type", () => {
    setUp();
    expect(getProjectInfo('libs/web/catalog/search')).toBeUndefined();
    expect(logger.warn).toBeCalledWith(
      expect.stringContaining(
        'Invalid project path libs/web/catalog/search. Last folder should be one of the allowed types:'
      )
    );
  });

  function setUp() {
    vi.spyOn(logger, 'warn').mockReturnValue(undefined);
  }
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

afterEach(() => {
  vi.restoreAllMocks();
});

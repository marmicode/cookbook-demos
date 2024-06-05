import { stat } from 'node:fs/promises';
import { dirname, join } from 'node:path';
import { globIterate } from 'glob';

/**
 * Checks if there are `index.ts` files in parent folders.
 * This is useful to exclude folders with `index.ts` which are inside other libs.
 */
export async function hasIndexInParentTree(
  indexPath: string
): Promise<boolean> {
  let folderPath = dirname(indexPath);
  let previousFolderPath: string;

  do {
    previousFolderPath = folderPath;
    folderPath = dirname(folderPath);
    try {
      await stat(join(folderPath, 'index.ts'));
      return true;
    } catch (error) {
      if (error.code === 'ENOENT') {
        continue;
      }
      throw error;
    }
  } while (folderPath !== previousFolderPath);

  return false;
}

export function getProjectInfo(projectPath: string): {
  libs: string;
  platform: string;
  scope: string;
  type: string;
  name?: string;
} {
  const parts = projectPath.split('/');

  if (parts.length !== 4) {
    throw new Error(`Invalid project path ${projectPath}`);
  }
  const [libs, platform, scope, nameAndType] = parts;
  const nameAndTypeParts = nameAndType.split('-');
  const type = nameAndTypeParts.at(-1);
  const name = nameAndTypeParts.length > 1 ? nameAndTypeParts[0] : undefined;

  if (!allowedLibraryTypes.includes(type)) {
    throw new Error(
      `Invalid project path ${projectPath}. Last folder should be one of the allowed types: ${allowedLibraryTypes}`
    );
  }

  return {
    libs,
    name,
    platform,
    scope,
    type,
  };
}

const allowedLibraryTypes = [
  'domain',
  'feature',
  'infra',
  'model',
  'ui',
  'utils',
];

export async function hasFileMatching(globPattern: string): Promise<boolean> {
  const { done } = await globIterate(globPattern).next();
  return !done;
}

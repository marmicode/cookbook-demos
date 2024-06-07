import { stat } from 'node:fs/promises';
import { dirname, join } from 'node:path';
import { globIterate } from 'glob';

/**
 * Checks if there are `index.ts` files in parent folders.
 * This is useful to exclude folders with `index.ts` which are inside other libs.
 */
export async function hasIndexInParentTree(
  folderPath: string
): Promise<boolean> {
  let previousFolderPath: string;

  do {
    previousFolderPath = folderPath;
    folderPath = dirname(folderPath);
    try {
      await stat(join(folderPath, 'index.ts'));
      return true;
    } catch (error) {
      if (
        error instanceof Error &&
        'code' in error &&
        error.code === 'ENOENT'
      ) {
        continue;
      }
      throw error;
    }
  } while (folderPath !== previousFolderPath);

  return false;
}

export function getProjectInfo(projectPath: string): {
  platform: string;
  scope: string;
  type: string;
  name?: string;
} {
  const parts = projectPath.split('/');

  if (parts.length !== 4) {
    throw new Error(`Invalid project path ${projectPath}`);
  }
  const [platform, scope, nameAndType] = parts.slice(-3);
  const nameAndTypeParts = nameAndType.split('-');
  const type = nameAndTypeParts.at(-1);
  const name = nameAndTypeParts.length > 1 ? nameAndTypeParts[0] : undefined;

  if (!allowedLibraryTypes.includes(type)) {
    throw new Error(
      `Invalid project path ${projectPath}. Last folder should be one of the allowed types: ${allowedLibraryTypes}`
    );
  }

  return {
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

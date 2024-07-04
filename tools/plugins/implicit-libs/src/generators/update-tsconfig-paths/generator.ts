import {
  createProjectGraphAsync,
  formatFiles,
  readJson,
  Tree,
  writeJson,
} from '@nx/devkit';
import { join } from 'node:path/posix';

export async function updateTsconfigPathsGenerator(
  tree: Tree,
  { graph }: { graph?: Graph } = {}
) {
  graph = graph ?? new GraphImpl();

  const projectNodes = await graph.getNodes();
  const libraries = projectNodes.filter(({ type }) => type === 'lib');
  const npmScope = readJson(tree, 'package.json').name.split('/')[0];
  const paths = libraries.reduce((acc, library) => {
    return {
      ...acc,
      [`${npmScope}/${library.name}`]: [
        join('.', library.projectRoot, 'index.ts'),
      ],
    };
  }, {} as Record<string, string[]>);

  const tsconfigBasePath = 'tsconfig.base.json';
  const tsconfigBase = readJson(tree, tsconfigBasePath);
  const updatedTsconfigBase = {
    ...tsconfigBase,
    compilerOptions: {
      ...tsconfigBase.compilerOptions,
      paths: {
        ...tsconfigBase.compilerOptions.paths,
        ...paths,
      },
    },
  };
  writeJson(tree, tsconfigBasePath, updatedTsconfigBase);

  await formatFiles(tree);
}

export interface Graph {
  getNodes(): Promise<GraphNode[]>;
}

export interface GraphNode {
  name: string;
  projectRoot: string;
  type: 'app' | 'lib' | 'e2e';
}

class GraphImpl implements Graph {
  async getNodes(): Promise<GraphNode[]> {
    const projectGraph = await createProjectGraphAsync();
    return Object.values(projectGraph.nodes).map((node) => ({
      name: node.name,
      type: node.type,
      projectRoot: node.data.root,
    }));
  }
}

export default updateTsconfigPathsGenerator;

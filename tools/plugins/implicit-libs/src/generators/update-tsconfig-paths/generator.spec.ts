import { createTreeWithEmptyWorkspace } from '@nx/devkit/testing';

import { Graph, GraphNode, updateTsconfigPathsGenerator } from './generator';

describe(updateTsconfigPathsGenerator.name, () => {
  it('should add new libraries to tsconfig.base.json', async () => {
    const { graphFake, readJsonFile, writeJsonFile, runGenerator } = setUp();

    writeJsonFile('tsconfig.base.json', {
      compilerOptions: {
        paths: {
          '@marmicode/web-cart-ui': ['libs/web/cart/ui/index.ts'],
        },
      },
    });

    graphFake.addNode({
      name: 'web-cart-ui',
      projectRoot: 'libs/web/cart/ui',
      type: 'lib',
    });

    graphFake.addNode({
      name: 'web-catalog-ui',
      projectRoot: 'libs/web/catalog/ui',
      type: 'lib',
    });

    await runGenerator();

    const paths = readJsonFile('tsconfig.base.json').compilerOptions.paths;
    expect(paths).toEqual({
      '@marmicode/web-cart-ui': ['libs/web/cart/ui/index.ts'],
      '@marmicode/web-catalog-ui': ['libs/web/catalog/ui/index.ts'],
    });
  });

  it('should override existing paths', async () => {
    const { graphFake, readJsonFile, writeJsonFile, runGenerator } = setUp();

    writeJsonFile('tsconfig.base.json', {
      compilerOptions: {
        paths: {
          '@marmicode/web-cart-ui': ['libs/web/cart/ui/index.ts'],
        },
      },
    });

    graphFake.addNode({
      name: 'web-cart-ui',
      projectRoot: 'libs/web/new-cart/ui',
      type: 'lib',
    });

    await runGenerator();

    const paths = readJsonFile('tsconfig.base.json').compilerOptions.paths;
    expect(paths).toEqual({
      '@marmicode/web-cart-ui': ['libs/web/new-cart/ui/index.ts'],
    });
  });
});

function setUp() {
  const tree = createTreeWithEmptyWorkspace();

  function readJsonFile(filePath: string) {
    const content = tree.read(filePath, 'utf-8');
    if (content == null) {
      throw new Error(`File not found: ${filePath}`);
    }
    return JSON.parse(content);
  }

  function writeJsonFile(filePath: string, content: unknown) {
    tree.write(filePath, JSON.stringify(content));
  }

  writeJsonFile('package.json', {
    name: '@marmicode/root',
  });

  const graphFake = new GraphFake();
  return {
    graphFake,
    async runGenerator() {
      await updateTsconfigPathsGenerator(tree, { graph: graphFake });
    },
    readJsonFile,
    writeJsonFile,
  };
}

class GraphFake implements Graph {
  #nodes: GraphNode[] = [];

  addNode(node: GraphNode) {
    this.#nodes.push(node);
  }

  async getNodes() {
    return this.#nodes;
  }
}

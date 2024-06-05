# Implicit Libraries Demo

This workspace is a demonstration of how to implement Nx [Implicit Libraries](https://cookbook.marmicode.io/nx/implicit-libraries).

## Try it out

```sh
bun install
nx run-many -t lint,test # to run lint and test on all implicit libraries
```

## Create a new implicit library

```sh
mkdir -p libs/web/catalog/search-feature
touch libs/web/catalog/search-feature/index.ts
```

When running `nx run-many -t lint,test` again you should see that the new implicit library is linted too _(but not tested because it doesn't have any tests yet)_.

## How it works

- [Implicit Libraries | Marmicode Coockbook](https://cookbook.marmicode.io/nx/implicit-libraries)
- 👉 [tools/plugins/implicit-libs/src/index.ts](tools/plugins/implicit-libs/src/index.ts)

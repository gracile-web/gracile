# Change Log

## 0.0.1-next.3

### Patch Changes

- [`4e9e3d6`](https://github.com/gracile-web/gracile/commit/4e9e3d69831926af54ef6b8416a6367ba579f1f3) -
  Fix path resolution for Iconify JSON

  Iconify wasn't surviving publishing (worked linked only)

  \+ Added `.js` to lodash-es/set imports (Vite was hiding the break locally?)

## 0.0.1-next.2

### Patch Changes

- [`b1f3072`](https://github.com/gracile-web/gracile/commit/b1f307202f4f8b315a4dca3e77e6ff0eda39bdbd) -
  Republish/reversion everything after Lerna > Changesets migration

  Also remove all publishConfigs (not needed anymore with TP workflow)

- Updated dependencies
  [[`b1f3072`](https://github.com/gracile-web/gracile/commit/b1f307202f4f8b315a4dca3e77e6ff0eda39bdbd)]:
  - @literals/rollup-plugin-html-css-minifier@4.0.3-next.2
  - vite-plugin-standard-css-modules@0.3.1-next.2
  - @gracile/markdown-preset-marked@0.2.4-next.2
  - og-images-generator@0.6.3-next.2
  - @gracile-labs/client-router@0.4.2-next.2
  - @gracile/markdown@0.6.4-next.2
  - @gracile/metadata@0.3.6-next.2
  - @gracile/sitemap@0.5.4-next.2
  - @gracile/internal-utils@0.8.1-next.2
  - @gracile/svg@0.4.4-next.2
  - @gracile/gracile@0.11.1-next.2
  - @gracile/client@0.5.8-next.2
  - @gracile/engine@0.12.1-next.2
  - @gracile/server@0.7.8-next.2

## 0.0.1-next.1

### Patch Changes

- [`86c4029`](https://github.com/gracile-web/gracile/commit/86c40292e73740f7bfdc01dff48c84197ca560f3) -
  Initialize decoupled, reusable docs shell

  Gracile docs is not anymore just for the Gracile web toolkit. It's gonna be
  used with the Web Elements Analyzer docs.

All notable changes to this project will be documented in this file. See
[Conventional Commits](https://conventionalcommits.org) for commit guidelines.

## [0.12.5-next.1](https://github.com/gracile-web/gracile/compare/@gracile/docs@0.12.5-next.0...@gracile/docs@0.12.5-next.1) (2026-05-16)

**Note:** Version bump only for package @gracile/docs

## [0.12.5-next.0](https://github.com/gracile-web/gracile/compare/@gracile/docs@0.12.4...@gracile/docs@0.12.5-next.0) (2026-05-12)

**Note:** Version bump only for package @gracile/docs

## [0.12.4](https://github.com/gracile-web/gracile/compare/@gracile/docs@0.12.4-next.2...@gracile/docs@0.12.4) (2026-05-09)

**Note:** Version bump only for package @gracile/docs

## [0.12.4-next.2](https://github.com/gracile-web/gracile/compare/@gracile/docs@0.12.4-next.1...@gracile/docs@0.12.4-next.2) (2026-05-09)

**Note:** Version bump only for package @gracile/docs

## [0.12.4-next.1](https://github.com/gracile-web/gracile/compare/@gracile/docs@0.12.4-next.0...@gracile/docs@0.12.4-next.1) (2026-05-09)

**Note:** Version bump only for package @gracile/docs

## [0.12.4-next.0](https://github.com/gracile-web/gracile/compare/@gracile/docs@0.12.3...@gracile/docs@0.12.4-next.0) (2026-04-12)

**Note:** Version bump only for package @gracile/docs

## [0.12.3](https://github.com/gracile-web/gracile/compare/@gracile/docs@0.12.3-next.1...@gracile/docs@0.12.3) (2026-04-04)

**Note:** Version bump only for package @gracile/docs

## [0.12.3-next.1](https://github.com/gracile-web/gracile/compare/@gracile/docs@0.12.3-next.0...@gracile/docs@0.12.3-next.1) (2026-04-04)

### Bug Fixes

- unused import, old esbuild flag
  ([9cf2893](https://github.com/gracile-web/gracile/commit/9cf28935322988bdb558e19d3a380ac0e0aa5182))

## [0.12.3-next.0](https://github.com/gracile-web/gracile/compare/@gracile/docs@0.12.2...@gracile/docs@0.12.3-next.0) (2026-04-04)

### Bug Fixes

- remove url pattern polyfill
  ([94d1130](https://github.com/gracile-web/gracile/commit/94d1130df8d56db56c20248c65a88a9da7f4c08f))
- rollup chunk hack isn't needed anymore
  ([6fda2e0](https://github.com/gracile-web/gracile/commit/6fda2e043ebc289910b6433e75dc78242e4f360f))

## [0.12.2](https://github.com/gracile-web/gracile/compare/@gracile/docs@0.12.1...@gracile/docs@0.12.2) (2026-03-29)

**Note:** Version bump only for package @gracile/docs

## [0.12.1](https://github.com/gracile-web/gracile/compare/@gracile/docs@0.12.1-next.1...@gracile/docs@0.12.1) (2026-03-29)

**Note:** Version bump only for package @gracile/docs

## [0.12.1-next.1](https://github.com/gracile-web/gracile/compare/@gracile/docs@0.12.1-next.0...@gracile/docs@0.12.1-next.1) (2026-03-29)

**Note:** Version bump only for package @gracile/docs

## [0.12.1-next.0](https://github.com/gracile-web/gracile/compare/@gracile/docs@0.12.0...@gracile/docs@0.12.1-next.0) (2026-03-29)

**Note:** Version bump only for package @gracile/docs

# [0.12.0](https://github.com/gracile-web/gracile/compare/@gracile/docs@0.12.0-next.3...@gracile/docs@0.12.0) (2026-03-23)

**Note:** Version bump only for package @gracile/docs

# [0.12.0-next.3](https://github.com/gracile-web/gracile/compare/@gracile/docs@0.12.0-next.2...@gracile/docs@0.12.0-next.3) (2026-03-23)

### Bug Fixes

- oxc/esbuild settings, temp hack for broken hydration (rolldown different
  chunking)
  ([df4b018](https://github.com/gracile-web/gracile/commit/df4b0183167e2863c7793d8b2f830035a75aec76))

# [0.12.0-next.2](https://github.com/gracile-web/gracile/compare/@gracile/docs@0.12.0-next.1...@gracile/docs@0.12.0-next.2) (2026-03-23)

**Note:** Version bump only for package @gracile/docs

# [0.12.0-next.1](https://github.com/gracile-web/gracile/compare/@gracile/docs@0.12.0-next.0...@gracile/docs@0.12.0-next.1) (2026-03-22)

**Note:** Version bump only for package @gracile/docs

# [0.12.0-next.0](https://github.com/gracile-web/gracile/compare/@gracile/docs@0.11.0...@gracile/docs@0.12.0-next.0) (2026-03-22)

### Features

- rehaul import attributes handling strategy entirely
  ([806c355](https://github.com/gracile-web/gracile/commit/806c355eddab7160010101a65acba317ed9c91d5))

# [0.11.0](https://github.com/gracile-web/gracile/compare/@gracile/docs@0.11.0-next.0...@gracile/docs@0.11.0) (2026-03-22)

**Note:** Version bump only for package @gracile/docs

# [0.11.0-next.0](https://github.com/gracile-web/gracile/compare/@gracile/docs@0.10.1...@gracile/docs@0.11.0-next.0) (2026-03-22)

### Features

- prepare vite 8 migration - pre minor bug fixes
  ([a9bb25f](https://github.com/gracile-web/gracile/commit/a9bb25fb55dd9fe11fff874acf9d10e64d99617a))

## [0.10.1](https://github.com/gracile-web/gracile/compare/@gracile/docs@0.10.1-next.0...@gracile/docs@0.10.1) (2026-03-22)

**Note:** Version bump only for package @gracile/docs

## [0.10.1-next.0](https://github.com/gracile-web/gracile/compare/@gracile/docs@0.10.0-next.6...@gracile/docs@0.10.1-next.0) (2026-03-22)

**Note:** Version bump only for package @gracile/docs

# [0.10.0](https://github.com/gracile-web/gracile/compare/@gracile/docs@0.10.0-next.6...@gracile/docs@0.10.0) (2026-03-22)

**Note:** Version bump only for package @gracile/docs

# [0.10.0-next.6](https://github.com/gracile-web/gracile/compare/@gracile/docs@0.10.0-next.5...@gracile/docs@0.10.0-next.6) (2026-03-22)

**Note:** Version bump only for package @gracile/docs

# [0.10.0-next.5](https://github.com/gracile-web/gracile/compare/@gracile/docs@0.10.0-next.4...@gracile/docs@0.10.0-next.5) (2026-03-21)

**Note:** Version bump only for package @gracile/docs

# [0.10.0-next.4](https://github.com/gracile-web/gracile/compare/@gracile/docs@0.10.0-next.3...@gracile/docs@0.10.0-next.4) (2026-03-21)

**Note:** Version bump only for package @gracile/docs

# [0.10.0-next.3](https://github.com/gracile-web/gracile/compare/@gracile/docs@0.10.0-next.2...@gracile/docs@0.10.0-next.3) (2026-03-21)

### Features

- group jsx packages, minor fixes
  ([1718a61](https://github.com/gracile-web/gracile/commit/1718a61c32b05bf5151b92a9ecc72763b0d4ea04))

# [0.10.0-next.2](https://github.com/gracile-web/gracile/compare/@gracile/docs@0.10.0-next.1...@gracile/docs@0.10.0-next.2) (2026-03-21)

**Note:** Version bump only for package @gracile/docs

# [0.10.0-next.1](https://github.com/gracile-web/gracile/compare/@gracile/docs@0.10.0-next.0...@gracile/docs@0.10.0-next.1) (2026-03-21)

### Bug Fixes

- cve - h3, use main lodash-es + publish og generator, clean deps
  ([31138f0](https://github.com/gracile-web/gracile/commit/31138f07f53916dfb3b3cf3899d9719b00a108a0))
- dynamic tag support for html minifier
  ([313cc5f](https://github.com/gracile-web/gracile/commit/313cc5f00e4ea8a2d18d8db9a0079ad031c9524e))
- prevent plugin duplication, convert to typescript, enable tests
  ([dd85864](https://github.com/gracile-web/gracile/commit/dd85864e351854284013b3a797a9aedc0278fc2e))
- unpic element incorrect attribute bindings, migrate sass old syntaxes
  ([6552da1](https://github.com/gracile-web/gracile/commit/6552da1cfb8499c13fa9818e74926f087b91b104))

# 0.10.0-next.0 (2026-03-18)

### Bug Fixes

- client side scripts (broke after removing CSR)
  ([42ef39a](https://github.com/gracile-web/gracile/commit/42ef39a206e47c8ed98196eca27445faafa37d27))
- lint/format with monorepo rules (docs)
  ([63757c1](https://github.com/gracile-web/gracile/commit/63757c16e0a38c144954d82106862edf76b38580))
- more lint, more `catalog:`
  ([e27f9a7](https://github.com/gracile-web/gracile/commit/e27f9a7f36577288e8b96ef53d1e6cec9c182c02))
- ventilate all integration tests in each package
  ([a7390b5](https://github.com/gracile-web/gracile/commit/a7390b5870cf0b73da674ddb951157d6050d85c3))

### Features

- add docs version to footer
  ([c7d824c](https://github.com/gracile-web/gracile/commit/c7d824c11a19e0c52c9fd55a596e3f7d2faf26bd))
- integrate external main docs website repository (code)
  ([d6a52d9](https://github.com/gracile-web/gracile/commit/d6a52d93f44f8e449d997f92ef60e45f2c0da178))
- integrate external main docs website repository (content)
  ([3f6f847](https://github.com/gracile-web/gracile/commit/3f6f847f87be6b50786abd5638f2bbd1de7d1dfb))
- more readmes (new packages)
  ([f90c03b](https://github.com/gracile-web/gracile/commit/f90c03bf0b0d69ebd3a8ea95a03083d5a2312ed1))
- readmes from package collection, format content
  ([6395cf5](https://github.com/gracile-web/gracile/commit/6395cf509e4fee969e2273d66b6e7d1d2af1cd07))

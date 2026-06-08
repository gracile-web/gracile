# Change Log

## 0.5.0-next.3

### Patch Changes

- [`b1f3072`](https://github.com/gracile-web/gracile/commit/b1f307202f4f8b315a4dca3e77e6ff0eda39bdbd) -
  Republish/reversion everything after Lerna > Changesets migration

  Also remove all publishConfigs (not needed anymore with TP workflow)

## 0.5.0-next.2

### Minor Changes

- [`f687199`](https://github.com/gracile-web/gracile/commit/f6871990e9a4f94305ff27e343fd41d1a3fbe2c6) -
  Update JSX bootstrap types expansions (WEA)

  Now reflects CSS Custom Properties as a `style:map` facet.

  ```tsx
  <my-mighty-element
    style:map={{
      '--text-colour': 'cyan',
      // 🫥 Oh no, this CSS custom property is mispelled.
      '--text-color': 'tomato',
    }}
  />;

  /**
   * @cssProp --text-colour - Sober or crazy.
   * ...
   */
  export class MyMightyElement extends HTMLElement {
    // ...
  }
  ```

  For when JSX Forge namespace is used in conjunction with WEA automatic
  namespaces augmentation.

All notable changes to this project will be documented in this file. See
[Conventional Commits](https://conventionalcommits.org) for commit guidelines.

## [0.4.1-next.1](https://github.com/gracile-web/gracile/compare/jsx-forge@0.4.1-next.0...jsx-forge@0.4.1-next.1) (2026-05-16)

### Bug Fixes

- re export return types (annotation issues), revert jsx-forge getText hacks
  ([efa3288](https://github.com/gracile-web/gracile/commit/efa32881d9c8a38c2aada9bdfebc7537e2170a01))

## [0.4.1-next.0](https://github.com/gracile-web/gracile/compare/jsx-forge@0.4.0...jsx-forge@0.4.1-next.0) (2026-05-12)

### Bug Fixes

- ts `getText` "Node must have a real position", syntactic workarounds
  ([7af9875](https://github.com/gracile-web/gracile/commit/7af98752d005fceddfebeb75173193bf48b8074f))

## [0.4.0](https://github.com/gracile-web/gracile/compare/jsx-forge@0.4.0-next.1...jsx-forge@0.4.0) (2026-05-09)

**Note:** Version bump only for package jsx-forge

## [0.4.0-next.1](https://github.com/gracile-web/gracile/compare/jsx-forge@0.4.0-next.0...jsx-forge@0.4.0-next.1) (2026-05-09)

### Features

- enhance "to jsx"/"to literals" transformers, fix jsx namespace
  ([6066507](https://github.com/gracile-web/gracile/commit/6066507676557c440582f82bcd05ed50c74c3544))

## [0.4.0-next.0](https://github.com/gracile-web/gracile/compare/jsx-forge@0.3.0...jsx-forge@0.4.0-next.0) (2026-04-12)

### Features

- better anti collision for `html`, optional type awareness
  ([0c1ae3f](https://github.com/gracile-web/gracile/commit/0c1ae3fdd8e37661ef6e57f63fe660c92cf63e16))

## [0.3.0](https://github.com/gracile-web/gracile/compare/jsx-forge@0.3.0-next.0...jsx-forge@0.3.0) (2026-04-04)

**Note:** Version bump only for package jsx-forge

## [0.3.0-next.0](https://github.com/gracile-web/gracile/compare/jsx-forge@0.2.0...jsx-forge@0.3.0-next.0) (2026-04-04)

### Features

- "idiomatic" (expected, convenient) jsx text whitespace trimming
  ([4e9d2b3](https://github.com/gracile-web/gracile/commit/4e9d2b37844c87c0affa43033ec2f148e73a0079))
- rehaul jsx handling in vite, no rollup ts plugin + ts patch anymore
  ([eda2dd2](https://github.com/gracile-web/gracile/commit/eda2dd2a8bd7adad48a589a6c5d5410ebf446457))

### Bug Fixes

- treat vendored wea intrinsics as source
  ([e091e8a](https://github.com/gracile-web/gracile/commit/e091e8adf4665cfd73da59bbcc9189e241b8d43a))

# [0.2.0](https://github.com/gracile-web/gracile/compare/jsx-forge@0.2.0-next.0...jsx-forge@0.2.0) (2026-03-23)

**Note:** Version bump only for package jsx-forge

# [0.2.0-next.0](https://github.com/gracile-web/gracile/compare/jsx-forge@0.1.3-next.0...jsx-forge@0.2.0-next.0) (2026-03-23)

### Features

- migrate to typescript 6 + monorepo wide shared settings for new packages
  ([40c1743](https://github.com/gracile-web/gracile/commit/40c1743287fb68cb13de50ac8131b347fe6b6ba1))

## [0.1.3-next.0](https://github.com/gracile-web/gracile/compare/jsx-forge@0.1.2...jsx-forge@0.1.3-next.0) (2026-03-22)

**Note:** Version bump only for package jsx-forge

## [0.1.2](https://github.com/gracile-web/gracile/compare/jsx-forge@0.1.2-next.0...jsx-forge@0.1.2) (2026-03-22)

**Note:** Version bump only for package jsx-forge

## [0.1.2-next.0](https://github.com/gracile-web/gracile/compare/jsx-forge@0.1.1...jsx-forge@0.1.2-next.0) (2026-03-22)

**Note:** Version bump only for package jsx-forge

## [0.1.1](https://github.com/gracile-web/gracile/compare/jsx-forge@0.1.1-next.0...jsx-forge@0.1.1) (2026-03-22)

**Note:** Version bump only for package jsx-forge

## [0.1.1-next.0](https://github.com/gracile-web/gracile/compare/jsx-forge@0.1.0-next.4...jsx-forge@0.1.1-next.0) (2026-03-22)

**Note:** Version bump only for package jsx-forge

# [0.1.0](https://github.com/gracile-web/gracile/compare/jsx-forge@0.1.0-next.4...jsx-forge@0.1.0) (2026-03-22)

**Note:** Version bump only for package jsx-forge

# [0.1.0-next.4](https://github.com/gracile-web/gracile/compare/jsx-forge@0.1.0-next.3...jsx-forge@0.1.0-next.4) (2026-03-22)

**Note:** Version bump only for package jsx-forge

# [0.1.0-next.3](https://github.com/gracile-web/gracile/compare/jsx-forge@0.1.0-next.2...jsx-forge@0.1.0-next.3) (2026-03-21)

### Features

- group jsx packages, minor fixes
  ([1718a61](https://github.com/gracile-web/gracile/commit/1718a61c32b05bf5151b92a9ecc72763b0d4ea04))

# [0.1.0-next.2](https://github.com/gracile-web/gracile/compare/jsx-forge@0.1.0-next.1...jsx-forge@0.1.0-next.2) (2026-03-21)

**Note:** Version bump only for package jsx-forge

# [0.1.0-next.1](https://github.com/gracile-web/gracile/compare/jsx-forge@0.1.0-next.0...jsx-forge@0.1.0-next.1) (2026-03-21)

**Note:** Version bump only for package jsx-forge

# 0.1.0-next.0 (2026-03-18)

### Bug Fixes

- lint/format with monorepo rules
  ([0784f7a](https://github.com/gracile-web/gracile/commit/0784f7a64132e19c74e503deb8194598142c7081))
- more lint, more `catalog:`
  ([e27f9a7](https://github.com/gracile-web/gracile/commit/e27f9a7f36577288e8b96ef53d1e6cec9c182c02))
- ventilate all integration tests in each package
  ([a7390b5](https://github.com/gracile-web/gracile/commit/a7390b5870cf0b73da674ddb951157d6050d85c3))

### Features

- incorporate external gracile packages
  ([d97e488](https://github.com/gracile-web/gracile/commit/d97e488bf5c75d7aefbd0c8956212142e80719a1))
- more readmes (new packages)
  ([f90c03b](https://github.com/gracile-web/gracile/commit/f90c03bf0b0d69ebd3a8ea95a03083d5a2312ed1))

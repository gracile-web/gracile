# JavaScript Literals tools

```sh
npm i @literals/parser
npm i @literals/html-css-minifier
npm i @literals/rollup-plugin-html-css-minifier
```

Non-exhaustive list of what has been done from the initial repos (3 projects):

- Migrate everything to ESM
- Migrate to `html-minifier-terser` (using Terser) versus `html-minifier` (using
  Uglify)
- Upgrade nearly all dependencies
- Update tests for ESM compatibility
- Migrate to a PNPM-managed mono repo by merging the three forked repos
  histories
- Centralize most tooling to root (lint-staged, husky, prettier…)
- Remove old/broken tools (ts-node CJS setup, mocha, nyc, jasmine, coveralls,
  travis…)
- Set up modern test tooling (`node:test` with bare `tsc`, c8…)
- Setup a CI/CD with Lerna-lite backed releases
- Pin problematic dependencies before a full upgrade
- Add demos
- Security: added NPM package provenance and PNPM signatures audit in CI

While keeping all tests greens (no release if CI is unhappy).

Seeking:

- Replace CleanCSS with a more modern solution? `lightningcss` is not
  configurable enough, though.
- Add more complex tests for evaluating hydration mismatches for server+client
  custom elements (Lit)

Blockings deps (typings or runtime issues when upgrading):

- MagicString
- CleanCSS
- Sinon

---

All packages follow semantic versioning.

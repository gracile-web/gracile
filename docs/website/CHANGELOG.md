# @gracile/docs

## 0.12.5-next.3

### Patch Changes

- [`913bce2`](https://github.com/gracile-web/gracile/commit/913bce2332305819e4f5be6d986972843d90e09d) -
  Fix path resolution for Iconify JSON

  Iconify wasn't surviving publishing (worked linked only)

  \+ Added `.js` to lodash-es/set imports (Vite was hiding the break locally?)

## 0.12.5-next.2

### Patch Changes

- [`b1f3072`](https://github.com/gracile-web/gracile/commit/b1f307202f4f8b315a4dca3e77e6ff0eda39bdbd) -
  Republish/reversion everything after Lerna > Changesets migration

  Also remove all publishConfigs (not needed anymore with TP workflow)

- Updated dependencies
  [[`b1f3072`](https://github.com/gracile-web/gracile/commit/b1f307202f4f8b315a4dca3e77e6ff0eda39bdbd)]:
  - og-images-generator@0.6.3-next.2
  - @gracile-labs/docs@0.0.1-next.2
  - @gracile/gracile@0.11.1-next.2

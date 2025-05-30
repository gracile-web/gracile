# pnpm tsx --test -C test src/addons/client-router.test.ts

# set -e

pnpm tsx --test -C test src/routes-premises.test.ts

pnpm tsx --test -C test src/addons/metadata.test.ts
pnpm tsx --test -C test src/addons/markdown.test.ts
pnpm tsx --test -C test src/addons/svg.test.ts
pnpm tsx --test -C test src/routes.test.ts
pnpm tsx --test -C test src/assets.test.ts
pnpm tsx --test -C test src/routes-torture.test.ts
pnpm tsx --test -C test src/server-express/dev-all-around.test.ts

pnpm tsx --test -C test src/server-express/01-build.test.ts
pnpm tsx --test -C test src/server-express/02-runs-after-build-express.test.ts
pnpm tsx --test -C test src/server-express/03-runs-after-build-hono.test.ts

pnpm tsx --test -C test src/exports.test.ts
pnpm tsx --test -C test src/exports-addons.test.ts
pnpm tsx --test -C test src/custom-elements.test.ts
pnpm tsx --test -C test src/template-failure.test.ts

pnpm tsx --test -C test src/build-mode/project-core.test.ts

pnpm tsx --test -C test --test-concurrency=1,1 \
  src/addons/markdown.test.ts \
  src/addons/metadata.test.ts \
  src/addons/svg.test.ts \
  src/assets.test.ts \
  src/build-mode/project-core.test.ts \
  src/custom-elements.test.ts \
  src/exports.test.ts \
  src/polyfills.test.ts \
  src/routes-torture.test.ts \
  src/routes.test.ts \
  src/server-express/01-build.test.ts \
  src/server-express/02-runs-after-build.test.ts \
  src/server-express/dev-all-around.test.ts

pnpm tsx --test -C test src/addons/markdown.test.ts \
  src/server-express/build.test.ts \
  src/polyfills.test.ts

pnpm tsx --test -C test \
  src/addons/markdown.test.ts \
  src/addons/svg.test.ts \
  src/routes.test.ts \
  src/addons/metadata.test.ts \
  src/assets.test.ts \
  src/custom-elements.test.ts \
  src/routes-torture.test.ts \
  src/server-express/dev-all-around.test.ts \
  src/build-mode/project-core.test.ts \
  src/server-express/build.test.ts \
  src/polyfills.test.ts

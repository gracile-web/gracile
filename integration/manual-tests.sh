pnpm tsx --test src/addons/metadata.test.ts
pnpm tsx --test src/addons/markdown.test.ts
pnpm tsx --test src/addons/svg.test.ts
pnpm tsx --test src/routes.test.ts
pnpm tsx --test src/assets.test.ts
pnpm tsx --test src/routes-torture.test.ts
pnpm tsx --test src/server-express/dev-all-around.test.ts
pnpm tsx --test src/server-express/01-build.test.ts
pnpm tsx --test src/server-express/02-runs-after-build.test.ts
pnpm tsx --test src/custom-elements.test.ts
pnpm tsx --test --test-concurrency=1 src/polyfills.test.ts # aa

pnpm tsx --test --test-concurrency=1,1 \
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

pnpm tsx --test src/addons/markdown.test.ts \
	src/server-express/build.test.ts \
	src/polyfills.test.ts

pnpm tsx --test \
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

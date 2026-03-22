/**
 * Maps each package's README.md (canonical source, published to npm) to its
 * corresponding destination inside the docs website content tree.
 *
 * Paths are relative to the monorepo root for `src` and relative to
 * docs/website/ for `dest`.
 *
 * The collect-readmes.ts script reads this manifest and copies files at
 * docs:generate time. The destination files are git-ignored — they are
 * generated artifacts, never committed.
 */
export const README_MAP: { src: string; dest: string }[] = [
	{
		src: 'packages/addons/sitemap',
		dest: 'src/content/docs/15-add-ons/30-sitemap/README.md',
	},
	{
		src: 'packages/addons/markdown',
		dest: 'src/content/docs/15-add-ons/20-markdown/README.md',
	},
	{
		src: 'packages/addons/metadata',
		dest: 'src/content/docs/15-add-ons/05-metadata/README.md',
	},
	{
		src: 'packages/addons/svg',
		dest: 'src/content/docs/15-add-ons/25-svg/README.md',
	},
	{
		src: 'packages/labs/client-router',
		dest: 'src/content/docs/15-add-ons/02-client-router/README.md',
	},
	{
		src: 'packages/labs/css-helpers',
		dest: 'src/content/docs/15-add-ons/03-css-helpers/README.md',
	},
	{
		src: 'packages/labs/islands',
		dest: 'src/content/docs/15-add-ons/35-islands/README.md',
	},

	{
		src: 'packages/labs/babel-plugin-jsx-to-literals',
		dest: 'src/content/docs/15-add-ons/56-jsx/45-babel-plugin-jsx-to-literals/README.md',
	},
	{
		src: 'packages/labs/vite-plugin-babel-jsx-to-literals',
		dest: 'src/content/docs/15-add-ons/56-jsx/50-vite-plugin-babel-jsx-to-literals/README.md',
	},
	{
		src: 'packages/labs/jsx-forge',
		dest: 'src/content/docs/15-add-ons/56-jsx/55-jsx-forge/README.md',
	},
	{
		src: 'packages/labs/vite-plugin-jsx-forge',
		dest: 'src/content/docs/15-add-ons/56-jsx/60-vite-plugin-jsx-forge/README.md',
	},
	{
		src: 'packages/labs/vite-plugin-standard-css-modules',
		dest: 'src/content/docs/15-add-ons/62-vite-plugin-standard-css-modules/README.md',
	},
	{
		src: 'packages/labs/hmr',
		dest: 'src/content/docs/15-add-ons/65-hmr/README.md',
	},
	{
		src: 'packages/labs/og-images-generator',
		dest: 'src/content/docs/15-add-ons/68-og-images-generator/README.md',
	},
	{
		src: 'packages/labs/functional',
		dest: 'src/content/docs/15-add-ons/70-functional/README.md',
	},
	// {
	// 	src: 'packages/labs/literals/html-css-minifier',
	// 	dest: 'src/content/docs/15-add-ons/75-literals-html-css-minifier/README.md',
	// },
	{
		src: 'starter-projects',
		dest: 'src/content/docs/04-starter-projects/README.md',
	},
];

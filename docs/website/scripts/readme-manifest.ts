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
		src: 'starter-projects',
		dest: 'src/content/docs/04-starter-projects/README.md',
	},
];

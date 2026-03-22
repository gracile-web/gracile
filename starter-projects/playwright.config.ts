import { defineConfig } from '@playwright/test';

/**
 * Each project name must match a directory under `templates/`.
 * The custom fixture in `_harness/template-server.ts` uses the project name
 * to locate the template root and start a Vite dev server on a free port.
 */
export default defineConfig({
	testDir: 'tests',
	testIgnore: ['_legacy/**', '_harness/**'],

	fullyParallel: true,

	forbidOnly: !!process.env['CI'],
	retries: process.env['CI'] ? 2 : 0,

	reporter: process.env['CI'] ? 'github' : 'list',

	use: {
		colorScheme: 'dark',
		trace: 'on-first-retry',
	},

	projects: [
		{ name: 'minimal-static', testMatch: 'minimal-static.spec.ts' },
		{
			name: 'minimal-server-express',
			testMatch: 'minimal-server-express.spec.ts',
		},
		{ name: 'minimal-server-hono', testMatch: 'minimal-server-hono.spec.ts' },
		{ name: 'basics', testMatch: 'basics.spec.ts' },
	],
});

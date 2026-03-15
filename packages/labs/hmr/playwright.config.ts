import path from 'node:path';

import { defineConfig } from '@playwright/test';
import { resolveFixtures } from '@gracile/internal-test-utils/fixtures';

const fixtureDir = path.join(resolveFixtures(), 'hmr-basic-lit');

export default defineConfig({
	testDir: 'test/integration',
	testMatch: '**/*.spec.ts',
	timeout: 30_000,
	retries: 1,
	use: {
		baseURL: 'http://localhost:5188',
	},
	webServer: {
		command: `npx vite --port 5188`,
		cwd: fixtureDir,
		port: 5188,
		reuseExistingServer: !process.env['CI'],
	},
	projects: [
		{
			name: 'chromium',
			use: { browserName: 'chromium' },
		},
	],
});

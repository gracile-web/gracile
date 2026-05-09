import path from 'node:path';

import { defineConfig } from '@playwright/test';
import { resolveFixtures } from '@gracile/internal-test-utils/fixtures';

const fixtureDir = path.join(resolveFixtures(), 'static-site-islands');

export default defineConfig({
	testDir: 'test/integration',
	testMatch: '**/*.spec.ts',
	timeout: 30_000,
	retries: 1,
	use: {
		baseURL: 'http://localhost:5200',
	},
	webServer: {
		command: 'npx vite --port 5200',
		cwd: fixtureDir,
		port: 5200,
		reuseExistingServer: !process.env['CI'],
	},
	projects: [
		{
			name: 'chromium',
			use: { browserName: 'chromium' },
		},
	],
});

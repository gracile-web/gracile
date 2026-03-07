import path from 'node:path';
import { fileURLToPath } from 'node:url';

import { defineConfig } from '@playwright/test';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const fixtureDir = path.resolve(__dirname, '__fixtures__/basic-lit');

export default defineConfig({
	testDir: '.',
	testMatch: '**/*.test.js',
	timeout: 30_000,
	retries: 1,
	use: {
		baseURL: 'http://localhost:5188',
	},
	webServer: {
		command: `npx vite --port 5188`,
		cwd: fixtureDir,
		port: 5188,
		reuseExistingServer: !process.env.CI,
	},
	projects: [
		{
			name: 'chromium',
			use: { browserName: 'chromium' },
		},
	],
});

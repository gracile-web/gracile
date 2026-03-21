// NOTE: This works, we use this because the playwright one is not what want.
import { after, before } from 'node:test';

import { expect, test } from '@playwright/test';
import type { ViteDevServer } from 'vite';

// import { createViteTestServer } from './_suite/utils.js';

let server: ViteDevServer;

before(async () => {
	// server = await createViteTestServer(import.meta.url);
});

test('minimal-server screenshots', async ({ page }) => {
	await page.goto('http://localhost:3030');

	await expect(page).toHaveTitle('Gracile - Home');
	await expect(page).toHaveScreenshot({
		fullPage: true,
		maskColor: 'darkslategray',
		mask: [
			page.getByText(/http:\/\//),
			...(await page.getByRole('code').all()),
		],
	});

	await page.goto('http://localhost:3030/about/');
	await expect(page).toHaveTitle('Gracile - About');
	await expect(page).toHaveScreenshot({ fullPage: true });

	await page.goto('http://localhost:3030/api/');

	expect(await page.textContent('body')).toBe(
		'A GET! http://localhost:3030/api/',
	);

	after(() => server.close());

	await page.goto('http://localhost:3030/api/sub-route/');
	expect(await page.textContent('body')).toBe(
		'A GET! http://localhost:3030/api/sub-route/',
	);

	// Not working for build
	await page.goto('http://localhost:3030/NOT_FOUND/');
	await expect(page).toHaveTitle('Gracile - 404');
	await expect(page).toHaveScreenshot({
		fullPage: true,
		mask: [
			page.getByText('not found.'),
			...(await page.getByRole('code').all()),
		],
		maskColor: 'darkslategray',
	});
});

test('routing works', async ({ page }) => {
	await page.goto('http://localhost:3030');

	await page.getByText('About page').click();
});

// after(() => server.close());

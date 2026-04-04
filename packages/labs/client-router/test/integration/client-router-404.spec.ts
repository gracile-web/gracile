import fs from 'node:fs';
import path from 'node:path';

import { expect, test } from '@playwright/test';
import { resolveFixtures } from '@gracile/internal-test-utils/fixtures';

const GOTO_OPTIONS = { waitUntil: 'networkidle' as const };

const route404File = path.join(
	resolveFixtures(),
	'client-routing-basic/src/routes/404.ts',
);

function write404Route(content: string): void {
	fs.writeFileSync(route404File, content, 'utf8');
}

function remove404Route(): void {
	fs.unlinkSync(route404File);
}

let original404RouteContent: string;

test.beforeAll(() => {
	original404RouteContent = fs.readFileSync(route404File, 'utf8');
});

test.afterEach(() => {
	if (!fs.existsSync(route404File)) write404Route(original404RouteContent);
});

test.afterAll(() => {
	write404Route(original404RouteContent);
});

test.describe('Client Router — 404 Route', () => {
	test.describe.configure({ mode: 'serial' });

	test('loads 404 route directly for missing URL', async ({ page }) => {
		await page.goto('/missing-page/', GOTO_OPTIONS);

		await expect(page).toHaveTitle('404 Not Found');
		await expect(page.locator('h1')).toHaveText('404 — Not Found');
		await expect(page.locator('p code')).toHaveText(
			/http:\/\/(?:localhost|127\.0\.0\.1):\d+\/missing-page\//,
		);
	});

	test('navigates to missing route via click and keeps requested URL in context', async ({
		page,
	}) => {
		await page.goto('/', GOTO_OPTIONS);

		const pageErrors: Error[] = [];
		page.on('pageerror', (error) => {
			pageErrors.push(error);
		});

		let fullReload = false;
		page.on('load', () => {
			fullReload = true;
		});

		await page.evaluate(() => {
			const link = document.createElement('a');
			link.href = '/missing-from-click/';
			link.textContent = 'Missing route';
			document.body.append(link);
			link.click();
		});

		await page.waitForURL('**/missing-from-click/');

		await expect(page).toHaveTitle('404 Not Found');
		await expect(page.locator('h1')).toHaveText('404 — Not Found');
		await expect(page.locator('p code')).toHaveText(
			/http:\/\/(?:localhost|127\.0\.0\.1):\d+\/missing-from-click\//,
		);
		expect(fullReload).toBe(false);
		expect(
			pageErrors.find((error) =>
				error.message.includes('No route or fallback matched'),
			),
		).toBeUndefined();
	});

	test('hard navigates to server 404 when the client 404 route is removed', async ({
		page,
	}) => {
		await page.goto('/', GOTO_OPTIONS);

		const pageErrors: Error[] = [];
		page.on('pageerror', (error) => {
			pageErrors.push(error);
		});

		remove404Route();
		await page.waitForTimeout(300);
		await page.reload(GOTO_OPTIONS);

		let fullReload = false;
		page.on('load', () => {
			fullReload = true;
		});

		await page.evaluate(() => {
			const link = document.createElement('a');
			link.href = '/missing-without-client-404/';
			link.textContent = 'Missing route without 404';
			document.body.append(link);
			link.click();
		});

		await page.waitForURL('**/missing-without-client-404/');
		await page.waitForLoadState('networkidle');

		await expect(page).toHaveTitle('404: Not found');
		await expect(page.locator('h1')).toHaveText('404: Not found');
		await expect(page.locator('pre')).toHaveText('/missing-without-client-404/');
		expect(fullReload).toBe(true);
		expect(
			pageErrors.find(
				(error) =>
					error.message.includes('Failed to fetch dynamically imported module') ||
					error.message.includes('No route or fallback matched'),
			),
		).toBeUndefined();
	});
});

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

import { expect, test } from '@playwright/test';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const counterFile = path.resolve(
	__dirname,
	'../../../__fixtures__/hmr-basic-lit/src/my-counter.js',
);

function writeCounter(content: string) {
	fs.writeFileSync(counterFile, content, 'utf8');
}

let originalContent: string;

test.beforeAll(() => {
	originalContent = fs.readFileSync(counterFile, 'utf8');
});

test.afterAll(() => {
	writeCounter(originalContent);
});

test.afterEach(() => {
	writeCounter(originalContent);
});

// Playwright pierces shadow DOM with its CSS engine by default.

test.describe('Web Components HMR', () => {
	test.describe.configure({ mode: 'serial' });

	test('component renders initially', async ({ page }) => {
		await page.goto('/');

		const greeting = page.locator('my-counter .greeting');
		await expect(greeting).toHaveText('Hello World');
	});

	test('counter increments and state is preserved', async ({ page }) => {
		await page.goto('/');

		const button = page.locator('my-counter button');
		await expect(button).toHaveText('Count: 0');

		await button.click();
		await button.click();
		await button.click();
		await expect(button).toHaveText('Count: 3');
	});

	test('HMR updates template without full page reload', async ({ page }) => {
		await page.goto('/');

		const button = page.locator('my-counter button');

		// Build up some state
		await button.click();
		await button.click();
		await expect(button).toHaveText('Count: 2');

		// Track page reloads
		let fullReload = false;
		page.on('load', () => {
			fullReload = true;
		});

		// Change the greeting text in the source
		const updated = originalContent.replace(
			'${this.greeting} World',
			'${this.greeting} HMR',
		);
		writeCounter(updated);

		// Wait for the HMR update to apply
		const greeting = page.locator('my-counter .greeting');
		await expect(greeting).toHaveText('Hello HMR', { timeout: 10_000 });

		// Verify no full page reload occurred
		expect(fullReload).toBe(false);
	});

	test('HMR updates styles without full page reload', async ({ page }) => {
		await page.goto('/');

		const greeting = page.locator('my-counter .greeting');
		await expect(greeting).toHaveCSS('color', 'rgb(0, 0, 139)'); // darkblue

		let fullReload = false;
		page.on('load', () => {
			fullReload = true;
		});

		// Change the style
		const updated = originalContent.replace(
			'color: darkblue;',
			'color: crimson;',
		);
		writeCounter(updated);

		// Wait for the style update
		await expect(greeting).toHaveCSS('color', 'rgb(220, 20, 60)', {
			timeout: 10_000,
		}); // crimson

		expect(fullReload).toBe(false);
	});

	test('component remains functional after HMR update', async ({ page }) => {
		await page.goto('/');

		const button = page.locator('my-counter button');

		// Trigger HMR update
		const updated = originalContent.replace(
			'${this.greeting} World',
			'${this.greeting} Updated',
		);
		writeCounter(updated);

		await expect(page.locator('my-counter .greeting')).toHaveText(
			'Hello Updated',
			{ timeout: 10_000 },
		);

		// Verify interactions still work after HMR
		await button.click();
		await expect(button).toHaveText('Count: 1');
	});

	test('no console errors during HMR cycle', async ({ page }) => {
		const errors: string[] = [];
		page.on('console', (msg) => {
			if (msg.type() === 'error') {
				errors.push(msg.text());
			}
		});

		await page.goto('/');

		// Trigger an HMR update
		const updated = originalContent.replace(
			'${this.greeting} World',
			'${this.greeting} Clean',
		);
		writeCounter(updated);

		const greeting = page.locator('my-counter .greeting');
		await expect(greeting).toHaveText('Hello Clean', { timeout: 10_000 });

		expect(errors).toEqual([]);
	});
});

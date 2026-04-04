// FIXME:

// import fs from 'node:fs';
// import path from 'node:path';

// import { expect, test } from '@playwright/test';

// import { resolveFixtures } from '@gracile/internal-test-utils/fixtures';

// // ---------------------------------------------------------------------------
// // Fixture paths
// // ---------------------------------------------------------------------------

// const fixtureDir = path.join(resolveFixtures(), 'hmr-css-modules');

// const cardCssFile = path.join(fixtureDir, 'src/my-card.css');
// const badgeCssFile = path.join(fixtureDir, 'src/my-badge.css');

// // ---------------------------------------------------------------------------
// // Helpers
// // ---------------------------------------------------------------------------

// let originalCardCss: string;
// let originalBadgeCss: string;

// function writeCardCss(content: string) {
// 	fs.writeFileSync(cardCssFile, content, 'utf8');
// }
// function writeBadgeCss(content: string) {
// 	fs.writeFileSync(badgeCssFile, content, 'utf8');
// }

// test.beforeAll(() => {
// 	originalCardCss = fs.readFileSync(cardCssFile, 'utf8');
// 	originalBadgeCss = fs.readFileSync(badgeCssFile, 'utf8');
// });

// test.afterAll(() => {
// 	writeCardCss(originalCardCss);
// 	writeBadgeCss(originalBadgeCss);
// });

// test.afterEach(() => {
// 	writeCardCss(originalCardCss);
// 	writeBadgeCss(originalBadgeCss);
// });

// // Playwright pierces shadow DOM with its CSS engine by default.

// // ---------------------------------------------------------------------------
// // Tests — type: 'css' (CSSStyleSheet)
// // ---------------------------------------------------------------------------

// test.describe('CSS Modules HMR — type: css (CSSStyleSheet)', () => {
// 	test.describe.configure({ mode: 'serial' });

// 	test('component renders with initial styles', async ({ page }) => {
// 		await page.goto('/');

// 		const title = page.locator('my-card .title');
// 		await expect(title).toHaveText('Card Title');
// 		await expect(title).toHaveCSS('color', 'rgb(0, 0, 139)'); // darkblue
// 	});

// 	test('CSS edit updates color without full page reload', async ({ page }) => {
// 		await page.goto('/');

// 		const title = page.locator('my-card .title');
// 		await expect(title).toHaveCSS('color', 'rgb(0, 0, 139)'); // darkblue

// 		let fullReload = false;
// 		page.on('load', () => {
// 			fullReload = true;
// 		});

// 		// Mutate the CSS file
// 		const updated = originalCardCss.replace(
// 			'color: darkblue;',
// 			'color: crimson;',
// 		);
// 		writeCardCss(updated);

// 		// Wait for the style to propagate
// 		await expect(title).toHaveCSS('color', 'rgb(220, 20, 60)', {
// 			timeout: 10_000,
// 		}); // crimson

// 		expect(fullReload).toBe(false);
// 	});

// 	test('component state is preserved across CSS HMR', async ({ page }) => {
// 		await page.goto('/');

// 		const button = page.locator('my-card button');
// 		await expect(button).toHaveText('Count: 0');

// 		// Build up state
// 		await button.click();
// 		await button.click();
// 		await button.click();
// 		await expect(button).toHaveText('Count: 3');

// 		let fullReload = false;
// 		page.on('load', () => {
// 			fullReload = true;
// 		});

// 		// Edit CSS
// 		const updated = originalCardCss.replace(
// 			'color: darkgreen;',
// 			'color: tomato;',
// 		);
// 		writeCardCss(updated);

// 		const body = page.locator('my-card .body');
// 		await expect(body).toHaveCSS('color', 'rgb(255, 99, 71)', {
// 			timeout: 10_000,
// 		}); // tomato

// 		// State must survive
// 		await expect(button).toHaveText('Count: 3');
// 		expect(fullReload).toBe(false);
// 	});

// 	test('multiple rapid edits apply correctly', async ({ page }) => {
// 		await page.goto('/');

// 		const title = page.locator('my-card .title');

// 		let fullReload = false;
// 		page.on('load', () => {
// 			fullReload = true;
// 		});

// 		// First edit
// 		writeCardCss(originalCardCss.replace('color: darkblue;', 'color: green;'));
// 		await expect(title).toHaveCSS('color', 'rgb(0, 128, 0)', {
// 			timeout: 10_000,
// 		});

// 		// Second edit
// 		writeCardCss(originalCardCss.replace('color: darkblue;', 'color: orange;'));
// 		await expect(title).toHaveCSS('color', 'rgb(255, 165, 0)', {
// 			timeout: 10_000,
// 		});

// 		expect(fullReload).toBe(false);
// 	});
// });

// // ---------------------------------------------------------------------------
// // Tests — type: 'css-lit' (CSSResult)
// // ---------------------------------------------------------------------------

// test.describe('CSS Modules HMR — type: css-lit (CSSResult)', () => {
// 	test.describe.configure({ mode: 'serial' });

// 	test('component renders with initial styles', async ({ page }) => {
// 		await page.goto('/');

// 		const label = page.locator('my-badge .label');
// 		await expect(label).toHaveText('Badge');
// 		await expect(label).toHaveCSS('color', 'rgb(139, 0, 0)'); // darkred
// 	});

// 	test('CSS edit updates color without full page reload', async ({ page }) => {
// 		await page.goto('/');

// 		const label = page.locator('my-badge .label');
// 		await expect(label).toHaveCSS('color', 'rgb(139, 0, 0)'); // darkred

// 		let fullReload = false;
// 		page.on('load', () => {
// 			fullReload = true;
// 		});

// 		const updated = originalBadgeCss.replace(
// 			'color: darkred;',
// 			'color: royalblue;',
// 		);
// 		writeBadgeCss(updated);

// 		await expect(label).toHaveCSS('color', 'rgb(65, 105, 225)', {
// 			timeout: 10_000,
// 		}); // royalblue

// 		expect(fullReload).toBe(false);
// 	});
// });

// // ---------------------------------------------------------------------------
// // Tests — error-free cycle
// // ---------------------------------------------------------------------------

// test.describe('CSS Modules HMR — no errors', () => {
// 	test('no console errors during HMR cycle', async ({ page }) => {
// 		const errors: string[] = [];
// 		page.on('console', (msg) => {
// 			if (msg.type() === 'error') {
// 				errors.push(msg.text());
// 			}
// 		});

// 		await page.goto('/');

// 		// Trigger a CSS HMR update
// 		const updated = originalCardCss.replace('color: darkblue;', 'color: teal;');
// 		writeCardCss(updated);

// 		const title = page.locator('my-card .title');
// 		await expect(title).toHaveCSS('color', 'rgb(0, 128, 128)', {
// 			timeout: 10_000,
// 		}); // teal

// 		expect(errors).toEqual([]);
// 	});
// });

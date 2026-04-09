/**
 * HMR Scenario Tests — the "god test suite" for Gracile's HMR story.
 *
 * Tests every HMR scenario end-to-end using a real Vite dev server with
 * the core engine. Each test modifies specific source files and asserts
 * whether the browser did a full page (SSR) reload or a soft (client) update.
 *
 * Convention recap:
 *   - route entry:   src/routes/*.ts (not .client.)
 *   - _prefixed:     not a route, but importable helper
 *   - .client.ts:    client-only sibling asset
 *   - .css:          sibling CSS asset
 *
 * Scenarios tested:
 *   1. Touch route entry      → full SSR reload
 *   2. Touch _local-helper    → full SSR reload (routes/_*.ts imported by route)
 *   3. Touch _shared-helper   → full SSR reload (features/ imported by route)
 *   4. Touch (home).client.ts → soft client reload (NOT full SSR reload)
 *   5. Touch document.client  → soft client reload (deep .client. in import tree)
 *   6. Touch (home).css       → CSS hot update (no page reload)
 */

import fs from 'node:fs';
import path from 'node:path';

import { expect, test } from '@playwright/test';
import { resolveFixtures } from '@gracile/internal-test-utils/fixtures';

// ── File paths ──────────────────────────────────────────────────────

const fixtureRoot = path.join(resolveFixtures(), 'hmr-scenarios', 'src');

const files = {
	homeRoute: path.join(fixtureRoot, 'routes', '(home).ts'),
	homeClient: path.join(fixtureRoot, 'routes', '(home).client.ts'),
	homeCss: path.join(fixtureRoot, 'routes', '(home).css'),
	localHelper: path.join(fixtureRoot, 'routes', '_local-helper.ts'),
	sharedHelper: path.join(fixtureRoot, 'features', '_shared-helper.ts'),
	documentClient: path.join(fixtureRoot, 'document.client.ts'),
};

// ── Helpers ─────────────────────────────────────────────────────────

/** Map from file key to original content, saved once at suite start. */
const originals = new Map<string, string>();

function saveOriginals() {
	for (const [key, filePath] of Object.entries(files)) {
		originals.set(key, fs.readFileSync(filePath, 'utf8'));
	}
}

function restoreAll() {
	for (const [key, filePath] of Object.entries(files)) {
		const original = originals.get(key);
		if (original !== undefined) {
			fs.writeFileSync(filePath, original, 'utf8');
		}
	}
}

/**
 * Touch a file by appending/replacing a unique comment with a timestamp.
 * The actual source semantics are preserved — only a trailing comment changes.
 */
function touchFile(filePath: string) {
	let content = fs.readFileSync(filePath, 'utf8');
	const marker = `// __hmr_touch__ ${Date.now()}`;

	// Replace previous touch marker or append.
	if (content.includes('// __hmr_touch__')) {
		content = content.replace(/\/\/ __hmr_touch__.*/, marker);
	} else {
		content += `\n${marker}\n`;
	}

	fs.writeFileSync(filePath, content, 'utf8');
}

/**
 * Mutate actual content in a file (for testing that SSR output changes).
 */
function mutateExport(filePath: string, oldValue: string, newValue: string) {
	const content = fs.readFileSync(filePath, 'utf8');
	fs.writeFileSync(filePath, content.replace(oldValue, newValue), 'utf8');
}

const GOTO_OPTIONS = { waitUntil: 'networkidle' as const };

/**
 * HMR update timeout — how long to wait for the browser to reflect a change.
 */
const HMR_TIMEOUT = 10_000;

// ── Setup / teardown ────────────────────────────────────────────────

test.beforeAll(() => {
	saveOriginals();
});

test.afterAll(() => {
	restoreAll();
});

test.afterEach(() => {
	restoreAll();
});

// ── Scenario tests ──────────────────────────────────────────────────

test.describe('HMR Scenarios', () => {
	test.describe.configure({ mode: 'serial' });

	// ── Baseline ────────────────────────────────────────────────────

	test('baseline: home page renders correctly', async ({ page }) => {
		await page.goto('/', GOTO_OPTIONS);

		await expect(page).toHaveTitle('Home');
		await expect(page.locator('#title')).toHaveText('Home Page');
		await expect(page.locator('#local-greeting')).toHaveText(
			'Hello from local helper',
		);
		await expect(page.locator('#shared-greeting')).toHaveText(
			'Hello from shared helper',
		);
	});

	// ── Scenario 1: Touch route entry → full SSR reload ─────────────

	test('touch route entry → full SSR reload with updated content', async ({
		page,
	}) => {
		await page.goto('/', GOTO_OPTIONS);
		await expect(page.locator('#title')).toHaveText('Home Page');

		let didFullReload = false;
		page.on('load', () => {
			didFullReload = true;
		});

		// Mutate the route template.
		mutateExport(files.homeRoute, 'Home Page', 'Home Page UPDATED');

		// Wait for the full reload to deliver new SSR content.
		await expect(page.locator('#title')).toHaveText('Home Page UPDATED', {
			timeout: HMR_TIMEOUT,
		});
		expect(didFullReload).toBe(true);
	});

	// ── Scenario 2: Touch _local-helper.ts → full SSR reload ────────

	test('touch local helper (routes/_*.ts) → full SSR reload', async ({
		page,
	}) => {
		await page.goto('/', GOTO_OPTIONS);
		await expect(page.locator('#local-greeting')).toHaveText(
			'Hello from local helper',
		);

		let didFullReload = false;
		page.on('load', () => {
			didFullReload = true;
		});

		mutateExport(
			files.localHelper,
			'Hello from local helper',
			'Hello from local helper UPDATED',
		);

		await expect(page.locator('#local-greeting')).toHaveText(
			'Hello from local helper UPDATED',
			{ timeout: HMR_TIMEOUT },
		);
		expect(didFullReload).toBe(true);
	});

	// ── Scenario 3: Touch _shared-helper.ts → full SSR reload ───────

	test('touch shared helper (features/) → full SSR reload', async ({
		page,
	}) => {
		await page.goto('/', GOTO_OPTIONS);
		await expect(page.locator('#shared-greeting')).toHaveText(
			'Hello from shared helper',
		);

		let didFullReload = false;
		page.on('load', () => {
			didFullReload = true;
		});

		mutateExport(
			files.sharedHelper,
			'Hello from shared helper',
			'Hello from shared helper UPDATED',
		);

		await expect(page.locator('#shared-greeting')).toHaveText(
			'Hello from shared helper UPDATED',
			{ timeout: HMR_TIMEOUT },
		);
		expect(didFullReload).toBe(true);
	});

	// ── Scenario 4: Touch (home).client.ts → soft client reload ─────

	test('touch sibling .client.ts → NOT a full SSR reload', async ({ page }) => {
		await page.goto('/', GOTO_OPTIONS);
		await expect(page.locator('#title')).toHaveText('Home Page');

		// Inject a sentinel in the DOM that would be lost on full reload.
		await page.evaluate(() => {
			(window as any).__hmr_sentinel__ = true;
		});

		let didFullReload = false;
		page.on('load', () => {
			didFullReload = true;
		});

		touchFile(files.homeClient);

		// Give Vite time to process the HMR update.
		// eslint-disable-next-line playwright/no-wait-for-timeout
		await page.waitForTimeout(3000);

		// The module is self-accepting (.client. files get auto-injected
		// import.meta.hot.accept()), so Vite re-executes it in-place.
		// No full page reload should occur.
		expect(didFullReload).toBe(false);

		const sentinelSurvived = await page.evaluate(
			() => (window as any).__hmr_sentinel__ === true,
		);
		expect(sentinelSurvived).toBe(true);

		// SSR content should still be intact (unchanged).
		await expect(page.locator('#title')).toHaveText('Home Page');
	});

	// ── Scenario 5: Touch document.client.ts → soft client reload ───

	test('touch document.client.ts → NOT a full SSR reload', async ({ page }) => {
		await page.goto('/', GOTO_OPTIONS);
		await expect(page.locator('#title')).toHaveText('Home Page');

		await page.evaluate(() => {
			(window as any).__hmr_sentinel__ = true;
		});

		let didFullReload = false;
		page.on('load', () => {
			didFullReload = true;
		});

		touchFile(files.documentClient);

		// eslint-disable-next-line playwright/no-wait-for-timeout
		await page.waitForTimeout(3000);

		expect(didFullReload).toBe(false);

		const sentinelSurvived = await page.evaluate(
			() => (window as any).__hmr_sentinel__ === true,
		);
		expect(sentinelSurvived).toBe(true);

		await expect(page.locator('#title')).toHaveText('Home Page');
	});

	// ── Scenario 6: Touch (home).css → CSS hot update ───────────────

	test('touch sibling CSS → style updates without full reload', async ({
		page,
	}) => {
		await page.goto('/', GOTO_OPTIONS);

		const title = page.locator('#title');
		await expect(title).toHaveCSS('color', 'rgb(0, 0, 139)'); // darkblue

		await page.evaluate(() => {
			(window as any).__hmr_sentinel__ = true;
		});

		let didFullReload = false;
		page.on('load', () => {
			didFullReload = true;
		});

		// Change the color in the CSS file.
		const cssContent = fs.readFileSync(files.homeCss, 'utf8');
		fs.writeFileSync(
			files.homeCss,
			cssContent.replace('darkblue', 'crimson'),
			'utf8',
		);

		await expect(title).toHaveCSS('color', 'rgb(220, 20, 60)', {
			timeout: HMR_TIMEOUT,
		}); // crimson

		// CSS HMR should NOT cause a full page reload.
		expect(didFullReload).toBe(false);

		const sentinelSurvived = await page.evaluate(
			() => (window as any).__hmr_sentinel__ === true,
		);
		expect(sentinelSurvived).toBe(true);
	});
});

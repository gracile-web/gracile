/**
 * Islands addon — browser / hydration tests (static-site-islands, Chromium).
 *
 * Tests that every framework island:
 *   1. Has SSR content visible on first paint (no flash of fallback).
 *   2. Is fully hydrated — clicking "+1" increments the counter.
 *
 * Playwright's CSS engine pierces shadow DOM automatically, so selectors
 * reach inside `<is-land>`'s shadow root without any special syntax.
 */

import { expect, test } from '@playwright/test';

// ── helpers ──────────────────────────────────────────────────────────────────

/** Returns the count paragraph for a given section id. */
function countPara(page: import('@playwright/test').Page, sectionId: string) {
	return page
		.locator(`#${sectionId} p`)
		.filter({ hasText: /^Count:/ })
		.first();
}

/** Returns the +1 button inside a section (shadow-root pierced). */
function plusButton(page: import('@playwright/test').Page, sectionId: string) {
	return page.locator(`#${sectionId} button`).filter({ hasText: '+1' }).first();
}

// ── page-level ────────────────────────────────────────────────────────────────

test('page has correct title and heading', async ({ page }) => {
	await page.goto('/');
	await expect(page).toHaveTitle('Document - Islands - All Islands');
	await expect(page.locator('h1')).toHaveText('Hello Islands');
});

// ── SSR sanity — content visible before any interaction ───────────────────────

test.describe('SSR — all frameworks render initial HTML', () => {
	const frameworks = [
		{ id: 'react-island', label: 'React SSR OK', attr: 'data-island="react"' },
		{ id: 'vue-island', label: 'Vue SSR OK', attr: 'data-island="vue"' },
		{
			id: 'svelte-island',
			label: 'Svelte SSR OK',
			attr: 'data-island="svelte"',
		},
		{ id: 'solid-island', label: 'Solid SSR OK', attr: 'data-island="solid"' },
		{
			id: 'preact-island',
			label: 'Preact SSR OK',
			attr: 'data-island="preact"',
		},
	] as const;

	for (const { id, label } of frameworks) {
		test(`${id} shows SSR content on load`, async ({ page }) => {
			await page.goto('/');
			// Status paragraph is rendered server-side — must be present immediately.
			await expect(page.locator(`#${id} .island-status`).first()).toHaveText(
				label,
			);
		});
	}
});

// ── Hydration — counter increments on click ───────────────────────────────────

test.describe('Hydration — counters are interactive', () => {
	test('React island: counter increments', async ({ page }) => {
		await page.goto('/');
		const btn = plusButton(page, 'react-island');
		const count = countPara(page, 'react-island');

		await expect(count).toHaveText('Count: 0');
		await btn.click();
		await expect(count).toHaveText('Count: 1');
		await btn.click();
		await expect(count).toHaveText('Count: 2');
	});

	test('Vue island: counter increments', async ({ page }) => {
		await page.goto('/');
		const btn = plusButton(page, 'vue-island');
		const count = countPara(page, 'vue-island');

		await expect(count).toHaveText('Count: 0');
		await btn.click();
		await expect(count).toHaveText('Count: 1');
	});

	test('Svelte island: counter increments', async ({ page }) => {
		await page.goto('/');
		const btn = plusButton(page, 'svelte-island');
		const count = countPara(page, 'svelte-island');

		await expect(count).toHaveText('Count: 0');
		await btn.click();
		await expect(count).toHaveText('Count: 1');
	});

	test('Solid island: counter increments', async ({ page }) => {
		await page.goto('/');
		const btn = plusButton(page, 'solid-island');
		const count = countPara(page, 'solid-island');

		await expect(count).toHaveText('Count: 0');
		await btn.click();
		await expect(count).toHaveText('Count: 1');
	});

	test('Preact island: counter increments', async ({ page }) => {
		await page.goto('/');
		const btn = plusButton(page, 'preact-island');
		const count = countPara(page, 'preact-island');

		await expect(count).toHaveText('Count: 0');
		await btn.click();
		await expect(count).toHaveText('Count: 1');
	});
});

// ── Fallback / error guard ────────────────────────────────────────────────────

test('no framework fallback content is visible after hydration', async ({
	page,
}) => {
	await page.goto('/');

	// The is-land fallback slots (plain <p>Fallback: X loading…</p>) must be
	// replaced / hidden once hydration fires.
	// Use the full "Fallback: X" prefix to avoid "React loading" matching "Preact loading".
	for (const text of [
		'Fallback: React loading',
		'Fallback: Vue loading',
		'Fallback: Svelte loading',
		'Fallback: Solid loading',
		'Fallback: Preact loading',
	]) {
		await expect(page.getByText(text, { exact: false })).not.toBeVisible();
	}
});

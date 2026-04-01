import { expect, test } from '@playwright/test';

test.describe('DSD Style Deduplication', () => {
	test('SSR HTML has deduplicated styles', async ({ request }) => {
		const response = await request.get('/');
		const html = await response.text();

		// First <my-card> should have <style id="__lit-s-my-card">
		const firstStyleMatch = html.match(
			/<style id="__lit-s-my-card">([\s\S]*?)<\/style>/,
		);
		expect(firstStyleMatch).toBeTruthy();
		expect(firstStyleMatch![1]).toContain('steelblue');

		// First <my-card> should also have the adopter after the style
		const firstAdopterIdx = html.indexOf(
			'<adopt-shared-style style-id="__lit-s-my-card">',
		);
		expect(firstAdopterIdx).toBeGreaterThan(-1);
		// The adopter must appear after the first style
		expect(firstAdopterIdx).toBeGreaterThan(firstStyleMatch!.index!);

		// Count how many <style id="__lit-s-my-card"> appear — should be exactly 1
		const styleIdMatches = html.match(/<style id="__lit-s-my-card">/g);
		expect(styleIdMatches).toHaveLength(1);

		// Count adopters — should be 3 (one per instance)
		const adopterMatches = html.match(
			/<adopt-shared-style style-id="__lit-s-my-card">/g,
		);
		expect(adopterMatches).toHaveLength(3);

		// No plain <style> without id inside subsequent my-card shadow roots
		// Split by template shadowroot boundaries and check
		const templateBlocks = html.split(/<template shadowrootmode="open">/g);
		// First block is before any shadow root — skip.
		// Blocks 2+ are the shadow roots of the 3 <my-card> instances.
		// Block index 1 = first my-card (has <style id=...>)
		// Block index 2,3 = subsequent (should NOT have <style>)
		expect(templateBlocks.length).toBeGreaterThanOrEqual(4);

		for (let i = 2; i < Math.min(templateBlocks.length, 4); i++) {
			const block = templateBlocks[i]!.split('</template>')[0]!;
			expect(block).not.toContain('<style>');
			expect(block).not.toContain('<style id=');
			expect(block).toContain(
				'<adopt-shared-style style-id="__lit-s-my-card">',
			);
		}
	});

	test('all cards are styled in the browser', async ({ page }) => {
		await page.goto('/');

		await expect(page).toHaveTitle('CSS Dedup Test - Home');

		// All 3 cards should be visible
		const cards = page.locator('my-card');
		await expect(cards).toHaveCount(3);

		// Verify each card's heading is visible and styled.
		// Playwright pierces shadow DOM by default.
		await expect(page.locator('my-card h2').first()).toBeVisible();
		await expect(page.locator('my-card h2').nth(1)).toBeVisible();
		await expect(page.locator('my-card h2').nth(2)).toBeVisible();

		// Verify headings have the expected color (steelblue = rgb(70, 130, 180))
		for (let i = 0; i < 3; i++) {
			const color = await page
				.locator('my-card h2')
				.nth(i)
				.evaluate((el) => getComputedStyle(el).color);
			expect(color).toBe('rgb(70, 130, 180)');
		}

		// Verify cards have border
		for (let i = 0; i < 3; i++) {
			const border = await page
				.locator('my-card .card')
				.nth(i)
				.evaluate((el) => getComputedStyle(el).borderColor);
			expect(border).toBe('rgb(70, 130, 180)');
		}
	});
});

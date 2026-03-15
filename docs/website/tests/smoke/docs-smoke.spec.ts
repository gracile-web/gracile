import { expect, test } from '@playwright/test';

test.describe('docs website smoke', () => {
	test('home page renders key sections', async ({ page }) => {
		await page.goto('/');

		await expect(
			page.getByRole('heading', { name: 'Works With' }),
		).toBeVisible();
		await expect(
			page.getByRole('heading', { name: 'Main Features' }),
		).toBeVisible();
		await expect(page.getByRole('link', { name: /see more/i })).toBeVisible();
	});

	test('docs index loads with rendered markdown content', async ({ page }) => {
		await page.goto('/docs/');

		await expect(page.locator('article[data-toc-content]')).toBeVisible();
		await expect(page.locator('main.content')).toContainText('Documentation');
	});

	test('docs page loads and keeps docs navigation visible', async ({
		page,
	}) => {
		await page.goto('/docs/learn/getting-started/installation/');

		await expect(page.locator('article[data-toc-content]')).toBeVisible();
		await expect(page.getByRole('navigation')).toContainText('Docs');
	});

	test('blog index loads', async ({ page }) => {
		await page.goto('/blog/');

		await expect(page.getByRole('heading', { name: 'Blog' })).toBeVisible();
		await expect(page.locator('main.content')).toBeVisible();
	});

	test('unknown routes return the 404 page', async ({ page }) => {
		await page.goto('/definitely-not-a-real-page/');

		await expect(
			page.getByRole('heading', { name: '404 - Page not found' }),
		).toBeVisible();
		await expect(page).toHaveTitle(/404: not found/i);
	});
});

import { expect, test } from '@playwright/test';

// Playwright pierces shadow DOM with its CSS engine by default.

test.describe('Client Router — Navigation', () => {
	test.describe.configure({ mode: 'serial' });

	test('home page renders with correct title', async ({ page }) => {
		await page.goto('/');

		await expect(page).toHaveTitle('Home');
		await expect(page.locator('h1')).toHaveText('Home Page');
		await expect(page.locator('.description')).toHaveText(
			'Welcome to the client routing test fixture.',
		);
	});

	test('navigates to about via click (client-side)', async ({ page }) => {
		await page.goto('/');
		await expect(page).toHaveTitle('Home');

		// Track full page reloads — a client-side navigation should NOT trigger one.
		let fullReload = false;
		page.on('load', () => {
			fullReload = true;
		});

		await page.click('a[href="/about/"]');

		await expect(page).toHaveTitle('About');
		await expect(page.locator('h1')).toHaveText('About Page');

		expect(fullReload).toBe(false);
	});

	test('navigates to contact via click (client-side)', async ({ page }) => {
		await page.goto('/');

		let fullReload = false;
		page.on('load', () => {
			fullReload = true;
		});

		await page.click('a[href="/contact/"]');

		await expect(page).toHaveTitle('Contact');
		await expect(page.locator('h1')).toHaveText('Contact Page');
		await expect(page.locator('.contact-list')).toBeVisible();

		expect(fullReload).toBe(false);
	});

	test('navigates back and forward with browser history', async ({ page }) => {
		await page.goto('/');
		await expect(page).toHaveTitle('Home');

		await page.click('a[href="/about/"]');
		await expect(page).toHaveTitle('About');

		await page.click('a[href="/contact/"]');
		await expect(page).toHaveTitle('Contact');

		// Go back to About
		await page.goBack();
		await expect(page).toHaveTitle('About');
		await expect(page.locator('h1')).toHaveText('About Page');

		// Go back to Home
		await page.goBack();
		await expect(page).toHaveTitle('Home');
		await expect(page.locator('h1')).toHaveText('Home Page');

		// Go forward to About
		await page.goForward();
		await expect(page).toHaveTitle('About');
	});

	test('multi-step navigation across all routes', async ({ page }) => {
		await page.goto('/');

		// Home → About → Contact → Home (full cycle)
		await page.click('a[href="/about/"]');
		await expect(page.locator('h1')).toHaveText('About Page');

		await page.click('a[href="/contact/"]');
		await expect(page.locator('h1')).toHaveText('Contact Page');

		await page.click('a[href="/"]');
		await expect(page.locator('h1')).toHaveText('Home Page');
	});
});

test.describe('Client Router — Direct URL Access', () => {
	test('loads about page directly', async ({ page }) => {
		await page.goto('/about/');

		await expect(page).toHaveTitle('About');
		await expect(page.locator('h1')).toHaveText('About Page');
	});

	test('loads contact page directly', async ({ page }) => {
		await page.goto('/contact/');

		await expect(page).toHaveTitle('Contact');
		await expect(page.locator('h1')).toHaveText('Contact Page');
	});
});

test.describe('Client Router — Head Reconciliation', () => {
	test.describe.configure({ mode: 'serial' });

	test('document title updates on navigation', async ({ page }) => {
		await page.goto('/');
		await expect(page).toHaveTitle('Home');

		await page.click('a[href="/about/"]');
		await expect(page).toHaveTitle('About');

		await page.click('a[href="/contact/"]');
		await expect(page).toHaveTitle('Contact');

		await page.click('a[href="/"]');
		await expect(page).toHaveTitle('Home');
	});
});

test.describe('Client Router — Navigation Menu', () => {
	test('all nav links are present', async ({ page }) => {
		await page.goto('/');

		const nav = page.locator('nav.top-menu');
		await expect(nav).toBeVisible();

		await expect(nav.locator('a[href="/"]')).toHaveText('Home');
		await expect(nav.locator('a[href="/about/"]')).toHaveText('About');
		await expect(nav.locator('a[href="/contact/"]')).toHaveText('Contact');
	});

	test('nav persists across client-side navigations', async ({ page }) => {
		await page.goto('/');
		await expect(page.locator('nav.top-menu')).toBeVisible();

		await page.click('a[href="/about/"]');
		await expect(page.locator('nav.top-menu')).toBeVisible();

		await page.click('a[href="/contact/"]');
		await expect(page.locator('nav.top-menu')).toBeVisible();
	});
});

test.describe('Client Router — Web Components', () => {
	test('custom element renders in home page', async ({ page }) => {
		await page.goto('/');

		const greeting = page.locator('my-greetings');
		await expect(greeting).toBeVisible();
		// Shadow DOM — Playwright pierces it by default.
		await expect(greeting.locator('.greeting')).toContainText('Hello World!');
	});

	test('custom element survives client-side round-trip', async ({ page }) => {
		await page.goto('/');
		await expect(page.locator('my-greetings')).toBeVisible();

		// Navigate away
		await page.click('a[href="/about/"]');
		await expect(page.locator('h1')).toHaveText('About Page');

		// Navigate back
		await page.click('a[href="/"]');
		await expect(page.locator('my-greetings')).toBeVisible();
		await expect(
			page.locator('my-greetings').locator('.greeting'),
		).toContainText('Hello World!');
	});
});

test.describe('Client Router — Error Handling', () => {
	test('no console errors during navigation', async ({ page }) => {
		const errors: string[] = [];
		page.on('console', (msg) => {
			if (msg.type() === 'error') {
				errors.push(msg.text());
			}
		});

		await page.goto('/');
		await page.click('a[href="/about/"]');
		await expect(page.locator('h1')).toHaveText('About Page');
		await page.click('a[href="/contact/"]');
		await expect(page.locator('h1')).toHaveText('Contact Page');
		await page.click('a[href="/"]');
		await expect(page.locator('h1')).toHaveText('Home Page');

		expect(errors).toEqual([]);
	});

	test('no uncaught exceptions during navigation', async ({ page }) => {
		const exceptions: Error[] = [];
		page.on('pageerror', (error) => {
			exceptions.push(error);
		});

		await page.goto('/');
		await page.click('a[href="/about/"]');
		await expect(page).toHaveTitle('About');
		await page.click('a[href="/"]');
		await expect(page).toHaveTitle('Home');

		expect(exceptions).toEqual([]);
	});
});

test.describe('Client Router — Page Content', () => {
	test('route-specific content is isolated', async ({ page }) => {
		await page.goto('/');
		await expect(page.locator('.description')).toHaveText(
			'Welcome to the client routing test fixture.',
		);
		// Contact-specific content should NOT exist on home
		await expect(page.locator('.contact-list')).not.toBeVisible();

		await page.click('a[href="/contact/"]');
		await expect(page.locator('.contact-list')).toBeVisible();
		// Home greeting should NOT exist on contact
		await expect(page.locator('my-greetings')).not.toBeVisible();
	});

	test('page body is fully replaced on navigation', async ({ page }) => {
		await page.goto('/');
		const homeContent = await page.locator('main').innerHTML();

		await page.click('a[href="/about/"]');
		// Wait for the new route to render before capturing the content.
		await expect(page.locator('h1')).toHaveText('About Page');
		const aboutContent = await page.locator('main').innerHTML();

		expect(homeContent).not.toEqual(aboutContent);
	});
});

import { test, expect } from './_harness/template-server.js';

// MARK: Page rendering

test('home page renders', async ({ page, templateServer }) => {
	await page.goto(templateServer.address);
	await expect(page).toHaveTitle('Gracile Basics');
});

test('about page renders', async ({ page, templateServer }) => {
	await page.goto(`${templateServer.address}/about/`);
	await expect(page).toHaveTitle('About - Gracile Basics');
});

test('blog index renders', async ({ page, templateServer }) => {
	await page.goto(`${templateServer.address}/blog/`);
	await expect(page).toHaveTitle('Blog - Gracile Basics');
});

test('form page renders', async ({ page, templateServer }) => {
	await page.goto(`${templateServer.address}/form/regular/`);
	await expect(page).toHaveTitle('Form without JS - Gracile Basics');
});

test('form +JS page renders', async ({ page, templateServer }) => {
	await page.goto(`${templateServer.address}/form/with-js/`);
	await expect(page).toHaveTitle('Form with JS - Gracile Basics');
});

test('JSON endpoint page renders', async ({ page, templateServer }) => {
	await page.goto(`${templateServer.address}/json/`);
	await expect(page).toHaveTitle('JSON endpoint with routing - Gracile Basics');
});

test('404 page renders', async ({ page, templateServer }) => {
	await page.goto(`${templateServer.address}/NOT_FOUND/`);
	await expect(page).toHaveTitle('Gracile - 404 - Gracile Basics');
});

// MARK: Navigation

test('nav routes work', async ({ page, templateServer }) => {
	await page.goto(templateServer.address);

	await page.locator('nav').getByText(/Form$/).click();
	await expect(page).toHaveTitle('Form without JS - Gracile Basics');

	await page.locator('nav').getByText('Form (+JS)').click();
	await expect(page).toHaveTitle('Form with JS - Gracile Basics');

	await page.locator('nav').getByText('JSON endpoint').click();
	await expect(page).toHaveTitle('JSON endpoint with routing - Gracile Basics');

	await page.locator('nav').getByText('Blog').click();
	await expect(page).toHaveTitle('Blog - Gracile Basics');

	await page
		.locator('nav')
		.getByText(/About$/)
		.click();
	await expect(page).toHaveTitle('About - Gracile Basics');
});

// MARK: Interactions

test('form - add and filter achievements', async ({ page, templateServer }) => {
	await page.goto(`${templateServer.address}/form/regular/`);

	await page.getByText('Delete all').click();

	await page.getByRole('textbox').first().fill('abc123');
	await page.getByText('Add an achievement').click();

	await expect(page.locator('pre')).toContainText('"name": "abc123"');

	await page.getByRole('textbox').nth(1).fill('abc1');
	await page.getByText('Filter by name').click();

	await expect(
		page.getByRole('main').getByRole('listitem').first(),
	).toContainText('abc123');
});

// NOTE: The basics JSON API uses a hardcoded DEV_URL (port 3030) in its
// URLPattern, so it can't be tested with dynamic ports. The page rendering
// test above already confirms the endpoint page loads correctly.

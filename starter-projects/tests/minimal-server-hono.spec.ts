import { test, expect } from './_harness/template-server.js';

test('home page renders', async ({ page, templateServer }) => {
	await page.goto(templateServer.address);
	await expect(page).toHaveTitle('Gracile - Home');
});

test('about page renders', async ({ page, templateServer }) => {
	await page.goto(`${templateServer.address}/about/`);
	await expect(page).toHaveTitle('Gracile - About');
});

test('404 page renders', async ({ page, templateServer }) => {
	await page.goto(`${templateServer.address}/NOT_FOUND/`);
	await expect(page).toHaveTitle('Gracile - 404');
});

test('API GET route responds', async ({ request, templateServer }) => {
	const response = await request.get(`${templateServer.address}/api/`);
	expect(response.status()).toBe(200);
	expect(await response.text()).toContain('A GET!');
});

test('navigation works', async ({ page, templateServer }) => {
	await page.goto(templateServer.address);
	await page.getByText('About page').click();
	await expect(page).toHaveTitle('Gracile - About');
});

import { test, expect } from './_harness/template-server.js';

test('home page renders', async ({ page, templateServer }) => {
	await page.goto(templateServer.address);
	await expect(page).toHaveTitle('Gracile - Home');
});

test('about page renders', async ({ page, templateServer }) => {
	await page.goto(`${templateServer.address}/about/`);
	await expect(page).toHaveTitle('Gracile - About');
});

test('navigation works', async ({ page, templateServer }) => {
	await page.goto(templateServer.address);
	await page.getByText('About page').click();
	await expect(page).toHaveTitle('Gracile - About');
});

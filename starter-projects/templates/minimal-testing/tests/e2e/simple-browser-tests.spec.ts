import { server as env } from '@gracile/gracile/server';
import { expect, test } from '@playwright/test';

// NOTE: Setup the server with a random port for each browser worker
process.env.PORT = String(env.RANDOM_PORT);

const { server } = await import('../../server.js');
await new Promise((resolve) => {
	server.addListener('listening', resolve);
});
const address = process.env.ADDRESS!;
console.log(address);
// --- End setup

test('has title', async ({ page }) => {
	await page.goto(address);

	await expect(page).toHaveTitle(/Gracile/);
});

test('get started link', async ({ page }) => {
	await page.goto(address);

	// Click the get "about page" link.
	await page.getByText('About page').click();

	// Expects page to have a heading with the name of About.
	await expect(page.getByRole('heading', { name: 'About' })).toBeVisible();
});

// IMPORTANT: Close the server after
test.afterAll(() => server.close());

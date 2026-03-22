import { after, before } from 'node:test';

import { expect, test } from '@playwright/test';

import { createTestServer } from './_suite/utils.js';

let server: Awaited<ReturnType<typeof createTestServer>>;

before(async () => {
	server = await createTestServer(import.meta.url);
});

const scOptions = { fullPage: true };

test('basics screenshots', async ({ page }) => {
	await page.goto('http://localhost:3030');

	await expect(page).toHaveScreenshot(scOptions);

	await page.goto('http://localhost:3030/form/regular/');
	await page.getByText('Delete all').click();
	await expect(page).toHaveScreenshot(scOptions);

	await page.goto('http://localhost:3030/form/with-js/');
	await expect(page).toHaveScreenshot(scOptions);

	await page.goto('http://localhost:3030/json/');
	await expect(page).toHaveScreenshot(scOptions);

	await page.goto('http://localhost:3030/markdown-editor/');
	await expect(page).toHaveScreenshot({
		...scOptions,
		// mask: [page.getByRole('presentation')],
		maxDiffPixelRatio: 0.01,
	});

	await page.goto('http://localhost:3030/streams/');
	await expect(page).toHaveScreenshot({
		...scOptions,
		maxDiffPixelRatio: 0.01,
	});

	await page.goto('http://localhost:3030/blog/');
	await expect(page).toHaveScreenshot(scOptions);

	await page.goto('http://localhost:3030/about/');
	await expect(page).toHaveScreenshot(scOptions);

	await page.goto('http://localhost:3030/NOT_FOUND/');
	await expect(page).toHaveScreenshot(scOptions);
	await expect(page).toHaveTitle('Gracile - 404 - Gracile Basics');
});

test('basics - routes', async ({ page }) => {
	await page.goto('http://localhost:3030');
	await expect(page).toHaveTitle('Gracile Basics');

	await page.locator('nav').getByText(/Form$/).click();
	await expect(page).toHaveTitle('Form without JS - Gracile Basics');

	await page.locator('nav').getByText('Form (+JS)').click();
	await expect(page).toHaveTitle('Form with JS - Gracile Basics');

	await page.locator('nav').getByText('JSON endpoint').click();
	await expect(page).toHaveTitle('JSON endpoint with routing - Gracile Basics');

	await page.locator('nav').getByText('Markdown editor').click();
	await expect(page).toHaveTitle('Markdown editor - Gracile Basics');

	await page.locator('nav').getByText('Streams').click();
	await expect(page).toHaveTitle('Streams - Gracile Basics');

	await page.locator('nav').getByText('Blog').click();
	await expect(page).toHaveTitle('Blog - Gracile Basics');

	await page
		.locator('nav')
		.getByText(/About$/)
		.click();
	await expect(page).toHaveTitle('About - Gracile Basics');
});

//

test('basics - interactions - form', async ({ page }) => {
	await page.goto('http://localhost:3030/form/regular/');

	await page.getByText('Delete all').click();

	await page.getByRole('textbox').first().fill('abc123');
	await page.getByText('Add an achievement').click();

	await expect(page.locator('pre')).toContainText(`{
  "props": {
    "GET": {
      "achievements": [
        {
          "name": "abc123",
          "coolnessFactor": 1
        }
      ],
      "filterByName": null
    }
  }
}`);

	await page.getByRole('textbox').nth(1).fill('abc1');
	await page.getByText('Filter by name').click();

	await expect(
		page.getByRole('main').getByRole('listitem').first(),
	).toContainText(`1 - abc123`);

	await page.getByText('Delete all').click();

	await expect(page.locator('pre')).toContainText(`{
  "props": {
    "GET": {
      "achievements": [],
      "filterByName": "abc1"
    }
  }
}`);
});

test('basics - interactions - form + js', async ({ page }) => {
	await page.goto('http://localhost:3030/form/with-js/');

	await page.getByText('Change field value').click();
	await expect(page.locator('pre')).toContainText(`{
  "success": true,
  "message": null,
  "myData": "untouched"
}`);
});

test('basics - interactions - json endpoint', async ({ page }) => {
	await page.goto('http://localhost:3030/json/');

	await page.getByText('Get a Pet (1)').click();
	await expect(page.locator('pre')).toContainText(`200 - {
  "success": true,
  "data": {
    "id": 1,
    "name": "Rantanplan",
    "type": "dog"
  }
}`);

	await page.getByText('No pet found (10)').click();
	await expect(page.locator('pre')).toContainText(`404 - {
  "success": false,
  "message": "Pet \\"10\\" not found!"
}`);

	await page.getByText('Wrong method (DELETE)').click();
	await expect(page.locator('pre')).toContainText(`405 - {
  "success": false,
  "message": "Only \\"GET\\" is allowed."
}`);
});

after(() => server.close());

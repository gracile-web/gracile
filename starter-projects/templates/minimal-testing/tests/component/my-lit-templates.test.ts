import assert from 'node:assert';
import test from 'node:test';

import { renderLitTemplate } from '@gracile/gracile/server-html';

import { myServerTemplate1 } from '../../src/features/my-server-template-1.js';
import { myTemplate1 } from '../../src/features/my-template-1.js';

await test('should render myServerTemplate 1', async () => {
	const result = await renderLitTemplate(myServerTemplate1());

	console.log(result);

	assert.match(result, /Hello/);
});

await test('should render with hydration parts - myTemplate 1', async () => {
	const result = await renderLitTemplate(myTemplate1());

	console.log(result);

	assert.match(result, /Hello/);
	assert.match(result, /<!--lit-part B09pxQP8WOw=-->/);
});

import test, { suite } from 'node:test';

import { renderLitTemplate } from '@gracile/gracile/server-html';

import { myServerTemplate1 } from '../../src/features/my-server-template-1.js';
import { myTemplate1 } from '../../src/features/my-template-1.js';

await suite('suite of snapshot tests for nested templates', async () => {
	await test('snapshot test - myTemplate1 in myServerTemplate1', async (t) => {
		// @ts-expect-error Node experimental API!
		// eslint-disable-next-line @typescript-eslint/no-unsafe-call
		t.assert.snapshot(
			//
			await renderLitTemplate(
				//
				myServerTemplate1(myTemplate1()),
			),
		);
	});
});

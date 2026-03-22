// Button.test.ts
import { expect, test } from '@sand4rt/experimental-ct-web';

import { MyGreetings } from '../../src/features/my-greetings.js';

test('render props', async ({ mount }) => {
	const component = await mount(MyGreetings, {
		props: {
			name: 'Barbara',
		},
	});
	await expect(component).toContainText('Hello Barbara!');
});

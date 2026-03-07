import assert from 'node:assert';
import test, { suite } from 'node:test';

import { myLib1 } from '../../src/lib/my-lib-1.js';

await test('`myLib1` should return "foo"', () => {
	const result = myLib1();

	console.log(result);

	assert.match(result, /foo/);
});

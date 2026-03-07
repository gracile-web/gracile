import assert from 'node:assert';
import test, { after, before, suite } from 'node:test';

import type { ServerType } from '@hono/node-server';
import { build } from 'vite';

let server: ServerType | null = null;

before(async () => {
	await build();
	server = (await import('../../server.js')).server;
});

await suite('API endpoints', async () => {
	await test('make a GET request', async () => {
		const resultGet = await fetch('http://localhost:3030/api/hello/');

		const bodyGet = await resultGet.text();
		console.log(bodyGet);

		assert.match(bodyGet, /GET/);
	});

	await test('make a POST request', async () => {
		const resultPost = await fetch('http://localhost:3030/api/hello/', {
			method: 'POST',
		});

		const bodyPost = await resultPost.text();
		console.log(bodyPost);

		assert.match(bodyPost, /POST/);
	});
});

after(() => server?.close());

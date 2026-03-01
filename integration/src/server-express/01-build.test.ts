/**
 * Server-express build verification.
 *
 * Verifies the server-mode build produces the expected client/ and server/
 * directories with the correct structure.
 */

/* eslint-disable @typescript-eslint/no-floating-promises */
import { describe, it, before } from 'node:test';

import { assertBuildContains, assertHtmlFile } from '../helpers/build.js';
import { buildFixture } from '../helpers/server.js';

describe('server-express build', () => {
	before(async () => {
		await buildFixture('server-express');
	});

	it('produces server entrypoint', async () => {
		await assertBuildContains('server-express', 'dist/server', [
			'entrypoint.js',
		]);
	});

	it('produces server route chunks', async () => {
		await assertBuildContains('server-express', 'dist/server', ['chunk/']);
	});

	it('produces client static pages', async () => {
		await assertBuildContains('server-express', 'dist/client', [
			'about/index.html',
			'contact/index.html',
			'favicon.svg',
		]);
	});

	it('produces client asset bundles', async () => {
		await assertBuildContains('server-express', 'dist/client', ['assets/']);
	});

	it('client about page has valid HTML', async () => {
		await assertHtmlFile('server-express', 'dist/client/about/index.html');
	});

	it('client contact page has valid HTML', async () => {
		await assertHtmlFile('server-express', 'dist/client/contact/index.html');
	});
});

/* eslint-disable @typescript-eslint/no-floating-promises */
// NOTE: Work-in-Progress

import '@gracile/gracile/hydration';

import assert from 'node:assert/strict';
import { existsSync } from 'node:fs';
import test, { describe } from 'node:test';
import { fileURLToPath } from 'node:url';

import type * as serverEnv from '@gracile/engine/server/env';
import * as serverRuntime from '@gracile/gracile/_internals/server-runtime';
import * as document from '@gracile/gracile/document';
import * as env from '@gracile/gracile/env';
import * as hono from '@gracile/gracile/hono';
import * as node from '@gracile/gracile/node';
import * as plugin from '@gracile/gracile/plugin';
import { defineRoute } from '@gracile/gracile/route';
import * as server from '@gracile/gracile/server';
import * as serverHtml from '@gracile/gracile/server-html';
import * as urlPattern from '@gracile/gracile/url-pattern';
// import * as svg from '@gracile/svg/vite';
// import * as metadata from '@gracile/metadata/index';
// import * as mdModule from '@gracile/markdown/module';
// import * as mdRenderer from '@gracile/markdown/renderer';
// import * as mdPlugin from '@gracile/markdown/vite';
// import * as markdown from '@gracile/markdown';
import { resolve } from 'import-meta-resolve';

function checkEnv(input: typeof serverEnv) {
	assert.equal(typeof input.CLIENT_DIST_DIR, 'string');
	assert.equal(typeof input.IP_EXPOSED, 'string');
	assert.equal(typeof input.IP_LOCALHOST, 'string');
	assert.equal(typeof input.LOCALHOST, 'string');
	assert.equal(typeof input.PUBLIC_DIR, 'string');
	assert.equal(typeof input.RANDOM_PORT, 'number');
}

describe('gracile package should do its exports correctly', () => {
	test('node adapter', () => {
		assert.equal(typeof node.printAddressInfos, 'function');
		assert.equal(typeof node.getClientDistPath, 'function');
		assert.equal(typeof node.nodeAdapter, 'function');
		checkEnv(node);
	});

	test('hono adapter', () => {
		assert.equal(typeof hono.printAddressInfos, 'function');
		assert.equal(typeof hono.getClientDistPath, 'function');
		assert.equal(typeof hono.honoAdapter, 'function');

		checkEnv(hono);
	});

	//
	test('vite plugin', () => {
		assert.equal(typeof plugin.gracile, 'function');
		assert.equal(typeof serverRuntime.createGracileMiddleware, 'function');
	});

	test('url pattern', () => {
		assert.equal(urlPattern.URLPattern.constructor.name, 'Function');
	});

	//
	test('server-html', () => {
		assert.equal(typeof serverHtml.html, 'function');
	});

	test('route', () => {
		assert.equal(typeof defineRoute, 'function');
	});

	test('document', () => {
		assert.equal(typeof document.RouteTemplateOutlet, 'function');

		assert.equal(typeof document.pageAssetsCustomLocation(), 'object');
	});

	test('server utils', () => {
		// eslint-disable-next-line @typescript-eslint/no-unused-vars, @typescript-eslint/require-await
		const testGracileHandler: server.GracileHandler = async () => ({
			response: new Response(),
		});

		checkEnv(server);
	});

	test('internals - lit hydrate', () => {
		assert.equal('litElementHydrateSupport' in globalThis, true);
	});

	test('env', () => {
		assert.equal(typeof env.DEV === 'boolean', true);
		assert.equal(typeof env.TEST === 'boolean', true);
		assert.equal(typeof env.PREVIEW === 'boolean', true);
		assert.equal(typeof env.BROWSER === 'boolean', true);
	});

	test('tsconfigs', () => {
		assert.equal(
			existsSync(
				fileURLToPath(
					resolve('@gracile/gracile/tsconfigs/base', import.meta.url),
				),
			),
			true,
		);
		assert.equal(
			existsSync(
				fileURLToPath(
					resolve('@gracile/gracile/tsconfigs/strict', import.meta.url),
				),
			),
			true,
		);
		assert.equal(
			existsSync(
				fileURLToPath(
					resolve('@gracile/gracile/tsconfigs/strictest', import.meta.url),
				),
			),
			true,
		);
	});
});

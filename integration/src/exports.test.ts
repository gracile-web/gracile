/* eslint-disable @typescript-eslint/no-floating-promises */
// NOTE: Work-in-Progress

import '@gracile/gracile/_internals/hydrate';

import assert from 'node:assert/strict';
import { existsSync } from 'node:fs';
import test, { describe } from 'node:test';
import { fileURLToPath } from 'node:url';

import * as env from '@gracile/engine/server/env';
import * as dsd from '@gracile/gracile/_internals/polyfills/declarative-shadow-dom';
import * as requestIdleC from '@gracile/gracile/_internals/polyfills/request-idle-callback';
import * as serverRuntime from '@gracile/gracile/_internals/server-runtime';
import * as document from '@gracile/gracile/document';
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

describe('gracile package should do its exports correctly', () => {
	function checkEnv(input: typeof env) {
		assert.equal(typeof input.CLIENT_DIST_DIR, 'string');
		assert.equal(typeof input.IP_EXPOSED, 'string');
		assert.equal(typeof input.IP_LOCALHOST, 'string');
		assert.equal(typeof input.PUBLIC_DIR, 'string');
		assert.equal(typeof input.RANDOM_PORT, 'number');
	}
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

		assert.equal(typeof document.helpers.dev, 'object');
		assert.equal(typeof document.helpers.fullHydration, 'object');
		assert.equal(typeof document.helpers.pageAssets, 'object');
		assert.equal(typeof document.helpers.polyfills, 'object');
	});
	test('server utils', () => {
		// eslint-disable-next-line @typescript-eslint/require-await, @typescript-eslint/no-unused-vars
		const testGracileHandler: server.GracileHandler = async () => ({
			response: new Response(),
		});

		checkEnv(server);
	});
	test('internals - lit hydrate', () => {
		assert.equal('litElementHydrateSupport' in globalThis, true);
	});
	test('internals - polyfills - dsd', () => {
		assert.equal(typeof dsd.checkDsd, 'function');
	});
	test('internals - polyfills - requestIdleCallback', () => {
		assert.equal(typeof requestIdleC.requestIdleCallback, 'string');
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

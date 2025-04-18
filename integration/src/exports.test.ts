/* eslint-disable @typescript-eslint/no-floating-promises */

import '@gracile/gracile/hydration-elements';

import assert from 'node:assert/strict';
import { existsSync } from 'node:fs';
import { describe, test } from 'node:test';
import { fileURLToPath } from 'node:url';

import { constants as serverConstants } from '@gracile/engine/server/constants';
import * as internalLogger from '@gracile/gracile/_internals/logger';
import * as route from '@gracile/gracile/_internals/route';
import * as routeModule from '@gracile/gracile/_internals/route-module';
import * as serverRuntime from '@gracile/gracile/_internals/server-runtime';
import * as document from '@gracile/gracile/document';
import { nodeCondition } from '@gracile/gracile/node-condition';
import * as hono from '@gracile/gracile/hono';
import * as node from '@gracile/gracile/node';
import * as plugin from '@gracile/gracile/plugin';
import { defineRoute } from '@gracile/gracile/route';
import * as server from '@gracile/gracile/server';
import * as serverHtml from '@gracile/gracile/server-html';
import * as urlPattern from '@gracile/gracile/url-pattern';
import { html as litServerHtml } from '@lit-labs/ssr';
import { resolve } from 'import-meta-resolve';
import { html } from 'lit';

import { noop } from './__utils__/noop.js';

function checkServerEnv(input: typeof serverConstants) {
	assert.equal(typeof input.CLIENT_DIST_DIR, 'string');
	assert.equal(typeof input.IP_EXPOSED, 'string');
	assert.equal(typeof input.IP_LOCALHOST, 'string');
	assert.equal(typeof input.LOCALHOST, 'string');
	assert.equal(typeof input.PUBLIC_DIR, 'string');
	assert.equal(typeof input.RANDOM_PORT, 'number');
}

describe('gracile package should do its exports correctly', () => {
	test('node adapter', () => {
		assert.equal(typeof node.printUrls, 'function');
		assert.equal(typeof node.getClientBuildPath, 'function');
		assert.equal(typeof node.nodeAdapter, 'function');

		// eslint-disable-next-line @typescript-eslint/require-await
		const testGracileHandler: node.GracileNodeHandler = async () => null;
		noop(testGracileHandler);
		const testOptions: node.NodeAdapterOptions = {};
		noop(testGracileHandler, testOptions);

		checkServerEnv(node.server);
	});

	test('hono adapter', () => {
		assert.equal(typeof hono.printUrls, 'function');
		assert.equal(typeof hono.getClientBuildPath, 'function');
		assert.equal(typeof hono.honoAdapter, 'function');

		// eslint-disable-next-line @typescript-eslint/require-await
		const testGracileHandler: hono.GracileHonoHandler = async () =>
			new Response();
		noop(testGracileHandler);
		const testOptions: hono.HonoAdapterOptions = {};
		noop(testGracileHandler, testOptions);

		checkServerEnv(hono.server);
	});

	//
	test('vite plugin', () => {
		assert.equal(typeof plugin.gracile, 'function');
		assert.equal(typeof serverRuntime.createGracileHandler, 'function');
	});

	test('url pattern', () => {
		assert.equal(urlPattern.URLPattern.constructor.name, 'Function');
	});

	//
	test('server-html', () => {
		assert.equal(typeof serverHtml.html, 'function');
		assert.equal(typeof serverHtml.isHydratable, 'function');
		assert.equal(typeof serverHtml.renderLitTemplate, 'function');

		const testGracileHandler: serverHtml.ServerRenderedTemplate = litServerHtml`ok`;
		noop(testGracileHandler);
	});

	test('route', () => {
		assert.equal(typeof defineRoute, 'function');
	});

	test('document', () => {
		assert.equal(typeof document.pageAssetsCustomLocation(), 'object');
	});

	test('ambient custom elements', () => {
		const routeTemplateOutlet =
			null as unknown as HTMLElementTagNameMap['route-template-outlet'];

		const elems = html` <route-template-outlet></route-template-outlet> `;
		noop(routeTemplateOutlet, elems);
	});

	test('server utils', () => {
		// eslint-disable-next-line @typescript-eslint/require-await
		const testGracileHandler: server.GracileHandler = async () => ({
			response: new Response(),
		});
		noop(testGracileHandler);

		checkServerEnv(serverConstants);
	});

	test('internals - lit hydrate', () => {
		assert.equal('litElementHydrateSupport' in globalThis, true);
	});

	test('env', () => {
		assert.equal(typeof nodeCondition.DEV === 'boolean', true);
		assert.equal(typeof nodeCondition.TEST === 'boolean', true);
		assert.equal(typeof nodeCondition.PREVIEW === 'boolean', true);
		assert.equal(typeof nodeCondition.BROWSER === 'boolean', true);
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

	test('internals', () => {
		assert.equal(typeof internalLogger.createLogger, 'function');
		assert.equal(typeof route.RequestMethod, 'object');
		assert.equal(typeof routeModule.RouteModule, 'function');
		assert.equal(typeof serverRuntime.createGracileHandler, 'function');
	});
});

/* eslint-disable @typescript-eslint/no-floating-promises */
// NOTE: WIP

import assert from 'node:assert/strict';
import { describe } from 'node:test';

//
import { defineConfig } from '@gracile/gracile';
import * as node from '@gracile/gracile/node';
// import document from '@gracile/gracile/document';
// import urlPattern from '@gracile/gracile/url-pattern';
import * as plugin from '@gracile/gracile/plugin';
import * as serverHtml from '@gracile/gracile/server-html';

describe('gracile package should do exports correctly', () => {
	assert.equal(typeof defineConfig, 'function');
	//
	// assert.equal(urlPattern.URLPattern, 'function');

	assert.equal(typeof plugin.gracile, 'function');
	assert.equal(typeof plugin.createGracileMiddleware, 'function');

	assert.equal(typeof node.printAddressInfos, 'function');
	assert.equal(typeof node.authenticateBasic, 'function');
	assert.equal(typeof node.notFoundHandler, 'function');

	assert.equal(typeof serverHtml.html, 'function');

	// assert.equal(document.RouteTemplateOutlet, 'function');
	// assert.equal(document.helpers.dev.errors, 'function');
});

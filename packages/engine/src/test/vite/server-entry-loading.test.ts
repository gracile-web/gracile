import assert from 'node:assert/strict';
import { describe, test } from 'node:test';

import { builtInServerEntryLoadingPage } from '../../errors/pages.js';
import { renderLitTemplate } from '../../render/lit-ssr.js';
import {
	createServerEntryReadyPath,
	createViteClientPath,
	isHtmlNavigationRequest,
	joinDevelopmentBasePath,
} from '../../vite/server-entry-loading.js';

describe('server entry loading helpers', () => {
	test('joins dev base paths without duplicating slashes', () => {
		assert.equal(joinDevelopmentBasePath('/', '@vite/client'), '/@vite/client');
		assert.equal(
			joinDevelopmentBasePath('/docs/', '__gracile/server-entry-ready'),
			'/docs/__gracile/server-entry-ready',
		);
	});

	test('detects browser navigation requests', () => {
		assert.equal(
			isHtmlNavigationRequest({
				method: 'GET',
				headers: { accept: 'text/html,application/xhtml+xml' },
			}),
			true,
		);

		assert.equal(
			isHtmlNavigationRequest({
				method: 'GET',
				headers: { 'sec-fetch-dest': 'document' },
			}),
			true,
		);

		assert.equal(
			isHtmlNavigationRequest({
				method: 'GET',
				headers: { accept: 'application/json' },
			}),
			false,
		);

		assert.equal(
			isHtmlNavigationRequest({
				method: 'POST',
				headers: { accept: 'text/html' },
			}),
			false,
		);
	});

	test('renders a loading page with the Vite client bridge and escaped details', async () => {
		const readyPath = createServerEntryReadyPath('/docs/');
		const viteClientPath = createViteClientPath('/docs/');
		const html = await renderLitTemplate(
			builtInServerEntryLoadingPage({
				entry: '/server/<entry>.ts',
				requestPath: '/docs/blog/?draft=1',
				viteClientPath,
				readyPath,
			}),
		);

		assert.match(
			html,
			/<meta name="gracile-vite-client-path" content="\/docs\/@vite\/client" \/>/,
		);
		assert.match(html, /viteClientScript\.src = viteClientPath/);
		assert.match(html, /fetch\(readyPath, \{/);
		assert.match(html, /window\.location\.reload\(\)/);
		assert.match(html, /\/docs\/__gracile\/server-entry-ready/);
		assert.match(html, /&lt;entry&gt;/);
	});
});

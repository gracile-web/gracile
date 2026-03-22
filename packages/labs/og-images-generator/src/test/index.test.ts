/* eslint-disable @typescript-eslint/no-floating-promises */
import test from 'node:test';
import assert from 'node:assert';

import * as api from '../api.js';

import { hash } from './_utilities.js';
// import { writeFile } from 'node:fs/promises';

import type { CollectOptions } from '../collect.js';
import { writeFile } from 'node:fs/promises';

const options: CollectOptions = {
	base: process.cwd() + '/src/test/__fixtures__/pages',
	out: process.cwd() + '/src/test/__fixtures__/.test-outputs',
	json: process.cwd() + '/src/test/__fixtures__/.test-outputs/index.json',
	additionalPatterns: [],
	globber: {},
};

const CONFIG =
	process.cwd() + '/src/test/__fixtures__/og-images.config.fixture.js';

const CONFIG_ASYNC =
	process.cwd() + '/src/test/__fixtures__/og-images-async.config.fixture.js';

test('Collect HTML pages metadata', async () => {
	const pages = await api.collectHtmlPages(options);

	assert.equal(hash(pages), '703137aef9805f0ca95b8c8b56619f84');
});

test('Fetch Source Sans', async () => {
	const font = await api.fetchFont(api.SOURCE_SANS_FONT_URL);

	assert.equal(hash(font), '060e4e9e30bcb9ae675a80328a87a687');
});

test('Load user config', async () => {
	const config = await api.loadUserConfig(CONFIG);

	assert.ok('template' in config);
	assert.ok('resvg' in config.renderOptions);
	assert.ok('satori' in config.renderOptions);
});

test('Generate single image', async () => {
	const config = await api.loadUserConfig(CONFIG);

	const image = await api.renderOgImage(config, {
		path: '/nested/page',
		meta: {
			tags: { 'og:title': 'hello', 'og:description': 'there' },
			jsonLds: [],
		},
	});

	assert.equal(hash(image), '951fcd6c24e7c6527f2caa3d8cbf32e6');
});

test('Generate single image with async. template', async () => {
	const config = await api.loadUserConfig(CONFIG_ASYNC);

	const image = await api.renderOgImage(config, {
		path: '/nested/page',
		meta: {
			tags: { 'og:title': 'hello', 'og:description': 'there' },
			jsonLds: [],
		},
	});

	// NOTE: For quick visual tests
	await writeFile(
		process.cwd() + '/src/test/__fixtures__/.test-outputs/img-test.png',
		image,
	);

	assert.equal(hash(image), '0dc1e02ff1f555c937543540ec8acdfc');
});

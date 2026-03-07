import test from 'node:test';
import assert from 'node:assert';

import * as api from '../src/api.js';
import { hash } from './_utils.js';
// import { writeFile } from 'node:fs/promises';

/** @type {import('../src/collect.js').CollectOptions} */
const options = {
	base: process.cwd() + '/test/__fixtures__/pages',
	out: process.cwd() + '/test/__fixtures__/.test-outputs',
	json: process.cwd() + '/test/__fixtures__/.test-outputs/index.json',
	additionalPatterns: [],
	globber: {},
};

test('Collect HTML pages metadata', async (t) => {
	const pages = await api.collectHtmlPages(options);

	assert.equal(hash(pages), 'c0a4d63001e47bd28ee3b2e84f11345a');
});

test('Fetch Source Sans', async (t) => {
	const font = await api.fetchFont(api.SOURCE_SANS_FONT_URL);

	assert.equal(hash(font), '060e4e9e30bcb9ae675a80328a87a687');
});

test('Load user config', async (t) => {
	const config = await api.loadUserConfig(
		process.cwd() + '/test/__fixtures__/og-images.config.fixture.js',
	);

	assert.ok('template' in config);
	assert.ok('resvg' in config.renderOptions);
	assert.ok('satori' in config.renderOptions);
});

test('Generate single image', async (t) => {
	const config = await api.loadUserConfig(
		process.cwd() + '/test/__fixtures__/og-images.config.fixture.js',
	);

	const image = await api.renderOgImage(config, {
		path: '/nested/page',
		meta: {
			tags: { 'og:title': 'hello', 'og:description': 'there' },
			jsonLds: [],
		},
	});

	assert.equal(hash(image), '951fcd6c24e7c6527f2caa3d8cbf32e6');
});

test('Generate single image with async. template', async (t) => {
	const config = await api.loadUserConfig(
		process.cwd() + '/test/__fixtures__/og-images-async.config.fixture.js',
	);

	const image = await api.renderOgImage(config, {
		path: '/nested/page',
		meta: {
			tags: { 'og:title': 'hello', 'og:description': 'there' },
			jsonLds: [],
		},
	});

	// NOTE: For quick visual tests
	// await writeFile(
	// 	process.cwd() + '/test/__fixtures__/.test-outputs/img-test.png',
	// 	image,
	// );

	assert.equal(hash(image), '0dc1e02ff1f555c937543540ec8acdfc');
});

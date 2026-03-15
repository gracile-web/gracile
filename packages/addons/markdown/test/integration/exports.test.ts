/* eslint-disable @typescript-eslint/no-floating-promises */

import assert from 'node:assert';
import { describe, test } from 'node:test';

import * as markdownModule from '@gracile/markdown/module';
import * as markdownRenderer from '@gracile/markdown/renderer';
import * as markdownVite from '@gracile/markdown/vite';
import { html } from 'lit';

import { noop } from '@gracile/internal-test-utils/noop';

describe('@gracile/markdown exports', () => {
	test('vite plugin', () => {
		assert.equal(typeof markdownVite.viteMarkdownPlugin, 'function');
	});

	test('renderer classes', () => {
		assert.equal(
			typeof markdownRenderer.MarkdownDocumentRendererEmpty,
			'function',
		);
		assert.equal(typeof markdownRenderer.MarkdownRendererBase, 'function');
	});

	test('types', () => {
		const t1: markdownModule.Heading = { text: 'hey', slug: 'hey', depth: 1 };
		const t2: markdownModule.MarkdownModule = {
			path: { absolute: '', relative: '' },
			body: { html: 'a', lit: html`a` },
			excerpt: { html: 'a', lit: html`a`, text: '' },
			meta: {
				slug: 'a',
				title: 'a',
				frontmatter: { foo: 1 },
				tableOfContents: [],
				tableOfContentsFlat: [],
			},
			source: { file: '', markdown: '', yaml: '' },
		};
		const t3: markdownModule.TocLevel = {
			text: 'a',
			depth: 0,
			slug: 'a',
			children: [],
		};

		noop(t1, t2, t3);
	});
});

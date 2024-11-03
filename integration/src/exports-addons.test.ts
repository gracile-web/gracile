/* eslint-disable @typescript-eslint/no-floating-promises */
// NOTE: Work-in-Progress

import '@gracile/gracile/hydration-elements';
import '@gracile/markdown/ambient';
import '@gracile/svg/ambient';
import '@gracile-labs/css-helpers/ambient';

import assert from 'node:assert';
import { describe, test } from 'node:test';

import * as markdownModule from '@gracile/markdown/module';
import * as markdownRenderer from '@gracile/markdown/renderer';
import * as markdownVite from '@gracile/markdown/vite';
import * as mdPresetMarked from '@gracile/markdown-preset-marked/renderer';
import * as metadata from '@gracile/metadata';
import * as metadataOptions from '@gracile/metadata/config-options';
import * as svg from '@gracile/svg/vite';
import * as cssHelpersGlobalCss from '@gracile-labs/css-helpers/global-css-provider';
// import * as csrRouter from '@gracile-labs/client-router/router';
import { html } from 'lit';

import { noop } from './__utils__/noop.js';

describe('gracile addons should do their exports correctly', () => {
	test('addon - markown', () => {
		assert.equal(typeof markdownVite.viteMarkdownPlugin, 'function');
		assert.equal(
			typeof markdownRenderer.MarkdownDocumentRendererEmpty,
			'function',
		);
		assert.equal(typeof markdownRenderer.MarkdownRendererBase, 'function');

		// MARK: TYSTS
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

		// NOTE: AMBIENT
		const t4: typeof import('./dummy.md') = { default: t2 };

		noop(t1, t2, t3, t4);
	});

	test('addon - svg', () => {
		assert.equal(typeof svg.viteSvgPlugin, 'function');

		// MARK: TYSTS
		// NOTE: AMBIENT
		const t1: typeof import('./dummy.svg') = { default: html`abc` };

		noop(t1);
	});

	test('addon - metadata', () => {
		assert.equal(typeof metadata.createMetadata, 'function');

		// MARK: TYSTS
		const t1: metadataOptions.Breadcrumbs = [{ name: 'a' }];
		const t2: metadataOptions.MetadataConfig = { author: 'a' };

		noop(t1, t2);
	});

	test('css helpers - global styles provider', () => {
		assert.equal(typeof cssHelpersGlobalCss.globalStylesProvider, 'function');

		const globalStyles =
			null as unknown as HTMLElementTagNameMap['adopt-global-styles'];

		const elems = html` <route-template-outlet></route-template-outlet> `;
		noop(globalStyles, elems);
	});

	test('addon - md preset marked', () => {
		assert.equal(typeof mdPresetMarked.MarkdownRenderer, 'function');
	});

	test('addon - client side routing', () => {
		// FIXME:
		// assert.equal(typeof csrRouter.createRouter, 'function');
	});
});

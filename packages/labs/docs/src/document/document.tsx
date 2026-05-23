'use html-server';

import { fileURLToPath } from 'node:url';

import '../lib/iconify-icon.js';
import '../lib/unpic-element.js';
import '../lib/copy-button.js';

import { createMetadata, type Breadcrumbs } from '@gracile/metadata';

import { SITE_TITLE, SITE_URL } from '@gracile-docs/site';
import { colorModeCritical } from '../lib/color-mode/color-mode-critical.js';
import { keepScrollingPositionCritical } from '../lib/keep-scroll-position/ksp-critical.js';

import {
	favicon,
	googleAnalytics,
	pagePathToOgPath,
	requestIdleCallbackPolyfill,
} from './document-helpers.js';

// Absolute paths to document-level client assets, served via Vite's /@fs/ prefix
// because document.tsx lives in the lib (outside the consumer Vite root).
const _docDir = fileURLToPath(new URL('.', import.meta.url));
const DOC_STYLES = `/@fs${_docDir}document.scss`;
const DOC_CLIENT = `/@fs${_docDir}document.client.ts`;

export const document = (options: {
	url: URL;
	title?: string;
	description?: string;
	breadcrumbs?: Breadcrumbs;
	layout?: 'bare' | 'default' | 'blog';
	page?: string;
}) => {
	// HACK: `/docs//` can appear due to a trailing-slash normalization issue
	// in the paths-handler layer; strip it here until that is fixed upstream.
	const normalizedPathname = options.url.pathname.replace(/docs\/\/$/, 'docs/');
	const ogImageUrl =
		(import.meta.env.DEV ? '' : SITE_URL.replace(/\/$/, '')) +
		pagePathToOgPath(normalizedPathname);

	return (
		<html
			lang="en"
			class:list={[
				`page-${
					options.page ||
					options.url.pathname
						//
						.slice(1)
						.replaceAll('/', '-')
						.slice(0, -1) ||
					'home'
				}`,
				'layout-' + (options.layout || 'default'),
				'sl-theme-dark',
			]}
		>
			<head>
				{colorModeCritical}

				{googleAnalytics}

				{requestIdleCallbackPolyfill}

				<link rel="stylesheet" href={DOC_STYLES} />
				<script type="module" src={DOC_CLIENT}></script>

				{createMetadata({
					siteTitle: SITE_TITLE,
					pageTitle: `${SITE_TITLE} | ${options.title}`,

					pageDescription: options.description ?? '-',
					ogImageUrl,

					generator: 'Gracile v0-Alpha',
					canonicalUrl: SITE_URL,
					author: 'Julian Cataldo',
					license: 'ISC',
					favicon: false,

					jsonLd: { breadcrumbs: options.breadcrumbs || [] },
					colorScheme: 'dark light',
				})}

				{favicon}
			</head>

			<body data-pagefind-body>
				<route-template-outlet></route-template-outlet>

				{keepScrollingPositionCritical}
			</body>
		</html>
	);
};

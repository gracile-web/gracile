'use html-server';

import '../lib/iconify-icon.js';
import '../lib/unpic-element.js';
import '../lib/copy-button.js';

import { createMetadata, type Breadcrumbs } from '@gracile/metadata';
import { SITE_TITLE, SITE_URL } from '../content/global.js';
import { colorModeCritical } from '../lib/color-mode/color-mode-critical.js';

import {
	favicon,
	googleAnalytics,
	pagePathToOgPath,
	requestIdleCallbackPolyfill,
} from './document-helpers.js';
import { keepScrollingPositionCritical } from '../lib/keep-scroll-position/ksp-critical.js';

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

				<link rel="stylesheet" href="/src/document/document.scss" />
				<script type="module" src="/src/document/document.client.ts"></script>

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

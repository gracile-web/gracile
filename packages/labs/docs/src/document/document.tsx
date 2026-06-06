'use html-server';

import '../lib/iconify-icon.js';
import '../lib/unpic-element.js';
import '../lib/copy-button.js';

import { createMetadata, type Breadcrumbs } from '@gracile/metadata';
import { docsConfig } from '@gracile-docs/content';

import { navCurrentPageCritical } from '../lib/nav-current-page-critical.js';
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

const _docDir = import.meta.dirname;
const DOC_STYLES = `/@fs${_docDir}/document.css`;
const DOC_CLIENT = `/@fs${_docDir}/document.client.js`;

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
	const { site } = docsConfig;
	const ogImageUrl =
		(import.meta.env.DEV ? '' : site.url.replace(/\/$/, '')) +
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
				// 'wa-theme-default',
			]}
		>
			<head>
				{colorModeCritical}

				{googleAnalytics}

				{requestIdleCallbackPolyfill}

				<link rel="stylesheet" href={DOC_STYLES} />
				<script type="module" src={DOC_CLIENT}></script>

				{createMetadata({
					siteTitle: site.title,
					pageTitle: `${site.title} | ${options.title}`,

					pageDescription: options.description ?? '-',
					ogImageUrl,

					generator: 'Gracile v0-Alpha',
					canonicalUrl: site.url,
					author: site.authors,
					license: site.license,
					favicon: false,

					jsonLd: { breadcrumbs: options.breadcrumbs || [] },
					colorScheme: 'dark light',
				})}

				{favicon(site.logoHref, site.themeColor)}
			</head>

			<body data-pagefind-body>
				<route-template-outlet></route-template-outlet>

				{keepScrollingPositionCritical}
				{navCurrentPageCritical}
			</body>
		</html>
	);
};

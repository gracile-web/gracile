import { createLogger } from '@gracile/internal-utils/logger/helpers';
import type { ServerRenderedTemplate } from '@lit-labs/ssr';
import { html } from '@lit-labs/ssr';
import { unsafeHTML } from 'lit/directives/unsafe-html.js';

import type { MetadataConfig } from './config-options.js';

const logger = createLogger();

/**
 * Ouput all useful tags to put in document head.
 *
 * - [Validate X (Twitter) Cards](https://cards-dev.twitter.com/validator)
 * - [Preview social share with Chromium extension](https://chromewebstore.google.com/detail/social-share-preview/ggnikicjfklimmffbkhknndafpdlabib)
 *
 */
export function createMetadata(
	config: MetadataConfig,
	warn?: boolean,
): ServerRenderedTemplate[] {
	const result: ServerRenderedTemplate[] = [];

	// eslint-disable-next-line unicorn/text-encoding-identifier-case
	const charset = config.charset ?? 'UTF-8';
	result.push(html`
		<!--  -->

		<meta charset=${charset} />
		<meta
			name="viewport"
			content=${config.viewport ?? 'width=device-width, initial-scale=1.0'}
		/>
	`);

	if (warn && config.pageTitle && config.pageTitle?.length > 55)
		logger.warn('Page title exceeding 50 characters!');
	if (warn && config.pageDescription && config.pageDescription?.length > 150)
		logger.warn('Page description exceeding 150 characters!');

	if (config.canonicalUrl)
		result.push(html`
			<!--  -->
			<link href=${config.canonicalUrl} rel="canonical" />
			<meta property="og:url" content=${config.canonicalUrl} />
			<meta name="twitter:url" content=${config.canonicalUrl} />
		`);

	result.push(html`
		<!--  -->
		<meta property="og:type" content="website" />
	`);

	if (config.locale !== false)
		result.push(html`
			<!--  -->
			<meta property="og:locale" content=${config.localeValue ?? 'en_US'} />
		`);

	if (config.xAuthorAccountHandle)
		result.push(html`
			<!--  -->
			<meta name="twitter:site" content=${`@${config.xAuthorAccountHandle}`} />
		`);

	if (config.xSiteAccountHandle)
		result.push(html`
			<!--  -->
			<meta name="twitter:creator" content=${`@${config.xSiteAccountHandle}`} />
		`);

	if (config.siteTitle)
		result.push(html`
			<meta name="apple-mobile-web-app-title" content=${config.siteTitle} />
			<meta property="og:site_name" content=${config.siteTitle} />
		`);

	if (config.pageTitle) result.push(html` <title>${config.pageTitle}</title> `);

	const ogTitle = config.pageTitle || config.ogTitle;
	if (ogTitle)
		result.push(html`
			<meta property="og:title" content=${ogTitle} />
			<meta name="twitter:title" content=${ogTitle} />
		`);

	if (config.pageDescription)
		result.push(html`
			<meta property="og:image:alt" content=${config.pageDescription} />
			<meta
				name="description"
				property="og:description"
				content=${config.pageDescription}
			/>
			<meta name="twitter:description" content=${config.pageDescription} />
		`);

	if (config.ogImageUrl)
		result.push(html`
			<meta property="og:image" content=${config.ogImageUrl} />
			<meta name="twitter:image:src" content=${config.ogImageUrl} />
			<meta name="twitter:card" content="summary_large_image" />
			<meta property="og:image:width" content="1200" />
			<meta property="og:image:height" content="630" />
		`);

	if (config.author)
		result.push(html`
			<!--  -->
			<meta name="author" content=${config.author} />
		`);

	if (config.license)
		result.push(html`
			<!--  -->
			<meta name="copyright" content=${config.license} />
		`);

	if (config.generator)
		result.push(html` <meta name="generator" content=${config.generator} /> `);

	if (config.favicon !== false)
		result.push(html`
			<!--  -->
			<link
				type="image/svg+xml"
				href=${config.faviconUrl ?? '/favicon.svg'}
				rel="icon"
			/>
		`);

	if (config.sitemap !== false)
		result.push(html`
			<link
				type="application/xml"
				href=${config.sitemapUrl ?? '/sitemap.xml'}
				rel="sitemap"
			/>
		`);

	if (config.viewTransition)
		result.push(html`
			<meta
				name="view-transition"
				content=${typeof config.viewTransition === 'string'
					? config.viewTransition
					: 'same-origin'}
			/>
		`);

	if (config.jsonLd?.breadcrumbs?.length)
		result.push(html`
			<script type="application/ld+json">
				${unsafeHTML(
					JSON.stringify(
						{
							'@context': 'https://schema.org',
							'@type': 'BreadcrumbList',
							itemListElement: config.jsonLd.breadcrumbs.map(
								(crumb, index) => ({
									'@type': 'ListItem',
									position: index + 1,
									name: crumb.name,
									item: crumb.href
										? // Join by removing possible duplicate slashes
											`${(config.canonicalUrl ?? '').replace(/\/$/, '')}/${crumb.href.replace(/^\//, '')}`
										: undefined,
								}),
							),
						},
						null,
						2,
					),
				)}
			</script>
		`);

	if (config.colorScheme)
		result.push(html`
			<meta name="color-scheme" content=${config.colorScheme} />
		`);

	return result;
}

export { type MetadataConfig, type Breadcrumbs } from './config-options.js';

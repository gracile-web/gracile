export interface MetadataConfig {
	canonicalUrl?: string | undefined;
	siteTitle?: string | undefined;

	pageTitle?: string | undefined;
	ogTitle?: string | undefined;
	pageDescription?: string | undefined;

	ogImageUrl?: string | undefined;

	author?: string | undefined;
	license?: string | undefined;
	generator?: string | undefined;

	jsonLd?: {
		breadcrumbs?: Breadcrumbs;
	};

	/**
	 * @defaultValue true
	 */
	sitemap?: boolean | undefined;
	/**
	 * @defaultValue "/sitemap.xml"
	 */
	sitemapUrl?: string | undefined;

	/**
	 * @defaultValue true
	 */
	favicon?: boolean | undefined;
	/**
	 * @defaultValue "/favicon.svg"
	 */
	faviconUrl?: string | undefined;

	/**
	 * @defaultValue true
	 */
	locale?: boolean | undefined;
	/**
	 * @defaultValue "en_US"
	 */
	localeValue?: string | undefined;

	/**
	 * @example `foo_user123`. \@ will be appended.
	 */
	xAuthorAccountHandle?: string | undefined;
	/**
	 * @example `foo_site123`. \@ will be appended.
	 */
	xSiteAccountHandle?: string | undefined;

	/**
	 * @defaultValue "UTF-8"
	 */
	charset?: string | undefined;
	/**
	 * @defaultValue "width=device-width, initial-scale=1.0"
	 */
	viewport?: string | undefined;
	/**
	 * @defaultValue `both`
	 */
	colorScheme?: 'dark light' | 'light dark' | 'normal' | 'only light';
	/**
	 * @defaultValue `false`
	 */
	viewTransition?: boolean | string | undefined;
}

export type Breadcrumbs = { name: string; href?: string }[];

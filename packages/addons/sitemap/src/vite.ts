import { Readable } from 'node:stream';

import { logger } from '@gracile/internal-utils/logger';
import c from 'picocolors';
import { SitemapStream, streamToPromise } from 'sitemap';
import type { Plugin } from 'vite';

const VITE_PLUGIN_NAME = 'vite-plugin-gracile-sitemap';

export function viteSitemapPlugin(options: {
	siteUrl: string;
	/**
	 * Default value:
	 *
	 * ```js
	 * [['User-agent', '*'], ['Allow', '/'], ['Sitemap', `${hostname}sitemap.xml`]]
	 * ```
	 */
	robotsTxt?: [string, string][] | false;
}): Plugin {
	return {
		name: VITE_PLUGIN_NAME,
		enforce: 'post',

		async generateBundle(_, bundle) {
			const links = Object.entries(bundle)

				.filter(([, asset]) => asset.fileName.endsWith('.html'))
				.map(([, asset]) =>
					`/${asset.fileName}`.replace(/\/index\.html$/, '/'),
				);

			const hostname = options.siteUrl.endsWith('/')
				? options.siteUrl
				: `${options.siteUrl}/`;

			const stream = new SitemapStream({
				hostname,
			});

			const map = await streamToPromise(Readable.from(links).pipe(stream)).then(
				(data) => {
					return data.toString();
				},
			);

			this.emitFile({
				fileName: 'sitemap.xml',
				type: 'asset',
				source: map,
			});

			if (options.robotsTxt !== false) {
				this.emitFile({
					fileName: 'robots.txt',
					type: 'asset',
					source: `
	${
		typeof options.robotsTxt === 'object'
			? options.robotsTxt
					.map(([option, value]) => `${option}: ${value}`)
					.join('\n')
			: `
User-agent: *
Allow: /
	`.trim()
	}

Sitemap: ${options.siteUrl}sitemap.xml
					`.trim(),
				});
			}

			logger.info(c.cyan(c.bold('Sitemap generated. Found links:')));
			logger.info(c.gray(`- ${links.join('\n- ')}`));
		},
	};
}

import { Readable } from 'node:stream';

import { getLogger } from '@gracile/internal-utils/logger/helpers';
import c from 'picocolors';
import { SitemapStream, streamToPromise } from 'sitemap';
import type { PluginOption } from 'vite';

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

	// NOTE: for Vite versions mismatches with `exactOptionalPropertyTypes`?
	// This `any[]` AND with a plugin -array- makes ESLint and TS shut up.
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
}): any[] {
	const logger = getLogger();

	let isSsrBuild = false;

	return [
		{
			name: VITE_PLUGIN_NAME,
			enforce: 'post',

			config(_, environment) {
				isSsrBuild = environment.isSsrBuild || false;
			},

			async generateBundle(_, bundle) {
				if (isSsrBuild) {
					logger.warn(
						`\n${VITE_PLUGIN_NAME} is only compatible with static output! Skipping…\n`,
					);
					return;
				}

				const links = Object.entries(bundle)
					.filter(([, asset]) => asset.fileName.endsWith('.html'))
					.map(([, asset]) =>
						`/${asset.fileName}`.replace(/\/index\.html$/, '/'),
					);

				if (links.length < 2) {
					logger.warn(
						`\n${VITE_PLUGIN_NAME} hasn't found any built HTML pages! Skipping…\n`,
					);
					return;
				}

				const hostname = options.siteUrl.endsWith('/')
					? options.siteUrl
					: `${options.siteUrl}/`;

				const stream = new SitemapStream({
					hostname,
				});

				const map = await streamToPromise(
					Readable.from(links).pipe(stream),
				).then((data) => {
					return data.toString();
				});

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
		} satisfies PluginOption,
	];
}

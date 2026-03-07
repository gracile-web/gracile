import {
	renderOgImage,
	loadUserConfig,
	extractMetadataFromHtml,
	ogPathToPagePath,
	DEFAULT_OG_PATH_PREFIX,
} from 'og-images-generator/api';

/**
 * @typedef {() => Promise<import('../generate.js').UserConfig>} ConfigReloader
 * @param {object} [options]
 * @param {string} [options.pathPrefix] - Default: `/og/`
 * @param {boolean} [options.trailingSlash] - Default: `true`
 * @param {ConfigReloader} [options.configReloader]
 * @returns {Promise<import('connect').NextHandleFunction>}
 */
export async function connectOgImagesGenerator(options) {
	let config = options?.configReloader ? null : await loadUserConfig();

	const prefix = options?.pathPrefix ?? DEFAULT_OG_PATH_PREFIX;

	return async (req, res, next) => {
		if (options?.configReloader) config = await options.configReloader();

		if (!config) return next();
		if (!req.url) return next();
		if (req.url.startsWith(prefix) === false) return next();

		const base = 'http://' + req.rawHeaders[req.rawHeaders.indexOf('Host') + 1];
		const path = ogPathToPagePath(
			req.url,
			options?.pathPrefix,
			options?.trailingSlash,
		);

		const pageUrl = new URL(path, base).href;

		const associatedPageHtml = await (await fetch(pageUrl)).text();

		const meta = extractMetadataFromHtml(associatedPageHtml);

		const image = await renderOgImage(config, { path, meta });

		res.setHeader('Content-Type', 'image/png');
		// HACK:
		await new Promise(() => setTimeout(() => res.end(image), 0));
	};
}

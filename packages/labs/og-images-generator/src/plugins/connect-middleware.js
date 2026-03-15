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

	return async (request, res, next) => {
		if (options?.configReloader) config = await options.configReloader();

		if (!config) return next();
		if (!request.url) return next();
		if (request.url.startsWith(prefix) === false) return next();

		const base =
			'http://' + request.rawHeaders[request.rawHeaders.indexOf('Host') + 1];
		const path = ogPathToPagePath(
			request.url,
			options?.pathPrefix,
			options?.trailingSlash,
		);

		const pageUrl = new URL(path, base).href;

		const fetched = await fetch(pageUrl);
		const associatedPageHtml = await fetched.text();

		const meta = extractMetadataFromHtml(associatedPageHtml);

		const image = await renderOgImage(config, { path, meta });

		res.setHeader('Content-Type', 'image/png');
		// HACK:
		await new Promise(() => setTimeout(() => res.end(image), 0));
	};
}

import type { NextHandleFunction } from 'connect';

import type { Page } from '../collect.js';
import { extractMetadataFromHtml } from '../collect.js';
import type { UserConfig } from '../generate.js';
import { loadUserConfig } from '../generate.js';
import { ogPathToPagePath, DEFAULT_OG_PATH_PREFIX } from '../paths.js';
import { renderOgImage } from '../render.js';

export type ConfigReloader = () => Promise<UserConfig>;

export interface ConnectOgOptions {
	pathPrefix?: string;
	trailingSlash?: boolean;
	configReloader?: ConfigReloader;
}

export async function connectOgImagesGenerator(
	options?: ConnectOgOptions,
): Promise<NextHandleFunction> {
	let config: UserConfig | null = options?.configReloader
		? null
		: await loadUserConfig();

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
		await new Promise<void>((resolve) =>
			setTimeout(() => {
				res.end(image);
				resolve();
			}, 0),
		);
	};
}

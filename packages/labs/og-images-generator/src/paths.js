// For dynamic loading (middlewares…)

export const DEFAULT_OG_PATH_PREFIX = '/og/';

/**
 * @param {string} pathName
 * @param {string} [pathPrefix]
 * @returns {string}
 */
export function ogPathToPagePath(
	pathName,
	pathPrefix = DEFAULT_OG_PATH_PREFIX,
	trailingSlash = true,
) {
	const suffix = trailingSlash ? '/' : '';
	return pathName
		.replace(pathPrefix ?? '', '')
		.replace(/^index.png$/, suffix)
		.replace(/\.png$/, suffix);
}

/**
 * @param {string} pathName
 * @param {string} [pathPrefix]
 * @returns {string}
 */
export function pagePathToOgPath(
	pathName,
	pathPrefix = DEFAULT_OG_PATH_PREFIX,
) {
	return (
		pathPrefix.slice(0, -1) +
		(pathName === '/' ? '/index.png' : pathName.replace(/\/$/, '') + '.png')
	);
}

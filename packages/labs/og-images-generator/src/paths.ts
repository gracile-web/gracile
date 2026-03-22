// For dynamic loading (middlewares…)

export const DEFAULT_OG_PATH_PREFIX = '/og/';

export function ogPathToPagePath(
	pathName: string,
	pathPrefix: string = DEFAULT_OG_PATH_PREFIX,
	trailingSlash = true,
): string {
	const suffix = trailingSlash ? '/' : '';
	return pathName
		.replace(pathPrefix ?? '', '')
		.replace(/^index.png$/, suffix)
		.replace(/\.png$/, suffix);
}

export function pagePathToOgPath(
	pathName: string,
	pathPrefix: string = DEFAULT_OG_PATH_PREFIX,
): string {
	return (
		pathPrefix.slice(0, -1) +
		(pathName === '/' ? '/index.png' : pathName.replace(/\/$/, '') + '.png')
	);
}

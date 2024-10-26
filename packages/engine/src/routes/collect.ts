import { join } from 'node:path';

import { getLogger } from '@gracile/internal-utils/logger/helpers';
import * as paths from '@gracile/internal-utils/paths';
import { fdir as Fdir } from 'fdir';
import c from 'picocolors';
import { URLPattern } from 'urlpattern-polyfill/urlpattern';
import { createFilter } from 'vite';

import { emptyRoutes } from '../logging/messages.js';

import { prepareSortableRoutes, routeComparator } from './comparator.js';
import { REGEXES } from './load-module.js';
import type * as R from './route.js';

const logger = getLogger();

function extractRoutePatterns(
	routeFilePath: string,
): Pick<R.Route, 'pattern' | 'hasParams'> & { patternString: string } {
	const routePathname = routeFilePath.replace(/\.(js|ts|jsx|tsx|html)$/, '');

	let pathParts = routePathname.split(
		paths.isWindows() ? paths.WINDOWS_PATH_SEPARATOR : '/',
	);
	const last = pathParts.at(-1);
	if (last === undefined) throw new ReferenceError('Cannot parse file path.');

	if (
		// NOTE: /foo/(foo) => /foo
		/\((.*)\)/.test(last) ||
		// NOTE: /foo/index => /foo
		last === 'index'
	)
		pathParts.pop();

	if (pathParts.length === 1 && pathParts.at(0) === 'index') pathParts = [];

	let hasParameters = false;

	const pathRelativeNormalized = pathParts.map((pathEntry) => {
		let entry = pathEntry;

		if (REGEXES.rest.test(entry)) {
			hasParameters = true;
			return pathEntry.replace(
				REGEXES.rest,
				(_s, parameter) => `:${parameter}*`,
			);
		}

		while (REGEXES.param.test(entry)) {
			hasParameters = true;
			entry = entry.replace(REGEXES.param, (_s, parameter) => {
				return `{:${parameter}}`;
			});
		}

		return entry;
	});

	const trailingSlash = pathRelativeNormalized.length > 0 ? '/' : '';
	const normalizedUrlPattern = `/${pathRelativeNormalized.join('/')}${trailingSlash}`;

	return {
		patternString: normalizedUrlPattern,
		pattern: new URLPattern(normalizedUrlPattern, 'http://gracile/'),
		hasParams: hasParameters,
	};
}

export const WATCHED_FILES_REGEX =
	/\/src\/routes\/(.*)\.(js|ts|jsx|tsx|html|css|scss|sass|less|styl|stylus)$/;

export async function collectRoutes(
	routes: R.RoutesManifest,
	root: string,
	excludePatterns: string[] = [],
): Promise<void> {
	routes.clear();

	const routesFolder = 'src/routes';
	const routesFolderAbsolute = join(root, routesFolder);

	// relative(routesFolderAbsolute, file);

	const allFilesInRoutes: string[] = await new Fdir()
		.withRelativePaths()
		.crawl(routesFolderAbsolute)
		.withPromise();

	const serverEntrypointsFilter = createFilter(
		['**/*.{js,ts,jsx,tsx,html}'],
		[
			//
			'**/*.client.{js,ts,jsx,tsx}',
			'**/*.document.{js,ts,jsx,tsx}',
			'**/_*/**',
			'**/_*',
			'**/.*',
			...excludePatterns,
		],
	);
	const serverEntrypoints = allFilesInRoutes.filter((f) =>
		serverEntrypointsFilter(f),
	);

	if (serverEntrypoints.length === 0) {
		logger.warnOnce(emptyRoutes(), {
			timestamp: true,
		});
		return;
	}

	// MARK: Routes priority order
	// TODO: `prepareSortableRoutes` and `routeComparator` in same function `sortRoutes`.
	const serverEntrypointsSorted = prepareSortableRoutes(serverEntrypoints)
		.sort((a, b) => routeComparator(a, b))
		.map((r) => r.route);

	const serverPageClientAssetsFilter = createFilter(
		['**/*.client.{js,ts,jsx,tsx}', '**/*.{css,scss,sass,less,styl,stylus}'],
		[...excludePatterns],
	);
	const serverPageClientAssets = allFilesInRoutes.filter((f) =>
		serverPageClientAssetsFilter(f),
	);

	logger.info(
		`\n${c.underline(`Found ${c.bold('routes')}`)}:\n` +
			`${c.dim('- ')}${serverEntrypointsSorted
				.map((f) => {
					const pathParts = f.split('/');

					return pathParts
						.map((part, index) => {
							if (/\[\./.test(part)) return c.cyan(c.italic(part));
							if (/\[/.test(part)) return c.cyan(part);
							if (/\(/.test(part)) return c.yellow(part);
							if (index === pathParts.length - 1) return c.green(part);
							return part;
						})
						.join(c.gray('/'));
				})
				.join(c.dim('\n- '))}\n`,
	);

	// MARK: Associate

	for (const routePath of serverEntrypointsSorted) {
		const filePath = join(routesFolder, routePath);
		const routeWithPatterns = extractRoutePatterns(routePath);

		routes.set(routeWithPatterns.patternString, {
			filePath,
			pattern: routeWithPatterns.pattern,

			hasParams: routeWithPatterns.hasParams,
			pageAssets: [],
			// NOTE: Not implemented here!
			// prerender: null,
		});
	}

	for (const routePath of serverPageClientAssets) {
		// NOTE: Exact extension needed client side by Vite.
		const assetPathWithExtension = join(routesFolder, routePath);

		for (const route of routes.values())
			if (
				paths.removeAllExtension(route.filePath) ===
				paths.removeAllExtension(assetPathWithExtension)
			)
				route.pageAssets.push(assetPathWithExtension);
	}
}

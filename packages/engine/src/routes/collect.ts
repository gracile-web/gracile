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
	const routePathname = routeFilePath.replace(/\.[j|t]s$/, '');

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

	let hasParams = false;

	const pathRelNorm = pathParts.map((pathEntry) => {
		let entry = pathEntry;

		if (entry.match(REGEXES.rest)) {
			hasParams = true;
			return pathEntry.replace(REGEXES.rest, (_s, param) => `:${param}*`);
		}

		while (REGEXES.param.test(entry)) {
			hasParams = true;
			entry = entry.replace(REGEXES.param, (_s, param) => {
				return `{:${param}}`;
			});
		}

		return entry;
	});

	const trailingSlash = pathRelNorm.length > 0 ? '/' : '';
	const normalizedUrlPattern = `/${pathRelNorm.join('/')}${trailingSlash}`;

	return {
		patternString: normalizedUrlPattern,
		pattern: new URLPattern(normalizedUrlPattern, 'http://gracile/'),
		hasParams,
	};
}

export const WATCHED_FILES_REGEX =
	/\/src\/routes\/(.*)\.(ts|js|css|scss|sass|less|styl|stylus)$/;
// const routes: R.RoutesManifest = new Map<string, R.Route>();

export async function collectRoutes(
	routes: R.RoutesManifest,
	root: string /* vite: ViteDevServer */,
	excludePatterns: string[] = [],
	// single: { file?: string; event: 'add' },
): Promise<void> {
	routes.clear();

	const routesFolder = 'src/routes';
	const routesFolderAbsolute = join(root, routesFolder);

	// relative(routesFolderAbsolute, file);

	const allFilesInRoutes: string[] = await new Fdir()
		.withRelativePaths()
		.crawl(routesFolderAbsolute)
		.withPromise();

	// console.log({ allFilesInRoutes });

	const serverEntrypointsFilter = createFilter(
		['**/*.{js,ts}'],
		[
			//
			'**/*.client.{js,ts}',
			'**/*.document.{js,ts}',
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
	// TODO: `prepareSortableRoutes` and `routeComparator` in same function `sortRoutes`
	const serverEntrypointsSorted = prepareSortableRoutes(serverEntrypoints)
		.sort((a, b) => routeComparator(a, b))
		.map((r) => r.route);

	const serverPageClientAssetsFilter = createFilter(
		['**/*.client.{js,ts}', '**/*.{css,scss,sass,less,styl,stylus}'],
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
							if (part.match(/\[\./)) return c.cyan(c.italic(part));
							if (part.match(/\[/)) return c.cyan(part);
							if (part.match(/\(/)) return c.yellow(part);
							if (index === pathParts.length - 1) return c.green(part);
							return part;
						})
						.join(c.gray('/'));
				})
				.join(c.dim('\n- '))}\n`,
	);

	// MARK: Associate

	serverEntrypointsSorted.forEach((routePath) => {
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
	});

	serverPageClientAssets.forEach((routePath) => {
		// NOTE: Exact extension needed client side by Vite.
		const assetPathWithExt = join(routesFolder, routePath);

		routes.forEach((route) => {
			if (
				paths.removeAllExt(route.filePath) ===
				paths.removeAllExt(assetPathWithExt)
			)
				route.pageAssets.push(assetPathWithExt);
		});
	});
}

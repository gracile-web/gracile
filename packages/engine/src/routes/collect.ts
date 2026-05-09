import { join } from 'node:path';

import { getLogger } from '@gracile/internal-utils/logger/helpers';
import * as paths from '@gracile/internal-utils/paths';
import { fdir as Fdir } from 'fdir';
import c from 'picocolors';
import { createFilter } from 'vite';

import { emptyRoutes } from '../logging/messages.js';
import type { ProgrammaticRoute } from '../user-config.js';

import { prepareSortableRoutes, routeComparator } from './comparator.js';
import { REGEXES } from './load-module.js';
import type * as R from './route.js';

const logger = getLogger();

/** @internal Exported for unit testing. */
export function extractRoutePatterns(
	routeFilePath: string,
	trailingSlash: 'always' | 'never' | 'ignore' = 'ignore',
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

	const isRoot = pathRelativeNormalized.length === 0;
	const slash = isRoot || trailingSlash === 'never' ? '' : '/';
	const normalizedUrlPattern = `/${pathRelativeNormalized.join('/')}${slash}`;

	return {
		patternString: normalizedUrlPattern,
		pattern: new URLPattern(normalizedUrlPattern, 'http://gracile/'),
		hasParams: hasParameters,
	};
}

export const WATCHED_ROUTES_FILES_REGEX =
	/\/src\/routes\/(.*)\.(js|ts|jsx|tsx|html|css|scss|sass|less|styl|stylus)$/;
/**
 * Normalize a user-provided pattern string (URLPattern syntax) according to
 * the configured `trailingSlash` strategy, mirroring `extractRoutePatterns`.
 */
function normalizeProgrammaticPattern(
	pattern: string,
	trailingSlash: 'always' | 'never' | 'ignore',
): Pick<R.Route, 'pattern' | 'hasParams'> & { patternString: string } {
	const hasParameters = /[*:{]/.test(pattern);
	const isRoot = pattern === '/' || pattern === '';

	let normalized = pattern.startsWith('/') ? pattern : `/${pattern}`;

	// Convert bare :param to {:param} to match file-based route format
	// (file-based routes produce {:param} from [param] brackets).
	// This ensures render.ts can correctly substitute static path values.
	// Don't touch :param* (rest/wildcard params) — those are handled separately.
	normalized = normalized.replaceAll(/:(\w+)(?![*+])/g, '{:$1}');

	if (!isRoot) {
		if (trailingSlash === 'never') {
			if (normalized.endsWith('/')) normalized = normalized.slice(0, -1);
		} else {
			// 'always' or 'ignore' — ensure trailing slash, matching file-based behavior
			if (!normalized.endsWith('/')) normalized = `${normalized}/`;
		}
	}

	return {
		patternString: normalized,
		pattern: new URLPattern(normalized, 'http://gracile/'),
		hasParams: hasParameters,
	};
}

/**
 * Convert a URLPattern string key (e.g. `/blog/{:slug}/` or `/docs/:path+/`)
 * into a file-path-like string that `prepareSortableRoutes` / `routeComparator`
 * can parse. Used to re-sort the manifest after merging programmatic routes.
 */
function patternToSortKey(patternString: string): string {
	return (
		patternString
			.slice(1) // remove leading /
			.replace(/\/$/, '') // remove trailing /
			.replaceAll(/:(\w+)\*/g, '[...$1]') // :rest* -> [...rest]  (programmatic)
			.replaceAll(/{:(\w+)}/g, '[$1]') // {:param} -> [param]  (file-derived)
			.replaceAll(/:(\w+)/g, '[$1]') || // :param  -> [param]   (programmatic)
		'index' // root pattern -> 'index'
	);
}
export async function collectRoutes(
	routes: R.RoutesManifest,
	root: string,
	excludePatterns: string[] = [],
	trailingSlash: 'always' | 'never' | 'ignore' = 'ignore',
	definedRoutes?: ProgrammaticRoute[],
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

	const serverPageClientAssetsFilter = createFilter(
		['**/*.client.{js,ts,jsx,tsx}', '**/*.{css,scss,sass,less,styl,stylus}'],
		[...excludePatterns],
	);
	const serverPageClientAssets = allFilesInRoutes.filter((f) =>
		serverPageClientAssetsFilter(f),
	);

	if (serverEntrypoints.length === 0 && !definedRoutes?.length) {
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

	if (serverEntrypointsSorted.length > 0)
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

	// MARK: Associate file-based routes

	for (const routePath of serverEntrypointsSorted) {
		const filePath = join(routesFolder, routePath);
		const routeWithPatterns = extractRoutePatterns(routePath, trailingSlash);

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

	// MARK: Programmatic routes

	if (definedRoutes?.length) {
		for (const defined of definedRoutes) {
			const normalized = normalizeProgrammaticPattern(
				defined.pattern,
				trailingSlash,
			);

			const existing = routes.get(normalized.patternString);
			if (existing) {
				logger.warn(
					`Programmatic route '${defined.pattern}' overrides file-based route '${existing.filePath}'.`,
					{ timestamp: true },
				);
			}

			const pageAssets =
				defined.pageAssets ??
				serverPageClientAssets
					.map((a) => join(routesFolder, a))
					.filter(
						(a) =>
							paths.removeAllExtension(a) ===
							paths.removeAllExtension(defined.filePath),
					);

			routes.set(normalized.patternString, {
				filePath: defined.filePath,
				pattern: normalized.pattern,
				hasParams: normalized.hasParams,
				pageAssets,
			});
		}

		// MARK: Re-sort the merged manifest

		const allEntries = [...routes.entries()];
		const keyedSortables = allEntries.map(([patternString, route]) => {
			// File-based routes already have real file paths that
			// prepareSortableRoutes can parse correctly.  Only programmatic
			// routes need the pattern→key shim.
			const routesPrefix = `${routesFolder}/`;
			const sortKey = route.filePath.startsWith(routesPrefix)
				? route.filePath.slice(routesPrefix.length)
				: patternToSortKey(patternString);

			return {
				sortable: prepareSortableRoutes([sortKey])[0]!,
				patternString,
				route,
			};
		});

		keyedSortables.sort((a, b) => routeComparator(a.sortable, b.sortable));

		routes.clear();
		for (const { patternString, route } of keyedSortables)
			routes.set(patternString, route);

		logger.info(
			`\n${c.underline(`Defined ${c.bold('programmatic routes')}`)}:\n` +
				`${c.dim('~ ')}${definedRoutes
					.map(
						(d) => `${c.magenta(d.pattern)} ${c.dim('→')} ${c.dim(d.filePath)}`,
					)
					.join(c.dim('\n~ '))}\n`,
		);
	}
}

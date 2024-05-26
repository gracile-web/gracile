import path, { join, relative } from 'node:path';

import { logger } from '@gracile/internal-utils/logger';
import * as paths from '@gracile/internal-utils/paths';
import fastGlob from 'fast-glob';
import c from 'picocolors';
import { URLPattern } from 'urlpattern-polyfill/urlpattern';

// import type { ViteDevServer } from 'vite';
import { prepareSortableRoutes, routeComparator } from './comparator.js';
import { REGEXES } from './load-module.js';
import type * as R from './route.js';

function extractRoutePatterns(
	absoluteFilePath: string,
): Pick<R.Route, 'pattern' | 'hasParams'> & { patternString: string } {
	const routePathname = path
		.relative('src/routes', paths.relativeToProject(absoluteFilePath))
		.replace(/\.[j|t]s$/, '');

	let pathParts = routePathname.split(
		process.platform === 'win32' ? '\\' : '/',
	);
	const last = pathParts.at(-1);
	if (typeof last === 'undefined') throw new Error('Cannot parse file path.');

	if (
		// NOTE: /foo/(foo) => /foo
		/\((.*)\)/.test(last) ||
		// NOTE: /foo/index => /foo
		last === 'index'
	)
		pathParts.pop();

	if (pathParts.length === 1 && pathParts.at(0) === 'index') pathParts = [];
	if (pathParts.length === 1 && pathParts.at(0) === '404')
		pathParts = ['__404'];

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

const routes: R.RoutesManifest = new Map<string, R.Route>();

export async function collectRoutes(root: string /* vite: ViteDevServer */) {
	routes.clear();

	const serverEntrypoints = await fastGlob(
		[
			'src/routes/**/*.{js,ts}',
			'!**/src/routes/**/*.client.{js,ts}',
			'!**/src/routes/**/*.document.{js,ts}',
			'!**/src/routes/**/_*/**',
			'!**/src/routes/**/_*',
		],
		{ ignore: [], cwd: root, absolute: true },
	);

	// MARK: Routes priority order
	const serverEntrypointsSorted = prepareSortableRoutes(serverEntrypoints)
		.sort((a, b) => routeComparator(a, b))
		.map((r) => r.route);

	const serverPageClientAssets = await fastGlob(
		[
			//
			'src/routes/**/*.{css,scss}',
			'src/routes/**/*.client.{js,ts}',
		],
		{ ignore: [], cwd: root, absolute: true },
	);

	logger.info(
		`\n${c.underline(`Found ${c.bold('routes')}`)}:\n` +
			`${c.dim('- ')}${serverEntrypointsSorted
				.map((f) => {
					const pathParts = relative(join(root, 'src/routes'), f).split('/');

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

	serverEntrypointsSorted.forEach((filePath) => {
		const routeWithPatterns = extractRoutePatterns(filePath);

		routes.set(routeWithPatterns.patternString, {
			filePath: paths.relativeToProject(filePath),
			pattern: routeWithPatterns.pattern,

			hasParams: routeWithPatterns.hasParams,
			pageAssets: [],
			// NOTE: Not implemented!
			prerender: null,
		});
	});

	serverPageClientAssets.forEach((filePath) => {
		// NOTE: Exact extension needed client side by Vite.
		const assetPathWithExt = paths.relativeToProject(filePath);
		const associatedRoutePath = assetPathWithExt.replace(
			/\.(.*)$/,
			// FIXME: Don't need this anymore?
			(_a, b) => `.${String(b)}`,
		);

		routes.forEach((route) => {
			if (
				paths.removeAllExt(route.filePath) ===
				paths.removeAllExt(associatedRoutePath)
			)
				route.pageAssets.push(assetPathWithExt);
		});
	});

	return routes;
}

/**
 * Vite plugins: HTML route resolution and asset collection for builds.
 *
 * These are registered as Vite plugins (not Rollup plugins via
 * `rollupOptions.plugins`) so they work correctly with the Environment
 * API's `builder.build(env)`, which does not inherit top-level
 * `rollupOptions` into environment builds.
 *
 * They use `applyToEnvironment` to scope to the client build only,
 * preventing the SSR build from trying to resolve HTML entries.
 *
 * Data is read lazily from shared state, which is populated by the
 * client build plugin's `config` hook before these hooks run.
 *
 * @internal
 */

import { basename, extname, join } from 'node:path';

import { createFilter, type PluginOption } from 'vite';

import { REGEX_TAG_LINK, REGEX_TAG_SCRIPT } from '../render/route-template.js';

import type { PluginSharedState } from './plugin-shared-state.js';
import { GRACILE_ENVIRONMENT_NAMES } from './constants.js';

function stripPremises(input: string): string {
	return input
		.replace(/index\.html$/, '__index.doc.html')
		.replace(/404\.html$/, '__404.doc.html')
		.replace(/500\.html$/, '__500.doc.html');
}

export function gracileHtmlRoutesBuildPlugins({
	state,
}: {
	state: PluginSharedState;
}): PluginOption[] {
	return [
		{
			name: 'gracile-html-routes',
			apply: 'build',
			enforce: 'pre',

			applyToEnvironment(environment) {
				return environment.name !== GRACILE_ENVIRONMENT_NAMES.ssr;
			},

			resolveId(id) {
				const inputList = state.clientBuildInputList;
				const root = state.root;
				if (!inputList || !root) return null;

				if (extname(id) === '.html' && inputList.includes(id))
					return join(root, id);

				return null;
			},

			load(id) {
				const renderedRoutes = state.renderedRoutes;
				if (!renderedRoutes) return null;

				if (extname(id) === '.html') {
					if (['index.html', '404.html', '500.html'].includes(basename(id))) {
						const content = renderedRoutes.find(
							(index) => index.absoluteId === id,
						)?.html;

						if (content) return content;
					}

					if (state.gracileConfig.pages?.premises?.expose) {
						if (basename(id).endsWith('doc.html')) {
							const content = renderedRoutes.find(
								(index) => stripPremises(index.absoluteId) === id,
							)?.static.document;

							if (content) return content;
						}

						const content = renderedRoutes.find(
							(index) => index.name === basename(id),
						)?.html;
						if (content) return content;
					}
				}

				return null;
			},
		} as const,

		{
			name: 'gracile-collect-handler-assets',
			apply: 'build',
			enforce: 'post',

			applyToEnvironment(environment) {
				return environment.name !== GRACILE_ENVIRONMENT_NAMES.ssr;
			},

			buildStart() {
				const renderedRoutes = state.renderedRoutes;
				if (!renderedRoutes) return;

				if (!state.gracileConfig.pages?.premises?.expose) return;

				const premisesFilter = createFilter(
					state.gracileConfig.pages.premises.include,
					state.gracileConfig.pages.premises.exclude,
				);

				for (const route of renderedRoutes) {
					if (premisesFilter(route.name) === false) continue;

					if (state.outputMode === 'server' && route.savePrerender !== true)
						continue;

					const fileNameParts = route.name.split('/');
					const last = fileNameParts.pop();
					const properties = last?.replace(
						/(.*)\.html$/,
						(_, r) => `__${r}.props.json`,
					);
					if (!properties) throw new Error('No props.');
					fileNameParts.push(properties);
					const fileName = fileNameParts.join('/');

					this.emitFile({
						fileName,
						type: 'asset',
						source: JSON.stringify(route.static.props ?? {}),
					});
				}
			},

			generateBundle(_, bundle) {
				const renderedRoutes = state.renderedRoutes;
				if (!renderedRoutes) return;
				if (state.outputMode !== 'server') return;

				for (const fileKey in bundle) {
					const file = bundle[fileKey];

					if (fileKey.endsWith('.html') && file && 'source' in file) {
						const source = file.source.toString();

						const collectedAssets = [
							...[...source.matchAll(REGEX_TAG_SCRIPT)]
								.map((v) => v[0])
								// NOTE: Too brittle
								.filter((v) => v.includes(`type="module"`)),
							...[...source.matchAll(REGEX_TAG_LINK)]
								.map((v) => v[0])
								// NOTE: Too brittle
								.filter((v) => /rel="(stylesheet|modulepreload)"/.test(v)),
						].join('\n');

						const route = renderedRoutes.find((r) => {
							if (state.gracileConfig.pages?.premises?.expose)
								return (
									`/${r.name}` ===
									`/${fileKey}`.replace(
										/(.*?)\/__(.*?)\.doc\.html$/,
										(a, b, c) => `${b}/${c}.html`,
									)
								);

							return r.name === fileKey;
						});
						if (route) route.handlerAssets = collectedAssets;

						if (route?.savePrerender !== true) {
							delete bundle[fileKey];
							// NOTE: Not sure if it's useful
							if (route?.html) route.html = null;
						}
					}
				}
			},
		} as const,
	];
}

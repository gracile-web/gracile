import { basename, extname, join } from 'node:path';

import { createFilter, type Plugin, type ViteDevServer } from 'vite';

import { renderRoutes } from '../routes/render.js';
import { REGEX_TAG_LINK, REGEX_TAG_SCRIPT } from '../render/route-template.js';
import type { RoutesManifest } from '../routes/route.js';
import type { GracileConfig } from '../user-config.js';

function stripPremises(input: string) {
	return input
		.replace(/index\.html$/, '__index.doc.html')
		.replace(/404\.html$/, '__404.doc.html')
		.replace(/500\.html$/, '__500.doc.html');
}

export const buildRoutes = async ({
	routes,
	viteServerForBuild,
	root,
	gracileConfig,
	serverMode = false,
}: {
	routes: RoutesManifest;
	viteServerForBuild: ViteDevServer;
	root: string;
	gracileConfig: GracileConfig;
	serverMode?: boolean;
}) => {
	// TODO: extract upstream, return just the plugins
	const { renderedRoutes } = await renderRoutes({
		vite: viteServerForBuild,
		serverMode,
		root,
		gracileConfig,
		routes,
	});

	const inputList = renderedRoutes
		.filter((index) => index.html)
		.map((input) => input.name);

	const premisesFilter = gracileConfig.pages?.premises?.expose
		? createFilter(
				gracileConfig.pages.premises.include,
				gracileConfig.pages.premises.exclude,
			)
		: null;

	if (gracileConfig.pages?.premises?.expose && premisesFilter) {
		// eslint-disable-next-line unicorn/no-array-for-each
		inputList.forEach((input) => {
			if (premisesFilter(input) === false) return;

			inputList.push(stripPremises(input));
		});
	}

	return {
		routes,
		renderedRoutes,
		inputList,

		plugin: [
			{
				name: 'gracile-html-routes',
				apply: 'build',
				enforce: 'pre',

				resolveId(id) {
					if (extname(id) === '.html' && inputList.includes(id))
						return join(root, id);

					return null;
				},

				load(id) {
					if (extname(id) === '.html') {
						if (['index.html', '404.html', '500.html'].includes(basename(id))) {
							const content = renderedRoutes.find(
								(index) => index.absoluteId === id,
							)?.html;

							if (content) return content;
						}

						if (gracileConfig.pages?.premises?.expose) {
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
							// return '';}
						}
					}

					return null;
				},
			} satisfies Plugin,

			{
				name: 'gracile-collect-handler-assets',
				enforce: 'post',

				buildStart() {
					if (!gracileConfig.pages?.premises?.expose || !premisesFilter) return;

					for (const route of renderedRoutes) {
						if (premisesFilter(route.name) === false) continue;

						if (serverMode && route.savePrerender !== true) continue;

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
					if (serverMode === false) return;

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

							// NOTE: Not used (for now?)
							// file.source = alteredContent;

							const route = renderedRoutes.find((r) => {
								if (gracileConfig.pages?.premises?.expose)
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
			} satisfies Plugin,
		],
	};
};

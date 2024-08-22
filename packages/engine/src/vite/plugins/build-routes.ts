import { basename, extname, join } from 'node:path';

import { createFilter, type Plugin, type ViteDevServer } from 'vite';

import { renderRoutes } from '../../build/static.js';
import {
	REGEX_TAG_LINK,
	REGEX_TAG_SCRIPT,
} from '../../render/route-template.js';
import type { RoutesManifest } from '../../routes/route.js';
import type { GracileConfig } from '../../user-config.js';

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
		.filter((i) => i.html)
		.map((input) => input.name);

	const premisesFilter = gracileConfig.pages?.premises?.expose
		? createFilter(
				gracileConfig.pages.premises.include,
				gracileConfig.pages.premises.exclude,
			)
		: null;

	if (gracileConfig.pages?.premises?.expose && premisesFilter) {
		inputList.forEach((input) => {
			if (premisesFilter(input) === false) return;

			inputList.push(
				input
					.replace(/index\.html$/, '__index.doc.html')
					.replace(/404\.html$/, '__404.doc.html'),

				// input.replace(/(.*)\.html$/, (_, r) => `__${r}.document.html`),
				// .replace(/(.*)\.html$/, (_, r) => `__${r}.document.html`),
			);
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
					if (extname(id) === '.html') {
						if (inputList.find((i) => i === id)) return join(root, id);
					}

					return null;
				},

				load(id) {
					if (extname(id) === '.html') {
						if (['index.html', '404.html'].includes(basename(id))) {
							const content = renderedRoutes.find(
								(i) => i.absoluteId === id,
							)?.html;

							if (content) return content;
						}

						if (gracileConfig.pages?.premises?.expose) {
							if (basename(id).endsWith('doc.html')) {
								const content = renderedRoutes.find((i) => {
									return (
										i.absoluteId
											.replace(/index\.html$/, '__index.doc.html')
											.replace(/404\.html$/, '__404.doc.html') === id
									);
								})?.static.document;

								if (content) return content;
							}

							const content = renderedRoutes.find(
								(i) => i.name === basename(id),
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

					renderedRoutes.forEach((route) => {
						if (premisesFilter(route.name) === false) return;

						if (serverMode && route.savePrerender !== true) return;

						const fileNameParts = route.name.split('/');
						const last = fileNameParts.pop();
						const newName = last?.replace(
							/(.*)\.html$/,
							(_, r) => `__${r}.props.json`,
						);
						if (!newName) throw new Error();
						fileNameParts.push(newName);
						const fileName = fileNameParts.join('/');

						this.emitFile({
							fileName,
							type: 'asset',
							source: JSON.stringify(route.static.props ?? {}),
						});
					});
				},

				generateBundle(_, bundle) {
					if (serverMode === false) return;

					// eslint-disable-next-line no-restricted-syntax, guard-for-in
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
								// eslint-disable-next-line no-param-reassign, @typescript-eslint/no-dynamic-delete
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

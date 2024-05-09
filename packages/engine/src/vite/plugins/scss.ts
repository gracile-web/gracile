import type { PluginOption } from 'vite';

export const scssHtml: PluginOption = {
	name: 'scss-html',
	generateBundle(_context, bundle, _a) {
		Object.entries(bundle).forEach(([filePath, asset]) => {
			if (asset.fileName.endsWith('.scss')) {
				// eslint-disable-next-line no-param-reassign
				bundle[filePath] = {
					...asset,
					fileName: asset.fileName.replace('.scss', '.css'),
				};
			}
			if (
				asset.fileName.endsWith('.html') &&
				'source' in asset &&
				typeof asset.source === 'string'
			) {
				// eslint-disable-next-line no-param-reassign
				bundle[filePath] = {
					...asset,
					// HACK:
					source: asset.source.replaceAll(
						/<link rel="stylesheet" href="(.*)">/g,
						//
						(r, __a) => {
							return r.replace(/\.scss">$/, '.css">');
						},
					),
				};
			}
		});
	},
};

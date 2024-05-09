// From https://github.com/r3dDoX/vite-plugin-svgo
import fs from 'node:fs';

import { logger } from '@gracile/internal-utils/logger';
import type { Config } from 'svgo';
import { optimize } from 'svgo';
import type { Plugin } from 'vite';

const VITE_PLUGIN_NAME = 'vite-plugin-svgo';
const fileRegex = /\.svg$/;

export function viteSvgPlugin(
	svgoOptimizeOptions: Omit<Config, 'path'> = {},
): Plugin {
	return {
		name: VITE_PLUGIN_NAME,
		enforce: 'pre',

		async load(id: string) {
			if (fileRegex.test(id)) {
				let svgCode;
				try {
					svgCode = await fs.promises.readFile(id, 'utf8');
				} catch (exception) {
					logger.warn(
						`${id} couldn't be loaded by vite-plugin-svgo: ${String(exception)}`,
					);
					return null;
				}
				try {
					const optimizedSvg = optimize(svgCode, {
						path: id,
						...svgoOptimizeOptions,
					});
					return `import { html } from 'lit';

export default html\`${optimizedSvg.data}\`;`;
				} catch (exception) {
					logger.error(
						`${id} errored during svg optimization:\n${String(exception)}`,
					);
				}
			}
			return null;
		},
	};
}

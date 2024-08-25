// From https://github.com/r3dDoX/vite-plugin-svgo
import fs from 'node:fs';

import { getLogger } from '@gracile/internal-utils/logger/helpers';
import type { Config } from 'svgo';
import { optimize } from 'svgo';
import type { PluginOption } from 'vite';

const VITE_PLUGIN_NAME = 'vite-plugin-svgo';
const fileRegex = /\.svg$/;

export function viteSvgPlugin(
	svgoOptimizeOptions: Omit<Config, 'path'> = {},
	// NOTE: for Vite versions mismatches with `exactOptionalPropertyTypes`?
	// This `any[]` AND with a plugin -array- makes ESLint and TS shut up.
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
): any[] {
	const logger = getLogger();

	return [
		{
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
		} satisfies PluginOption,
	];
}

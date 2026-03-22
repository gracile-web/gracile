/**
 * Adapted from https://github.com/fi3ework/vite-plugin-web-components-hmr
 * which was forked from https://github.com/open-wc/open-wc/tree/master/packages/dev-server-hmr
 * Both under MIT license.
 */

/** @typedef {import('vite').Plugin} VitePlugin */
/** @typedef {import('./utils.js').Matcher} Matcher */

/**
 * @typedef {object} BaseClass
 * @property {string} name
 * @property {string} [import]
 */

/**
 * @typedef {object} Decorator
 * @property {string} name
 * @property {string} [import]
 */

/**
 * @typedef {object} FunctionOption
 * @property {string} name
 * @property {string} [import]
 */

/**
 * @typedef {object} Preset
 * @property {BaseClass[]} [baseClasses]
 * @property {Decorator[]} [decorators]
 * @property {string} [patch]
 */

/**
 * @typedef {object} WcHmrPluginConfig
 * @property {string[]} [include]
 * @property {string[]} [exclude]
 * @property {Preset[]} [presets]
 * @property {BaseClass[]} [baseClasses]
 * @property {Decorator[]} [decorators]
 * @property {FunctionOption[]} [functions]
 * @property {string[]} [patches]
 */

import fs from 'node:fs';
import path from 'node:path';

import { babelTransform } from './babel/babel-transform.js';
import { parseConfig, createMatchers } from './utils.js';
import {
	WC_HMR_MODULE_PREFIX,
	WC_HMR_MODULE_RUNTIME,
	WC_HMR_MODULE_PATCH,
} from './constants.js';

const __dirname = import.meta.dirname;

const wcHmrRuntime = fs.readFileSync(
	path.resolve(__dirname, 'wc-hmr-runtime.js'),
	'utf8',
);

/** @type {Matcher} */
let matchInclude = () => true;
/** @type {Matcher} */
let matchExclude = () => false;

/**
 * @param {WcHmrPluginConfig} pluginConfig
 * @returns {VitePlugin}
 */
export function gracileHmr(pluginConfig) {
	let shouldSkipHmr = false;

	/** @type {string} */
	let rootDir;

	const parsedPluginConfig = parseConfig(pluginConfig);

	return {
		name: 'gracile-labs-wc-hmr',
		// TODO: current babel config can not handle TS source code now
		// enforce: 'pre',
		configResolved(config) {
			shouldSkipHmr = config.command === 'build' || config.isProduction;
			rootDir = config.root;
		},
		configureServer() {
			if (parsedPluginConfig.include) {
				matchInclude = createMatchers(rootDir, parsedPluginConfig.include);
			}

			if (parsedPluginConfig.exclude) {
				matchExclude = createMatchers(rootDir, parsedPluginConfig.exclude);
			}

			return;
		},
		resolveId(id) {
			if (id.startsWith(WC_HMR_MODULE_PREFIX)) {
				return id;
			}
		},
		load(id) {
			if (id === WC_HMR_MODULE_RUNTIME) {
				return wcHmrRuntime;
			}

			if (id === WC_HMR_MODULE_PATCH) {
				return (
					(parsedPluginConfig.patches &&
						parsedPluginConfig.patches.join('\n')) ||
					''
				);
			}
		},
		async transform(code, id, options) {
			if (shouldSkipHmr || options?.ssr) return;

			const filePath = id;
			if (
				id.startsWith('/__web-dev-server__') ||
				!['.mjs', '.js', '.ts', '.json', '.jsx', '.tsx'].includes(
					path.extname(id),
				)
			) {
				return;
			}

			if (
				matchInclude(filePath) &&
				!matchExclude(filePath) &&
				!filePath.startsWith('__web-dev-server__') &&
				typeof code === 'string'
			) {
				try {
					const result = await babelTransform(
						code,
						filePath,
						/** @type {any} */ ({
							baseClasses: parsedPluginConfig.baseClasses,
							decorators: parsedPluginConfig.decorators,
							functions: parsedPluginConfig.functions,
							patches: parsedPluginConfig.patches,
							rootDir,
						}),
					);

					if (result.code) {
						return {
							code: result.code,
							...(result.map
								? {
										map: /* HACK: Types mismatch (rolldown) */ /** @type {any} */ (
											result.map
										),
									}
								: {}),
						};
					}
				} catch (/** @type {any} */ error) {
					if (error.name === 'SyntaxError') {
						// forward babel error to dev server
						// eslint-disable-next-line @typescript-eslint/no-unsafe-call
						const strippedMessage = error.message.replaceAll(
							new RegExp(`${filePath} ?:? ?`, 'g'),
							'',
						);
						console.error(
							`PluginSyntaxError` +
								[strippedMessage, filePath, error.code, error.loc, error.pos]
									.map((v) => JSON.stringify(v))
									.join('\n'),
						);
					}
				}
			}

			return code;
		},
	};
}

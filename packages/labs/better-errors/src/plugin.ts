// import { createLogger as createViteLogger, type PluginOption } from 'vite';
// // @\ts-expect-error No typings at all
// // import launchMiddleware from 'launch-editor-middleware';

// // import { getLogger } from '@gracile/internal-utils/logger/helpers';

// import type { BetterErrorPayload } from './dev/vite.js';

// const VITE_PLUGIN_NAME = 'vite-plugin-better-errors';

// // const virtualModuleId = 'better-errors:overlay';
// // const resolvedVirtualModuleId = `\0${virtualModuleId}`;

// // static GRACILE_OVERLAY_PATH =
// // 	'@gracile-labs/better-errors/dev/custom-overlay/vite-custom-overlay';

// export function patchOverlay(code: string, importPath?: string) {
// 	// NOTE: Make HTMLElement available in non-browser environments
// 	// eslint-disable-next-line @typescript-eslint/no-extraneous-class
// 	const { HTMLElement = class {} as typeof globalThis.HTMLElement } =
// 		globalThis;
// 	class ErrorOverlay extends HTMLElement {
// 		root: ShadowRoot;

// 		constructor(error: BetterErrorPayload['err']) {
// 			super();
// 			this.root = this.attachShadow({ mode: 'open' });
// 			this.dir = 'ltr';

// 			const customOverlay = document.createElement('vite-custom-overlay');
// 			customOverlay.errorPayload = error;

// 			// ;

// 			// // @ts-expect-error .
// 			// setTimeout(() => {
// 			// 	// __gracile_importOverlay();
// 			// }, 100);
// 			this.root.append(customOverlay);
// 		}
// 	}

// 	const overlayCode = `
// const BETTERR_OVERLAY_PATH =
// 	'@gracile-labs/better-errors/dev/custom-overlay/vite-custom-overlay';

// const BETTERR_CUSTOM_IMPORT_PATH = '${importPath}';

// // const __gracile_importOverlay = () => import(BETTERR_CUSTOM_IMPORT_PATH ?? BETTERR_OVERLAY_PATH);

// import('${importPath}')

// ${ErrorOverlay.toString()};
// `;

// 	return code.replace(
// 		'class ErrorOverlay',
// 		overlayCode + '\nclass ViteErrorOverlay',
// 	);
// }

// export function betterErrors(options?: {
// 	overlayImportPath: string;
// 	// MarkdownRenderer: typeof MarkdownDocumentRendererEmpty;
// 	// NOTE: for Vite versions mismatches with `exactOptionalPropertyTypes`?
// 	// This `any[]` AND with a plugin -array- makes ESLint and TS shut up.
// 	// eslint-disable-next-line @typescript-eslint/no-explicit-any
// }): any[] {
// 	// const logger = getLogger();

// 	// NOTE: Used to filter out redundant Vite errors, which are
// 	// noisy and less detailed than ours.
// 	// This should be refined on a case-by-case-basis.
// 	// Also, keep in mind that the user could use their own Vite
// 	// logger. Which is fine, but maybe the Gracile one should be
// 	// disabled in that case.
// 	const viteLogger = createViteLogger();
// 	const customLogger = createViteLogger();
// 	customLogger.error = (message /* options */) => {
// 		if (message.startsWith('\u001B[31mError when evaluating SSR module '))
// 			return;
// 		viteLogger.error(message);
// 	};

// 	return [
// 		{
// 			name: VITE_PLUGIN_NAME,
// 			enforce: 'pre',

// 			apply: 'serve',

// 			config() {
// 				return {
// 					customLogger,
// 				};
// 			},

// 			// NOTE: VITE ALREADY PROVIDE THIS!
// 			// configureServer(server) {
// 			// 	server.middlewares.use(
// 			// 		'/__open-in-editor',
// 			// 		// eslint-disable-next-line @typescript-eslint/no-unsafe-argument, @typescript-eslint/no-unsafe-call
// 			// 		launchMiddleware(),
// 			// 	);
// 			// },

// 			transform(code, id, options_ = {}) {
// 				if (options_.ssr) return null;
// 				if (!id.includes('vite/dist/client/client.mjs')) return null;

// 				// Replace the Vite overlay with ours
// 				return patchOverlay(code, options?.overlayImportPath);
// 			},

// 			// 			resolveId(id) {
// 			// 				if (id === virtualModuleId) {
// 			// 					return resolvedVirtualModuleId;
// 			// 				}
// 			// 				return null;
// 			// 			},

// 			// 			load(id) {
// 			// 				if (id === resolvedVirtualModuleId) {
// 			// 					return `
// 			// const routeImports = new Map(

// 			// );

// 			// `;
// 			// 				}
// 			// 			},
// 		} satisfies PluginOption,
// 	];
// }

throw new Error('Empty');

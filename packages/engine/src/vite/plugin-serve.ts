/**
 * Vite plugin: development server middleware.
 *
 * Sets up the Gracile request handler, route watcher, and dev-time
 * logging for `vite dev`.
 *
 * When `server.entry` is configured, the user's server file is loaded
 * via the SSR environment runner and bridged into Vite's middleware
 * stack.  Otherwise falls back to the built-in `nodeAdapter` path.
 *
 * @internal
 */

import type {
	IncomingMessage,
	RequestListener,
	ServerResponse,
} from 'node:http';

import { getVersion } from '@gracile/internal-utils/version';
import c from 'picocolors';
import type {
	Logger,
	PluginOption,
	RunnableDevEnvironment,
	ViteDevServer,
} from 'vite';
import { createServerAdapter } from '@whatwg-node/server';

import { createDevelopmentHandler } from '../dev/development.js';
import { builtInServerEntryLoadingPage } from '../errors/pages.js';
import { renderLitTemplate } from '../render/lit-ssr.js';
import { nodeAdapter } from '../server/adapters/node.js';
import type { GracileConfig } from '../user-config.js';

import type { PluginSharedState } from './plugin-shared-state.js';
import { setDevelopmentHandler } from './plugin-handler-virtual.js';
import {
	createServerEntryReadyPath,
	createViteClientPath,
	getRequestPathname,
	isHtmlNavigationRequest,
} from './server-entry-loading.js';

/**
 * Detect whether the exported `app` is a Hono-style app (has `.fetch`)
 * or a connect/express-style middleware function.
 */
function isFetchApp(
	app: unknown,
): app is { fetch: (request: Request) => Promise<Response> } {
	return (
		typeof app === 'object' &&
		app !== null &&
		'fetch' in app &&
		typeof (app as Record<string, unknown>)['fetch'] === 'function'
	);
}

/**
 * Bridge a fetch-based app (Hono) into Node's `(req, res, next)` middleware.
 *
 * Uses `@whatwg-node/server` to handle both directions:
 * Node `IncomingMessage` → standard `Request` and standard `Response` → Node `ServerResponse`.
 */
function createFetchBridge(
	getApp: () => { fetch: (request: Request) => Promise<Response> } | null,
	logger: Logger,
): RequestListener {
	const adapter = createServerAdapter((request) => {
		const app = getApp();
		if (!app) {
			return new Response('Server entry not loaded yet', { status: 503 });
		}
		return app.fetch(request);
	});

	return async (request, response) => {
		try {
			await adapter(request, response);
		} catch (error) {
			logger.error(String(error));
			if (!response.headersSent) {
				response.statusCode = 500;
				response.end('Internal server error');
			}
		}
	};
}

function respondWithServerEntryReadyState(
	request: IncomingMessage,
	response: ServerResponse,
	isReady: boolean,
): void {
	response.statusCode = isReady ? 204 : 503;
	response.setHeader('cache-control', 'no-store');
	response.setHeader('x-gracile-server-entry-ready', isReady ? '1' : '0');

	if (!isReady) {
		response.setHeader('retry-after', '1');
	}

	response.end(request.method === 'HEAD' ? undefined : '');
}

async function respondWithServerEntryLoadingPage({
	request,
	response,
	entry,
	base,
}: {
	request: IncomingMessage;
	response: ServerResponse;
	entry: string;
	base: string;
}): Promise<void> {
	const requestPath = request.url ?? '/';
	const loadingPage = builtInServerEntryLoadingPage({
		entry,
		requestPath,
		viteClientPath: createViteClientPath(base),
		readyPath: createServerEntryReadyPath(base),
	});

	response.statusCode = 503;
	response.setHeader('content-type', 'text/html; charset=utf-8');
	response.setHeader('cache-control', 'no-store');
	response.setHeader('retry-after', '1');

	response.end(
		request.method === 'HEAD'
			? undefined
			: await renderLitTemplate(loadingPage),
	);
}

export function gracileServePlugin({
	state,
	config,
	logger,
	resetClientBuiltFlag,
}: {
	state: PluginSharedState;
	config: GracileConfig | undefined;
	logger: Logger;
	resetClientBuiltFlag: () => void;
}): PluginOption {
	return {
		name: 'vite-plugin-gracile-serve-middleware',

		apply: 'serve',

		config(_, environment) {
			if (environment.isPreview) return null;
			return {
				// NOTE: Supresses message: `Could not auto-determine entry point from rollupOptions or html files…`
				// FIXME: It's not working when reloading the Vite config.
				// Is user config, putting `optimizeDeps: { include: [] }` solve this.
				optimizeDeps: { include: [] },

				// NOTE: Useful? It breaks preview (expected)
				appType: 'custom',
			};
		},

		async configureServer(server) {
			// Reset so dev-mode config hot-reloads don't hit the guard.
			resetClientBuiltFlag();

			const version = getVersion();
			logger.info(
				`${c.cyan(c.italic(c.underline('🧚 Gracile')))}` +
					` ${c.dim(`~`)} ${c.green(`v${version ?? 'X'}`)}`,
			);

			const { handler } = await createDevelopmentHandler({
				routes: state.routes,
				vite: server,
				gracileConfig: state.gracileConfig,
			});

			// Publish the handler so `gracile:handler` virtual module
			// can delegate to it at runtime.
			setDevelopmentHandler(handler);

			logger.info(c.dim('Vite development server is starting…'), {
				timestamp: true,
			});

			server.watcher.on('ready', () => {
				setTimeout(() => {
					logger.info('');
					logger.info(c.green('Watching for file changes…'), {
						timestamp: true,
					});
					logger.info('');
					// NOTE: We want it to show after the Vite intro stuff
				}, 100);
			});

			// ── Integrated server entry mode ─────────────────────────
			if (state.serverEntry) {
				return () => {
					setupIntegratedServerEntry(server, state, logger);
				};
			}

			// ── Classic mode (built-in nodeAdapter) ──────────────────
			return () => {
				server.middlewares.use((request, response, next) => {
					const locals = config?.dev?.locals?.({ nodeRequest: request });
					Promise.resolve(
						nodeAdapter(handler, { logger })(request, response, locals),
					).catch((error) => next(error));
				});
			};
		},
	} as const;
}

// ── Integrated server entry setup ────────────────────────────────────

function setupIntegratedServerEntry(
	server: ViteDevServer,
	state: PluginSharedState,
	logger: Logger,
): void {
	const entry = state.serverEntry!;
	const ssrEnvironment = server.environments['ssr'] as RunnableDevEnvironment;
	const readyPath = createServerEntryReadyPath(server.config.base);

	// Mutable reference that gets hot-swapped on HMR.
	let currentApp: unknown = null;

	const loadEntry = async (): Promise<void> => {
		const wasReady = currentApp != null;

		try {
			const entryModule = await ssrEnvironment.runner.import(entry);
			currentApp = entryModule.default ?? entryModule.app ?? null;

			if (currentApp) {
				logger.info(c.green(`[gracile] Server entry loaded: ${entry}`), {
					timestamp: true,
				});

				if (!wasReady) {
					server.ws.send({ type: 'full-reload' });
				}
			} else {
				logger.warn(
					c.yellow(
						`[gracile] Server entry "${entry}" did not export a \`default\` or \`app\`. ` +
							`The integrated server will not handle requests until this is fixed.`,
					),
				);
			}
		} catch (error) {
			logger.error(
				`[gracile] Failed to load server entry "${entry}": ${String(error)}`,
			);
			currentApp = null;
		}
	};

	// Initial load
	void loadEntry();

	// Re-load when the entry (or its deps) are invalidated.
	server.watcher.on('change', () => {
		// The module runner will automatically invalidate; we just
		// need to re-import.
		void loadEntry();
	});

	// Bridge: detect Hono (fetch-based) vs Express (connect-based)
	const fetchBridge = createFetchBridge(
		() => (isFetchApp(currentApp) ? currentApp : null),
		logger,
	);

	server.middlewares.use((request, response, next) => {
		if (getRequestPathname(request) === readyPath) {
			respondWithServerEntryReadyState(request, response, currentApp != null);
			return;
		}

		if (!currentApp) {
			if (isHtmlNavigationRequest(request)) {
				Promise.resolve(
					respondWithServerEntryLoadingPage({
						request,
						response,
						entry,
						base: server.config.base,
					}),
				).catch((error: unknown) => next(error));
				return;
			}

			return next();
		}

		if (isFetchApp(currentApp)) {
			Promise.resolve(fetchBridge(request, response)).catch((error: unknown) =>
				next(error),
			);
		} else if (typeof currentApp === 'function') {
			// Connect / Express style
			(
				currentApp as (
					request: IncomingMessage,
					response: ServerResponse,
					next: () => void,
				) => void
			)(request, response, next);
		} else {
			next();
		}
	});
}

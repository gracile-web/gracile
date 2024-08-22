/**
 * Server **constants**.
 * Useful for setting up your HTTP framework options.
 *
 * @example
 * `/src/server.js`
 * ```js
 *
 * import * as gracile from '@gracile/gracile/hono';
 * import { serve } from '@hono/node-server';
 *
 * // ...
 *
 * serve(
 * 	{ fetch: app.fetch, port: 3030, hostname: gracile.server.LOCALHOST },
 * );
 * ```
 */
export const constants = Object.freeze({
	LOCALHOST: 'localhost',
	IP_LOCALHOST: '127.0.0.1',
	IP_EXPOSED: '0.0.0.0',
	RANDOM_PORT: 0,

	PUBLIC_DIR: 'public',
	CLIENT_DIST_DIR: './dist/client',
});

// export const PUBLIC_DIR = import.meta.env?.DEV
// 	? ('public' as const)
// 	: ('./dist/client' as const);

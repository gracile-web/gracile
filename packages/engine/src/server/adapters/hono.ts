// import { logger } from '@gracile/internal-utils/logger';
import { relative } from 'node:path';
import { Readable } from 'node:stream';
import { fileURLToPath } from 'node:url';

import { server } from '../constants.js';
import type { GracileHandler } from '../request.js';

export type { GracileHandler };

export type GracileHonoHandler = (context: {
	req: { raw: Request };
	var: unknown;
}) => Promise<Response>;

/**
 * @param handler - Takes a pre-built Gracile handler from `./dist/server/entrypoint.js`.
 * @example
 * `/src/server.js`
 * ```js
 * import { Hono } from 'hono';
 * import { serve } from '@hono/node-server';
 *
 * import * as gracile from '@gracile/gracile/hono';
 *
 * import { handler } from './dist/server/entrypoint.js';
 *
 * const app = new Hono();
 *
 * app.use(gracile.honoAdapter(handler));
 *
 * serve(app);
 * ```
 */
export const honoAdapter =
	(handler: GracileHandler): GracileHonoHandler =>
	async (context) => {
		const result = await handler(context.req.raw, context.var);

		// TODO: Hhandle stream abortion as gracefully as with Express.
		if (result?.body) {
			// NOTE: Typings mismatches
			const body = Readable.toWeb(result.body) as ReadableStream;
			return new Response(body, result.init);
		}

		if (result?.response) return result.response;

		throw new Error('Rendering was impossible in the Hono adapter!');
	};

/**
 *
 * @param root - resolve `dist/client` from this file path.
 * @example
 * `/src/server.js`
 * ```js
 * import * as gracile from '@gracile/gracile/node';
 * import { Hono } from 'hono';
 * import { serveStatic } from '@hono/node-server/serve-static';
 *
 * const app = new Hono();
 *
 * app.get('*', serveStatic({ root: gracile.getClientDistPath(import.meta.url) }));
 * ```
 */
export function getClientDistPath(root: string) {
	return relative(
		process.cwd(),
		fileURLToPath(new URL(server.CLIENT_DIST_DIR, root)),
	);
}

export { printUrls } from '../utils.js';

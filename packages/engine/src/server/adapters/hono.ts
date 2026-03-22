import { relative } from 'node:path';
import { Readable } from 'node:stream';
import { fileURLToPath } from 'node:url';

import { nodeCondition } from '@gracile/internal-utils/node-condition/production-ssr';
import { createLogger } from '@gracile/internal-utils/logger/helpers';

import { GracileError, GracileErrorData } from '../../errors/errors.js';
import { constants } from '../constants.js';
import type { AdapterOptions, GracileHandler } from '../request.js';

export type GracileHonoHandler = (context: {
	req: { raw: Request };
	var: unknown;
}) => Promise<Response>;

// eslint-disable-next-line @typescript-eslint/no-empty-object-type
export interface HonoAdapterOptions extends AdapterOptions {
	//
}

/**
 * @param handler - Takes a pre-built Gracile handler from `./dist/server/entrypoint.js`.
 * @param options - If you need more control.
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
	(handler: GracileHandler, options?: HonoAdapterOptions): GracileHonoHandler =>
	async (context) => {
		const logger = createLogger(options?.logger);

		const result = await handler(context.req.raw, context.var);

		if (result?.body) {
			// NOTE: Mirror the Node adapter: surface stream errors rather than
			// silently dropping them. In development the message is forwarded to
			// the client so the developer sees what went wrong.
			result.body.addListener('error', (error) => {
				if (nodeCondition.DEV) logger.error(String(error));
			});

			// NOTE: Typings mismatches
			const body = Readable.toWeb(result.body) as ReadableStream;
			return new Response(body, result.init);
		}

		if (result?.response) return result.response;

		throw new GracileError({
			...GracileErrorData.InvalidResponseInAdapter,
			message: GracileErrorData.InvalidResponseInAdapter.message('Hono'),
		});
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
 * app.get('*', serveStatic({ root: gracile.getClientBuildPath(import.meta.url) }));
 * ```
 */
export function getClientBuildPath(root: string) {
	return relative(
		process.cwd(),
		fileURLToPath(new URL(constants.CLIENT_DIST_DIR, root)),
	);
}

export { printUrls } from '../utilities.js';

export { type GracileHandler } from '../request.js';

// import { logger } from '@gracile/internal-utils/logger.build';

import { relative } from 'node:path';
import { Readable } from 'node:stream';
import { fileURLToPath } from 'node:url';

import { CLIENT_DIST_DIR } from '../env.js';
import { type GracileAsyncMiddleware } from '../request.js';

export function honoAdapter(middleware: GracileAsyncMiddleware) {
	return async function honoMiddleware(context: {
		req: { raw: Request };
		res: ResponseInit;
		var: unknown;
	}) {
		const result = await middleware(context.req.raw, context.var);

		if (result instanceof Readable) {
			return new Response(Readable.toWeb(result) as ReadableStream, {
				headers: { 'content-type': 'html' },
			});

			// context.res.headers.set('content-type', 'html');
			// return stream(c, async (stream) => {
			// 	stream.onAbort(() => {
			// 		throw new Error('Stream aborted!');
			// 	});
			// 	await stream.pipe(/** @type {ReadableStream} */ Readable.toWeb(result));
			// });
		}

		if (result) return result;
		throw new Error('Rendering was impossible in the Hono adapter!');
	};
}

export function getClientDistPath(root: string) {
	return relative(process.cwd(), fileURLToPath(new URL(CLIENT_DIST_DIR, root)));
}

export { printAddressInfos } from '../utils.js';

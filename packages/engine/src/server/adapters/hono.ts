// import { logger } from '@gracile/internal-utils/logger';
import { relative } from 'node:path';
import { Readable } from 'node:stream';
import { fileURLToPath } from 'node:url';

import { CLIENT_DIST_DIR } from '../env.js';
import type { GracileHandler } from '../request.js';

export type GracileHonoHandler = (context: {
	req: { raw: Request };
	var: unknown;
}) => Promise<Response>;

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

export function getClientDistPath(root: string) {
	return relative(process.cwd(), fileURLToPath(new URL(CLIENT_DIST_DIR, root)));
}

export { printAddressInfos } from '../utils.js';

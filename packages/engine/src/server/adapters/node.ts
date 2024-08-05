import { fileURLToPath } from 'node:url';

import { logger } from '@gracile/internal-utils/logger.build';
import { createServerAdapter } from '@whatwg-node/server';
import type { IncomingMessage, ServerResponse } from 'http';
import { Readable, Writable } from 'stream';

import { CLIENT_DIST_DIR } from '../env.js';
import { type GracileAsyncMiddleware } from '../request.js';

// NOTE: Find a more canonical way to ponyfill the Node HTTP request to standard Request
// @ts-expect-error Abusing this feature!
const nodeRequestToStandardRequest = createServerAdapter((request) => request);

export function nodeAdapter(middleware: GracileAsyncMiddleware) {
	return async function nodeMiddleware(
		req: IncomingMessage,
		res: ServerResponse,
		// next: (error?: unknown) => void,
		locals?: unknown,
	) {
		const request = (await Promise.resolve(
			nodeRequestToStandardRequest.handleNodeRequest(
				// HACK: Incorrect typings
				req as IncomingMessage & { url: string; method: string },
			),
		)) as unknown as Request;

		const mergedLocals = {
			...(locals ?? {}),
			...('locals' in res && typeof res.locals === 'object' ? res.locals : {}),
		};
		const result = await middleware(request, mergedLocals).catch((error) =>
			// next(error),
			res.end(String(error)),
		);

		// console.log({ result });
		if (result instanceof Readable) {
			res.setHeader('Content-Type', 'text/html');
			return result.pipe(res);
		}
		if (result instanceof Response) {
			if (result.status) res.statusCode = result.status;
			if (result.statusText) res.statusMessage = result.statusText;

			result.headers?.forEach((content, header) =>
				res.setHeader(header, content),
			);

			if (result.body) {
				const piped = await result.body
					.pipeTo(Writable.toWeb(res))
					.catch((e) => logger.error(String(e)));
				return piped;
			}
			return null;
		}
		return null;
	};
}

export function getClientDistPath(root: string) {
	return fileURLToPath(new URL(CLIENT_DIST_DIR, root));
}

export { printAddressInfos } from '../utils.js';

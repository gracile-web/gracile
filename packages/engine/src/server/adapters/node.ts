import { fileURLToPath } from 'node:url';

import { env } from '@gracile/internal-utils/env';
import { logger } from '@gracile/internal-utils/logger';
import { createServerAdapter } from '@whatwg-node/server';
import type { IncomingMessage, ServerResponse } from 'http';
import { Writable } from 'stream';

import { server } from '../constants.js';
import { type GracileHandler, isRedirect } from '../request.js';

// NOTE: Find a more canonical way to ponyfill the Node HTTP request to standard Request
// @ts-expect-error Abusing this feature!
const nodeRequestToStandardRequest = createServerAdapter((request) => request);

function standardResponseInitToNodeResponse(
	responseInit: ResponseInit | Response,
	res: ServerResponse,
) {
	const headers =
		responseInit instanceof Response
			? responseInit.headers
			: new Headers(responseInit.headers);

	headers.forEach((content, header) => res.setHeader(header, content));
	if (responseInit.status) res.statusCode = responseInit.status;
	if (responseInit.statusText) res.statusMessage = responseInit.statusText;
}

export function nodeAdapter(handler: GracileHandler) {
	return async function nodeHandler(
		req: IncomingMessage,
		res: ServerResponse,

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
		const result = await handler(request, mergedLocals);

		if (result?.body) {
			standardResponseInitToNodeResponse(result.init, res);

			// NOTE: We can't do similar thing with Hono with just
			// a standard Response workflow, it seems
			result.body.addListener('error', (error) => {
				if (env.DEV) logger.error(String(error));
				// NOTE: res.writeHead doesn't seems to take effect, too (too late)
				// res.statusCode = 500;
				res.end(env.DEV ? '__SSR_ERROR__' : undefined);
			});
			return result.body.pipe(res);
		}
		if (result?.response) {
			standardResponseInitToNodeResponse(result.response, res);

			const redirect = isRedirect(result.response);
			if (redirect) return res.end(result.body);

			if (result.response.body) {
				const piped = await result.response.body
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

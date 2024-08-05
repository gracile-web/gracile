import { fileURLToPath } from 'node:url';

import { logger } from '@gracile/internal-utils/logger.build';
import { createServerAdapter } from '@whatwg-node/server';
import type { IncomingMessage, ServerResponse } from 'http';
import { Writable } from 'stream';

import { CLIENT_DIST_DIR } from '../env.js';
import type { GracileHandler } from '../request.js';

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

			return result.body.pipe(res);
		}
		if (result?.response) {
			standardResponseInitToNodeResponse(result.response, res);

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

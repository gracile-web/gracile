import { Writable } from 'node:stream';
import { fileURLToPath } from 'node:url';
import type { IncomingMessage, ServerResponse } from 'node:http';

import { nodeCondition } from '@gracile/internal-utils/node-condition/production-ssr';
import { createLogger } from '@gracile/internal-utils/logger/helpers';
import { createServerAdapter } from '@whatwg-node/server';

import { GracileError, GracileErrorData } from '../../errors/errors.js';
import { constants } from '../constants.js';
import {
	type AdapterOptions,
	type GracileHandler,
	isRedirect,
} from '../request.js';

// NOTE: Find a more canonical way to ponyfill the Node HTTP request to standard Request
// @ts-expect-error Abusing this feature!
const nodeRequestToStandardRequest = createServerAdapter((request) => request);

function standardResponseInitToNodeResponse(
	responseInit: ResponseInit | Response,
	response: ServerResponse,
) {
	const headers =
		responseInit instanceof Response
			? responseInit.headers
			: new Headers(responseInit.headers);

	for (const [header, content] of headers.entries())
		response.setHeader(header, content);
	if (responseInit.status) response.statusCode = responseInit.status;
	if (responseInit.statusText) response.statusMessage = responseInit.statusText;
}

export type GracileNodeHandler = (
	request: IncomingMessage,
	response: ServerResponse,
	locals?: unknown,
) => Promise<ServerResponse<IncomingMessage> | null | void>;

// eslint-disable-next-line @typescript-eslint/no-empty-object-type
export interface NodeAdapterOptions extends AdapterOptions {
	//
}

/**
 * @param handler - Takes a pre-built Gracile handler from `./dist/server/entrypoint.js`.
 * @example
 * `/src/server.js`
 * ```js
 * import express from 'express';
 *
 * import * as gracile from '@gracile/gracile/node';
 *
 * import { handler } from './dist/server/entrypoint.js';
 *
 * const app = express();
 *
 * app.use(gracile.nodeAdapter(handler));
 *
 * const server = app.listen();
 * ```
 */
export function nodeAdapter(
	handler: GracileHandler,
	options?: NodeAdapterOptions,
): GracileNodeHandler {
	return async function nodeHandler(
		request: IncomingMessage,
		response: ServerResponse,
		locals?: unknown,
	) {
		const logger = createLogger(options?.logger);

		let webRequest: Request;

		try {
			webRequest = (await Promise.resolve(
				nodeRequestToStandardRequest.handleNodeRequest(
					// HACK: Exact optional properties
					request as IncomingMessage & { url?: string; method?: string },
				),
			)) as unknown as Request;
		} catch (error) {
			throw new GracileError(
				{
					...GracileErrorData.InvalidRequestInAdapter,
					message: GracileErrorData.InvalidRequestInAdapter.message('Node'),
				},
				{
					cause: error,
				},
			);
		}

		const mergedLocals: unknown = {
			...(locals || null),
			...('locals' in response && typeof response.locals === 'object'
				? response.locals
				: {}),
		};
		const result = await handler(webRequest, mergedLocals);

		if (result?.body) {
			standardResponseInitToNodeResponse(result.init, response);

			// NOTE: We can't do similar thing with Hono with just
			// a standard Response workflow, it seems
			result.body.addListener('error', (error) => {
				if (nodeCondition.DEV) logger.error(String(error));
				// NOTE: res.writeHead doesn't seems to take effect, too (too late)
				// res.statusCode = 500;
				response.end(nodeCondition.DEV ? '__SSR_ERROR__' : undefined);
			});
			return result.body.pipe(response);
		}
		if (result?.response) {
			standardResponseInitToNodeResponse(result.response, response);

			const redirect = isRedirect(result.response);
			if (redirect) return response.end(result.body);

			if (result.response.body) {
				const piped = await result.response.body
					.pipeTo(Writable.toWeb(response))
					.catch((error) => logger.error(String(error)));
				return piped;
			}
		}

		throw new GracileError({
			...GracileErrorData.InvalidResponseInAdapter,
			message: GracileErrorData.InvalidResponseInAdapter.message('Node'),
		});
	};
}

/**
 * @param root - resolve `dist/client` from this file path.
 * @example
 * ```js
 * `/src/server.js`
 * import * as gracile from '@gracile/gracile/node';
 * import express from 'express';
 *
 * const app = express();
 *
 * app.use(express.static(gracile.getClientBuildPath(import.meta.url)));
 * ```
 */
export function getClientBuildPath(root: string) {
	return fileURLToPath(new URL(constants.CLIENT_DIST_DIR, root));
}

export { printUrls } from '../utils.js';

export { type GracileHandler } from '../request.js';

import { Writable } from 'node:stream';
import { fileURLToPath } from 'node:url';

import { env } from '@gracile/internal-utils/env';
import { createLogger } from '@gracile/internal-utils/logger/helpers';
import { createServerAdapter } from '@whatwg-node/server';
import type { IncomingMessage, ServerResponse } from 'http';

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
	res: ServerResponse,
	response: ServerResponse,
) {
	const headers =
		responseInit instanceof Response
			? responseInit.headers
			: new Headers(responseInit.headers);

	headers.forEach((content, header) => res.setHeader(header, content));
	if (responseInit.status) res.statusCode = responseInit.status;
	if (responseInit.statusText) res.statusMessage = responseInit.statusText;
	for (const [header, content] of headers.entries())
		response.setHeader(header, content);
	if (responseInit.status) response.statusCode = responseInit.status;
	if (responseInit.statusText) response.statusMessage = responseInit.statusText;
}

export type { GracileHandler };

export type GracileNodeHandler = (
	req: IncomingMessage,
	res: ServerResponse,
	request: IncomingMessage,
	response: ServerResponse,
	locals?: unknown,
	// eslint-disable-next-line @typescript-eslint/no-invalid-void-type
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
		req: IncomingMessage,
		res: ServerResponse,

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
					req as IncomingMessage & { url?: string; method?: string },
					request as IncomingMessage & { url?: string; method?: string },
				),
			)) as unknown as Request;
		} catch (e) {
		} catch (error) {
			throw new GracileError(
				{
					...GracileErrorData.InvalidRequestInAdapter,
					message: GracileErrorData.InvalidRequestInAdapter.message('Node'),
				},
				{
					cause: e,
					cause: error,
				},
			);
		}

		const mergedLocals = {
			...(locals ?? {}),
			...('locals' in res && typeof res.locals === 'object' ? res.locals : {}),
		const mergedLocals: unknown = {
			...(locals || null),
			...('locals' in response && typeof response.locals === 'object'
				? response.locals
				: {}),
		};
		const result = await handler(webRequest, mergedLocals);

		if (result?.body) {
			standardResponseInitToNodeResponse(result.init, res);
			standardResponseInitToNodeResponse(result.init, response);

			// NOTE: We can't do similar thing with Hono with just
			// a standard Response workflow, it seems
			result.body.addListener('error', (error) => {
				if (env.DEV) logger.error(String(error));
				// NOTE: res.writeHead doesn't seems to take effect, too (too late)
				// res.statusCode = 500;
				res.end(env.DEV ? '__SSR_ERROR__' : undefined);
			});
			return result.body.pipe(res);
			return result.body.pipe(response);
		}
		if (result?.response) {
			standardResponseInitToNodeResponse(result.response, res);
			standardResponseInitToNodeResponse(result.response, response);

			const redirect = isRedirect(result.response);
			if (redirect) return res.end(result.body);
			if (redirect) return response.end(result.body);

			if (result.response.body) {
				const piped = await result.response.body
					.pipeTo(Writable.toWeb(res))
					.catch((e) => logger.error(String(e)));
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
 * app.use(express.static(gracile.getClientDistPath(import.meta.url)));
 * ```
 */
export function getClientDistPath(root: string) {
	return fileURLToPath(new URL(constants.CLIENT_DIST_DIR, root));
}

export { printUrls } from '../utils.js';

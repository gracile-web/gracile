/**
 * Pure, testable pipeline steps extracted from the request handler.
 *
 * Each function here is a focused stage of the Gracile request lifecycle.
 * They are composed by `createGracileHandler` in `./request.ts`.
 *
 * @internal
 */

import { Readable } from 'node:stream';

import * as assert from '@gracile/internal-utils/assertions';
import type { BetterErrorPayload } from '@gracile-labs/better-errors/dev/vite';
import type { HotPayload, Logger, ViteDevServer } from 'vite';

import { renderRouteTemplate } from '../render/route-template.js';
import type { RouteInfos } from '../routes/match.js';
import type * as R from '../routes/route.js';
import type { GracileConfig } from '../user-config.js';

// ── Types ────────────────────────────────────────────────────────────

export type StandardResponse = {
	response: Response;
	body?: never;
	init?: never;
};
export type ResponseWithNodeReadable = {
	response?: never;
	body: Readable;
	init: ResponseInit;
};

export type HandlerResult = StandardResponse | ResponseWithNodeReadable | null;

export const CONTENT_TYPE_HTML = { 'Content-Type': 'text/html' } as const;

export const PREMISE_REGEXES = {
	properties: /\/__(.*?)\.props\.json$/,
	document: /\/__(.*?)\.doc\.html$/,
} as const;

/** Describes which premises endpoint was requested, if any. */
export interface PremisesDescriptor {
	propertiesOnly: boolean;
	documentOnly: boolean;
}

// ── 1. Rewrite hidden route siblings ─────────────────────────────────

/**
 * Strip the `/__…` suffix so hidden-sibling URLs (premises) resolve to
 * the parent route.
 *
 * @example
 * rewriteHiddenRoutes('http://localhost/blog/__index.props.json')
 * // → 'http://localhost/blog/'
 */
export function rewriteHiddenRoutes(url: string): string {
	return url.replace(/\/__(.*)$/, '/');
}

// ── 2. Resolve premises ──────────────────────────────────────────────

/**
 * Determine if the incoming request targets a premises endpoint
 * (`__index.props.json` or `__index.doc.html`) and whether the config
 * allows it.
 *
 * @returns A descriptor when premises are enabled, or `null` when not.
 * @throws  When a premise URL is hit but premises are not enabled.
 */
export function resolvePremises(
	requestedUrl: string,
	gracileConfig: GracileConfig,
): PremisesDescriptor | null {
	const propertiesOnly = PREMISE_REGEXES.properties.test(requestedUrl);
	const documentOnly = PREMISE_REGEXES.document.test(requestedUrl);
	const allowPremises = Boolean(gracileConfig.pages?.premises?.expose);

	if (allowPremises === false && (propertiesOnly || documentOnly))
		throw new Error(
			'Accessed a page premise but they are not activated. You must enable `pages.premises.expose`.',
		);

	if (allowPremises) return { propertiesOnly, documentOnly };
	return null;
}

// ── 3. Execute handler ───────────────────────────────────────────────

/** The frozen context object passed to user route handlers. */
interface HandlerRouteContext {
	request: Request;
	url: URL;
	responseInit: ResponseInit;
	params: R.Parameters;
	locals: assert.UnknownObject;
}

export interface ExecuteHandlerOptions {
	routeInfos: RouteInfos;
	method: string;
	request: Request;
	fullUrl: string;
	locals: unknown;
	responseInit: ResponseInit;
	premises: PremisesDescriptor | null;
	routeTemplateOptions: Parameters<typeof renderRouteTemplate>[0];
}

/**
 * Result from `executeHandler`:
 *
 * - `{ type: 'response', value }` — return this response directly
 * - `{ type: 'output', value }` — pass to response building
 * - `{ type: 'fallthrough' }` — no handler, proceed to template-only render
 */
export type ExecuteHandlerResult =
	| { type: 'response'; value: StandardResponse }
	| { type: 'output'; value: Readable | Response | null }
	| { type: 'fallthrough' };

/**
 * Dispatch the user's route handler (top-level function or method-map).
 *
 * This determines whether to call the handler, which method to use,
 * and whether to short-circuit with premises or a 405.
 */
export async function executeHandler(
	options: ExecuteHandlerOptions,
): Promise<ExecuteHandlerResult> {
	const {
		routeInfos,
		method,
		request,
		fullUrl,
		locals,
		responseInit,
		premises,
		routeTemplateOptions,
	} = options;

	const handler = routeInfos.routeModule.handler;

	const shouldDispatch =
		('handler' in routeInfos.routeModule && handler !== undefined) ||
		// NOTE: When a handler exists but has no GET key, and the request
		// method is not GET, we still dispatch to let it handle the method.
		(handler && 'GET' in handler === false && method !== 'GET');

	if (!shouldDispatch) return { type: 'fallthrough' };

	// Build the frozen context passed to the user handler.
	let providedLocals: assert.UnknownObject = {};
	if (locals && assert.isUnknownObject(locals)) providedLocals = locals;

	const routeContext: HandlerRouteContext = Object.freeze({
		request,
		url: new URL(fullUrl),
		responseInit,
		params: routeInfos.params,
		locals: providedLocals,
	});

	const hasTopLevelHandler = typeof handler === 'function';

	if (!hasTopLevelHandler && !(method in handler!)) {
		const statusText = `This route doesn't handle the \`${method}\` method!`;
		return {
			type: 'response',
			value: {
				response: new Response(statusText, { status: 405, statusText }),
			},
		};
	}

	const handlerWithMethod = hasTopLevelHandler
		? handler
		: handler![method as keyof typeof handler];
	if (typeof handlerWithMethod !== 'function')
		throw new TypeError('Handler must be a function.');

	const handlerOutput = await Promise.resolve(
		handlerWithMethod(routeContext) as unknown,
	);

	// User returned a raw Response — pass it through.
	if (assert.isResponseOrPatchedResponse(handlerOutput))
		return { type: 'output', value: handlerOutput };

	// User returned data — merge into routeInfos.props for template rendering.
	routeTemplateOptions.routeInfos.props = hasTopLevelHandler
		? handlerOutput
		: { [method]: handlerOutput };

	// Short-circuit for premises.
	if (premises?.documentOnly) {
		const { document } = await renderRouteTemplate(routeTemplateOptions);
		return {
			type: 'response',
			value: {
				response: new Response(document, {
					headers: { ...CONTENT_TYPE_HTML },
				}),
			},
		};
	}
	if (premises?.propertiesOnly)
		return {
			type: 'response',
			value: {
				response: Response.json(routeTemplateOptions.routeInfos.props),
			},
		};

	const output = await renderRouteTemplate(routeTemplateOptions).then(
		(r) => r.output,
	);
	return { type: 'output', value: output };
}

// ── 4. Render without handler (template-only) ────────────────────────

/**
 * Render a page that has no handler — just a document/template.
 * Handles premises short-circuits.
 */
export async function renderWithoutHandler(options: {
	premises: PremisesDescriptor | null;
	routeTemplateOptions: Parameters<typeof renderRouteTemplate>[0];
}): Promise<StandardResponse | Readable | null> {
	const { premises, routeTemplateOptions } = options;

	if (premises?.documentOnly) {
		const { document } = await renderRouteTemplate(routeTemplateOptions);
		return {
			response: new Response(document, {
				headers: { ...CONTENT_TYPE_HTML },
			}),
		};
	}
	if (premises?.propertiesOnly)
		return {
			response: Response.json(routeTemplateOptions.routeInfos.props || {}),
		};

	const output = await renderRouteTemplate(routeTemplateOptions).then(
		(r) => r.output,
	);
	return output;
}

// ── 5. Build the final response from output ──────────────────────────

export function isRedirect(response: Response): { location: string } | null {
	const location = response.headers.get('location');
	if (response.status >= 300 && response.status <= 303 && location) {
		return { location };
	}
	return null;
}

/**
 * Convert a handler/render output (Response or Readable stream) into
 * the final `HandlerResult` shape expected by adapters.
 */
export function buildResponse(options: {
	output: Readable | Response | null;
	responseInit: ResponseInit;
	vite: ViteDevServer | undefined;
	logger: Logger;
}): HandlerResult {
	const { output, responseInit, vite, logger } = options;

	// Direct Response pass-through (e.g. from handler returning Response)
	if (assert.isResponseOrPatchedResponse(output)) {
		const redirect = isRedirect(output);
		if (redirect?.location)
			return {
				response: Response.redirect(redirect.location, output.status),
			};

		return { response: output };
	}

	// Readable stream — the SSR page render
	if (output instanceof Readable) {
		responseInit.headers = {
			...responseInit.headers,
			...CONTENT_TYPE_HTML,
		};
		return {
			body: output.on('error', (error) => {
				const errorMessage =
					`[SSR Error] There was an error while rendering a template chunk on server-side.\n` +
					`It was omitted from the resulting HTML.\n`;

				if (vite) {
					logger.error(errorMessage + error.stack);

					const payload: HotPayload = {
						type: 'error',
						err: {
							name: 'StreamingError',
							message: errorMessage,
							stack: error.stack ?? 'No stack trace available',
							hint: 'This is often caused by a wrong template location dynamic interpolation.',
							cause: error,
						},
					} satisfies BetterErrorPayload;

					setTimeout(() => {
						vite.hot.send(payload);
					}, 200);
				} else {
					logger.error(errorMessage);
				}
			}),

			init: responseInit,
		};
	}

	return null;
}

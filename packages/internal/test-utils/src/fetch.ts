/**
 * HTTP fetch helpers for integration tests.
 *
 * Gracile uses trailing-slash URLs by convention, so `get()` appends one by
 * default.  Pass `{ trailingSlash: false }` for exact-path fetches (e.g. JSON
 * endpoints, static assets).
 */

import { join } from 'node:path';

/**
 * Fetch a URL from the test server, returning the raw Response.
 */
export async function get(
	base: string,
	path: string,
	options?: {
		trailingSlash?: boolean;
		method?: string;
		headers?: Record<string, string>;
		body?: BodyInit | null;
		redirect?: RequestRedirect;
	},
): Promise<Response> {
	const trailing = options?.trailingSlash ?? true;
	let normalizedPath = path;

	// Append trailing slash unless told not to, or if path has query/extension.
	if (
		trailing &&
		!path.endsWith('/') &&
		!path.includes('?') &&
		!path.includes('.')
	) {
		normalizedPath += '/';
	}

	const url = new URL(normalizedPath, base);

	const init: RequestInit = {
		method: options?.method ?? 'GET',
		redirect: options?.redirect ?? 'follow',
	};
	if (options?.headers) init.headers = options.headers;
	if (options?.body != null) init.body = options.body;

	return fetch(url, init);
}

/**
 * Convenience — fetch a page and return the text body.
 */
export async function getText(
	base: string,
	path: string,
	options?: { trailingSlash?: boolean },
): Promise<string> {
	const response = await get(base, path, options);
	return response.text();
}

/**
 * Convenience — build a path from URL segments (mirrors old fetchResource API).
 */
export function urlPath(...parts: string[]): string {
	return join(...parts);
}

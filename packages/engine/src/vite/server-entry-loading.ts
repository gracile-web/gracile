import type { IncomingMessage } from 'node:http';

const REQUEST_BASE_ORIGIN = 'http://gracile.local';
const HTML_NAVIGATION_ACCEPT_RE = /(text\/html|application\/xhtml\+xml)/i;

function firstHeaderValue(
	value: string | string[] | undefined,
): string | undefined {
	return Array.isArray(value) ? value[0] : value;
}

export function joinDevelopmentBasePath(base: string, path: string): string {
	const normalizedBase = base.endsWith('/') ? base : `${base}/`;
	const normalizedPath = path.replace(/^\/+/, '');

	return `${normalizedBase}${normalizedPath}`;
}

export function createServerEntryReadyPath(base: string): string {
	return joinDevelopmentBasePath(base, '__gracile/server-entry-ready');
}

export function createViteClientPath(base: string): string {
	return joinDevelopmentBasePath(base, '@vite/client');
}

export function getRequestPathname(
	request: Pick<IncomingMessage, 'url'>,
): string {
	const requestUrl = request.url ?? '/';

	try {
		return new URL(requestUrl, REQUEST_BASE_ORIGIN).pathname;
	} catch {
		return requestUrl.split('?')[0] || '/';
	}
}

export function isHtmlNavigationRequest(
	request: Pick<IncomingMessage, 'method' | 'headers'>,
): boolean {
	if (request.method !== 'GET' && request.method !== 'HEAD') return false;

	const secFetchDestination = firstHeaderValue(
		request.headers['sec-fetch-dest'],
	);
	if (secFetchDestination === 'document') return true;

	const secFetchMode = firstHeaderValue(request.headers['sec-fetch-mode']);
	if (secFetchMode === 'navigate') return true;

	const accept = firstHeaderValue(request.headers.accept);
	return accept != null && HTML_NAVIGATION_ACCEPT_RE.test(accept);
}

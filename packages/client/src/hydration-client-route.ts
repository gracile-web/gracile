import '@lit-labs/ssr-client/lit-element-hydrate-support.js';

import { RouteModule, type Parameters } from '@gracile/engine/routes/route';
import { hydrate } from '@lit-labs/ssr-client';
// eslint-disable-next-line import-x/no-unresolved
import { routeImports } from 'gracile:client:routes';
import { premiseUrl } from '@gracile/internal-utils/paths';
import { URLPattern } from 'urlpattern-polyfill/urlpattern';

async function init(options?: HydrationOptions) {
	const url = new URL(globalThis.document.location.href);
	// NOTE: Remove hash and query.
	const baseURL = `${url.origin}${url.pathname}`;
	const urlPattern = new URLPattern({ baseURL });

	let route: RouteModule | undefined;
	let parameters: Parameters = {};

	for (const [pattern, routeImport] of routeImports.entries()) {
		const match = urlPattern.exec(pattern, baseURL);

		if (match) {
			const loaded = await routeImport();
			route = loaded.default(RouteModule);
			parameters = match.pathname.groups;
			break;
		}
	}
	if (!route?.template) throw new ReferenceError('No route template found.');

	const propertiesUrl = premiseUrl(url.pathname, 'props');
	const properties = await fetch(propertiesUrl).then((r) => r.json());

	const rootValue = route.template({
		url,
		params: parameters,
		props: properties,
	});

	let hydrationOptions;
	if (options?.signalHost) {
		const { SignalHost } = await import('./signal-host.js');
		hydrationOptions = { host: new SignalHost() };
	}
	hydrate(rootValue, document.body, hydrationOptions);
}

export interface HydrationOptions {
	signalHost?: boolean | undefined;
}

export function createHydrationRoot(options?: HydrationOptions) {
	document.addEventListener('DOMContentLoaded', () => {
		void init(options);
	});
}

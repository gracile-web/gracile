import '@lit-labs/ssr-client/lit-element-hydrate-support.js';

import { RouteModule, type Parameters } from '@gracile/engine/routes/route';
import { hydrate } from '@lit-labs/ssr-client';
// eslint-disable-next-line import-x/no-unresolved
import { routeImports } from 'gracile:client:routes';
import { premiseUrl } from '@gracile/internal-utils/paths';
import { URLPattern } from 'urlpattern-polyfill/urlpattern';

async function init() {
	const url = new URL(globalThis.document.location.href);
	const urlPattern = new URLPattern({
		baseURL: url.href,
	});

	let route: RouteModule | undefined;
	let parameters: Parameters = {};
	for (const [pattern, routeImport] of routeImports.entries()) {
		const match = urlPattern.exec(pattern, url.href);
		if (match) {
			// eslint-disable-next-line unicorn/no-await-expression-member
			const loaded = (await routeImport()).default(RouteModule);
			route = loaded;
			parameters = match.pathname.groups;
			break;
		}
	}
	if (!route?.template) throw new ReferenceError('No route template found.');

	const propertiesUrl = premiseUrl(url.pathname, 'props');
	const properties = await fetch(propertiesUrl).then((r) => r.json());

	const template = route.template({
		url,
		params: parameters,
		props: properties,
	});
	hydrate(template, document.body);
}

document.addEventListener('DOMContentLoaded', () => {
	void init();
});

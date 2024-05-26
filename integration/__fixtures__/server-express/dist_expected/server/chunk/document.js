import { p as pageAssets } from '../server.js';
import { html } from '@lit-labs/ssr';
import 'lit';
import { unsafeHTML } from 'lit/directives/unsafe-html.js';
import { html as html$1 } from '@lit-labs/ssr/lib/server-template.js';

/* eslint-disable @typescript-eslint/no-explicit-any */
/**
 * **Defines** a route.
 *
 * See in the [documentation](https://gracile.js.org/docs/learn/usage/defining-routes/).
 */
function defineRoute(options) {
    // NOTE: We need a factory so `instanceof` will work cross-realm.
    // Otherwise it breaks. when invoked from an `ssrLoadModule` context
    // (due to JS>TS transpilation?). Hence "userland".
    return (RouteModule) => {
        const routeModule = new RouteModule(options);
        return routeModule;
    };
}
// TODO: remove this, use `Response.json instead`? Or keep for old envs?
// export function jsonResponse(data: any, init?: ResponseInit) {
//   return new Response(JSON.stringify(data), {
//     ...init,
//     headers: { 'Content-Type': 'application/json' },
//   });
// }
// NOTE: Useful?
// export function notFound(statusText = '404 - Not found') {
// 	return new Response(null, {
// 		status: 404,
// 		statusText,
// 	});
// }

const errors = html`
	<script type="module">
		if (import.meta.hot) {
			import.meta.hot.on('gracile:ssr-error', (error) => {
				throw new Error(error.message);
			});
		}
	</script>
`;
const fullHydration = html`
	<script type="module">
		// HYDRATE
		import '@gracile/gracile/hydrate';
	</script>
`;
const polyfills = {
  declarativeShadowDom: html`
		<script type="module">
			// DECLARATIVE SHADOW DOM
			import '@gracile/gracile/polyfills/declarative-shadow-dom';
		</script>
	`,
  requestIdleCallback: html`
		${unsafeHTML(`
      <script>
				// REQUEST IDLE CALLBACK
				${await import('./request-idle-callback.js').then((m) => m.default)}
      </script>
			`)}
	`
};
const helpers = {
  fullHydration,
  polyfills,
  pageAssets,
  dev: {
    // NOTE: Unused for now.
    errors
  }
  // SSR_OUTLET: SSR_OUTLET_MARKER,
};

var __freeze = Object.freeze;
var __defProp = Object.defineProperty;
var __template = (cooked, raw) => __freeze(__defProp(cooked, "raw", { value: __freeze(cooked.slice()) }));
var _a;
const document = (options) => html$1(_a || (_a = __template(['\n	<!doctype html>\n	<html lang="en">\n		<head>\n			<!-- Helpers -->\n			', "\n			<!--  -->\n			", "\n			<!--  -->\n			", '\n\n			<!-- Global assets -->\n			<link\n				rel="stylesheet"\n				href=', '\n			/>\n			<script\n				type="module"\n				src=', "\n			><\/script>\n\n			<!-- Page assets -->\n			", '\n\n			<!-- SEO and page metadata -->\n			<meta charset="UTF-8" />\n			<meta name="viewport" content="width=device-width, initial-scale=1.0" />\n			<link rel="icon" type="image/svg" href="/favicon.svg" />\n\n			<title>', "</title>\n		</head>\n\n		<body>\n			<route-template-outlet></route-template-outlet>\n		</body>\n	</html>\n"])), Object.values(helpers.dev), helpers.fullHydration, Object.values(helpers.polyfills), new URL("./document.css", import.meta.url).pathname, new URL("./document.client.ts", import.meta.url).pathname, helpers.pageAssets, options.title ?? "Hello Gracile");

export { document as a, defineRoute as d };
//# sourceMappingURL=document.js.map

import { html } from 'lit';
import { d as document } from './document.js';
import '@gracile/gracile/server-html';

/* eslint-disable @typescript-eslint/no-explicit-any */
// export const RequestMethod = R.RequestMethod;
// export { R as Route };
/**
 * **Defines a file-based route** for Gracile to consume.
 *
 * @see full guide in the [documentation](https://gracile.js.org/docs/learn/usage/defining-routes/).
 */
function defineRoute(
/**
 * Options to populate the current route module.
 */
options) {
    // NOTE: We need a factory so `instanceof` will work cross-realm.
    // Otherwise it breaks. when invoked from an `ssrLoadModule` context
    // (due to JS>TS transpilation?). Hence "userland".
    return (RouteModule) => {
        const routeModule = new RouteModule(options);
        return routeModule;
    };
}

const routeImports = new Map(
	[ 
		['/route-premises/', () => Promise.resolve().then(() => routePremises$1)],
	]
);

const enabled = true;

const mode = 'server';

const routePremises = defineRoute({
  handler: () => ({ title: "Hello Client Router - Zebra", foo: "baz" }),
  document: (context) => document(context),
  template: (context) => html`
		<h1>${context.props.title}</h1>
		<hr />
		<code>${context.url.pathname}</code>
		<hr />
		<ul>
			<li>Enabled ?<code>${enabled}</code></li>
			<li>Mode<code>${mode}</code></li>
		</ul>

		<div>
			<!--  -->
			DUMP
			<pre>${JSON.stringify([...routeImports], null, 2)}</pre>
		</div>
	`
});

const routePremises$1 = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
    __proto__: null,
    default: routePremises
}, Symbol.toStringTag, { value: 'Module' }));

export { routePremises as default };

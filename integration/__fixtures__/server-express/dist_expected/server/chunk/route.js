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

export { defineRoute as d };
//# sourceMappingURL=route.js.map

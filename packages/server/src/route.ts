/* eslint-disable @typescript-eslint/no-explicit-any */

import * as R from '@gracile/engine/routes/route';

export { R as Route };

/**
 * **Defines** a route.
 *
 * See in the [documentation](https://gracile.js.org/docs/learn/usage/defining-routes/).
 */
export function defineRoute<
	GetHandlerData extends R.HandlerDataHtml = undefined,
	PostHandlerData extends R.HandlerDataHtml = undefined,
	StaticPathOptions extends R.StaticPathOptionsGeneric | undefined = undefined,
	RouteContext extends R.RouteContextGeneric = {
		url: URL;

		props: StaticPathOptions extends { params: any; props: any }
			? StaticPathOptions['props']
			: //  {
				// 		GET: GetHandlerData extends Response ? never : GetHandlerData;
				// 		POST: PostHandlerData extends Response ? never : PostHandlerData;
				// 	}

				GetHandlerData | PostHandlerData extends undefined
				? never
				: {
						GET: GetHandlerData extends Response ? never : GetHandlerData;
						POST: PostHandlerData extends Response ? never : PostHandlerData;
					};

		params: StaticPathOptions extends { params: any }
			? StaticPathOptions['params']
			: R.Params;
	},
>(options: {
	// locals?: (locals: any) => R.MaybePromise<Locals>;

	handler?: StaticPathOptions extends object
		? never
		:
				| R.Handler<Response>
				| {
						GET?: R.Handler<GetHandlerData>;
						POST?: R.Handler<PostHandlerData>;
						QUERY?: R.Handler<Response>;
						PUT?: R.Handler<Response>;
						PATCH?: R.Handler<Response>;
						DELETE?: R.Handler<Response>;
						HEAD?: R.Handler<Response>;
						OPTIONS?: R.Handler<Response>;
				  }
				| undefined;

	staticPaths?: (() => StaticPathOptions[]) | undefined;

	// TODO: Make it type dependent with handler
	prerender?: boolean | undefined;

	document?: R.DocumentTemplate<RouteContext> | undefined;

	template?: R.BodyTemplate<RouteContext> | undefined;
}) {
	// NOTE: We need a factory so `instanceof` will work cross-realm.
	// Otherwise it breaks. when invoked from an `ssrLoadModule` context
	// (due to JS>TS transpilation?). Hence "userland".
	return (RouteModule: typeof R.RouteModule) => {
		const routeModule = new RouteModule(options as unknown as R.ModuleOptions);
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

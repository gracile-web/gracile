// NOTE: Tested in @gracile/server, but could add more test here

import type { ServerRenderedTemplate } from '@lit-labs/ssr';
import type { TemplateResult } from 'lit';

// export type RouteParams = Record<string, string | undefined>;
// export type RouteProps = Record<string, any>;

export type MethodHtml = 'GET' | 'POST';
export type MethodNonHtml = 'QUERY' | 'PUT' | 'PATCH' | 'DELETE';
export type Method = MethodHtml & MethodNonHtml;

// export type KnownMethod = typeof knownMethods[number];

export const RequestMethod = {
	GET: 'GET',
	QUERY: 'QUERY',
	HEAD: 'HEAD',
	POST: 'POST',
	PUT: 'PUT',
	DELETE: 'DELETE',
	OPTIONS: 'OPTIONS',
	PATCH: 'PATCH',
} as const;

export type ModuleOptions = {
	staticPaths?: StaticPathsGeneric /* | undefined */;

	handler?: HandlerGeneric;

	prerender?: boolean | undefined;

	document?: DocumentTemplate<RouteContextGeneric>;

	template?: (context: RouteContextGeneric) => RouteTemplateResult;
};

export class RouteModule {
	readonly #staticPaths;

	public get staticPaths() {
		return this.#staticPaths;
	}

	readonly #locals;

	public get locals() {
		return this.#locals;
	}

	readonly #handler;

	public get handler() {
		return this.#handler;
	}

	readonly #document;

	public get document() {
		return this.#document;
	}

	readonly #prerender;

	public get prerender() {
		return this.#prerender;
	}

	readonly #template;

	public get template() {
		return this.#template;
	}

	constructor(options: ModuleOptions) {
		// if (typeof options.staticPaths === 'function')
		this.#staticPaths = options.staticPaths;

		// if (
		// 	(typeof options.handler === 'object' ||
		// 		typeof options.handler === 'function') &&
		// 	options.handler
		// )
		this.#handler = options.handler;

		this.#locals = {};

		// if (typeof options.template === 'function')
		this.#template = options.template;

		// if (typeof options.document === 'function')
		this.#document = options.document;

		// if (typeof options.prerender === 'boolean')
		this.#prerender = options.prerender;
	}
}

export type Parameters = Record<string, string | undefined>;

export type Handler<
	// Locals,
	Data extends HandlerData | HandlerDataHtml = never,
> = (context: {
	url: URL;

	/**
	 * Parameters from dynamic route.
	 *
	 * E.g. `src/routes/foo/[bar]/[baz].ts` -\> `{ bar: string; baz: string; }`
	 */
	params: Parameters;

	request: Request;

	locals: Gracile.Locals;

	/**
	 * Let you mutate the downstream **page** response.
	 *
	 * It doesn't take effect if you're returning the
	 * response yourself before (within your request handler).
	 * */
	responseInit: ResponseInit;
}) => MaybePromise<Data> | MaybePromise<void>;

export type HandlerGeneric =
	| Handler<HandlerData | HandlerDataHtml>
	| Partial<
			Record<MethodHtml, Handler<HandlerData | HandlerDataHtml>> &
				Record<MethodNonHtml, Handler<Response>>
	  >;

export type StaticPathsGeneric = () => MaybePromise<StaticPathOptionsGeneric[]>;

export type HandlerData = Response | undefined;
export type HandlerDataHtml = HandlerData | object;

export type StaticPathOptionsGeneric = {
	params: Parameters;
	props: unknown;
};

export type MaybePromise<T> = Promise<T> | T;

export type StaticRequest = Pick<Request, 'url'>;

export type RouteContextGeneric = {
	url: URL;
	params: Parameters;
	props: unknown;
};

export type DocumentResult = MaybePromise<ServerRenderedTemplate>;
export type RouteTemplateResult = MaybePromise<TemplateResult>;

export type DocumentTemplate<
	RouteContext extends RouteContextGeneric = RouteContextGeneric,
	// RouteContext,
> = (context: RouteContext) => DocumentResult;

export type BodyTemplate<RouteContext> = (
	context: RouteContext,
) => RouteTemplateResult;

// -----------------------------------------------------------------------------
// NOTE: Should be kept as internals?

export interface Route {
	filePath: string;
	pattern: URLPattern;
	hasParams: boolean;
	pageAssets: string[];
	// prerender: boolean | null;
}

// -----------------------------------------------------------------------------

export type RoutesManifest = Map<string, Route>;
export type RoutesImports = Map<string, () => Record<string, unknown>>;
export type RoutesAssets = Map<string, string>;

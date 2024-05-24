import type { ServerRenderedTemplate } from '@lit-labs/ssr';
import type { TemplateResult } from 'lit';

// export type RouteParams = Record<string, string | undefined>;
// export type RouteProps = Record<string, any>;

export type MethodHtml = 'GET' | 'POST';
export type MethodNonHtml = 'QUERY' | 'PUT' | 'PATCH' | 'DELETE';
export type Method = MethodHtml & MethodNonHtml;

// export type KnownMethod = typeof knownMethods[number];

// export const knownMethods = [
//   "GET",
//   "QUERY",
//   "HEAD",
//   "POST",
//   "PUT",
//   "DELETE",
//   "OPTIONS",
//   "PATCH",
// ] as const;

export type ModuleOptions = {
	staticPaths?: StaticPathsGeneric /* | undefined */;
	handler?: HandlerGeneric;

	template?: (context: RouteContextGeneric) => RouteTemplateResult;

	document?: DocumentTemplate<RouteContextGeneric>;
};

// TODO: put in engine
export class RouteModule {
	readonly #staticPaths;

	public get staticPaths() {
		return this.#staticPaths;
	}

	readonly #handler;

	public get handler() {
		return this.#handler;
	}

	readonly #document;

	public get document() {
		return this.#document;
	}

	readonly #template;

	public get template() {
		return this.#template;
	}

	constructor(options: ModuleOptions) {
		if (typeof options.staticPaths === 'function')
			this.#staticPaths = options.staticPaths;
		if (
			(typeof options.handler === 'object' ||
				typeof options.handler === 'function') &&
			options.handler
		)
			this.#handler = options.handler;
		// if (options.fragment) this.#fragment = options.fragment;
		if (typeof options.template === 'function')
			this.#template = options.template;
		if (typeof options.document === 'function')
			this.#document = options.document;
	}
}

export type Params = Record<string, string | undefined>;

export type Handler<Data extends HandlerData | HandlerDataHtml = never> =
	(context: {
		url: URL;

		/**
		 * Parameters from dynamic route.
		 *
		 * E.g. `src/routes/foo/[bar]/[baz].ts` -\> `{ bar: string; baz: string; }`
		 */
		params: Params;

		request: Request;

		/**
		 * Let you mutate the downstream **page** response.
		 *
		 * It doesn't take effect if you're returning the
		 * response yourself before (within your request handler).
		 * */
		response: ResponseInit;
	}) => MaybePromise<Data> | MaybePromise<void>;

export type HandlerGeneric =
	| Handler<HandlerData | HandlerDataHtml>
	| Partial<
			Record<MethodHtml, Handler<HandlerData | HandlerDataHtml>> &
				Record<MethodNonHtml, Handler<Response>>
	  >;

export type StaticPathsGeneric = () => StaticPathOptionsGeneric[];

export type HandlerData = Response | undefined;
export type HandlerDataHtml = HandlerData | object;

export type StaticPathOptionsGeneric = {
	params: Params;
	props: unknown;
};

export type MaybePromise<T> = Promise<T> | T;

export type StaticRequest = Pick<Request, 'url'>;

export type RouteContextGeneric = {
	url: URL;
	params: Params;
	props: unknown;
};

export type DocumentResult = MaybePromise<ServerRenderedTemplate>;
export type RouteTemplateResult = MaybePromise<
	TemplateResult<1> | ServerRenderedTemplate
>;

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
	prerender: boolean | null;
}

// -----------------------------------------------------------------------------

export type RoutesManifest = Map<string, Route>;
export type RoutesImports = Map<string, () => Record<string, unknown>>;
export type RoutesAssets = Map<string, string>;

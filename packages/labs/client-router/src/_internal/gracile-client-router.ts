import type { Config, Context, Plugin, Route } from '../types.js';

const { window } = globalThis;

export type EventType = 'route-changed' | 'route-rendered';

class RouteEvent extends Event {
	context;

	constructor(type: EventType, context: Context) {
		super(type);
		this.context = context;
	}
}

// TODO: Injectable/configurable logger.

const log = console.log;

/**
 * Forked/adapted from the
 * [`@thepassle/app-tools`](https://github.com/thepassle/app-tools) router (license ISC).
 */
export class GracileRouter extends EventTarget {
	public context: Context = {
		parameters: {},
		query: {},
		title: '',
		url: new URL(window.location.href),
	};

	public config;
	public routes;
	public route?: Route | null;

	static readonly events = Object.freeze({
		ROUTE_CHANGED: 'route-changed',
		ROUTE_RENDERED: 'route-rendered',
	} satisfies Record<string, EventType>);

	public override removeEventListener(
		type: EventType,
		callback: EventListenerOrEventListenerObject | null,
		options?: EventListenerOptions | boolean,
	): void {
		super.removeEventListener(type, callback, options);
	}

	public override addEventListener(
		type: EventType,
		callback: EventListenerOrEventListenerObject | null,
		options?: AddEventListenerOptions | boolean,
	): void {
		super.addEventListener(type, callback, options);
	}

	public constructor(config: Config) {
		super();
		this.config = config;

		this.routes = config.routes.map((route) => {
			const r = {
				...route,

				urlPattern: new URLPattern({
					pathname: route.path,
					baseURL: window.location.href,
					search: '*',
					hash: '*',
				}),
			};
			return r;
		});
		log('Initialized routes', this.routes);

		window.history.scrollRestoration = 'manual';

		queueMicrotask(() => {
			void this.navigate(new URL(window.location.href), {
				replace: true,
			});
		});

		const options = { signal: this.#aborter.signal };
		window.addEventListener('popstate', this.#onPopState.bind(this), options);
		window.addEventListener('click', this.#onAnchorClick.bind(this), options);
	}

	#aborter = new AbortController();

	public uninstall(): void {
		this.#aborter.abort();
	}

	public static get url(): URL {
		return new URL(window.location.href);
	}

	public get fallback(): URL {
		if (!this.config?.fallback)
			throw new Error('[ROUTER] No fallback configured');
		return new URL(this.config.fallback, GracileRouter.baseUrl);
	}

	public static get baseUrl(): URL {
		return new URL('./', document.baseURI);
	}

	public async render<RenderResult>(): Promise<RenderResult> {
		log(
			`Rendering route ${this.context.url.pathname}${this.context.url.search}${this.context.url.hash}`,
			{ context: this.context, route: this.route },
		);

		const result = await Promise.resolve(this.route?.render?.(this.context));

		this.dispatchEvent(new RouteEvent('route-rendered', this.context));

		return result as RenderResult;
	}

	// TODO: Restore scroll when it's the same page but with hash, to no hash.
	public restoreRouteScrolling(): void {
		const top = this.#savedScrollPosition.get(this.context.url.href) || 0;
		window.scrollTo({ behavior: 'instant', left: 0, top });
	}

	static createContext(
		route: Route,
		url: URL,
		match: URLPatternResult,
	): Context {
		const { title } = route;
		const query = Object.fromEntries(new URLSearchParams(url.search));
		const parameters = match.pathname.groups ?? {};

		return {
			resolvedPathname: match.pathname.input,
			url,
			title:
				typeof title === 'function' ? title({ parameters, query, url }) : title,
			parameters,
			query,
		};
	}

	#matchRoute(
		matcherUrl: URL,
		contextUrl: URL = matcherUrl,
	): { route: Route; context: Context } | null {
		for (const route of this.routes) {
			const match = route.urlPattern.exec(matcherUrl);
			if (match) {
				return {
					route,
					context: GracileRouter.createContext(route, contextUrl, match),
				};
			}
		}
		log(
			`No route matched for ${matcherUrl.pathname}${matcherUrl.search}${matcherUrl.hash}`,
			matcherUrl,
		);
		return null;
	}

	#resolveTrailingSlash(url: URL): {
		matcherUrl: URL;
		navigationUrl: URL;
		redirected: boolean;
	} {
		const policy = this.config?.trailingSlash ?? 'ignore';
		const matcherUrl = new URL(url.href);
		const pathname = matcherUrl.pathname;

		if (pathname === '/')
			return {
				matcherUrl,
				navigationUrl: new URL(url.href),
				redirected: false,
			};

		if (policy === 'ignore') {
			if (!pathname.endsWith('/')) matcherUrl.pathname = `${pathname}/`;
			return {
				matcherUrl,
				navigationUrl: new URL(url.href),
				redirected: false,
			};
		}

		if (policy === 'always' && !pathname.endsWith('/')) {
			matcherUrl.pathname = `${pathname}/`;
			return { matcherUrl, navigationUrl: matcherUrl, redirected: true };
		}

		if (policy === 'never' && pathname.endsWith('/')) {
			matcherUrl.pathname = pathname.slice(0, -1);
			return { matcherUrl, navigationUrl: matcherUrl, redirected: true };
		}

		return {
			matcherUrl,
			navigationUrl: new URL(url.href),
			redirected: false,
		};
	}

	#resolveRoute(
		matcherUrl: URL,
		contextUrl: URL = matcherUrl,
	): { route: Route; context: Context } | null {
		const directMatch = this.#matchRoute(matcherUrl, contextUrl);
		if (directMatch) return directMatch;

		if (!this.config?.fallback) return null;

		return this.#matchRoute(this.fallback, contextUrl);
	}

	static hardNavigate(
		url: URL,
		options: {
			replace?: boolean;
		} = {},
	): void {
		log(
			`[ROUTER] No client route matched for ${url.pathname}${url.search}${url.hash}. Falling back to browser navigation.`,
		);

		if (options.replace) {
			window.location.replace(url.href);
			return;
		}

		window.location.href = url.href;
	}

	#notifyUrlChanged(): void {
		this.dispatchEvent(new RouteEvent('route-changed', this.context));
	}

	#onPopState(): void {
		void this.navigate(new URL(window.location.href), {
			backNav: true,
		});
	}

	#onAnchorClick = (event: MouseEvent): void => {
		if (
			event.defaultPrevented ||
			event.button !== 0 ||
			event.metaKey ||
			event.ctrlKey ||
			event.shiftKey
		) {
			return;
		}

		const anchor = event
			.composedPath()
			.find((element) => (element as HTMLElement).tagName === 'A') as
			| HTMLAnchorElement
			| undefined;

		if (!anchor || !anchor.href) return;

		const url = new URL(anchor.href);

		if (GracileRouter.url.href === url.href) return;
		if (url.host !== window.location.host) return;
		if (anchor.hasAttribute('download') || anchor.href.includes('mailto:'))
			return;

		const target = anchor.getAttribute('target');
		if (target && target !== '' && target !== '_self') return;

		event.preventDefault();
		void this.navigate(url);
	};

	#collectPlugins(route: Route): Plugin[] {
		return [...(this.config?.plugins ?? []), ...(route?.plugins ?? [])];
	}

	#savedScrollPosition = new Map<string, number>();

	public async navigate(
		url: string | URL,
		options: {
			backNav?: boolean;
			replace?: boolean;
		} = {},
	): Promise<void> {
		if (typeof url === 'string') {
			url = new URL(url, GracileRouter.baseUrl);
		}

		const trailingSlashResult = this.#resolveTrailingSlash(url);
		const matcherUrl = trailingSlashResult.matcherUrl;

		if (trailingSlashResult.redirected) {
			void this.navigate(trailingSlashResult.navigationUrl, {
				...options,
				replace: true,
			});
			return;
		}

		this.#savedScrollPosition.set(this.context.url.href, window.scrollY);

		let matchedRoute = this.#resolveRoute(matcherUrl, url);
		log(`Navigating to ${url.pathname}${url.search}${url.hash}`, {
			context: matchedRoute?.context ?? this.context,
			route: this.route,
		});

		if (matchedRoute) this.context = matchedRoute.context;

		let plugins: Plugin[] = matchedRoute
			? this.#collectPlugins(matchedRoute.route)
			: [];

		for (const plugin of plugins) {
			try {
				const result = await Promise.resolve(
					plugin?.shouldNavigate?.(this.context),
				);
				if (result) {
					const condition = await Promise.resolve(result.condition());
					if (!condition) {
						url = new URL(result.redirect, GracileRouter.baseUrl);
						const redirectTrailingSlashResult = this.#resolveTrailingSlash(url);

						if (redirectTrailingSlashResult.redirected) {
							void this.navigate(redirectTrailingSlashResult.navigationUrl, {
								...options,
								replace: true,
							});
							return;
						}

						matchedRoute = this.#resolveRoute(
							redirectTrailingSlashResult.matcherUrl,
							url,
						);
						if (matchedRoute) this.context = matchedRoute.context;

						plugins = matchedRoute
							? this.#collectPlugins(matchedRoute.route)
							: [];

						log('Redirecting', { context: this.context, route: this.route });
					}
				}
			} catch (error) {
				log(`Plugin "${plugin.name}" error on shouldNavigate hook`, error);
				throw error;
			}
		}

		this.route = matchedRoute?.route ?? null;

		if (!this.route) {
			GracileRouter.hardNavigate(
				url,
				typeof options.replace === 'boolean'
					? { replace: options.replace }
					: {},
			);
			return;
		}

		for (const plugin of plugins) {
			try {
				await Promise.resolve(plugin?.beforeNavigation?.(this.context));
			} catch (error) {
				log(`Plugin "${plugin.name}" error on beforeNavigation hook`, error);
				throw error;
			}
		}

		if (options?.replace || !options.backNav) {
			const data = ['', '', `${url.pathname}${url.search}${url.hash}`] as const;

			if (options?.replace) window.history.replaceState(...data);
			else if (!options.backNav) window.history.pushState(...data);
		}

		this.#notifyUrlChanged();

		for (const plugin of plugins) {
			try {
				await Promise.resolve(plugin?.afterNavigation?.(this.context));
			} catch (error) {
				log(`Plugin "${plugin.name}" error on afterNavigation hook`, error);
				throw error;
			}
		}
	}
}

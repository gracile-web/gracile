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
	public context = {
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

	public uninstall() {
		this.#aborter.abort();
	}

	public static get url(): URL {
		return new URL(window.location.href);
	}

	public get fallback(): URL {
		return new URL(
			this.config?.fallback ||
				GracileRouter.baseUrl.href.slice(window.location.origin.length),
			GracileRouter.baseUrl,
		);
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
	public restoreRouteScrolling() {
		const top = this.#savedScrollPosition.get(this.context.url.href) || 0;
		window.scrollTo({ behavior: 'instant', left: 0, top });
	}

	#matchRoute(url: URL): Route | null {
		for (const route of this.routes) {
			const match = route.urlPattern.exec(url);
			if (match) {
				const { title } = route;
				const query = Object.fromEntries(new URLSearchParams(url.search));
				const parameters = match?.pathname?.groups ?? {};
				this.context = {
					url,
					title:
						typeof title === 'function'
							? title({ parameters, query, url })
							: title,
					parameters: parameters,
					query,
				};
				return route;
			}
		}
		log(`No route matched for ${url.pathname}${url.search}${url.hash}`, url);
		return null;
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

		this.#savedScrollPosition.set(this.context.url.href, window.scrollY);

		let route = this.#matchRoute(url) || this.#matchRoute(this.fallback);
		log(`Navigating to ${url.pathname}${url.search}${url.hash}`, {
			context: this.context,
			route: this.route,
		});

		let plugins: Plugin[] = route ? this.#collectPlugins(route) : [];

		for (const plugin of plugins) {
			try {
				const result = await Promise.resolve(
					plugin?.shouldNavigate?.(this.context),
				);
				if (result) {
					const condition = await Promise.resolve(result.condition());
					if (!condition) {
						url = new URL(result.redirect, GracileRouter.baseUrl);
						route = this.#matchRoute(url) || this.#matchRoute(this.fallback);
						plugins = route ? this.#collectPlugins(route) : [];
						log('Redirecting', { context: this.context, route: this.route });
					}
				}
			} catch (error) {
				log(`Plugin "${plugin.name}" error on shouldNavigate hook`, error);
				throw error;
			}
		}

		this.route = route;

		if (!this.route) {
			throw new Error(`[ROUTER] No route or fallback matched for url ${url}`);
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

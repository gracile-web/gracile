/* eslint-disable @typescript-eslint/no-use-before-define */
// TODO: Remove this polyfill when FF, Safari etc. support it.
// Maybe it's a better practice to let the user load it's own polyfill.
// It's the only place in the Gracile codebase where a polyfill is
// "shipped silently".
import 'urlpattern-polyfill';
import '@gracile/client/lit-element-hydrate-support';

import { render, type TemplateResult } from 'lit';
import { RouteModule } from '@gracile/engine/routes/route';
// eslint-disable-next-line import-x/no-unresolved
import { routeImports, enabled } from 'gracile:client:routes';
import { hydrate } from '@lit-labs/ssr-client';
import { premiseUrl } from '@gracile/internal-utils/paths';

import { GracileRouter } from './_internal/gracile-client-router.js';
import * as prefetching from './_internal/prefetching.js';
import type { Config, RouteDefinition } from './types.js';

if (!enabled) throw new Error('Gracile client router is disabled!');

// NOTE: First load don't need to fetch the base document, just the props.
// Also we just need to **hydrate**, where subsequent CSR initiated routes will
// be **rendered**. Those renders need an initial, successful hydration, or
// it will cause havoc.
let isInitiallyHydrated = false;

// NOTE: Will be used for the document head reconciliation between routes.
//
// I assume this is not the most efficient way of doing this, possibly
// just pumping pure, pre-processed JSON from the build step/virtual module
// is leaner, with fewer bytes and runtime cost.
// But this HTML approach has the merit of simplicity, and sturdiness
// (the real, browser DOM parser, will always be the best, and no need to add
// deps on the Node side, too. Like linkedom, parse5…).
// It's less pre-processing step, which are always lock-ins.
//
// Reminder that the "document" is a separate, private route which does NOT
// serve the page template (i.e. `<route-template-outlet>`), so the size
// is kinda deterministic and kept pretty tiny, but a bit fatter than with pure
// JSON. At least the `GracileRouter` hover prefetching and browser cache is
// mitigating that, for `static` output. For server though,
// the whole document (minus assets) is dynamically generated on each request.
const parser = new DOMParser();

export const loadedRoutes = new Map<string, RouteModule>();

const ROUTE_URL_404 = '/404/';

// NOTE: For prefetching only
async function importRoute(key: string) {
	if (loadedRoutes.has(key)) return;
	const loaded = await routeImports
		.get(key)?.()
		.then((m) => m.default(RouteModule));

	if (loaded) loadedRoutes.set(key, loaded);
	else
		throw new ReferenceError(`Could load client route module for \`${key}\``);
}

export function prefetchRoutePremises(options: {
	pattern: string;
	href: string;
}) {
	// TODO: Use typed context
	void importRoute(options.pattern);
	const preDocument = premiseUrl(options.href, 'doc');
	const preProperties = premiseUrl(options.href, 'props');

	void prefetching.prefetch(preDocument);
	void prefetching.prefetch(preProperties);
}

export interface GracileRouterConfig extends Config {
	morph?: (incoming: Document, target: Document) => void;
}

// TODO: Caching mechanisms optimisations
export function createRouter(config?: GracileRouterConfig) {
	const serverRoutes: RouteDefinition[] = [];

	let previousPathname: string | null = null;

	const cachedDocuments = new Map<string, Document>();
	const cachedTemplates = new Map<string, TemplateResult>();

	// MARK: Virtual routes.
	for (const [path, routeImport] of routeImports.entries()) {
		serverRoutes.push({
			path,

			// NOTE: This is already set up during head reconciliation, but `Router`
			// base class requires to set it up, so it will not overwrite it.
			title: () => document.title,

			// MARK: Render/Hydrate
			async render(/* context */) {
				// // NOTE: Didn't matched
				// if (context.url.pathname !== document.location.pathname) {
				//   // FIXME: Doesn't collect/replace sibling assets.
				//   // router.navigate('/404/');
				//   // Hack: Hard reload. Not that bad, maybe better than CSR? (robustness).
				//   // document.location.href = new URL(
				//   // 	'/404/',
				//   // 	document.location.href,
				//   // ).href;
				//   void router.navigate('/404/', /* { backNav: false } */);
				//   return;
				// }
				let loaded = loadedRoutes.get(path);

				const { url } = GracileRouter;

				const cachedDocumentForRoute = cachedDocuments.get(url.pathname);
				const cachedTemplateForRoute = cachedTemplates.get(url.pathname);

				// MARK: Import/Cache
				if (!loaded) {
					loaded = await routeImport().then((m) => m.default(RouteModule));
					if (!loaded?.template) throw new Error('Incorrect RouteModule');

					loadedRoutes.set(path, loaded);
				}

				// MARK: Initial hash scroll
				if (!isInitiallyHydrated && url.hash)
					document.querySelector(url.hash)?.scrollIntoView();

				const premiseToFetch = [];

				// MARK: Data fetching
				const freshRouteData = {
					props: null as unknown,
					document: null as string | null,
				};

				// MARK: Document
				//// TODO: Separate doc, not needed on first load, same for server mode
				if (!cachedDocumentForRoute && isInitiallyHydrated) {
					premiseToFetch.push(
						fetch(premiseUrl(url.pathname, 'doc')).then((r) =>
							r.text().then((r) => (freshRouteData.document = r)),
						),
					);
				}

				if (!cachedTemplateForRoute) {
					premiseToFetch.push(
						fetch(premiseUrl(url.pathname, 'props')).then((r) =>
							r.json().then((r) => (freshRouteData.props = r)),
						),
					);
				}

				await Promise.all(premiseToFetch);

				// MARK: Collect head
				const existingDocumentLinks = new Map<string, HTMLLinkElement>();
				const upcomingDocumentLinks = new Map<string, HTMLLinkElement>();
				let parsedDocument: Document | null = null;

				if (cachedDocumentForRoute) parsedDocument = cachedDocumentForRoute;
				else if (freshRouteData.document) {
					parsedDocument = parser.parseFromString(
						freshRouteData.document,
						'text/html',
					);
					cachedDocuments.set(url.pathname, parsedDocument);
				}

				// NOTE: Happens at first route change. Initial load already has assets.
				if (parsedDocument) {
					for (const link of document.querySelectorAll<HTMLLinkElement>(
						'head link',
					))
						existingDocumentLinks.set(link.href, link);
					for (const link of parsedDocument.querySelectorAll<HTMLLinkElement>(
						'head link',
					))
						upcomingDocumentLinks.set(link.href, link);
				}

				// TODO: Metas? `<base>`? HTML lang? Body classes? Inline styles?…

				const processPage = async (resolve: () => void) => {
					if (!loaded?.template) throw new Error('No template.');

					// MARK: Transform head
					if (isInitiallyHydrated) {
						if (!parsedDocument) throw new ReferenceError('Missing document');

						await Promise.all(
							[...upcomingDocumentLinks.values()].map(async (link) => {
								if (existingDocumentLinks.has(link.href) === false)
									await new Promise<void>((resolve) => {
										const clonedLink = link.cloneNode();
										clonedLink.addEventListener('load', () => resolve());
										document.head.append(clonedLink);
									});
							}),
						);
						for (const link of existingDocumentLinks.values())
							if (upcomingDocumentLinks.has(link.href) === false) link.remove();

						const existingDocumentScripts = new Map<
							string,
							HTMLScriptElement
						>();
						const upcomingDocumentScripts = new Map<
							string,
							HTMLScriptElement
						>();

						for (const script of document.querySelectorAll<HTMLScriptElement>(
							'head script',
						))
							existingDocumentScripts.set(script.src, script);
						for (const script of parsedDocument.querySelectorAll<HTMLScriptElement>(
							'head script',
						))
							upcomingDocumentScripts.set(script.src, script);

						for (const script of upcomingDocumentScripts.values()) {
							if (existingDocumentScripts.has(script.src) === false) {
								// NOTE 1: Appending a script tag seems to be ignored by the
								// browser. Maybe a security feature or something?
								// NOTE 2: Rollup will yell without this comment.
								// It's fine, we are getting already processed `<link>`, so,
								// their always correct and well funded.
								void import(/* @vite-ignore */ script.src);
							}
						}

						// TODO: Handle inline scripts? IDK how to treat them.
						// They can produce side-effects. Maybe make this configurable?

						// existingDocScripts.forEach((script, key) => {
						// 	if (newDocScripts.has(script.src) === false) {
						// 		// script.remove();
						// 	}
						// });
					}

					// MARK: Load template
					const parameters =
						// NOTE: We have this info server side, but it's easy to derive it
						// here, client-side, without complicating the payload for such
						// trivial things.
						router.route?.urlPattern?.exec(url)?.pathname?.groups || {};

					let renderedTemplate = cachedTemplateForRoute;
					if (!cachedTemplateForRoute) {
						const context = {
							url: url,
							params: parameters,
							props: freshRouteData.props,
						};

						renderedTemplate = (await Promise.resolve(
							loaded.template(context),
						)) as TemplateResult;

						cachedTemplates.set(
							url.pathname,
							// NOTE: It's not supposed to be a ServerRenderedTemplate, otherwise
							// it would have crash way before.
							renderedTemplate as TemplateResult,
						);
					}
					if (!renderedTemplate) throw new Error('Cannot render template');

					// MARK: Hydrate or render

					if (!isInitiallyHydrated) {
						try {
							// TODO: try
							requestIdleCallback(() => {});
							hydrate(renderedTemplate, document.body);
							isInitiallyHydrated = true;

							return;
						} catch (error) {
							console.error('Could not hydrate');
							throw error;
						}
					}

					// NOTE: We are always hydrated at this point, only route changed is
					// picked up also.
					// We don't want to re-render for hash changes, too.
					// TODO: early detection
					if (url.pathname !== previousPathname) {
						render(renderedTemplate, document.body);

						// MARK: Extras meta
						if (parsedDocument) {
							document.title = parsedDocument.title;
							document.documentElement.classList.value =
								parsedDocument.documentElement.classList.value;

							// TODO: attributes…
						}
						previousPathname = url.pathname;

						if (!url.hash) router.restoreRouteScrolling();
					}

					if (url.hash) document.querySelector(url.hash)?.scrollIntoView();

					resolve();
				};

				// NOTE: Note sure if the RAF is needed, but just in case, all
				// costly, layout affecting and cascading stuff are put in one stroke.
				// This is to avoid flash of conflicting styles, etc.
				// Also we keep a logical ordering for swaps.
				await new Promise<void>((resolve) =>
					requestAnimationFrame(() => processPage(resolve)),
				);
			},
		});
	}

	const router = new GracileRouter({
		...config,
		fallback: ROUTE_URL_404,
		plugins:
			config?.plugins ||
			[
				// TODO: Try to use the hooks properly? Should simplify things, but
				// rendering could become harder to control?
				// scrollToTop,
				// resetFocus,
				// TODO: offline, generic error page support…
			],

		routes: config?.routes.length
			? [...serverRoutes, ...config.routes]
			: serverRoutes,
	});

	router.addEventListener(GracileRouter.events.ROUTE_CHANGED, router.render);

	prefetching.init({
		prefetchAll: true,
		before: (url) => {
			for (const route of router.routes) {
				const toPrefetch = (route.urlPattern as URLPattern).exec(url);
				if (toPrefetch) {
					void importRoute(route.path);

					break;
				}
			}
		},
		hrefToUrls: (url) => [premiseUrl(url, 'props'), premiseUrl(url, 'doc')],
	});

	return router;
}

// TODO: Remove this polyfill when FF, Safari etc. support it.
// Maybe it's a better practice to let the user load it's own polyfill.
// It's the only place in the Gracile codebase where a polyfill is
// "shipped silently".
import 'urlpattern-polyfill';
import '@gracile/client/lit-element-hydrate-support';

import { RouteModule } from '@gracile/engine/routes/route';
import {
	type Config,
	type RouteDefinition,
} from '@thepassle/app-tools/router.js';
import { routeImports, enabled /* mode */ } from 'gracile:client:routes';
import { hydrate } from '@lit-labs/ssr-client';
import { render } from 'lit';
import { GracileRouter, loadedRoutes } from './gracile-client-router.js';
import { scrollToTop } from '@thepassle/app-tools/router/plugins/scrollToTop.js';
import { resetFocus } from '@thepassle/app-tools/router/plugins/resetFocus.js';

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

export async function createRouter(config?: Config) {
	const serverRoutes: RouteDefinition[] = [];

	let prevHash = '';
	let prevPathname = '';

	// MARK: Virtual routes.
	routeImports.forEach((routeImport, path) => {
		serverRoutes.push({
			path,

			// NOTE: This is already set up during head reconciliation, but `Router`
			// base class requires to set it up, so it will not overwrite it.
			title: () => document.title,

			// MARK: Render/Hydrate
			render: async () => {
				let loaded = loadedRoutes.get(path);

				// MARK: Import/Cache
				if (!loaded) {
					loaded = (await routeImport()).default(RouteModule);
					if (!loaded?.template) throw new Error('Incorrect RouteModule');

					loadedRoutes.set(path, loaded);
				}

				// MARK: Data fetching
				const routeData = {
					props: null as unknown,
					document: null as string | null,
				};

				const propsUrl = `${router.url.pathname ?? '/'}`
					// TODO: More generic/robust approach. Same everywhere we swap
					// these path parts (for *.doc.html, too).
					.replace(/\/404\/$/, '/__404.props.json')
					.replace(/\/500\/$/, '/__500.props.json')
					.replace(/\/$/, '/__index.props.json');

				// TODO: Separate doc, not needed on first load, same for server mode
				const [json, doc] = await Promise.all([
					// MARK: Template props
					fetch(propsUrl).then((r) => r.json() as unknown),

					// MARK: Document
					isInitiallyHydrated
						? fetch(
								`${router.url.pathname ?? '/'}`
									.replace(/404\/$/, '/__404.doc.html')
									.replace(/500\/$/, '/__500.doc.html')
									.replace(/\/$/, '/__index.doc.html'),
							).then((r) => r.text())
						: null,
				]);

				// MARK: 404 redirect
				if (json === null) {
					router.navigate('/404/');
					return;
				}

				routeData.props = json;
				routeData.document = doc;

				// MARK: Collect head
				const existingDocLinks = new Map();
				const newDocLinks = new Map();
				let parsedDoc: Document | null = null;

				if (routeData.document) {
					parsedDoc = parser.parseFromString(routeData.document, 'text/html');

					document
						.querySelectorAll<HTMLLinkElement>('head link')
						.forEach((link) => {
							existingDocLinks.set(link.href, link);
						});
					parsedDoc
						.querySelectorAll<HTMLLinkElement>('head link')
						.forEach((link) => {
							newDocLinks.set(link.href, link);
						});
				}
				// TODO: Metas? `<base>`? HTML lang? Body classes? Inline styles?…

				// NOTE: Note sure if the RAF is needed, but just in case, all
				// costly, layout affecting and cascading stuff are put in one stroke.
				// This is to avoid flash of conflicting styles, etc.
				// Also we keep a logical ordering for swaps.
				requestAnimationFrame(async () => {
					if (!loaded?.template) throw new Error();

					// MARK: Transform head
					if (parsedDoc) {
						await Promise.all(
							[...newDocLinks].map(async ([key, link]) => {
								if (existingDocLinks.has(link.href) === false) {
									await new Promise<void>((resolve) => {
										link.addEventListener('load', resolve);
										document.head.append(link);
									});
								}
							}),
						);
						existingDocLinks.forEach((link, key) => {
							if (newDocLinks.has(link.href) === false) {
								link.remove();
							}
						});

						const existingDocScripts = new Map();
						const newDocScripts = new Map();

						document
							.querySelectorAll<HTMLScriptElement>('head script')
							.forEach((script) => {
								existingDocScripts.set(script.src, script);
							});
						parsedDoc
							.querySelectorAll<HTMLScriptElement>('head script')
							.forEach((script) => {
								newDocScripts.set(script.src, script);
							});

						newDocScripts.forEach((script, key) => {
							if (existingDocScripts.has(script.src) === false) {
								// NOTE 1: Appending a script tag seems to be ignored by the
								// browser. Maybe a security feature or something?
								// NOTE 2: Rollup will yell without this comment.
								// It's fine, we are getting already processed `<link>`, so,
								// their always correct and well funded.
								import(/* @vite-ignore */ script.src);
							}
						});

						// TODO: Handle inline scripts? IDK how to treat them.
						// They can produce side-effects. Maybe make this configurable?

						// existingDocScripts.forEach((script, key) => {
						// 	if (newDocScripts.has(script.src) === false) {
						// 		// script.remove();
						// 	}
						// });
					}

					// MARK: Load template
					const params = router.route.urlPattern.exec(router.url)?.pathname
						?.groups;

					const renderedTemplate = await Promise.resolve(
						loaded.template({
							url: router.url,
							params,
							props: routeData.props,
						}),
					);

					// MARK: Hydrate or render
					if (!isInitiallyHydrated) {
						try {
							hydrate(renderedTemplate, document.body);
							isInitiallyHydrated = true;
							return;
						} catch (e) {
							console.error('Could not hydrate');
							throw e;
						}
					}

					render(renderedTemplate, document.body);

					if (Boolean(router.url.hash) && router.url.hash !== prevHash) {
						document.querySelector(router.url.hash)?.scrollIntoView();

						prevHash = router.url.hash;
						prevPathname = router.url.pathname;
					} else {
						scrollToTop.beforeNavigation?.(router.context);
						resetFocus.afterNavigation?.(router.context);
					}

					router.dispatchEvent(new Event('route-rendered'));

					// window.scrollTo(0, 0);

					// MARK: Extras meta
					if (parsedDoc) {
						document.title = parsedDoc.title;
						document.documentElement.classList.value =
							parsedDoc.documentElement.classList.value;

						// TODO: attributes…
					}
				});
			},
		});
	});

	const router = new GracileRouter({
		...config,

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

	return router;
}

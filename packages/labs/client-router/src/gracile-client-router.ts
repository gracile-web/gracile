import { RouteModule } from '@gracile/engine/routes/route';
import { Router, type Config } from '@thepassle/app-tools/router.js';
import { routeImports } from 'gracile:client:routes';

export const loadedRoutes = new Map<string, RouteModule>();

export class GracileRouter extends Router {
	static events = Object.freeze({
		ROUTE_CHANGED: 'route-changed',
		ROUTE_RENDERED: 'route-rendered',
	});

	constructor(config: Config) {
		super(config);

		window.addEventListener('mouseover', this._onAnchorHover);
	}

	private _onAnchorHover(e: MouseEvent) {
		// --- This part is copied from `Router`. Could be extracted to as static method?

		if (
			e.defaultPrevented ||
			e.button !== 0 ||
			e.metaKey ||
			e.ctrlKey ||
			e.shiftKey
		) {
			return;
		}

		const a = e.composedPath().find((el) => el instanceof HTMLAnchorElement);

		if (!a || !a.href) return;

		const url = new URL(a.href);

		if (this.url?.href === url.href) return;
		if (url.host !== window.location.host) return;
		if (a.hasAttribute('download') || a.href.includes('mailto:')) return;

		const target = a.getAttribute('target');
		if (target && target !== '' && target !== '_self') return;

		// ---

		if (loadedRoutes.has(url.pathname)) return;
		// TODO: Make it a plugin?

		// this.dispatchEvent(new Event('anchor-hover'));
		/* 
		async function importRoute() {
			const loaded = (await routeImports.get(url.pathname)?.())?.default(
				RouteModule,
			);

			console.log(loaded);
			if (loaded) loadedRoutes.set(url.pathname, loaded);
			else
				throw new ReferenceError(
					`Could load client route module for \`${url.pathname}\``,
				);
		}

		importRoute(); */

		// EXTENDS WITH PLUGINS
		//     let plugins = this._collectPlugins(route);

		// for (const plugin of plugins) {
		//   try {
		//     const result = await plugin?.shouldNavigate?.(this.context);
		//     if (result) {
		//       const condition = await result.condition();
		//       if (!condition) {
		//         url = new URL(result.redirect, this.baseUrl);
		//         route = this._matchRoute(url) || this._matchRoute(this.fallback);
		//         plugins = this._collectPlugins(route);
		//         log('Redirecting', { context: this.context, route: this.route });
		//       }
		//     }
		//   } catch(e) {
		//     log(`Plugin "${plugin.name}" error on shouldNavigate hook`, e);
		//     throw e;
		//   }
		// }
	}

	uninstall() {
		super.uninstall();
		window.removeEventListener('mouseover', this._onAnchorHover);
	}
}

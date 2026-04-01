import type { PluginOption, EnvironmentModuleNode } from 'vite';

// Matches route entry files in `src/routes/`, excluding client-only siblings
// (e.g. `(home).client.ts`). These are isomorphic modules that live in both the
// SSR and client module graphs when the client router is active.
const ROUTE_MODULE_RE = /\/src\/routes\/.*(?<!\.client)\.[jt]sx?$/;

// NOTE: From https://vite.dev/guide/migration#advanced (Vite 5>6 migration).
export function hmrSsrReload(): PluginOption {
	return {
		name: 'vite-plugin-gracile-hmr-ssr-reload',
		enforce: 'post',

		hotUpdate: {
			order: 'post',

			handler({ modules, server, timestamp }) {
				if (this.environment.name !== 'ssr') return;

				let needsReload = false;

				const invalidatedModules = new Set<EnvironmentModuleNode>();
				for (const module_ of modules) {
					if (module_.id == null) continue;
					const clientModule =
						server.environments.client.moduleGraph.getModuleById(module_.id);

					// Route modules live in both the SSR and client module graphs
					// when the client router is active (isomorphic routes).
					// They still need a full reload because SSR output has changed.
					if (clientModule != null && !ROUTE_MODULE_RE.test(module_.id))
						continue;

					this.environment.moduleGraph.invalidateModule(
						module_,
						invalidatedModules,
						timestamp,
						true,
					);
					needsReload = true;
				}

				if (needsReload) {
					server.ws.send({ type: 'full-reload' });
					return [];
				}
			},
		},
	} as const;
}

import type { Plugin, EnvironmentModuleNode } from 'vite';

// NOTE: From https://vite.dev/guide/migration#advanced (Vite 5>6 migration).
export function hmrSsrReload(): Plugin {
	return {
		name: 'vite-plugin-gracile-hmr-ssr-reload',
		enforce: 'post',

		hotUpdate: {
			order: 'post',

			handler({ modules, server, timestamp }) {
				if (this.environment.name !== 'ssr') return;

				let hasSsrOnlyModules = false;

				const invalidatedModules = new Set<EnvironmentModuleNode>();
				for (const module_ of modules) {
					if (module_.id == null) continue;
					const clientModule =
						server.environments.client.moduleGraph.getModuleById(module_.id);
					if (clientModule != null) continue;

					this.environment.moduleGraph.invalidateModule(
						module_,
						invalidatedModules,
						timestamp,
						true,
					);
					hasSsrOnlyModules = true;
				}

				if (hasSsrOnlyModules) {
					server.ws.send({ type: 'full-reload' });
					return [];
				}
			},
		},
	};
}

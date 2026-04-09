import type { GracileConfig } from '../user-config.js';

export function createServerEntrypointGracileHandler(
	config: GracileConfig,
): string {
	const serializableConfig: Record<string, unknown> = {
		...config,
		litSsr: config.litSsr
			? {
					...config.litSsr,
					renderInfo: config.litSsr.renderInfo
						? {
								...config.litSsr.renderInfo,
								elementRenderers: undefined,
							}
						: undefined,
				}
			: undefined,
	};

	return `
import { routeAssets, routeImports, routes } from 'gracile:routes';
import { createGracileHandler } from '@gracile/gracile/_internals/server-runtime';
import { createLogger } from '@gracile/gracile/_internals/logger';

createLogger();

export const handler = createGracileHandler({
	root: process.cwd(),
	routes,
	routeImports,
	routeAssets,
	serverMode: true,
	
	gracileConfig: ${JSON.stringify(serializableConfig, null, 2)},
});
`;
}

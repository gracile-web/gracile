import type { RendererModule } from '@gracile/internal-utils/plugin-context';

import type { GracileConfig } from '../user-config.js';

export function createServerEntrypointGracileHandler(
	config: GracileConfig,
	rendererModules: RendererModule[] = [],
): string {
	// Generate import statements for element renderer classes.
	const rendererImports = rendererModules
		.map(
			(m, index) =>
				`import { ${m.exportName} as __renderer_${index} } from '${m.importSpecifier}';`,
		)
		.join('\n');

	const hasRenderers = rendererModules.length > 0;

	// Strip non-serialisable elementRenderers from the config —
	// they are re-injected via the generated imports above.

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

	const rendererArray = rendererModules
		.map((_, index) => `__renderer_${index}`)
		.join(', ');

	return `
import { routeAssets, routeImports, routes } from 'gracile:routes';
import { createGracileHandler } from '@gracile/gracile/_internals/server-runtime';
import { createLogger } from '@gracile/gracile/_internals/logger';
${rendererImports}

createLogger();

export const handler = createGracileHandler({
	root: process.cwd(),
	routes,
	routeImports,
	routeAssets,
	serverMode: true,
	
	gracileConfig: ${JSON.stringify(serializableConfig, null, 2)},
	${hasRenderers ? `elementRenderers: [${rendererArray}]` : ''}
});
`;
}

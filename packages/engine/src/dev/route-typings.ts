import { mkdir, writeFile } from 'node:fs/promises';
import { join } from 'node:path';

import type { RoutesManifest } from '../routes/route.js';

export async function generateRoutesTypings(
	root: string,
	routes: RoutesManifest,
) {
	// NOTE: For future, we'll provide parameters like:
	// `route('/blog/:id', { id: 'foo' })`.
	//
	// export const route: (path: string, params?: Params) => string;
	//

	const typings = `declare module 'gracile:route' {
	export const route: (path: Route) => string;
}

export type Route =
	| ${[...routes]
		.map(
			([v]) =>
				`\`${v
					.replace(
						/{:(.*)}/,

						'${string}',
					)
					.replace(
						/:(.*?)\*\//,

						'${string}',
					)}\``,
		)
		.join('\n	| ')};
`;

	await mkdir(join(root, '.gracile')).catch(() => null);
	await writeFile(join(root, '.gracile/routes.d.ts'), typings);
}

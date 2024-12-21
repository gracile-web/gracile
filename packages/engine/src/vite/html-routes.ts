import { readFile } from 'node:fs/promises';

import type { Plugin } from 'vite';

/**
 * It make it possible to have HTML routes. It's funny,
 * but not THAT useful.
 * @todo Make tests and document this simple feature.
 */
export function htmlRoutesLoader(): Plugin[] {
	return [
		{
			name: 'gracile-html-route-loader',

			async load(id) {
				if (/\/src\/routes\/(.*?)\.html/.test(id) === false) return null;

				const htmlContent = await readFile(id, 'utf8');

				return `import { defineRoute } from '@gracile/gracile/route';
import { html } from '@gracile/gracile/server-html';

export default defineRoute({
	document: () => html\`${htmlContent.replaceAll('`', '\\`') /* Escape literal */}\`,
});
`;
			},
		},
	];
}

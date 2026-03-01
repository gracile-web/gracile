/* eslint-disable @typescript-eslint/no-floating-promises */
import { after, describe, it } from 'node:test';

import { fetchResource } from './__utils__/fetch.js';
import { createStaticDevServer } from './__utils__/gracile-server.js';
import { snapshotAssertEqual } from './__utils__/snapshot.js';
import { removeLocalPathsInDevAssets } from './__utils__/vite.js';
import { writeActual } from './config.js';

// FIXME: Skipped — parallel Vite dev servers on the same `static-site` root
// cause esbuild dep-scan race conditions. Will be addressed in test harness rehaul.
const SKIP = true;

const projectRoutes = 'static-site/src/routes';
const currentTestRoutes = '03-custom-elements';

describe(
	'custom-elements',
	{
		skip: SKIP
			? 'parallel vite dev server conflict — pending test harness rehaul'
			: undefined,
	},
	() => {
		let address: string;
		let close: () => Promise<void>;

		it('setup server', async () => {
			({ address, close } = await createStaticDevServer({
				project: 'static-site',
				port: 1947,
			}));
		});

		it('render Lit element - Full', async () => {
			const route = '00-lit-full';

			await snapshotAssertEqual({
				expectedPath: [
					projectRoutes,
					currentTestRoutes,
					`_${route}_expected.html`,
				],
				actualContent: await fetchResource(address, [currentTestRoutes, route]),
				writeActual,
			});

			await snapshotAssertEqual({
				expectedPath: [
					projectRoutes,
					currentTestRoutes,
					`_${route}_expected-client_ts.ts`,
				],
				actualContent: await fetchResource(
					address,
					['/src/routes', currentTestRoutes, `${route}.client.ts`],
					{ trailingSlash: false },
				),
				writeActual,
				prettier: false,
			});

			await snapshotAssertEqual({
				expectedPath: [
					projectRoutes,
					currentTestRoutes,
					`_${route}_expected-lit_element.ts`,
				],
				actualContent: await fetchResource(
					address,
					['/src/routes', currentTestRoutes, '_lit-element.ts'],
					{ trailingSlash: false },
				).then((r) => removeLocalPathsInDevAssets(r)),
				writeActual,
				prettier: false,
			});
		});

		after(async () => close?.());
	},
);

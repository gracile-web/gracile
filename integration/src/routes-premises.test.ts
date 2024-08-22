/* eslint-disable @typescript-eslint/no-floating-promises */
import { after, it } from 'node:test';

import { fetchResource } from './__utils__/fetch.js';
import { createStaticDevServer } from './__utils__/gracile-server.js';
import { snapshotAssertEqual } from './__utils__/snapshot.js';
import { writeActual } from './config.js';

const { address, close } = await createStaticDevServer({
	project: 'static-site',
	port: 18982,
});

const projectRoutes = 'static-site/src/routes';

const currentTestRoutes = '12-route-premises';

// ---

it('route-premises - props', async () => {
	const route = '01-page-zebra/__index.props.json';

	await snapshotAssertEqual({
		expectedPath: [
			projectRoutes,
			currentTestRoutes,
			`_${route.replaceAll('/', '__')}_expected._json`,
		],
		actualContent: await fetchResource(address, [currentTestRoutes, route], {
			trailingSlash: false,
		}),
		writeActual,
	});

	const route2 = '02-page-lion/__index.props.json';

	await snapshotAssertEqual({
		expectedPath: [
			projectRoutes,
			currentTestRoutes,
			`_${route2.replaceAll('/', '__')}_expected._json`,
		],
		actualContent: await fetchResource(address, [currentTestRoutes, route2], {
			trailingSlash: false,
		}),
		writeActual,
	});
});

it('route-premises - doc', async () => {
	const route = '01-page-zebra/__index.doc.html';

	await snapshotAssertEqual({
		expectedPath: [
			projectRoutes,
			currentTestRoutes,
			`_${route.replaceAll('/', '__')}_expected._html`,
		],
		actualContent: await fetchResource(address, [currentTestRoutes, route], {
			trailingSlash: false,
		}),
		writeActual,
	});

	const route2 = '02-page-lion/__index.doc.html';

	await snapshotAssertEqual({
		expectedPath: [
			projectRoutes,
			currentTestRoutes,
			`_${route2.replaceAll('/', '__')}_expected._html`,
		],
		actualContent: await fetchResource(address, [currentTestRoutes, route2], {
			trailingSlash: false,
		}),
		writeActual,
	});
});

it('route-premises - doc', async () => {
	const route = '01-page-zebra';

	await snapshotAssertEqual({
		expectedPath: [
			projectRoutes,
			currentTestRoutes,
			`_${route.replaceAll('/', '__')}_expected._html`,
		],
		actualContent: await fetchResource(address, [currentTestRoutes, route]),
		writeActual,
	});

	const route2 = '02-page-lion';

	await snapshotAssertEqual({
		expectedPath: [
			projectRoutes,
			currentTestRoutes,
			`_${route2.replaceAll('/', '__')}_expected._html`,
		],
		actualContent: await fetchResource(address, [currentTestRoutes, route2]),
		writeActual,
	});
});

after(async () => close());

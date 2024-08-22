/* eslint-disable @typescript-eslint/no-floating-promises */
import { after, it } from 'node:test';

import { fetchResource } from './__utils__/fetch.js';
import { createStaticDevServer } from './__utils__/gracile-server.js';
import { snapshotAssertEqual } from './__utils__/snapshot.js';
import { writeActual } from './config.js';

const projectRoutes = 'static-site/src/routes';
const currentTestRoutes = '00-routes';

const { address, close } = await createStaticDevServer({
	project: 'static-site',
	port: 4549,
});

it('return basic 404', async () => {
	const route = 'does_not_exist';

	await snapshotAssertEqual({
		expectedPath: [projectRoutes, `_${route}_expected.html`],
		actualContent: await fetchResource(address, [route]),
		writeActual,
	});
});
it('return basic 404 - direct', async () => {
	const route = '404';

	await snapshotAssertEqual({
		expectedPath: [projectRoutes, `_${route}_expected.html`],
		actualContent: await fetchResource(address, [route]),
		writeActual,
	});
});
it('return an error page on route error', async () => {
	const route = 'throws';

	await snapshotAssertEqual({
		expectedPath: [projectRoutes, `_${route}_expected.html`],
		actualContent: await fetchResource(address, [route]),
		writeActual,
	});
});

it('return basic route', async () => {
	const route = '00-basic';

	await snapshotAssertEqual({
		expectedPath: [projectRoutes, `_${route}_expected.html`],
		actualContent: await fetchResource(address, [currentTestRoutes, route]),
		writeActual,
	});
});

it('return doc only route', async () => {
	const route = '01-doc-only';

	await snapshotAssertEqual({
		expectedPath: [projectRoutes, currentTestRoutes, `_${route}_expected.html`],
		actualContent: await fetchResource(address, [currentTestRoutes, route]),
		writeActual,
	});
});

it('pass props for top level handler', async () => {
	const route = '02-top-handler';

	await snapshotAssertEqual({
		expectedPath: [projectRoutes, currentTestRoutes, `_${route}_expected.html`],
		actualContent: await fetchResource(address, [currentTestRoutes, route]),
		writeActual,
	});
});

it('pass props for GET handler', async () => {
	const route = '03-get-handler';

	await snapshotAssertEqual({
		expectedPath: [projectRoutes, currentTestRoutes, `_${route}_expected.html`],
		actualContent: await fetchResource(address, [currentTestRoutes, route]),
		writeActual,
	});
});

it('return 1 param static route', async () => {
	const route = '01-param';

	await snapshotAssertEqual({
		expectedPath: [
			projectRoutes,
			currentTestRoutes,
			`_${route}_expected-omega.html`,
		],
		actualContent: await fetchResource(address, [
			currentTestRoutes,
			route,
			'omega',
		]),
		writeActual,
	});

	await snapshotAssertEqual({
		expectedPath: [
			projectRoutes,
			currentTestRoutes,
			`_${route}_expected-jupiter.html`,
		],
		actualContent: await fetchResource(address, [
			currentTestRoutes,
			route,
			'jupiter',
		]),
		writeActual,
	});
});

after(async () => close());

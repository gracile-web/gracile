/* eslint-disable @typescript-eslint/no-floating-promises */
import assert from 'node:assert/strict';
import { after, it } from 'node:test';

import { getLogger } from '@gracile/internal-utils/logger/helpers';
import * as cheerio from 'cheerio';

import { fetchResource } from './__utils__/fetch.js';
import {
	createStaticDevServer,
	ERROR_404,
} from './__utils__/gracile-server.js';

const logger = getLogger();

const { address, close } = await createStaticDevServer({
	project: 'static-site',
	port: 2555,
});

const currentTestRoutes = '00-routes';

// ---

const routes = [
	//
	{ path: '', h1: 'movie (index)' },
	{ path: 'shoot-or', h1: 'Shoot or' },

	{ path: 'popular', h1: '"Popular" (trustee)' },
	{ path: 'formal', h1: '"Formal" (trustee)' },

	{ path: 'formal/research', h1: '"Formal" - Research' },
	{ path: 'popular/research', h1: '"Popular" - Research' },

	{ path: 'formal/guide', h1: '"Formal" - "Guide"' },
	{ path: 'popular/brave', h1: '"Popular" - "Brave"' },

	// DEACTIVATED
	{ path: 'dance-noon', include: ERROR_404 /* '"Dance" (arrow) - noon' */ },
	{
		path: 'creation-noon',
		include: ERROR_404 /* '"Creation" (zebras) - noon' */,
	},

	// DEACTIVATED
	{ path: 'edge-noon-plumber', h1: '"Edge" - "Plumber" (arrow) - (noon)' },

	// DEACTIVATED
	{ path: 'make/best', h1: '"Best" [advance]' },
	{ path: 'make/done', include: ERROR_404 /* '"Done" [vast]' */ },

	{ path: 'car/bike/boat', h1: 'car / bike / boat - index' },
	{ path: 'car/bike/boat/train', h1: 'car / bike / boat / train' },
	{ path: 'car/bike/boat/zeppelin', h1: 'car / bike / boat / zeppelin' },
	{ path: 'car/bike/boat/train/red', h1: 'car / bike / boat / train / red' },

	{ path: 'car/bike/boat/fog', h1: 'car / bike / boat / "Fog"' },
	{ path: 'car/bike/boat/rain', h1: 'car / bike / boat / "Rain"' },
];

// eslint-disable-next-line no-restricted-syntax
for (const routeToTest of routes) {
	it(`return ${routeToTest.path}`, async () => {
		const route = '05-torture-test';

		// eslint-disable-next-line no-restricted-syntax
		const url = [currentTestRoutes, route, routeToTest.path];

		// eslint-disable-next-line no-await-in-loop
		const resource = await fetchResource(address, url);

		if (routeToTest.include) {
			assert.equal(resource.includes(routeToTest.include), true);
		} else if (routeToTest.h1) {
			const $ = cheerio.load(resource);

			const h1 = $('h1').text();
			assert.equal(routeToTest.h1, h1);
		}
		logger.info(`${routes.length} routes matched!`);
	});
}

//

after(async () => close());

/* eslint-disable @typescript-eslint/no-floating-promises */
import assert from 'node:assert/strict';
import { after, it } from 'node:test';

import { logger } from '@gracile/internal-utils/logger';
import * as cheerio from 'cheerio';

import { fetchResource } from './__utils__/fetch.js';
import {
	createStaticDevServer,
	ERROR_HEADING,
} from './__utils__/gracile-server.js';

const { address, close, tryOrClose } = await createStaticDevServer({
	project: 'static-site',
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
	{ path: 'dance-noon', h1: ERROR_HEADING /* '"Dance" (arrow) - noon' */ },
	{
		path: 'creation-noon',
		h1: ERROR_HEADING /* '"Creation" (zebras) - noon' */,
	},

	// DEACTIVATED
	{ path: 'edge-noon-plumber', h1: '"Edge" - "Plumber" (arrow) - (noon)' },

	// DEACTIVATED
	{ path: 'make/best', h1: '"Best" [advance]' },
	{ path: 'make/done', h1: ERROR_HEADING /* '"Done" [vast]' */ },

	{ path: 'car/bike/boat', h1: 'car / bike / boat - index' },
	{ path: 'car/bike/boat/train', h1: 'car / bike / boat / train' },
	{ path: 'car/bike/boat/zeppelin', h1: 'car / bike / boat / zeppelin' },
	{ path: 'car/bike/boat/train/red', h1: 'car / bike / boat / train / red' },

	{ path: 'car/bike/boat/fog', h1: 'car / bike / boat / "Fog"' },
	{ path: 'car/bike/boat/rain', h1: 'car / bike / boat / "Rain"' },
];

it('return all correct routes', async () => {
	const route = '05-torture-test';

	await tryOrClose(async () => {
		// eslint-disable-next-line no-restricted-syntax
		for (const routeToTest of routes) {
			const url = [address, currentTestRoutes, route, routeToTest.path];

			// eslint-disable-next-line no-await-in-loop
			const resource = await fetchResource(url);

			const $ = cheerio.load(resource);

			const h1 = $('h1').text();

			// const body = $('body').text();
			// console.log({ url, body });

			assert.equal(routeToTest.h1, h1);
		}
	});

	logger.info(`${routes.length} routes matched!`);
});

//

after(async () => close());

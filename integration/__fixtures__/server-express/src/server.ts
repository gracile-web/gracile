// Based on "starter-projects/minimal-server-express/src/server.ts"

import { createHandlers } from '@gracile/gracile/node';
import { IP_LOCALHOST, PUBLIC_DIR, safeEnvLoader } from '@gracile/gracile/env';
import express from 'express';

import { authentication } from './middlewares.js';
import { join } from 'path';

const ROOT = '__fixtures__/server-express/';
// const ROOT = '';

const env = safeEnvLoader({
	GRACILE_SITE_URL: { type: String, optional: true },
});

console.log(env.GRACILE_SITE_URL);

const app = express();
const { handlers } = await createHandlers({
	root: join(process.cwd(), ROOT) /*  printAddress: true */,
});

app.get('*', (req, res, next) => {
	// return res.end('OK');
	console.log('request: ' + req.url);
	return next();
});

// Separate JSON API
app.use('/api', (_req, res, _next) =>
	res.json({
		hello: 'world',
	}),
);

// Protected route with middleware
app.use('/private/', authentication);

app.get('/__close', (req, res) => {
	console.log('closing…');
	setTimeout(() => server.close(() => process.exit()));

	return res.end('Closing…');
});

// Static assets or pre-rendered routes
app.use(express.static(join(ROOT, PUBLIC_DIR)));

// Gracile routes
app.use(handlers);

const server = app.listen(3033, IP_LOCALHOST, () => {
	console.log(server.address());
	// printAddressInfos(server);
});

// NOTE: DISABLED FOR TESTS

// if (import.meta.hot) import.meta.hot.accept(() => server.close());

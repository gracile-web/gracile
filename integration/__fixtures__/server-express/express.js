import express from 'express';

import { notFoundHandler, printAddressInfos } from '@gracile/gracile/node';
import { CLIENT_DIST_DIR, IP_LOCALHOST } from '@gracile/gracile/env';

import { handler } from './dist/server/entrypoint.js';
import { fileURLToPath } from 'node:url';

const PORT = 9874;

const app = express();

app.use(
	express.static(fileURLToPath(new URL(CLIENT_DIST_DIR, import.meta.url))),
);

//

// Separate JSON API
// app.use('/api', (_req, res, _next) =>
// 	res.json({
// 		hello: 'world',
// 	}),
// );

//
app.use((...args) =>
	handler(...args, { requestId: crypto.randomUUID() }).catch((error) =>
		next(error),
	),
);

// app.use((...args) => handler(...args).catch((error) => next(error)));

app.use(notFoundHandler);

const instance = app.listen(PORT, IP_LOCALHOST, () => {
	printAddressInfos({ instance });
});

export { instance };

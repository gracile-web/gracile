import express from 'express';

import * as gracile from '@gracile/gracile/node';

import { handler } from './dist/server/entrypoint.js';

const app = express();

app.use(express.static(gracile.getClientDistPath(import.meta.url)));

app.use((_req, res, next) => {
	res.locals.requestId = crypto.randomUUID();
	return next();
});

app.use(gracile.nodeAdapter(handler));

const server = app.listen(9874, () => gracile.printUrls(server.address()));

export { server };

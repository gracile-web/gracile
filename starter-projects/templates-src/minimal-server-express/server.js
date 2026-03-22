import express from 'express';

import * as gracile from '@gracile/gracile/node';

import { handler } from './dist/server/entrypoint.js';

const app = express();

app.use(express.static(gracile.getClientBuildPath(import.meta.url)));

app.use((req, res, next) => {
	res.locals.requestId = crypto.randomUUID();
	res.locals.userEmail = req.get('x-forwarded-email') || 'null@0.home.arpa';
	return next();
});

app.use(gracile.nodeAdapter(handler));

export const server = app.listen(3030, () =>
	gracile.printUrls(server.address()),
);

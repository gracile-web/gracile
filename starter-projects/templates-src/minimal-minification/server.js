import * as gracile from '@gracile/gracile/hono';

import { serve } from '@hono/node-server';
import { serveStatic } from '@hono/node-server/serve-static';
import { Hono } from 'hono';

import { handler } from './dist/server/entrypoint.js';

const app = new Hono()
	.get('*', serveStatic({ root: gracile.getClientBuildPath(import.meta.url) }))
	.use(gracile.honoAdapter(handler));

export const server = serve(
	{ fetch: app.fetch, port: 3030, hostname: gracile.server.LOCALHOST },
	(address) => gracile.printUrls(address),
);

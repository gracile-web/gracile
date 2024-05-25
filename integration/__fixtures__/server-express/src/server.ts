// import { handleWithExpressApp } from '@gracile/engine/server';
// import { handleWithExpressApp } from '@gracile/engine/dev/server';
// import { IP_LOCALHOST, PUBLIC_DIR, withExpress } from '@gracile/engine/server';
import { withExpress } from '@gracile/engine/server';
import { IP_LOCALHOST, PUBLIC_DIR, safeEnvLoader } from '@gracile/gracile/env';
import express from 'express';

import { authentication } from './middlewares.js';
import { join } from 'path';

const ROOT = '__fixtures__/server-express/';

const env = safeEnvLoader({
	GRACILE_SITE_URL: { type: String, optional: true },
});

console.log(env.GRACILE_SITE_URL);

const app = express();

// app.get('*', (req, res, next) => {
// 	console.log('request: ' + req.url);
// 	return res.end('OK');
// });
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
app.use(express.static(ROOT + PUBLIC_DIR));

// console.log({ in: process.cwd() });

await withExpress({
	app,
	root: join(process.cwd(), ROOT) /*  printAddress: true */,
});

const server = app.listen(3033, IP_LOCALHOST, () => {
	console.log(server.address());
	// printAddressInfos(server);
});

// //

// if (import.meta.hot) import.meta.hot.accept(() => server.close());
// if (import.meta.hot)
// 	import.meta.hot.accept((...args) => {
// 		console.log(args);
// 	});

// // export const PUBLIC_DIR = import.meta.env.DEV ? 'public' : './dist/client';
// // // console.log({ test });
// // // // // Oh no.
// // // // // https://github.com/lit/lit/issues/4621#issuecomment-2053684925
// // // // function hideLitWarning() {
// // // // 	const c = `Lit is in dev mode. Not recommended for production! See https://lit.dev/msg/dev-mode for more information.`;
// // // // 	globalThis.litIssuedWarnings = new Set();
// // // // 	globalThis.litIssuedWarnings.add(c);
// // // // }

// // // // hideLitWarning();

// // // // console.log(globalThis.litIssuedWarnings);

// // // // console.log(globalThis.litIssuedWarnings);

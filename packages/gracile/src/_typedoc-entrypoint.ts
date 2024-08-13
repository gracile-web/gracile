export { pageAssetsCustomLocation } from './document.js';
// export {  } from './env.js';
export {
	getClientDistPath,
	type GracileHonoHandler,
	honoAdapter,
} from './hono.js';
export {
	// FIXME: make more typedoc entrypoint so it's possible to re-export conflicting stuff.
	// getClientDistPath,
	type GracileNodeHandler,
	nodeAdapter,
	printAddressInfos,
} from './node.js';

// export * from './hydration.js';
// export * from './index.js';
// // export * from './node.js';
export { env } from './env.js';
export { gracile, type GracileConfig } from './plugin.js';
export { defineRoute } from './route.js';
export { type GracileHandler, server } from './server.js';
export { html } from './server-html.js';
// export { URLPattern } from './url-pattern.js';

// export type * as Route from '@gracile/engine/routes/route';
// export type {
// 	StaticPathOptionsGeneric,
// 	StaticRequest,
// } from '@gracile/engine/routes/route';

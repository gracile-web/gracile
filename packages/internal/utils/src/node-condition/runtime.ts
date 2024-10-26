// UNUSED?

// // NOTE: Sometimes, export conditions are not the right tool for detecting envs.
// // Especially in interlaced realms like a Vite full-stack setup, with plugins.
// // Gracile (and others Vite plugins) are just considered prod dependencies while
// // in dev.
// // That's why we provide some helpers to set/check for envs explicitly during
// // runtime, here.

// import { InternalError } from '../../../../engine/src/errors/errors.js';

// const isViteDevSymbol = Symbol('gracile-is-vite-dev');

// export function setIsViteDev(state: boolean) {
// 	globalThis[isViteDevSymbol] = state;
// }

// export function isViteDev() {
// 	const state = globalThis[isViteDevSymbol] as boolean | undefined;
// 	if (state) return state;
// 	throw new InternalError(new ReferenceError('Fail to get '));
// }

throw new Error('Nothing to see here.');

/* eslint-disable @typescript-eslint/no-explicit-any */
/* c8 ignore start */

import type { Signal } from 'signal-polyfill';
// import { GracileLogger } from '@gracile/internal-utils/logger/logger';
// import { nodeCondition } from '@gracile/internal-utils/condition';

import type { FunctionalState } from './functional.js';

const DEV = true; // NOTE: AWLAYS ON FOR NOW!
const log = console;
// const { DEV } = nodeCondition;
// const log = new GracileLogger();

export function debug(message: string, ...object: unknown[]): void {
	if (DEV) log.debug(message, ...object);
}

// NOTE: Debug tools for REPL/Node tests/devtools.

const globalSignalSet = new Set<Signal.State<any>>();

const signalFinalizers = new FinalizationRegistry<Signal.State<any>>(
	(signal) => {
		globalSignalSet.delete(signal);
		debug('[Signal GC]', signal);
	},
);
export function trackSignal(host: object, signal: Signal.State<any>): void {
	if (DEV) {
		globalSignalSet.add(signal);
		signalFinalizers.register(host, signal);
	}
}

export function initDebugging(context: FunctionalState): {
	readonly registerDebugFinalizers: (host: object, id?: string) => void;
} {
	const debugFinalizers = new FinalizationRegistry<{
		host: object;
		id: string;
	}>(({ host, id }) => {
		debug(`[FinalizationRegistry] GC’d host ${id}`);

		// Actively clean all associated state
		context.storeMap.delete(host);
		context.contextStackMap.delete(host);
		context.effectMap.delete(host);
	});

	if (DEV) (globalThis as any).__debugSignals = context;

	return {
		registerDebugFinalizers(host: object, id?: string): void {
			if (!DEV) return;

			const _id = id || `anon@${Math.random().toFixed(6)}`;

			debugFinalizers.register(host, { host, id: _id });
		},
	} as const;
}
/* c8 ignore stop */

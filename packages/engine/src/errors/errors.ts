/* eslint-disable unicorn/custom-error-definition */

// NOTE: Taken and adapted from https://github.com/withGracile/Gracile/blob/cf65476b27053333cf5a36f6f9f46b794c98dfa2/packages/Gracile/src/core/errors/errors.ts

import {
	BetterError,
	type BuiltinErrorTypes,
} from '@gracile-labs/better-errors/errors';

// import { codeFrame } from '@gracile-labs/better-errors/printer';

export * as GracileErrorData from './errors-data.js';

export const GRACILE_JS_ERRORS_DOCS_BASE =
	'https://gracile.js.org/docs/references/errors';

type ErrorTypes =
	| BuiltinErrorTypes
	| 'GracileError'
	| 'TemplateError'
	| 'InternalError'
	| 'TypeGuardError'
	| 'AggregateError';

// | 'BetterError'
// | 'GracileUserError'
// | 'CompilerError'
// | 'CSSError'
// | 'MarkdownError'

export class GracileError extends BetterError<ErrorTypes> {
	type: ErrorTypes = 'GracileError';

	static is(error: unknown): error is GracileError {
		return (error as GracileError).type === 'GracileError';
	}
}

export class TemplateError extends GracileError {
	type: ErrorTypes = 'TemplateError';

	static is(error: unknown): error is TemplateError {
		return (error as TemplateError).type === 'TemplateError';
	}
}

export class InternalError extends GracileError {
	type: ErrorTypes = 'InternalError';

	static is(error: unknown): error is InternalError {
		return (error as InternalError).type === 'InternalError';
	}
}

//
// /* eslint-disable @typescript-eslint/lines-between-class-members */
// /* eslint-disable max-classes-per-file */

// import type { buildErrorMessage } from 'vite';

// export type RollupError = Parameters<typeof buildErrorMessage>['0'];

// export abstract class BetterError extends Error implements RollupError {
// 	// --- RollupError
// 	watchFiles?: string[];
// 	binding?: string;
// 	cause?: unknown;
// 	code?: string;
// 	exporter?: string;
// 	frame?: string;
// 	hook?: string;
// 	id?: string;
// 	ids?: string[];
// 	loc?: { column: number; file?: string; line: number };
// 	meta?: unknown;
// 	names?: string[];
// 	plugin?: string;
// 	pluginCode?: unknown;
// 	pos?: number;
// 	reexporter?: string;
// 	stack?: string;
// 	url?: string;
// 	// --- End RollupError

// 	constructor(message: string, options?: { cause?: unknown }) {
// 		super(message);
// 		this.name = 'BetterError';
// 		this.cause = options?.cause;
// 	}
// }

// export class GracileUnknownError extends BetterError {
// 	constructor(message: string, options?: { cause?: unknown }) {
// 		super(message, options);
// 		this.name = 'GracileUnknownError';
// 	}
// }

// export class SsrError extends BetterError {
// 	constructor(message: string, options?: { cause?: unknown }) {
// 		super(message, options);
// 		this.name = 'SsrError';
// 	}
// }

// export function isViteError(error: unknown): error is RollupError {
// 	if (
// 		typeof error === 'object' &&
// 		error &&
// 		'message' in error &&
// 		'plugin' in error &&
// 		typeof error.plugin === 'string' &&
// 		error.plugin.startsWith(`vite:`)
// 	)
// 		return true;
// 	return false;
// }

// // export type EsbuildError = {
// // 	plugin: 'vite:esbuild';
// // } & RollupError;

// // export class GracileRouterError extends Error implements e {
// // 	constructor(message: string, options: { cause: unknown }) {
// // 		super(message);
// // 		this.name = 'GracileRouterError';
// // 		this.cause = options.cause;
// // 	}
// // }

// /**
//  * Special error that is exposed to users.
//  * Compared to BetterError, it contains a subset of information.
//  */
// export class GracileUserError extends Error {
// 	type: ErrorTypes = 'GracileUserError';
// 	/**
// 	 * A message that explains to the user how they can fix the error.
// 	 */
// 	hint: string | undefined;
// 	name = 'GracileUserError';

// 	constructor(message: string, hint?: string) {
// 		super();
// 		this.message = message;
// 		this.hint = hint;
// 	}

// 	static is(err: unknown): err is GracileUserError {
// 		return (err as GracileUserError).type === 'GracileUserError';
// 	}
// }

// ---

/**
 * An error util. that should never be called in theory.
 */
export class TypeGuardError extends Error {}

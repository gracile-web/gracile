import type { ErrorPayload } from 'vite';
import { codeFrame } from './dev/printer.js';

export type BuiltinErrorTypes =
	| 'BetterError'
	//
	// | 'BetterUserError'
	| 'InternalError'
	| 'AggregateError';

/**
 * Generic object representing an error with all possible data
 * Compatible with Gracile, Astro's and Vite's errors
 */
export interface ErrorWithMetadata<T extends string = string> {
	[name: string]: unknown;
	name: string;
	title?: string;
	type?: BuiltinErrorTypes & T;
	message: string;
	stack: string;
	hint?: string;
	id?: string;
	frame?: string;
	plugin?: string;
	pluginCode?: string;
	fullCode?: string;
	loc?: {
		file?: string;
		line?: number;
		column?: number;
	};
	cause?: unknown;
}
interface ErrorProperties {
	title?: string | undefined;
	name: string;
	message?: string | undefined;
	location?: ErrorLocation | undefined;
	hint?: string | undefined;
	stack?: string | undefined;
	frame?: string | undefined;
}

export interface ErrorLocation {
	file?: string | undefined;
	line?: number | undefined;
	column?: number | undefined;
}

export class BetterError<
	ConsumerErrorTypes extends string = string,
> extends Error {
	public loc: ErrorLocation | undefined;
	public title: string | undefined;
	public hint: string | undefined;
	public frame: string | undefined;

	type: BuiltinErrorTypes | ConsumerErrorTypes = 'BetterError';

	constructor(props: ErrorProperties, options?: ErrorOptions) {
		const { name, title, message, stack, location, hint, frame } = props;
		super(message, options);

		this.title = title;
		this.name = name;

		if (message) this.message = message;
		// Only set this if we actually have a stack passed, otherwise uses Error's
		if (stack) this.stack = stack;
		this.loc = location;
		this.hint = hint;
		this.frame = frame;
	}

	public setLocation(location: ErrorLocation): void {
		this.loc = location;
	}

	public setName(name: string): void {
		this.name = name;
	}

	public setMessage(message: string): void {
		this.message = message;
	}

	public setHint(hint: string): void {
		this.hint = hint;
	}

	public setFrame(source: string, location: ErrorLocation): void {
		this.frame = codeFrame(source, location);
	}

	static is(err: unknown): err is BetterError {
		return (err as BetterError).type === 'BetterError';
	}
}

export class AggregateError extends BetterError {
	type: BuiltinErrorTypes = 'AggregateError';
	errors: BetterError[];

	// Despite being a collection of errors, AggregateError still needs to have a main error attached to it
	// This is because Vite expects every thrown errors handled during HMR to be, well, Error and have a message
	constructor(
		props: ErrorProperties & { errors: BetterError[] },
		options?: ErrorOptions,
	) {
		super(props, options);

		this.errors = props.errors;
	}

	static is(err: unknown): err is AggregateError {
		return (err as AggregateError).type === 'AggregateError';
	}
}

export function isBetterError(e: unknown): e is BetterError {
	return e instanceof BetterError;
}

export type SSRError = Error & ErrorPayload['err'];
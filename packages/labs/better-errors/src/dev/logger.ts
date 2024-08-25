import { getDocsForError, renderErrorMarkdown } from './utils.js';

import picocolors from 'picocolors';
import { BetterError, type ErrorWithMetadata } from '../errors.js';
import type { BetterErrorData } from '../errors-data.js';
const { yellow, bold, cyan, dim, underline, red } = picocolors;

// a regex to match the first line of a stack trace
const STACK_LINE_REGEXP = /^\s+at /g;
const IRRELEVANT_STACK_REGEXP = /node_modules|astro[/\\]dist/g;

function formatErrorStackTrace(
	err: Error | ErrorWithMetadata,
	showFullStacktrace: boolean,
): string {
	const stackLines = (err.stack || '')
		.split('\n')
		.filter((line) => STACK_LINE_REGEXP.test(line));
	// If full details are required, just return the entire stack trace.
	if (showFullStacktrace) {
		return stackLines.join('\n');
	}
	// Grab every string from the user's codebase, exit when you hit node_modules or astro/dist
	const irrelevantStackIndex = stackLines.findIndex((line) =>
		IRRELEVANT_STACK_REGEXP.test(line),
	);
	if (irrelevantStackIndex <= 0) {
		const errorId = (err as ErrorWithMetadata).id;
		const errorLoc = (err as ErrorWithMetadata).loc;
		if (errorId || errorLoc?.file) {
			const prettyLocation = `    at ${errorId ?? errorLoc?.file}${
				errorLoc?.line && errorLoc.column
					? `:${errorLoc.line}:${errorLoc.column}`
					: ''
			}`;
			return (
				prettyLocation +
				'\n    [...] See full stack trace in the browser, or rerun with --verbose.'
			);
		} else {
			return stackLines.join('\n');
		}
	}
	// If the error occurred inside of a dependency, grab the entire stack.
	// Otherwise, only grab the part of the stack that is relevant to the user's codebase.
	return (
		stackLines.splice(0, irrelevantStackIndex).join('\n') +
		'\n    [...] See full stack trace in the browser, or rerun with --verbose.'
	);
}

export function padMultilineString(source: string, n = 2) {
	const lines = source.split(/\r?\n/);
	return lines.map((l) => ` `.repeat(n) + l).join(`\n`);
}

export function formatErrorMessage(
	err: ErrorWithMetadata,
	showFullStacktrace: boolean,
	errorsData: Record<string, BetterErrorData>,
	docsBaseUrl?: string,
): string {
	const isOurError =
		BetterError.is(
			err,
		); /* || CompilerError.is(err) || AstroUserError.is(err) */
	let message = '';
	if (isOurError) {
		message +=
			red(`[${err.name}]`) + ' ' + renderErrorMarkdown(err.message, 'cli');
	} else {
		message += err.message;
	}
	const output = [message];

	if (err.hint) {
		output.push(`  ${bold('Hint:')}`);
		output.push(
			yellow(padMultilineString(renderErrorMarkdown(err.hint, 'cli'), 4)),
		);
	}

	if (docsBaseUrl) {
		const docsLink = getDocsForError(err, errorsData, docsBaseUrl);
		if (docsLink) {
			output.push(`  ${bold('Error reference:')}`);
			output.push(`    ${cyan(underline(docsLink))}`);
		}
	}

	if (err.stack) {
		output.push(`  ${bold('Stack trace:')}`);
		output.push(dim(formatErrorStackTrace(err, showFullStacktrace)));
	}

	if (err.cause) {
		output.push(`  ${bold('Caused by:')}`);
		let causeMessage = '  ';
		if (err.cause instanceof Error) {
			causeMessage +=
				err.cause.message +
				'\n' +
				formatErrorStackTrace(err.cause, showFullStacktrace);
		} else {
			causeMessage += JSON.stringify(err.cause);
		}
		output.push(dim(causeMessage));
	}

	return output.join('\n');
}

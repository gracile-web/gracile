// TODO: Refactor with Gracile code-base style.
/* eslint-disable unicorn/no-abusive-eslint-disable */
/* eslint-disable */
import picocolors from 'picocolors';

import { BetterError, type ErrorWithMetadata } from '../errors.js';
import type { BetterErrorData } from '../errors-data.js';

import { getDocsForError, renderErrorMarkdown } from './utils.js';
const { yellow, bold, cyan, dim, underline, red } = picocolors;

// a regex to match the first line of a stack trace
const STACK_LINE_REGEXP = /^\s+at /g;
const IRRELEVANT_STACK_REGEXP = /node_modules|astro[/\\]dist/g;

function formatErrorStackTrace(
	error: Error | ErrorWithMetadata,
	showFullStacktrace: boolean,
): string {
	const stackLines = (error.stack || '')
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
		const errorId = (error as ErrorWithMetadata).id;
		const errorLoc = (error as ErrorWithMetadata).loc;
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
	error: ErrorWithMetadata,
	showFullStacktrace: boolean,
	errorsData: Record<string, BetterErrorData>,
	docsBaseUrl?: string,
): string {
	const isOurError =
		BetterError.is(
			error,
		); /* || CompilerError.is(err) || AstroUserError.is(err) */
	let message = '';
	message += isOurError
		? red(`[${error.name}]`) + ' ' + renderErrorMarkdown(error.message, 'cli')
		: error.message;
	const output = [message];

	if (error.hint) {
		output.push(`  ${bold('Hint:')}`);
		output.push(
			yellow(padMultilineString(renderErrorMarkdown(error.hint, 'cli'), 4)),
		);
	}

	if (docsBaseUrl) {
		const docsLink = getDocsForError(error, errorsData, docsBaseUrl);
		if (docsLink) {
			output.push(`  ${bold('Error reference:')}`);
			output.push(`    ${cyan(underline(docsLink))}`);
		}
	}

	if (error.stack) {
		output.push(`  ${bold('Stack trace:')}`);
		output.push(dim(formatErrorStackTrace(error, showFullStacktrace)));
	}

	if (error.cause) {
		output.push(`  ${bold('Caused by:')}`);
		let causeMessage = '  ';
		causeMessage +=
			error.cause instanceof Error
				? error.cause.message +
					'\n' +
					formatErrorStackTrace(error.cause, showFullStacktrace)
				: JSON.stringify(error.cause);
		output.push(dim(causeMessage));
	}

	return output.join('\n');
}

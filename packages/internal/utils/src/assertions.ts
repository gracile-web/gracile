import { type ServerRenderedTemplate } from '@lit-labs/ssr';
import type { TemplateResult } from 'lit';

export type UnknownObject = Record<string, unknown>;

/**
 * Used for user provided modules with unknown/possibly malformed shapes.
 * Avoid this for well typed sources.
 */
export function isUnknownObject(input: unknown): input is UnknownObject {
	return typeof input === 'object' && input !== null && !Array.isArray(input);
}

export function isLitTemplate(
	input: unknown,
): input is TemplateResult | ServerRenderedTemplate {
	return (
		(typeof input === 'object' &&
			input &&
			'_$litType$' in input &&
			input._$litType$ === 1 &&
			'strings' in input &&
			Array.isArray(input.strings)) ||
		false
	);
}

export function isLitNormalTemplate(input: unknown): input is TemplateResult {
	return isLitTemplate(input) && '_$litServerRenderMode' in input === false;
}

export function isLitServerTemplate(
	input: unknown,
): input is ServerRenderedTemplate {
	return (
		isLitTemplate(input) &&
		'_$litServerRenderMode' in input &&
		input._$litServerRenderMode === 1
	);
}

export function isResponseOrPatchedResponse(input: unknown): input is Response {
	if (input instanceof Response) return true;

	// NOTE: We have to use that because Hono breaks with `Response.json`
	// (IDK why, maybe some global patching somewhere,
	// not found in the Hono codebase).
	if (
		input &&
		typeof input === 'object' &&
		input.constructor.name === 'Response' &&
		'url' in input &&
		'body' in input &&
		'bodyUsed' in input &&
		'headers' in input &&
		'status' in input &&
		'statusText' in input
	)
		return true;

	return false;
}

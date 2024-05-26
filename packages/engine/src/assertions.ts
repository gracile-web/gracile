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
): input is TemplateResult<1> | ServerRenderedTemplate {
	return (
		(typeof input === 'object' &&
			input &&
			'_$litType$' in input &&
			// eslint-disable-next-line no-underscore-dangle
			input._$litType$ === 1 &&
			'strings' in input &&
			Array.isArray(input.strings)) ||
		false
	);
}

export function isLitNormalTemplate(
	input: unknown,
): input is TemplateResult<1> {
	return isLitTemplate(input) && '_$litServerRenderMode' in input === false;
}

export function isLitServerTemplate(
	input: unknown,
): input is ServerRenderedTemplate {
	return (
		isLitTemplate(input) &&
		'_$litServerRenderMode' in input &&
		// eslint-disable-next-line no-underscore-dangle
		input._$litServerRenderMode === 1
	);
}

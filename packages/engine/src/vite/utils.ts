import {
	render as renderLitSsr,
	type ServerRenderedTemplate,
} from '@lit-labs/ssr';
import { collectResult } from '@lit-labs/ssr/lib/render-result.js';

export async function renderSsrTemplate(template: ServerRenderedTemplate) {
	return collectResult(renderLitSsr(template));
}

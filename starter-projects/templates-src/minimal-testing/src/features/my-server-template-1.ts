import {
	html,
	type ServerRenderedTemplate,
} from '@gracile/gracile/server-html';
import type { TemplateResult } from 'lit';

export const myServerTemplate1 = (
	children?: TemplateResult<1>,
): ServerRenderedTemplate => html`
	<!--  -->
	<div>Hello</div>

	<main>${children ?? 'none'}</main>
	<!--  -->
`;

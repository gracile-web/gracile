import { html } from 'lit';

import logo from '../../assets/gracile-logo.svg';
import { shellMenu } from './menu.js';

export const shellHeader = (props: {
	title: string | null;
	currentPath: string;
}) => html`
	<header class="shell-header">
		<div class="menu">
			<a href="/" class="logo">${logo}</a>

			${shellMenu({ currentPath: props.currentPath })}
		</div>

		${props.title ? html`<h1>${props.title}</h1>` : null}
	</header>
`;

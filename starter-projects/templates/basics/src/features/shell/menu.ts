import { html } from 'lit';

import { MENU } from '../../constants.js';
import { tree } from '../tree.js';

export const shellMenu = (props: { currentPath: string }) => html`
	<nav class="shell-menu">
		<!--  -->

		${tree({ tree: MENU, currentPath: props.currentPath })}
	</nav>
`;

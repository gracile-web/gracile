import { html } from 'lit';

export const shellFooter = () => html`
	<!--  -->
	<footer class="shell-footer">
		<div>
			© ${new Date().getFullYear()} —
			<a href="https://gracile.js.org" target="_blank">Gracile</a>
			— License ISC
		</div>
	</footer>
`;

import { html } from '@lit-labs/ssr';
import { unsafeHTML } from 'lit/directives/unsafe-html.js';
import { generateHydrationScript } from 'solid-js/web';

export function document(context: { url: URL; title?: string }) {
	return html`
		<!doctype html>
		<html lang="en" data-path=${context.url.pathname}>
			<head>
				<meta charset="UTF-8" />
				<title>Document - Islands - ${context.title ?? 'Untitled'}</title>
				${unsafeHTML(generateHydrationScript())}
			</head>

			<body>
				<route-template-outlet></route-template-outlet>
			</body>
		</html>
	`;
}

import { html } from '@lit-labs/ssr';

export function document(context: { url: URL; title?: string }) {
	return html`
		<!doctype html>
		<html lang="en" data-path=${context.url.pathname}>
			<head>
				<meta charset="UTF-8" />
				<title>Document - Minimal - ${context.title ?? 'Untitled'}</title>
			</head>

			<body>
				<route-template-outlet></route-template-outlet>
			</body>
		</html>
	`;
}

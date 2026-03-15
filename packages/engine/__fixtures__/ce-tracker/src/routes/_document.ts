import { html } from '@lit-labs/ssr';

export function document(context: { url: URL }) {
	return html`
		<!doctype html>
		<html lang="en">
			<head>
				<meta charset="UTF-8" />
				<title>CE Tracker Test</title>
			</head>
			<body>
				<route-template-outlet></route-template-outlet>
			</body>
		</html>
	`;
}

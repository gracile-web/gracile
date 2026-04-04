import { html } from '@gracile/gracile/server-html';

export const document = (props: { url: URL; title?: string | null }) => html`
	<!doctype html>
	<html lang="en">
		<head>
			<meta charset="utf-8" />
			<meta name="viewport" content="width=device-width, initial-scale=1.0" />

			<link
				rel="stylesheet"
				href=${new URL('./document.css', import.meta.url).pathname}
			/>
			<script
				type="module"
				src=${new URL('./document.client.ts', import.meta.url).pathname}
			></script>

			<title>${props.title}</title>
		</head>

		<body>
			<route-template-outlet></route-template-outlet>
		</body>
	</html>
`;

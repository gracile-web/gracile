import { html } from '@gracile/gracile/server-html';

export const document = (props: { url: URL; title?: string | null }) => html`
	<!doctype html>
	<html lang="en">
		<head>
			<meta charset="utf-8" />
			<meta name="viewport" content="width=device-width, initial-scale=1.0" />
			<title>${props.title}</title>
		</head>

		<body>
			<route-template-outlet></route-template-outlet>
		</body>
	</html>
`;

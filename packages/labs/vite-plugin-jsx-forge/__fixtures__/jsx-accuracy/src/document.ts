import { html } from '@gracile/gracile/server-html';

export const document = (props: { url: URL; title?: string | null }) => html`
	<!doctype html>
	<html lang="en">
		<head>
			<meta charset="utf-8" />
			<title>${props.title ?? 'JSX Accuracy'}</title>
		</head>
		<body>
			<route-template-outlet></route-template-outlet>
		</body>
	</html>
`;

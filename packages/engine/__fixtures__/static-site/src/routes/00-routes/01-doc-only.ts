import { html } from '@gracile/gracile/server-html';
import { defineRoute } from '@gracile/gracile/route';

export default defineRoute({
	document: () => html`
		<!doctype html>
		<html lang="en">
			<head>
				<meta charset="UTF-8" />
				<meta name="viewport" content="width=device-width, initial-scale=1.0" />
				<title>Document</title>
			</head>
			<body>
				Only a bare doc!
			</body>
		</html>
	`,
});

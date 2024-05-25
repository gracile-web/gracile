import { helpers } from '@gracile/gracile/document';
import { html } from '@gracile/gracile/server-html';

export const document = (options: { url: URL; title?: string }) => html`
	<!doctype html>
	<html lang="en">
		<head>
			<!-- Helpers -->
			${Object.values(helpers.dev)}
			<!--  -->
			${helpers.fullHydration}
			<!--  -->
			${Object.values(helpers.polyfills)}

			<!-- Global assets -->
			<link
				rel="stylesheet"
				href=${new URL('./document.css', import.meta.url).pathname}
			/>
			<script
				type="module"
				src=${new URL('./document.client.ts', import.meta.url).pathname}
			></script>

			<!-- Page assets -->
			${helpers.pageAssets}

			<!-- SEO and page metadata -->
			<meta charset="UTF-8" />
			<meta name="viewport" content="width=device-width, initial-scale=1.0" />
			<link rel="icon" type="image/svg" href="/favicon.svg" />

			<title>${options.title ?? 'Hello Gracile'}</title>
		</head>

		<body>
			<route-template-outlet></route-template-outlet>
		</body>
	</html>
`;

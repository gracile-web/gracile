'use html-server';

export const document = (props: { title?: string | null }) => (
	<html lang="en">
		<head>
			{/* Basics */}
			<meta charset="utf-8" />
			<meta name="viewport" content="width=device-width, initial-scale=1.0" />

			{/* Global assets */}

			<link
				rel="stylesheet"
				href="https://early.webawesome.com/webawesome@3.0.0-alpha.7/dist/styles/themes/default.css"
			/>
			<script
				type="module"
				src="https://early.webawesome.com/webawesome@3.0.0-alpha.7/dist/webawesome.loader.js"
			></script>

			<script
				type="module"
				src={new URL('./document.client.ts', import.meta.url).pathname}
			></script>

			{/* SEO and page metadata */}
			<title>{props.title}</title>
			<link type="image/svg+xml" href="/favicon.svg" rel="icon" />
		</head>

		<body>
			<route-template-outlet></route-template-outlet>
		</body>
	</html>
);

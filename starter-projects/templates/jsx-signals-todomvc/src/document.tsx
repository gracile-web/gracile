'use html-server';

import { setSignalConstructor } from '@gracile-labs/functional';
import { Signal } from '@lit-labs/signals';

setSignalConstructor(Signal);

export const document = (props: { title?: string | null }) => (
	<html lang="en">
		<head>
			{/* Basics */}
			<meta charset="utf-8" />
			<meta name="viewport" content="width=device-width, initial-scale=1.0" />

			{/* Global assets */}

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

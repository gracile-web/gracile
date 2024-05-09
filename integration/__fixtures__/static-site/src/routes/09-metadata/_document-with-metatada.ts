import { createMetadata } from '@gracile/metadata';
import { html } from '@lit-labs/ssr';

export function document(context: { url: URL }) {
	return html`
		<!doctype html>
		<html lang="en" data-path=${context.url.pathname}>
			<head>
				${createMetadata({
					author: 'Anon',
					canonicalUrl: 'http://example.com',
					colorScheme: 'dark light',
					siteTitle: 'My Site',
					pageTitle: 'My page',
					pageDescription: 'My desc.',
					license: 'MIT',
					generator: 'Gracile',

					jsonLd: {
						breadcrumbs: [
							{ name: 'page', href: '/test-page/' },
							{ name: 'page-nested', href: '/test-page/nested/' },
						],
					},

					viewTransition: true,
				})}
			</head>

			<body>
				<route-template-outlet></route-template-outlet>
			</body>
		</html>
	`;
}

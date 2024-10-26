import { Readable } from 'node:stream';

import * as assert from '@gracile/internal-utils/assertions';
import { html } from '@gracile/internal-utils/dummy-literals';
import type { ErrorLocation } from '@gracile-labs/better-errors/errors';
import { render as renderLitSsr } from '@lit-labs/ssr';
import { collectResult } from '@lit-labs/ssr/lib/render-result.js';
import type { ViteDevServer } from 'vite';

import {
	GracileError,
	GracileErrorData,
	TemplateError,
} from '../errors/errors.js';
import type { RouteInfos } from '../routes/match.js';
import type * as R from '../routes/route.js';

import { PAGE_ASSETS_MARKER, SSR_OUTLET_MARKER } from './markers.js';

async function* concatStreams(...readables: Readable[]) {
	// eslint-disable-next-line no-restricted-syntax
	for (const readable of readables) {
		// eslint-disable-next-line no-restricted-syntax, no-await-in-loop
		for await (const chunk of readable) {
			yield chunk;
		}
	}
}

export const REGEX_TAG_SCRIPT =
	/\s?<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script\s*>\s?/gi;

export const REGEX_TAG_LINK = /\s?<link\b[^>]*?>\s?/gi;

export async function renderRouteTemplate({
	url,
	vite,
	mode,
	routeInfos,
	routeAssets,
	serverMode,
	docOnly,
}: {
	url: string;
	vite?: ViteDevServer | undefined;
	mode: 'dev' | 'build';
	routeInfos: RouteInfos;
	routeAssets?: R.RoutesAssets | undefined;
	root: string;
	serverMode?: boolean | undefined;
	docOnly?: boolean | undefined;
}): Promise<{ output: null | Readable; document: null | string }> {
	const location = {
		file: routeInfos.foundRoute.filePath,
	} satisfies ErrorLocation;

	if (!routeInfos.routeModule.document && !routeInfos.routeModule.template)
		return { output: null, document: null };

	// MARK: Context
	const context: R.RouteContextGeneric = {
		url: new URL(url),
		params: routeInfos.params,
		props: routeInfos.props,
	};

	// MARK: Fragment
	if (!routeInfos.routeModule.document && routeInfos.routeModule.template) {
		const fragmentOutput = await Promise.resolve(
			routeInfos.routeModule.template?.(context) as unknown,
		);
		if (assert.isLitTemplate(fragmentOutput) === false)
			throw new GracileError({
				...GracileErrorData.InvalidRouteDocument,
				message: GracileErrorData.InvalidRouteDocument.message(location.file),
				// location,
			});

		const fragmentRender = renderLitSsr(fragmentOutput);
		const output = Readable.from(fragmentRender);

		return { output, document: null };
	}

	// MARK: Document
	if (
		!routeInfos.routeModule.document ||
		typeof routeInfos.routeModule.document !== 'function'
	)
		throw new GracileError({
			...GracileErrorData.InvalidRouteDocument,
			message: GracileErrorData.InvalidRouteDocument.message(location.file),
			location,
		});

	const baseDocTemplateResult = await Promise.resolve(
	const baseDocumentTemplateResult = await Promise.resolve(
		routeInfos.routeModule.document?.(context) as unknown,
	);

	if (assert.isLitServerTemplate(baseDocTemplateResult) === false)
	if (assert.isLitServerTemplate(baseDocumentTemplateResult) === false)
		throw new GracileError({
			...GracileErrorData.InvalidRouteDocumentResult,
			message: GracileErrorData.InvalidRouteDocumentResult.message(
				location.file,
			),
			location,
		});

	let baseDocRendered: string;

	// console.log({ ddd: baseDocTemplateResult });
	let baseDocumentRendered: string;

	try {
		baseDocRendered = await collectResult(renderLitSsr(baseDocTemplateResult));
	} catch (e) {
		baseDocumentRendered = await collectResult(
			renderLitSsr(baseDocumentTemplateResult),
		);
	} catch (error) {
		throw new TemplateError(
			{
				...GracileErrorData.CouldNotRenderRouteDocument,
				message: GracileErrorData.CouldNotRenderRouteDocument.message(
					location.file,
				),
				location,
			},
			{ cause: String(e as Error) },
			{ cause: String(error) },
		);
	}

	// MARK: Sibling assets
	let baseDocRenderedWithAssets = baseDocRendered;

	// If the user doesnt use `pageAssetCustomLocation`, we put this as a fallback

	baseDocRenderedWithAssets = baseDocRenderedWithAssets
	// NOTE: If the user doesn't use `pageAssetCustomLocation`,
	// we put this as a fallback.
	baseDocumentRendered = baseDocumentRendered
		.replace('</head>', `\n${PAGE_ASSETS_MARKER}</head>`)
		.replace(
			PAGE_ASSETS_MARKER,
			// eslint-disable-next-line prefer-template
			routeInfos.foundRoute.pageAssets.length
				? // eslint-disable-next-line prefer-template
					html`<!-- PAGE ASSETS -->` +

			routeInfos.foundRoute.pageAssets.length > 0
				? html`<!-- PAGE ASSETS -->` +
						`${routeInfos.foundRoute.pageAssets
							.map((path) => {
								//
								if (/\.(js|ts)$/.test(path)) {
								if (/\.(js|ts|jsx|tsx)$/.test(path)) {
									// prettier-ignore
									return html`		<script type="module" src="/${path}"></script>`;
								}

								if (/\.(css|scss|sass|less|styl|stylus)$/.test(path)) {
									// prettier-ignore
									return html`		<link rel="stylesheet" href="/${path}" />`;
								}

								// NOTE: Never called (filtered upstream in `collectRoutes`)
								return null;
							})
							.join('\n')}` +
						`<!-- /PAGE ASSETS -->\n		`
				: '',
		);

	// MARK: Dev. overlay
	// TODO: Need more testing and refinement (refreshes kills its usefulness)
	const overlay = () => html`
		<script type="module">
			if (import.meta.hot) {
				import.meta.hot.on('gracile:ssr-error', (error) => {
					console.error(error.message);
				});
				import.meta.hot.on('error', (payload) => {
					console.error(payload.err.message);
				});
			}
		</script>
	`;

	if (mode === 'dev')
		baseDocRenderedWithAssets = baseDocRenderedWithAssets.replace(
		baseDocumentRendered = baseDocumentRendered.replace(
			'<head>',
			`<head>\n${overlay()}`,
		);

	// // MARK: Inject assets for server output runtime only
	// MARK: Inject assets for server output runtime only.
	const routeAssetsString = routeAssets?.get?.(
		routeInfos.foundRoute.pattern.pathname,
	);
	if (routeAssetsString)
		baseDocRenderedWithAssets = baseDocRenderedWithAssets
			.replace(REGEX_TAG_SCRIPT, (s) => {
		baseDocumentRendered = baseDocumentRendered
			.replaceAll(REGEX_TAG_SCRIPT, (s) => {
				if (s.includes(`type="module"`)) return '';
				return s;
			})
			.replace(REGEX_TAG_LINK, (s) => {
			.replaceAll(REGEX_TAG_LINK, (s) => {
				if (s.includes(`rel="stylesheet"`)) return '';
				return s;
			})
			.replace('</head>', `${routeAssetsString}\n</head>`);

	// MARK: Base document
	const baseDocHtml =
	const baseDocumentHtml =
		vite && mode === 'dev'
			? await vite.transformIndexHtml(
					// HACK: Sometimes, we need to invalidate for server asset url
					// imports to work. So we keep this hack around just in case.
					// Maybe it's linked to the way hashed assets are invalidating
					// the html proxy module…
					// `${routeInfos.pathname}?r=${Math.random()}`,
					routeInfos.pathname,
					baseDocRenderedWithAssets,
					baseDocumentRendered,
				)
			: baseDocRenderedWithAssets;
			: baseDocumentRendered;

	if (docOnly) return { document: baseDocHtml, output: null };
	if (docOnly) return { document: baseDocumentHtml, output: null };

	const index = baseDocHtml.indexOf(SSR_OUTLET_MARKER);
	const baseDocRenderStreamPre = Readable.from(baseDocHtml.substring(0, index));
	const baseDocRenderStreamPost = Readable.from(
		baseDocHtml.substring(index + SSR_OUTLET_MARKER.length + 1),
	const index = baseDocumentHtml.indexOf(SSR_OUTLET_MARKER);
	const baseDocumentRenderStreamPre = Readable.from(
		baseDocumentHtml.slice(0, Math.max(0, index)),
	);
	const baseDocumentRenderStreamPost = Readable.from(
		baseDocumentHtml.slice(Math.max(0, index + SSR_OUTLET_MARKER.length)),
	);

	// MARK: Page
	// Skipped with server mode in production build
	// Skipped with server mode in production build.

	if (
		routeInfos.routeModule.template &&
		(serverMode === false ||
			//
			(serverMode &&
				(mode !== 'build' || routeInfos.routeModule.prerender === true)))
	) {
		const routeOutput = await Promise.resolve(
			routeInfos.routeModule.template(context),
		);

		// NOTE: Explicitely unset template (maybe a bad idea as a feature. We'll see)
		// if (routeOutput === null || routeOutput === undefined) {
		// 	const output = Readable.from(
		// 		concatStreams(baseDocRenderStreamPre, baseDocRenderStreamPost),
		// 	);
		// 	return { output, document: null };
		// }

		if (assert.isLitTemplate(routeOutput) === false)
			throw Error(
			throw new Error(
				`Wrong template result for page template ${routeInfos.foundRoute.filePath}.`,
			);

		const renderStream = Readable.from(renderLitSsr(routeOutput));

		const output = Readable.from(
			concatStreams(
				baseDocRenderStreamPre,
				baseDocumentRenderStreamPre,
				renderStream,
				baseDocRenderStreamPost,
				baseDocumentRenderStreamPost,
			),
		);

		return { output, document: baseDocHtml };
		return { output, document: baseDocumentHtml };
	}

	// MARK: Just the document
	const output = Readable.from(baseDocHtml);
	// MARK: Just the document.
	const output = Readable.from(baseDocumentHtml);

	return { output, document: baseDocHtml };
	return { output, document: baseDocumentHtml };
}

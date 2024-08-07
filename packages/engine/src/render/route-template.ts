import { html } from '@gracile/internal-utils/dummy-literals';
import { html as LitSsrHtml, render as renderLitSsr } from '@lit-labs/ssr';
import { collectResult } from '@lit-labs/ssr/lib/render-result.js';
import { Readable } from 'stream';
import type { ViteDevServer } from 'vite';

import { isLitServerTemplate, isLitTemplate } from '../assertions.js';
import type { RouteInfos } from '../routes/match.js';
import type * as R from '../routes/route.js';

async function* concatStreams(...readables: Readable[]) {
	// eslint-disable-next-line no-restricted-syntax
	for (const readable of readables) {
		// eslint-disable-next-line no-restricted-syntax, no-await-in-loop
		for await (const chunk of readable) {
			yield chunk;
		}
	}
}

// export const SSR_OUTLET_MARKER = '________SSR_OUTLET________';
export const SSR_OUTLET_MARKER =
	'<route-template-outlet></route-template-outlet>';
// const SSR_OUTLET = unsafeHTML(SSR_OUTLET_MARKER);

export const PAGE_ASSETS_MARKER = '<!--__GRACILE_PAGE_ASSETS__-->';
// FIXME: cannot be used with `unsafeHTML`, so must be duplicated…
export const pageAssets = LitSsrHtml`<!--__GRACILE_PAGE_ASSETS__-->`;

export const REGEX_TAG_SCRIPT =
	/\s?<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script\s*>\s?/gi;

export const REGEX_TAG_LINK = /\s?<link\b[^>]*?>\s?/gi;

export type HandlerInfos = { data: unknown; method: string };

export async function renderRouteTemplate({
	request,
	vite,
	mode,
	routeInfos,
	handlerInfos,
	routeAssets,
	// root,
	serverMode,
}: {
	request: Request | R.StaticRequest;
	vite?: ViteDevServer | undefined;
	mode: 'dev' | 'build';
	routeInfos: RouteInfos;
	handlerInfos?: HandlerInfos | undefined;
	routeAssets?: R.RoutesAssets | undefined;
	root: string;
	serverMode?: boolean | undefined;
}): Promise<{ output: null | Readable }> {
	if (!routeInfos.routeModule.document && !routeInfos.routeModule.template)
		return { output: null };

	// MARK: Context
	const context: R.RouteContextGeneric = {
		url: new URL(request.url),
		params: routeInfos.params,
		props: handlerInfos?.data
			? {
					[handlerInfos.method]: handlerInfos.data,
				}
			: routeInfos.props,
	};

	// MARK: Fragment
	if (!routeInfos.routeModule.document && routeInfos.routeModule.template) {
		const fragmentOutput = await Promise.resolve(
			routeInfos.routeModule.template?.(context) as unknown,
		);
		if (isLitTemplate(fragmentOutput) === false)
			throw Error(
				`Wrong template result for fragment template ${routeInfos.foundRoute.filePath}.`,
			);
		const fragmentRender = renderLitSsr(fragmentOutput);
		const output = Readable.from(fragmentRender);

		return { output };
	}

	// MARK: Document
	if (
		!routeInfos.routeModule.document ||
		typeof routeInfos.routeModule.document !== 'function'
	)
		throw new TypeError(
			`Route document must be a function ${routeInfos.foundRoute.filePath}.`,
		);

	const baseDocTemplateResult = await Promise.resolve(
		routeInfos.routeModule.document?.(context) as unknown,
	);

	if (isLitServerTemplate(baseDocTemplateResult) === false)
		throw new TypeError(
			`Incorrect document template result for ${routeInfos.foundRoute.filePath}.`,
		);

	const baseDocRendered = await collectResult(
		renderLitSsr(baseDocTemplateResult),
	);

	// MARK: Sibling assets
	let baseDocRenderedWithAssets = baseDocRendered.replace(
		PAGE_ASSETS_MARKER,
		html`
			<!-- PAGE ASSETS -->
			${routeInfos.foundRoute.pageAssets.map((path) => {
				//
				if (/\.(js|ts)$/.test(path)) {
					return html`
						<script type="module" src="/${path}"></script>
						<!--  -->
					`;
				}

				if (/\.(css|scss|sass|less|styl|stylus)$/.test(path)) {
					return html`
						<link rel="stylesheet" href="/${path}" />
						<!--  -->
					`;
				}

				throw new Error('Unknown asset.');
			})}
			<!-- /PAGE ASSETS -->
		`,
	);

	const routeAssetsString = routeAssets?.get?.(
		routeInfos.foundRoute.pattern.pathname,
	);
	if (routeAssetsString)
		baseDocRenderedWithAssets = baseDocRenderedWithAssets
			.replace(REGEX_TAG_SCRIPT, (s) => {
				if (s.includes(`type="module"`)) return '';
				return s;
			})
			.replace(REGEX_TAG_LINK, (s) => {
				if (s.includes(`rel="stylesheet"`)) return '';
				return s;
			})
			.replace('</head>', `${routeAssetsString}\n</head>`);

	// MARK: Base document
	const baseDocHtml =
		vite && mode === 'dev'
			? await vite.transformIndexHtml(
					// HACK: Sometimes, we need to invalidate for server asset url
					// imports to work. So we keep this hack around just in case.
					// Maybe it's linked to the way hashed assets are invalidating
					// the html proxy module…
					// `${routeInfos.pathname}?r=${Math.random()}`,
					routeInfos.pathname,
					baseDocRenderedWithAssets,
				)
			: baseDocRenderedWithAssets;

	const index = baseDocHtml.indexOf(SSR_OUTLET_MARKER);
	const baseDocRenderStreamPre = Readable.from(baseDocHtml.substring(0, index));
	const baseDocRenderStreamPost = Readable.from(
		baseDocHtml.substring(index + SSR_OUTLET_MARKER.length + 1),
	);

	// MARK: Page
	// Skipped with server mode in production build
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
		// 	return { output };
		// }

		if (isLitTemplate(routeOutput) === false)
			throw Error(
				`Wrong template result for page template ${routeInfos.foundRoute.filePath}.`,
			);

		const renderStream = Readable.from(renderLitSsr(routeOutput));

		const output = Readable.from(
			concatStreams(
				baseDocRenderStreamPre,
				renderStream,
				baseDocRenderStreamPost,
			),
		);

		return { output };
	}

	// MARK: Just the document
	const output = Readable.from(baseDocHtml);

	return { output };
}

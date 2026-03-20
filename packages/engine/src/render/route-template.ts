import { Readable } from 'node:stream';

import * as assert from '@gracile/internal-utils/assertions';
import type { ErrorLocation } from '@gracile-labs/better-errors/errors';
import { render as renderLitSsr, type RenderInfo } from '@lit-labs/ssr';
import { collectResult } from '@lit-labs/ssr/lib/render-result.js';
// Lit's purpose-built Readable subclass for RenderResult. Handles nested
// iterables, thunks, and Promises from sub-templates with proper back-pressure,
// whereas generic `Readable.from()` only sees the top-level iterable.
// Inherits from the same Node `Readable` we already depend on.
import { RenderResultReadable } from '@lit-labs/ssr/lib/render-result-readable.js';
import type { ViteDevServer } from 'vite';

import {
	GracileError,
	GracileErrorData,
	TemplateError,
} from '../errors/errors.js';
import type { RouteInfos } from '../routes/match.js';
import type * as R from '../routes/route.js';

import { SSR_OUTLET_MARKER } from './markers.js';
import {
	concatStreams,
	mergeRenderInfo,
	injectSiblingAssets,
	ensureDoctype,
	injectDevelopmentOverlay,
	injectServerAssets,
} from './route-template-pipeline.js';

// Re-export for consumers that import these regexes from this module.
export { REGEX_TAG_SCRIPT, REGEX_TAG_LINK } from './route-template-pipeline.js';

/**
 * Lit SSR's `RenderResultReadable._read()` is `async`, but Node.js
 * calls `_read()` without awaiting its return value.  If a thunk inside
 * the render result throws (e.g. template expressions in invalid
 * locations), the rejected Promise escapes and becomes an
 * `unhandledRejection`.
 *
 * This subclass overrides `_read()` to catch that rejection and convert
 * it into a stream `'error'` event via `this.destroy(err)`, which is
 * the standard Node Readable contract.
 */
class SafeRenderResultReadable extends RenderResultReadable {
	override _read(size: number): ReturnType<RenderResultReadable['_read']> {
		const maybePromise = super._read(size);

		void (maybePromise as Promise<void> | void)?.catch?.(
			(error: Error): void => {
				this.destroy(error);
			},
		);
		return maybePromise;
	}
}

export async function renderRouteTemplate({
	url,
	vite,
	mode,
	routeInfos,
	routeAssets,
	serverMode,
	docOnly,
	renderInfo,
}: {
	url: string;
	vite?: ViteDevServer | undefined;
	mode: 'dev' | 'build';
	routeInfos: RouteInfos;
	routeAssets?: R.RoutesAssets | undefined;
	root: string;
	serverMode?: boolean | undefined;
	docOnly?: boolean | undefined;
	renderInfo?: Partial<RenderInfo> | undefined;
}): Promise<{ output: null | Readable; document: null | string }> {
	const location = {
		file: routeInfos.foundRoute.filePath,
	} satisfies ErrorLocation;

	if (!routeInfos.routeModule.document && !routeInfos.routeModule.template)
		return { output: null, document: null };

	// MARK: Merged render info
	const mergedRenderInfo = mergeRenderInfo(renderInfo);

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

		const fragmentRender = renderLitSsr(fragmentOutput, mergedRenderInfo);
		const output = new SafeRenderResultReadable(fragmentRender);

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

	const baseDocumentTemplateResult = await Promise.resolve(
		routeInfos.routeModule.document?.(context) as unknown,
	);

	if (assert.isLitServerTemplate(baseDocumentTemplateResult) === false)
		throw new GracileError({
			...GracileErrorData.InvalidRouteDocumentResult,
			message: GracileErrorData.InvalidRouteDocumentResult.message(
				location.file,
			),
			location,
		});

	let baseDocumentRendered: string;

	try {
		baseDocumentRendered = await collectResult(
			renderLitSsr(baseDocumentTemplateResult, mergedRenderInfo),
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
			{ cause: String(error) },
		);
	}

	// MARK: Post-process document HTML (pure transforms)
	baseDocumentRendered = injectSiblingAssets(
		baseDocumentRendered,
		routeInfos.foundRoute.pageAssets,
	);
	baseDocumentRendered = ensureDoctype(baseDocumentRendered);

	if (mode === 'dev')
		baseDocumentRendered = injectDevelopmentOverlay(baseDocumentRendered);

	const routeAssetsString = routeAssets?.get?.(
		routeInfos.foundRoute.pattern.pathname,
	);
	if (routeAssetsString)
		baseDocumentRendered = injectServerAssets(
			baseDocumentRendered,
			routeAssetsString,
		);

	// MARK: Base document (Vite HTML transform in dev)
	const baseDocumentHtml =
		vite && mode === 'dev'
			? await vite.transformIndexHtml(routeInfos.pathname, baseDocumentRendered)
			: baseDocumentRendered;

	if (docOnly) return { document: baseDocumentHtml, output: null };

	const index = baseDocumentHtml.indexOf(SSR_OUTLET_MARKER);
	const baseDocumentRenderStreamPre = Readable.from(
		baseDocumentHtml.slice(0, Math.max(0, index)),
	);
	const baseDocumentRenderStreamPost = Readable.from(
		baseDocumentHtml.slice(Math.max(0, index + SSR_OUTLET_MARKER.length)),
	);

	// MARK: Page
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

		if (assert.isLitTemplate(routeOutput) === false)
			throw new Error(
				`Wrong template result for page template ${routeInfos.foundRoute.filePath}.`,
			);

		const renderStream = new SafeRenderResultReadable(
			renderLitSsr(routeOutput, mergedRenderInfo),
		);

		const output = Readable.from(
			concatStreams(
				baseDocumentRenderStreamPre,
				renderStream,
				baseDocumentRenderStreamPost,
			),
		);

		return { output, document: baseDocumentHtml };
	}

	// MARK: Just the document.
	const output = Readable.from(baseDocumentHtml);

	return { output, document: baseDocumentHtml };
}

import satori from 'satori';
import type { SatoriOptions } from 'satori';
import { html as satoriHtml } from 'satori-html';
import { render as renderLit } from '@lit-labs/ssr';
import { collectResultSync } from '@lit-labs/ssr/lib/render-result.js';
import { Resvg } from '@resvg/resvg-js';
import type { ResvgRenderOptions } from '@resvg/resvg-js';
import { decodeHTML } from 'entities';
import type { ReactNode } from 'react';

import type { UserConfig } from './generate.js';
import type { Page } from './collect.js';

export const fetchFont = async (fontUrl: string): Promise<ArrayBuffer> =>
	fetch(fontUrl).then((response) => response.arrayBuffer());

export const OG_SIZE = {
	width: 1200,
	height: 630,
} as const;

export const SOURCE_SANS_FONT_URL =
	'https://unpkg.com/typeface-source-sans-pro@1.1.13/files/source-sans-pro-400.woff';

export const FONTS = {
	sourceSans: async () => ({
		name: 'Source Sans Pro',
		data: await fetchFont(SOURCE_SANS_FONT_URL),
	}),
} as const;

export interface RenderedOg {
	path: string;
	data: Buffer;
}

export interface RenderOptions {
	satori: SatoriOptions;
	resvg?: ResvgRenderOptions;
}

export async function renderOgImage(
	userConfig: UserConfig,
	page?: Page,
): Promise<Buffer> {
	const pageOrDefaults = page || { path: '', meta: { tags: {}, jsonLds: [] } };
	const templateOptions = { page: pageOrDefaults };

	const template = await Promise.resolve(userConfig.template(templateOptions));

	/**
	 * `decodeHTML` is a hack because for now, we can't use `unsafeHTML` with
	 * string interpolation (special characters are not encoded by Lit SSR if
	 * they are typed as-is). Also further processors (satori…) are not
	 * decoding the HTML entities.
	 * See this issue: https://github.com/lit/lit/pull/4515
	 * This is the bug we get with `unsafeHTML` (mixed dev/prod…).
	 * This hack is not optimal and should be removed ASAP.
	 */
	const litSsred = decodeHTML(collectResultSync(renderLit(template)));
	const satoried = satoriHtml(litSsred) as unknown as ReactNode;

	const svg = await satori(
		// @ts-expect-error - FIXME: Mismatch
		satoried,
		userConfig.renderOptions.satori,
	);

	const resvg = new Resvg(svg, userConfig.renderOptions.resvg);

	const image = resvg.render();

	return image.asPng();
}

export const renderAllPagesOg = (
	pages: Page[],
	config: UserConfig,
): Promise<RenderedOg[]> =>
	Promise.all(
		pages.map(async (page) => ({
			path: page.path,
			data: await renderOgImage(config, page),
		})),
	);

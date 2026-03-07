import satori from 'satori';
import { html as satoriHtml } from 'satori-html';
import { render as renderLit } from '@lit-labs/ssr';
import { collectResultSync } from '@lit-labs/ssr/lib/render-result.js';
import { Resvg } from '@resvg/resvg-js';
import { decodeHTML } from 'entities';

/**
 * @param {string} fontUrl
 * @returns {Promise<ArrayBuffer>}
 */
export const fetchFont = async (fontUrl) =>
	fetch(fontUrl).then((response) => response.arrayBuffer());

export const OG_SIZE = /** @type {const} */ ({
	width: 1200,
	height: 630,
});

export const SOURCE_SANS_FONT_URL =
	'https://unpkg.com/typeface-source-sans-pro@1.1.13/files/source-sans-pro-400.woff';

export const FONTS = {
	sourceSans: async () => ({
		name: 'Source Sans Pro',
		data: await fetchFont(SOURCE_SANS_FONT_URL),
	}),
};

/**
 * @typedef RenderedOg
 * @property {string} path
 * @property {Buffer} data
 */

/**
 * @typedef RenderOptions
 * @property {import('satori').SatoriOptions} satori
 * @property {import('@resvg/resvg-js').ResvgRenderOptions} [resvg]
 */

/**
 * @param {import('./generate.js').UserConfig} userConfig
 * @param {import('./collect.js').Page} [page]
 * @returns {Promise<Buffer>}
 */
export async function renderOgImage(userConfig, page) {
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
	const satoried = /** @type {import('react').ReactNode} Cast VNode */ (
		satoriHtml(litSsred)
	);

	const svg = await satori(satoried, userConfig.renderOptions.satori);

	const resvg = new Resvg(svg, userConfig.renderOptions.resvg);

	const image = resvg.render();

	return image.asPng();
}

/**
 * @param {import('./generate.js').UserConfig} config
 * @param {import('./api.js').Page[]} pages
 * @returns {Promise<RenderedOg[]>}
 */
export const renderAllPagesOg = (pages, config) =>
	Promise.all(
		pages.map(async (page) => ({
			path: page.path,
			data: await renderOgImage(config, page),
		})),
	);

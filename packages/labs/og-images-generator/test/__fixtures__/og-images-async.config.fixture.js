import { html, styled, OG_SIZE, FONTS } from 'og-images-generator';

/** @type {import('og-images-generator').PathsOptions} (Optional) */
export const paths = {
	// DEFAULTS:
	base: './dist',
	out: './dist/og',
	json: './dist/og/index.json',
};

const myInlineStyle1 = styled.div`
	display: flex;
`;

const nestedTemplate1 = html`<span>My Website</span>`;

async function iAmABlocker() {
	const stuff = await new Promise((resolve) =>
		setTimeout(() => resolve('ok then'), 10),
	);

	return stuff;
}

/** @type {import('og-images-generator').Template} */
export const template = async ({ page }) =>
	html` <!-- Contrived example -->
		<div style=${myInlineStyle1}>
			${page.meta?.tags?.['og:title'] ?? 'Untitled'} <br />
			${page.meta?.tags?.['og:description'] ?? 'No description'}
			<!-- -->
			${nestedTemplate1}
			<em>Nice</em>
			<strong>Weather, ${await iAmABlocker()}</strong>
		</div>`;

/** @type {import('og-images-generator').RenderOptions} */
export const renderOptions = {
	satori: { fonts: [await FONTS.sourceSans()], ...OG_SIZE },
};

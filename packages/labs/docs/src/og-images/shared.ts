import { readFile } from 'node:fs/promises';

import {
	html,
	styled,
	OG_SIZE,
	type Template,
	type TemplateOptions,
	type RenderOptions,
	type PathsOptions,
} from 'og-images-generator';
import stripEmojiBase from 'emoji-strip';

const DEFAULT_SITE_TITLE = 'Gracile';
const DEFAULT_SITE_SUBTITLE = 'web framework';

const tokens = {
	/* Shoelace "Emerald/Sky" palette (https://shoelace.style/tokens/color) */

	slColorEmerald_950: 'rgb(236, 253, 245)',
	slColorEmerald_900: 'rgb(209, 250, 229)',
	slColorEmerald_800: 'rgb(167, 243, 208)',
	slColorEmerald_700: 'rgb(110, 231, 183)',
	slColorEmerald_600: 'rgb(52, 211, 153)',
	slColorEmerald_500: 'rgb(16, 185, 129)',
	slColorEmerald_400: 'rgb(5, 150, 105)',
	slColorEmerald_300: 'rgb(4, 120, 87)',
	slColorEmerald_200: 'rgb(6, 95, 70)',
	slColorEmerald_100: 'rgb(6, 78, 59)',
	slColorEmerald_50: 'rgb(3, 45, 34)',

	slColorSky_50: `rgb(19, 61, 87)`,
	slColorSky_100: `rgb(21, 82, 122)`,
	slColorSky_200: `rgb(19, 93, 138)`,
	slColorSky_300: `rgb(18, 109, 166)`,
	slColorSky_400: `rgb(22, 137, 204)`,
	slColorSky_500: `rgb(17, 158, 226)`,
	slColorSky_600: `rgb(39, 186, 253)`,
	slColorSky_700: `rgb(105, 208, 255)`,
	slColorSky_800: `rgb(166, 227, 255)`,
	slColorSky_900: `rgb(203, 239, 255)`,
	slColorSky_950: `rgb(232, 253, 255)`,
};

/**
 * Add unsupported emojis
 * @param {string} input
 * */

function stripEmoji(input: string): string {
	return stripEmojiBase(input).replaceAll(/(🧭)/g, '');
}

export const paths: PathsOptions = {
	// DEFAULTS
	// base: './dist',
	// out: './dist/og',
	// json: './dist/og/index.json',
};

const module_ = await import('node:module');
const require = module_.createRequire(import.meta.url);
const inter400Path =
	require.resolve('@fontsource/inter/files/inter-latin-400-normal.woff');
const fallbackLogoSvg = await readFile(
	new URL('../assets/logo-gracile-text-simple.svg', import.meta.url),
	'utf8',
);

export const renderOptions: RenderOptions = {
	satori: {
		fonts: [
			{
				name: 'Inter',
				data: await readFile(inter400Path),
			},
		],
		...OG_SIZE,
		graphemeImages: {
			'🚀': 'https://cdn.jsdelivr.net/gh/twitter/twemoji@14.0.2/assets/svg/1f680.svg',
		},
	},
};

export interface DocsOgImagesConfigOptions {
	logoSvg?: string | undefined;
	siteTitle?: string | undefined;
	siteSubtitle?: string | undefined;
	colorPalette?: DocsOgImagesColorPalette | undefined;
}

export interface DocsOgImagesColorPalette {
	primary950?: string | undefined;
	primary900?: string | undefined;
	primary200?: string | undefined;
	background50?: string | undefined;
	background200?: string | undefined;
	titleShadow?: string | undefined;
}

interface DocsOgImagesColorItems {
	descriptionBorderLeftColor: string;
	containerGradientColor1: string;
	containerGradientColor2: string;
	containerGradientColor3: string;
	logoColor: string;
	mainTitleColor: string;
	mainTitleShadowColor: string;
	pageTextColor: string;
}

function createColorItems(
	colorPalette: DocsOgImagesColorPalette = {},
): DocsOgImagesColorItems {
	const palette = {
		primary950: colorPalette.primary950 ?? tokens.slColorEmerald_950,
		primary900: colorPalette.primary900 ?? tokens.slColorEmerald_900,
		primary200: colorPalette.primary200 ?? tokens.slColorEmerald_200,
		background50: colorPalette.background50 ?? tokens.slColorSky_50,
		background200: colorPalette.background200 ?? tokens.slColorSky_200,
		titleShadow: colorPalette.titleShadow ?? '#00111ad9',
	};

	return {
		descriptionBorderLeftColor: palette.primary950,
		containerGradientColor1: palette.background50,
		containerGradientColor2: palette.background50,
		containerGradientColor3: palette.background200,
		logoColor: palette.primary950,
		mainTitleColor: palette.primary950,
		mainTitleShadowColor: palette.titleShadow,
		pageTextColor: palette.primary950,
	};
}

function toInlineSvg(svg: string, fillColor: string): string {
	return svg
		.replace(/<\?xml[\s\S]*?\?>/iu, '')
		.replace(/<!doctype[\s\S]*?>/iu, '')
		.replace(/<svg\b(?![^>]*\bfill=)/iu, `<svg fill="${fillColor}"`)
		.trim();
}

function getSvgAspectRatio(svg: string): number {
	const viewBoxMatch = svg.match(
		/viewBox=["']\s*(-?\d+(?:\.\d+)?)\s+(-?\d+(?:\.\d+)?)\s+(\d+(?:\.\d+)?)\s+(\d+(?:\.\d+)?)\s*["']/iu,
	);
	const widthNumber = Number(viewBoxMatch?.[3]);
	const heightNumber = Number(viewBoxMatch?.[4]);

	return widthNumber > 0 && heightNumber > 0 ? widthNumber / heightNumber : 3;
}

function createTemplate(
	logoSvg: string,
	logoSource: 'custom' | 'fallback',
	siteTitle: string,
	siteSubtitle: string,
	colors: DocsOgImagesColorItems,
): Template {
	const logoSvgMarkup = toInlineSvg(logoSvg, colors.logoColor);
	const logoHeight = 128;
	const logoWidth = Math.min(
		520,
		Math.round(logoHeight * getSvgAspectRatio(logoSvgMarkup)),
	);
	const logoStyle = `display: flex; align-items: center; justify-content: flex-start; width: ${logoWidth}px; height: ${logoHeight}px; color: ${colors.logoColor};`;
	const styles = createStyles(colors);

	return ({ page }: TemplateOptions) => {
		// eslint-disable-next-line no-console
		console.info(
			`[gracile-docs] Rendering OG image for ${page.path} with ${logoSource} logo (${logoSvgMarkup.length} chars).`,
		);

		// console.log(page.path.split('/').at(-1));
		// TODO:
		// if (page.path.split('/').at(-1)?.startsWith('__')) return undefined;

		// console.log(page.meta);

		// if (!page.meta?.tags) throw Error('Missing meta tags!');
		// if ('og:title' in page.meta.tags === false) throw Error('Missing title!');
		// if ('og:description' in page.meta.tags === false)
		//   throw Error('Missing description!');

		const ogTitle = page.meta?.tags?.['og:title'];
		let title = 'untitled';

		if (ogTitle)
			title =
				page.path === '/' ? ogTitle : ogTitle.replace(siteTitle + ' | ', '');

		const description = page.meta?.tags?.['og:description'] ?? '-';

		const breadcrumbs = page.meta?.jsonLds?.find(
			(index) => index?.['@type'] === 'BreadcrumbList',
		)?.itemListElement;

		// <!-- <span style=${styles.subTitle}>Docs</span> -->
		return html` <!--  -->
			<div style=${styles.container}>
				<div style=${styles.wrap}>
					<footer style=${styles.footer}>
						<div style=${styles.logo1}>
							<span style=${logoStyle}>${logoSvgMarkup}</span>
							<div style="display: flex; width: 100%; font-size: 40px">
								${siteSubtitle}
							</div>
						</div>
					</footer>

					<header style=${styles.header}>
						<span style=${styles.breadcrumbs}>
							${Array.isArray(breadcrumbs)
								? breadcrumbs.map((index) => {
										const name =
											typeof index === 'object' &&
											index &&
											'name' in index &&
											typeof index.name === 'string'
												? index.name
												: '';
										return html`
											${stripEmoji(name)}
											<span style="margin: 0 2rem 0 1rem"> / </span>
										`;
									})
								: null}
						</span>
						<span style=${styles.mainTitle}>${stripEmoji(title)}</span>
					</header>

					<div style=${styles.description}>${stripEmoji(description)}</div>
				</div>
			</div>`;
	};
}

export function createDocsOgImagesConfig(
	options: DocsOgImagesConfigOptions = {},
): { renderOptions: typeof renderOptions; template: Template } {
	const logoSvg = options.logoSvg?.trim() || fallbackLogoSvg;
	const logoSource = options.logoSvg?.trim() ? 'custom' : 'fallback';
	const siteTitle = options.siteTitle?.trim() || DEFAULT_SITE_TITLE;
	const siteSubtitle = options.siteSubtitle?.trim() || DEFAULT_SITE_SUBTITLE;
	const colors = createColorItems(options.colorPalette);

	// eslint-disable-next-line no-console
	console.info(
		`[gracile-docs] OG images configured with ${logoSource} logo (${logoSvg.length} chars).`,
	);

	return {
		renderOptions,
		template: createTemplate(
			logoSvg,
			logoSource,
			siteTitle,
			siteSubtitle,
			colors,
		),
	};
}

export const template = createTemplate(
	fallbackLogoSvg,
	'fallback',
	DEFAULT_SITE_TITLE,
	DEFAULT_SITE_SUBTITLE,
	createColorItems(),
);

function createStyles(colors: DocsOgImagesColorItems): Record<string, string> {
	return {
		header: styled.div`
			margin-top: 2rem;
			display: flex;
			justify-content: flex-start;
			align-items: center;
			flex-wrap: wrap;
			/* flex-direction: column; */
			gap: 0.75rem;
		`,

		breadcrumbs: styled.div`
			/* display: flex;
    align-items: center; */
			font-size: 40px;
			/* text-overflow: ellipsis; */
			/* overflow: hidden; */
			white-space: nowrap;
			/* width: 100%; */
			/* flex-grow: ; */
		`,

		container: styled.div`
			height: 100%;
			width: 100%;
			display: flex;
			flex-direction: column;
			align-items: center;
			justify-content: space-between;
			background-image: radial-gradient(
				at 15% 100%,
				${colors.containerGradientColor1} 0px,
				${colors.containerGradientColor2} 50%,
				${colors.containerGradientColor3} 100%
			);
		`,

		// title: styled.div`
		//   font-weight: 700;
		//   /* font-size: 70px; */
		//   color: white;
		// `,

		subTitle: styled.div`
			font-size: 60px;
		`,

		mainTitle: styled.div`
			text-shadow: 0.15em 0.15em 0.5em ${colors.mainTitleShadowColor};
			color: ${colors.mainTitleColor};
			font-size: 60px;
			text-overflow: ellipsis;
			overflow: hidden;
			white-space: nowrap;
			width: 100%;
		`,

		wrap: styled.div`
			padding: 50px 75px 50px 75px;
			height: 100%;
			width: 100%;
			display: flex;
			justify-content: space-between;
			flex-direction: column;
			color: ${colors.pageTextColor};
		`,

		description: styled.div`
			text-overflow: ellipsis;
			display: -webkit-box;
			-webkit-line-clamp: 3;
			-webkit-box-orient: vertical;
			overflow: hidden;
			white-space: pre-wrap;
			text-overflow: ellipsis;
			font-size: 40px;
			margin: 1.5rem 0 2.5rem 0;
			flex-direction: column;
			width: 100%;
			overflow: hidden;
			border-left: 5px solid ${colors.descriptionBorderLeftColor};
			padding: 0 40px 0 40px;
			padding-bottom: 10px;
		`,

		logo1: styled.div`
			display: flex;
			align-items: center;
			gap: 2rem;
		`,

		footer: styled.div`
			display: flex;
			align-items: center;
			justify-content: space-between;
			flex-wrap: wrap;
			gap: 30px;
			font-size: 40px;
		`,
	};
}

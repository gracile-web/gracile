import fs from 'node:fs';
import path from 'node:path';
import { pathToFileURL } from 'node:url';

import c from 'picocolors';
import type { ServerRenderedTemplate } from '@lit-labs/ssr';
import type { ResvgRenderOptions } from '@resvg/resvg-js';
import type { SatoriOptions } from 'satori';

import type { CollectOptions, Page, PathsOptions } from './collect.js';
import { collectHtmlPages } from './collect.js';
import type { RenderedOg, RenderOptions } from './render.js';
import { renderAllPagesOg } from './render.js';

export const CONFIG_FILE_NAME = 'og-images.config.js';

export const CONFIG_FILE_PATH = path.join(process.cwd(), CONFIG_FILE_NAME);

export interface TemplateOptions {
	page: Page;
}

export type Template = (
	options: TemplateOptions,
) => ServerRenderedTemplate | Promise<ServerRenderedTemplate>;

export interface UserConfig {
	renderOptions: RenderOptions;
	template: Template;
}

export type UserConfigInput = UserConfig | Promise<UserConfig>;

export interface GenerateOgImagesOptions extends PathsOptions {
	configPath?: string;
	config?: UserConfigInput;
}

export function resolveConfigPath(configPath = CONFIG_FILE_NAME): string {
	return path.isAbsolute(configPath)
		? configPath
		: path.resolve(process.cwd(), configPath);
}

export function normalizeUserConfig(config: unknown): UserConfig {
	if (typeof config !== 'object' || !config)
		throw new Error('Configuration is invalid.');
	if (!('template' in config))
		throw new Error('No template found in configuration.');
	if (typeof config.template !== 'function')
		throw new Error('Template should be a returning function.');

	if (!('renderOptions' in config) || !config.renderOptions)
		throw new Error('No render options found in configuration.');
	if (typeof config.renderOptions !== 'object')
		throw new Error('Return options should be an object.');
	if (!('satori' in config.renderOptions))
		throw new Error('Satori options are mandatory.');

	const resvg = (
		'resvg' in config.renderOptions ? config.renderOptions.resvg : {}
	) as ResvgRenderOptions;
	const satori = config.renderOptions.satori as SatoriOptions;

	return {
		template: config.template as UserConfig['template'],
		renderOptions: { satori, resvg },
	};
}

export async function loadUserConfig(configPath?: string): Promise<UserConfig> {
	const resolvedConfigPath = resolveConfigPath(configPath);
	// eslint-disable-next-line no-console
	console.log(resolvedConfigPath);
	const config: unknown = await import(
		pathToFileURL(resolvedConfigPath).href
	).catch((error: unknown) => {
		// eslint-disable-next-line no-console
		console.error(error);
		throw new Error('Configuration not found.');
	});

	return normalizeUserConfig(config);
}

export async function resolveUserConfig(
	options?: Pick<GenerateOgImagesOptions, 'config' | 'configPath'>,
): Promise<UserConfig> {
	if (options?.config) return normalizeUserConfig(await options.config);

	return loadUserConfig(options?.configPath);
}

export async function save(
	renderedImages: RenderedOg[],
	out: string,
): Promise<void> {
	await Promise.all(
		renderedImages.map(async (rendered) => {
			const fileDestination =
				rendered.path.replace(/\/index\.html$/, '').replace(/\.html$/, '') +
				'.png';

			const destination = path.join(process.cwd(), out, fileDestination);

			await fs.promises
				.mkdir(path.dirname(destination), { recursive: true })
				.catch(() => null);

			await fs.promises.writeFile(destination, rendered.data);
		}),
	);

	// eslint-disable-next-line no-console
	console.log(c.bold(c.green(renderedImages.length + ' images generated.')));
}

export async function generateOgImages(
	options?: GenerateOgImagesOptions,
): Promise<void> {
	const optionsOrDefaults: CollectOptions = {
		base: options?.base || './dist',
		out: options?.out || './dist/og',
		json: options?.json || './dist/og/index.json',
		additionalPatterns: options?.additionalPatterns || [],
		globber: options?.globber || {},
	};

	const pages = await collectHtmlPages(optionsOrDefaults);
	const config = await resolveUserConfig(options);
	const renderedImages = await renderAllPagesOg(pages, config);

	await save(renderedImages, optionsOrDefaults.out);

	// eslint-disable-next-line no-console
	console.log(
		c.magenta('OG images generation completed successfully. ') +
			c.blue('Now exiting.'),
	);
}

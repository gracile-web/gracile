import path from 'node:path';
import fs from 'node:fs';

import fastGlob from 'fast-glob';
import type { Options as GlobOptions } from 'fast-glob';
import { parse } from 'parse5';
import c from 'picocolors';

export type MetaTags = Record<string, string>;
export type JsonLds = Record<string, unknown>[];

export interface Metadata {
	tags?: MetaTags;
	jsonLds?: JsonLds;
}

export interface Page {
	meta?: Metadata;
	path: string;
}

export interface PathsOptions {
	base?: string;
	out?: string;
	json?: string;
	additionalPatterns?: string[];
	globber?: GlobOptions;
}

export type CollectOptions = Required<PathsOptions>;

export function extractMetadataFromHtml(fileContent: string): Metadata {
	const ast = parse(fileContent);

	const document_ = ast.childNodes.find((node) => node.nodeName === 'html');
	if (document_ === undefined) throw new Error('Invalid base HTML document.');
	if ('childNodes' in document_ === false)
		throw new Error('Invalid base HTML document.');

	const head = document_.childNodes.find((node) => node.nodeName === 'head');
	if (head === undefined) throw new Error('Invalid HTML head element.');
	if ('childNodes' in head === false)
		throw new Error('Invalid HTML head element.');

	const body = document_.childNodes.find((node) => node.nodeName === 'body');
	if (body === undefined) throw new Error('Invalid HTML body element.');
	if ('childNodes' in body === false)
		throw new Error('Invalid HTML body element.');

	const metaTagsNode = head.childNodes.filter((node) =>
		['meta'].includes(node.nodeName),
	);

	const jsonLds: JsonLds = [];

	for (const node of [...head.childNodes, ...body.childNodes]) {
		if (
			['script'].includes(node.nodeName) &&
			'attrs' in node &&
			node.attrs.find((attribute) => attribute.name === 'type')?.value ===
				'application/ld+json'
		) {
			const content = node.childNodes.at(0);
			if (content && 'value' in content)
				jsonLds.push(JSON.parse(content.value));
		}
	}

	const metaTags: MetaTags = {};
	for (const node of metaTagsNode) {
		if ('attrs' in node === false) continue;

		node.attrs.map((attribute) => {
			if (attribute.name === 'property' || attribute.name === 'name') {
				const metaName = attribute.value;
				const metaValue = node.attrs.find(
					(attr) => attr.name === 'content',
				)?.value;

				if (metaValue) metaTags[metaName] = metaValue;
			}
		});
	}

	return { tags: metaTags, jsonLds };
}

export async function collectHtmlPages(
	options: CollectOptions,
): Promise<Page[]> {
	console.log(c.bold(c.yellow('Collecting HTML pages…')));

	const files = await fastGlob(
		[path.join(options.base, '**/*.html'), ...options.additionalPatterns],
		options.globber,
	);

	const pages: Page[] = [];

	await Promise.all(
		files.map(async (filePath) => {
			const fileContent = await fs.promises.readFile(filePath, 'utf8');

			const pageMetas = extractMetadataFromHtml(fileContent);

			pages.push({
				path: path.relative(options.base, filePath),
				meta: pageMetas,
			});
		}),
	);

	await fs.promises
		.mkdir(path.join(options.out), { recursive: true })
		.catch(() => null);

	await fs.promises.writeFile(
		path.join(options.json),
		JSON.stringify(pages, null, 2),
	);

	return pages.sort((p, n) => (p.path < n.path ? -1 : 1));
}

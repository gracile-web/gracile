import { type } from 'arktype';
import type { MarkdownModule } from '@gracile-labs/docs/lib/markdown/md-module.js';
import type { DocsConfig } from '@gracile-labs/docs/vite';
import { PathsHandlers } from '@gracile-labs/docs/content/paths-handlers';
import { buildTree } from '@gracile-labs/docs/content/file-tree-builder';
import nodejsLogo from '@gracile-labs/docs/assets/nodejs-logo.svg?url';
import viteLogo from '@gracile-labs/docs/assets/vite-logo.svg?url';
import litLogo from '@gracile-labs/docs/assets/lit.svg?url';
import webComponentsLogo from '@gracile-labs/docs/assets/webcomponents-logo.svg?url';
import gracileLogo from '@gracile-labs/docs/assets/gracile-logo.svg?raw';

import packageJson from '../../package.json' with { type: 'json' };

const siteUrl = 'https://gracile.js.org/';

export const docsConfig: DocsConfig = {
	site: {
		title: 'Gracile',
		subtitle: 'Web framework',
		url: siteUrl,
		logoHref: '/favicon.svg',
		description: 'A thin, full-stack, web framework',
		issuesUrl: 'https://github.com/gracile-web/gracile/issues/',
		repoUrl: 'https://github.com/gracile-web/gracile/',
		docsRepoUrl: 'https://github.com/gracile-web/website/',
		discordInvitePath: 'chat/',
		discordInviteUrl: 'https://discord.gg/Q8nTZKZ9H4',
		playgroundUrl: '/playground/',
		sponsorUrl: 'https://github.com/sponsors/JulianCataldo',
		mainSiteUrl: 'https://gracile.js.org/',
		nextSiteUrl: 'https://next--gracile.js.org/',
		license: packageJson.license,
		version: packageJson.version,
		authors: packageJson.author.name,
	},
	home: {
		logoHtml: gracileLogo,
		descriptionHtml: 'A thin, full-stack, <strong>web</strong> framework',
		installCommand: 'npm create gracile@latest',
		splashLinks: [
			{ icon: 'books-duotone', label: 'References', href: '/docs/references/' },
			{
				icon: 'play-duotone',
				label: 'Get started',
				href: '/docs/learn/getting-started/',
			},
			{
				icon: 'app-window-duotone',
				label: 'Playground',
				href: '/docs/playground/',
			},
		],
		worksWith: [
			{ iconUrl: nodejsLogo, label: 'Node.js', detail: '& compatible' },
			{ iconUrl: viteLogo, label: 'Vite', detail: 'ecosystem' },
			{ iconUrl: litLogo, label: 'Lit', detail: 'ecosystem' },
			{
				iconUrl: webComponentsLogo,
				label: 'Web Components',
				detail: '& web APIs',
			},
		],
	},
} satisfies DocsConfig;

export const featureList = [
	{
		title: 'File Based Routing',
		desc: `Define URLs from your project tree, leverage code bundle splitting.`,
		href: '/docs/learn/usage/defining-routes/',
		tags: ['Server'],
	},
	{
		title: 'Server Side Rendering',
		desc: 'Render streams from your templates, per-request or ahead-of-time.',
		href: '/docs/learn/usage/output-modes/#doc_server-mode',
		tags: ['Server'],
	},
	{
		title: 'Static Site Generation',
		desc: 'Compile your project routes to an easily hosted distributable.',
		href: '/docs/learn/usage/output-modes/#doc_static-mode-ssg',
		tags: [],
	},
	{
		title: 'Client Side Routing',
		desc: 'Augment your "Multi-Page Application" with a snappier user experience.',
		href: '/docs/learn/usage/output-modes/#doc_client-side-routing-csr',
		tags: ['add-on'],
	},
	{
		title: 'Progressive Interactivity',
		desc: 'Add JS surgically, within "Islands", or opt for full blown hydration.',
		href: '/docs/learn/usage/progressive-interactivity/',
		tags: [],
	},
	{
		title: 'Custom HTML Elements',
		desc: 'Go along with the web grain, thanks to native APIs friendliness.',
		href: '/docs/recipes/working-with-forms-js/',
		tags: [],
	},
	{
		title: 'Lit HTML Elements',
		desc: "Sugar and streamline your Web Components, thanks to Lit's numerous helpers.",
		href: '/docs/learn/usage/passing-data-from-server-to-client/#doc_custom-element-examples',
		tags: [],
	},
	{
		title: 'Exotic File Formats',
		desc: 'Import SVG, frontmattered Markdown, and others; right into your templates.',
		href: '/docs/add-ons/',
		tags: [],
	},
	{
		title: 'HTML/CSS Template Literals',
		desc: 'Skip templates transformation, while keeping a robust editing experience.',
		href: '/docs/learn/usage/defining-base-document/#doc_example',
		tags: [],
	},
	{
		title: 'JSX Templates',
		desc: 'Transform templates to optimized HTML literals; benefit from handy helpers.',
		href: '/docs/add-ons/jsx-forge/',
		tags: [],
	},
	{
		title: 'Server Endpoints',
		desc: 'Implement route methods for handling HTTP requests, in a type-safe manner.',
		href: '/docs/learn/usage/defining-routes/#doc_handler',
		tags: [],
	},
	{
		title: 'Modular Architecture',
		desc: "Cherry pick only what's needed. Extend the framework capabilities.",
		href: '/docs/add-ons/',
		tags: [],
	},
];

export const pathsHandlers = new PathsHandlers();

export const docsMetaImportsGlob = import.meta.glob<MarkdownModule>(
	['/src/content/docs/**/*.md', '!/**/_*'],
	{ eager: true, query: 'meta' },
);
export const docsContentImportsGlob = import.meta.glob<MarkdownModule>([
	'/src/content/docs/**/*.md',
	'!/**/_*',
]);

// TODO: externalize to method?
export const docsMetaImports = Object.entries(docsMetaImportsGlob).map(
	([path, module]) =>
		({
			pathParams: pathsHandlers.filePathToDocsPathParam(path),
			href: pathsHandlers.pathToHref(path),
			module,
		}) satisfies MarkdownModuleConsumable,
);

export type MarkdownModuleConsumable = {
	pathParams: string | undefined;
	href: string;
	module: MarkdownModule;
};

const markdownTreeNodes =
	pathsHandlers.markdownModulesToTreeNode(docsMetaImportsGlob);

// TODO: merge buildTree with class?
export const markdownTree = buildTree(markdownTreeNodes);

// ---

const blogMetaImportsGlob = import.meta.glob<MarkdownModule>(
	['/src/content/blog/**/*.md', '!/**/_*'],
	{ eager: true, query: 'meta' },
);
export const blogContentImportsGlob = import.meta.glob<MarkdownModule>([
	'/src/content/blog/**/*.md',
	'!/**/_*',
]);

const blogPost = type({
	// 'title': "string",
	// 'description?': "string",
	'publishedAt?': type('string | null').pipe.try((a) => {
		if (a && Date.parse(a)) return new Date(a);
		throw new Error('Incorrect date');
	}),
	'updatedAt?': type('string | null').pipe.try((a) => {
		if (a && Date.parse(a)) return new Date(a);
		return null;
	}),
	'author?': "'Julian Cataldo' | 'Foo Bar'",
});

export const blogMetaImports = Object.entries(blogMetaImportsGlob).map(
	([path, module]) =>
		({
			pathParams: pathsHandlers.filePathToDocsPathParam(path),
			href: pathsHandlers.pathToHref(path),
			module: {
				...module,
				frontmatter: (() => {
					const fm = blogPost(module.frontmatter);
					if (fm instanceof type.errors) throw fm;
					return fm;
				})(),
			},
		}) satisfies MarkdownModuleConsumable,
);

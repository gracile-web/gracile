import type { TEMPLATE_LIST } from './types.js';

export const availableTemplates = [
	{
		value: 'minimal-static',
		label: 'Minimal - Static',
		hint: 'Get started with a statically generated project (SSG)',
	},
	{
		value: 'minimal-server-express',
		label: 'Minimal - Server Express',
		hint: 'Get started with a server-side rendered project (SSR)',
	},
	{
		value: 'minimal-server-hono',
		label: 'Minimal - Server Hono',
		hint: 'Get started with a server-side rendered project (SSR)',
	},
	{
		value: 'basics',
		label: 'Basics',
		hint: 'Get up and running with this all around demo of Gracile features',
	},
	// {
	// 	value: 'minimal-minification',
	// 	label: 'Minimal - HTML/CSS minification (labs)',
	// 	hint: 'An example on how to minify your build for any output mode. EXPERIMENTAL.',
	// },
	// {
	// 	value: 'minimal-client-routing',
	// 	label: 'Minimal - Client routing (labs)',
	// 	hint: 'Client-side router and hydration, for any mode. EXPERIMENTAL.',
	// },
	// {
	// 	value: 'minimal-bootstrap-tailwind',
	// 	label: 'Minimal - Bootstrap/Tailwind CSS (labs)',
	// 	hint: 'Adopt global vendor styles for Custom Elements. EXPERIMENTAL.',
	// },
	// {
	// 	value: 'minimal-testing',
	// 	label: 'Minimal - Testing setup',
	// 	hint: 'Client-side router and hydration, for any mode. EXPERIMENTAL.',
	// },
] satisfies {
	value: (typeof TEMPLATE_LIST)[number];
	label: string;
	hint?: string;
}[];

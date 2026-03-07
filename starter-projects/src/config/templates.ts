export const templates = [
	{
		merge: ['templates-src/basics'],
		name: 'basics',
		title: 'Basics',
		description:
			'Get up and running with this all around demo of Gracile features.',
		features: /* md */ `
- ✅ Minimal styling (make it your own!)
- ✅ SEO-friendly with canonical URLs and OpenGraph data
- ✅ Sitemap support
- ✅ Markdown support
- ✅ SVG support
- ✅ Server-rendered Lit Elements
`.trim(),
		containers: true,
		// tryout: 'https://gracile-template-basic-blog-static.netlify.app/',
	},
	// 	// 	{
	// 	// 		merge: ['./inventory/basics/**'],
	// 	// 		name: 'basics-server',
	// 	// 		title: 'Basics (server)',
	// 	// 		description: 'Get up and running with a full-stack project.',
	// 	// 		features: /* md */ `
	// 	// - ✅ Minimal styling (make it your own!)
	// 	// - ✅ SEO-friendly with canonical URLs and OpenGraph data
	// 	// - ✅ Markdown support
	// 	// - ✅ SVG support
	// 	// - ✅ Server-rendered Lit Elements
	// 	// `.trim(),
	// 	// 		containers: true,
	// 	// 		// tryout: 'https://gracile-template-basic-blog-static.netlify.app/',
	// 	// 	},
	{
		merge: [
			//
			'inventory/minimal',
			'inventory/minimal-static',
			'templates-src/minimal-static',
		],
		name: 'minimal-static',
		title: 'Minimal setup (static)',
		description: 'A statically generated project.',
		containers: true,
	},
	{
		merge: [
			//
			'inventory/minimal',
			'inventory/minimal-static',
			'templates-src/minimal-bootstrap-tailwind',
		],
		name: 'minimal-bootstrap-tailwind',
		title: 'Minimal setup (Bootstrap/Tailwind)',
		description: 'A project with popular vendors CSS preconfigured.',
		containers: true,
	},
	{
		merge: [
			//
			'inventory/minimal',
			'inventory/minimal-server',
			'templates-src/minimal-testing',
		],
		name: 'minimal-testing',
		title: 'Minimal setup with various kinds of test suites.',
		description: 'Browser (Playwright), Unit tests (Node).',
		containers: true,

		features: `**Available commands**

\`\`\`sh
test:unit
test:unit:dev

test:integration
test:integration:dev

test:component
test:component:dev

test:e2e
test:e2e:dev

test:all
\`\`\`
    `,
	},
	{
		merge: [
			//
			'inventory/minimal',
			'inventory/minimal-static',
			'templates-src/minimal-minification',
		],
		name: 'minimal-minification',
		title: 'Minimal setup (HTML/CSS minification)',
		description: 'Static/server and dev/build with minified CSS+HTML.',
		containers: true,
	},
	{
		merge: [
			//
			'inventory/minimal',
			// 'inventory/minimal-static',
			'templates-src/minimal-client-routing',
		],
		name: 'minimal-client-routing',
		title: 'Minimal setup for client routing (SPA)',
		description: 'Client-side routing demo, with hydration, for any mode.',
		containers: true,
	},
	{
		merge: [
			'inventory/minimal',
			'inventory/minimal-server',
			'templates-src/minimal-server-express',
		],
		name: 'minimal-server-express',
		title: 'Minimal server (Express)',
		description:
			'A Gracile handler, already set up with Express and static file serving.',
		containers: true,
	},
	{
		merge: [
			'inventory/minimal',
			'inventory/minimal-server',
			'templates-src/minimal-server-hono',
		],
		name: 'minimal-server-hono',
		title: 'Minimal server (Hono)',
		description:
			'A Gracile handler, already set up with Hono and static file serving.',
		containers: true,
	},
] as const;

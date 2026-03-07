import { exec } from 'node:child_process';
import { promisify } from 'node:util';

import { createServer } from 'vite';

export const $ = promisify(exec);

// export const infos = [
// 	/* templates */
// 	// { name: 'basics', port: 3030 },

// 	// { name: 'minimal-static', port: 3030 },
// 	// { name: 'minimal-server-hono', port: 3030 },
// 	// { name: 'minimal-server-express', port: 3030 },

// 	// { name: 'minimal-minification', port: 3030 },

// 	// ----

// 	{ name: 'minimal-testing', port: 3030 },
// 	// { name: 'minimal-bootstrap-tailwind', port: 3030 },
// 	// { name: 'minimal-client-routing', port: 3030 },
// ];

// export async function playwrightSuiteForTemplate(tpl: string, ui = false) {
// 	const playwrightResultBuild = await $(
// 		`pnpm playwright test ./tests/${tpl}.spec.ts${ui ? ' --ui' : ''}`, //  --ui
// 	);
// 	console.log(playwrightResultBuild.stdout);
// 	console.log(playwrightResultBuild.stderr);
// }

export async function createViteTestServer(cwd: string, ui = false) {
	const server = await createServer({
		root: cwd,
	});

	console.log({ root: server.config.root });

	// eslint-disable-next-line @typescript-eslint/no-floating-promises
	server.listen();

	return { close: () => server.close() };
}

export async function buildAndPreview(cwd: string) {
	const options = { cwd };

	// console.log('buildAndPreview');
	// await $('pnpm build', options);
	const c = exec('pnpm preview', options);

	await new Promise((resolve) => {
		// c.stdout?.on('data', (data) => {
		// 	console.log(data);
		// 	if (String(data).includes('preview server started')) resolve(null);
		// });

		setTimeout(() => {
			resolve();
		}, 1000);
	});

	return {
		close: () => c.kill(),
	};
}

const MODE = process.env['MODE'] || 'dev';

export async function createTestServer(url: string, ui = false) {
	console.log({ MODE });

	const name = new URL(url).pathname.split('/').at(-1)!.replace('.spec.ts', '');
	console.log(`Starting test for ${name}…`);

	const opts = { cwd: `./templates/${name}` };

	if (MODE === 'build') {
		const server = await buildAndPreview(opts.cwd);
		return server;
	}

	const server = await createViteTestServer(opts.cwd, ui);
	return server;
}

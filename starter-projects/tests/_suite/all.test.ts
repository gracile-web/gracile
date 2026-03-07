/* eslint-disable @typescript-eslint/no-floating-promises */

import { test } from 'node:test';

import { createServer } from 'vite';

import { infos, playwrightSuiteForTemplate } from './utils.ts';

infos.forEach((template) => {
	const opts = { cwd: `./templates/${template.name}` };

	test(`dev - ${template.name}`, async () => {
		const server = await createServer({
			root: opts.cwd,
			// server: { port: template.port },
		});

		server.listen();

		await playwrightSuiteForTemplate(template.name, true);

		await server.close();
	});
});

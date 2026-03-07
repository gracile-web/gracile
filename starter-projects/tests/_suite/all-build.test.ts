/* eslint-disable @typescript-eslint/no-misused-promises */
/* eslint-disable @typescript-eslint/no-floating-promises */

import { exec } from 'node:child_process';
import { test } from 'node:test';

import { $, infos, playwrightSuiteForTemplate } from './utils.ts';

infos.forEach(async (template) => {
	console.log('template.name');

	const options = { cwd: `./templates/${template.name}` };

	test(`dev - ${template.name}`, async () => {
		await $('node --run build', options);
		const c = exec('pnpm preview', options);

		await playwrightSuiteForTemplate(template.name, true);

		c.kill();
	});
});

// NOTE: shebang via `@gracile/gracile`

import { program } from '@commander-js/extra-typings';
import { build } from '@gracile/engine/build/build';
import { preview } from '@gracile/engine/preview';
import { logger } from '@gracile/internal-utils/logger';

import { greet } from '../utils.js';

greet();

// BUILD
program.command('build').action((_str, _options) => {
	build().catch((error) => logger.error(String(error)));
});

// PREVIEW
program
	.command('preview')
	.option('p, --port <number>')
	.option('h, --host')

	.action((_str, options) => {
		const opts = options.opts();
		preview({
			port: opts.port ? Number(opts.port) : undefined,
			expose: opts.host,
		}).catch((error) => logger.error(String(error)));
	});

// NOTE: disabled for now (might separate it)
// program.command('add <addon>').action((str, options) => {
//   add(str);
// });

program.parse();

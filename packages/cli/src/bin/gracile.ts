// NOTE: shebang via `@gracile/gracile`

import { join } from 'node:path';

import { program } from '@commander-js/extra-typings';
import { build } from '@gracile/engine/build/build';
import { preview } from '@gracile/engine/preview';
import { logger } from '@gracile/internal-utils/logger';

import { greet } from '../utils.js';

greet();

// BUILD
program
	.command('build')
	.option('-r, --root <string>', 'Root directory for the project')
	.action((_str, options) => {
		const opts = options.opts();
		build(opts.root ? join(process.cwd(), opts.root) : undefined).catch(
			(error) => logger.error(String(error)),
		);
	});

// PREVIEW
program
	.command('preview')
	.option('-p, --port <number>', 'Assign a local port (overrides config. file)')
	.option('-h, --host', 'Expose the server to you local network (0.0.0.0)')
	.option('-r, --root <string>', 'Root directory for the project')

	.action((_str, options) => {
		const opts = options.opts();
		preview({
			port: opts.port ? Number(opts.port) : undefined,
			expose: opts.host,
			root: opts.root ? join(process.cwd(), opts.root) : undefined,
		}).catch((error) => logger.error(String(error)));
	});

// NOTE: disabled for now (might separate it)
// program.command('add <addon>').action((str, options) => {
//   add(str);
// });

program.parse();

// NOTE: shebang via `@gracile/gracile`

import { join } from 'node:path';

import { program } from '@commander-js/extra-typings';
import { logger } from '@gracile/internal-utils/logger';

import { greet, suppressLitWarnings } from '../utils.js';

greet();

suppressLitWarnings();

const { dev } = await import('@gracile/engine/dev/dev');

// DEV
program
	// .command('dev')
	.option('-p, --port <number>', 'Assign a local port (overrides config. file)')
	.option('-h, --host', 'Expose the server to you local network (0.0.0.0)')
	.option('-r, --root <string>', 'Root directory for the project')
	.action((_str, options) => {
		const opts = options.opts();
		dev({
			port: opts.port ? Number(opts.port) : undefined,
			expose: opts.host,
			root: opts.root ? join(process.cwd(), opts.root) : undefined,
		}).catch((e) => logger.error(String(e)));
	});

program.parse();

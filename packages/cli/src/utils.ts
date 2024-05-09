import { logger } from '@gracile/internal-utils/logger';
import c from 'picocolors';

export function greet() {
	logger.info(
		`${c.cyan(c.italic(c.underline(' Gracile ')))}` +
			` ${c.green(` v${process.env['GRACILE_VERSION']}`)}`,
	);
}

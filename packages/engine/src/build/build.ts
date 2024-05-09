import { logger } from '@gracile/internal-utils/logger';
import c from 'picocolors';

import { viteBuild } from '../vite/build.js';

export async function build(root?: string) {
	logger.info(c.gray('\n— Build mode —\n'));

	await viteBuild(root ?? process.cwd());
}

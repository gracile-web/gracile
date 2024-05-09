// For keeping it long running with manual tests.

import { logger } from '@gracile/internal-utils/logger';

import { createServer } from '../__utils__/gracile-server.js';

const { address } = await createServer('static-site', 7878);

logger.info(address);

/**
 * Side-effect import: initializes the Gracile logger globally.
 * Import this at the top of any engine unit test that touches modules
 * which call `getLogger()` at module scope.
 */
import { createLogger } from '@gracile/internal-utils/logger/helpers';

createLogger();

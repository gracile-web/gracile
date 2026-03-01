/**
 * Side-effect import: initializes the Gracile Vite logger globally.
 * Import this in any helper that uses Vite APIs.
 */
import { createGracileViteLogger } from '@gracile/internal-utils/logger/vite-logger';

createGracileViteLogger();

import { createLogger } from 'vite';

// NOTE: Beware the export conditions will only work if
// this lib. is loaded externally, not in this current package.
// This can be possibly fixed.

export const logger = createLogger(undefined, { prefix: '[gracile]' });

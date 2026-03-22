/**
 * Fixtures directory resolver.
 *
 * Each package owns its fixtures in `__fixtures__/` at the package root.
 * Resolves relative to `process.cwd()` (set by pnpm to the package dir).
 */

import { resolve } from 'node:path';

/**
 * Resolve the `__fixtures__` directory for the current package.
 */
export function resolveFixtures(): string {
	return resolve(process.cwd(), '__fixtures__');
}

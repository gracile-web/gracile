import { logger } from '@gracile/internal-utils/logger';
import c from 'picocolors';

export function greet() {
	logger.info(
		`${c.cyan(c.italic(c.underline(' Gracile ')))}` +
			` ${c.green(` v${process.env['__GRACILE_VERSION']}`)}`,
	);
}

// HACK: See https://github.com/lit/lit/issues/4621#issuecomment-2053643429
// This need to happens before any lit dependency
// import in the current process module graph
export function suppressLitWarnings() {
	const w = `Lit is in dev mode. Not recommended for production! See https://lit.dev/msg/dev-mode for more information.`;
	// @ts-expect-error HACK .....
	globalThis.litIssuedWarnings = new Set();
	// @ts-expect-error HACK .....
	// eslint-disable-next-line @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-member-access
	globalThis.litIssuedWarnings.add(w);
}

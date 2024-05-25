// NOTE: Util. to pretty print for user provided server.

// import { logger } from '@gracile/internal-utils/logger';
// import { DEV } from 'esm-env';
// import type { Server } from 'http';
// import c from 'picocolors';

// export function printNodeHttpServerAddressInfos(
// 	instance: Server,
// 	expose: boolean = true,
// ) {
// 	const infos = instance.address();
// 	logger.info(c.green(`${DEV ? 'development' : 'production'} server started`), {
// 		timestamp: true,
// 	});

// 	if (typeof infos === 'object' && infos && infos.port && infos.address) {
// 		logger.info(
// 			`
// ${c.dim('┃')} Local    ${c.cyan(`http://localhost:${infos.port}/`)}
// ${c.dim('┃')} Network  ${expose ? c.cyan(`http://${infos.address}:${infos.port}/`) : c.dim(`use ${c.bold('--host')} to expose`)}
// 				`,
// 		);

// 		return infos;
// 	}

// 	throw Error('Invalid address/port.');
// }

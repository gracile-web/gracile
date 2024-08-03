// NOTE: Util. to pretty print for user provided server.

import type { IncomingMessage, Server, ServerResponse } from 'node:http';

// import type { AddressInfo } from 'node:net';
import { logger } from '@gracile/internal-utils/logger';
import { DEV } from 'esm-env';
import c from 'picocolors';

import { IP_EXPOSED } from './env.js';

export function printAddressInfos(options: {
	instance?: Server;
	address: string;
}) {
	let address: null | string = null;

	if (options.instance) {
		const infos = options.instance.address();

		if (typeof infos === 'object' && infos && infos.port && infos.address) {
			address = `http://${infos.address}:${infos.port}/`;
		}
	} else if (options.address) {
		address = options.address;
	} else throw new Error('Incorrect options');

	logger.info(c.green(`${DEV ? 'development' : 'production'} server started`), {
		timestamp: true,
	});

	logger.info(
		`
${c.dim('┃')} Local    ${c.cyan(address)}` +
			`${
				address?.includes(IP_EXPOSED)
					? `${c.dim('┃')} Network  ${c.cyan(address)}`
					: ''
			}
`,
	);
}

function sendHtml(res: ServerResponse, payload: unknown) {
	res.setHeader('content/type', 'text/html');
	res.end(payload);
}
function fallback404(res: ServerResponse) {
	return sendHtml(res, '404 — Not found!');
}
export function notFoundHandler(req: IncomingMessage, res: ServerResponse) {
	const host = req.headers.host;
	if (!host) {
		fallback404(res);
		return;
	}

	const url = new URL('/404/', `http://${host}`);

	fetch(url)
		.then((t) => t.text())
		.then((r) => sendHtml(res, r))
		.catch(() => fallback404(res));
}

export type LocalMiddlewareContext = {
	request: Request;
	response: ResponseInit;
};

export type BasicAuthUser = { userName: string | null };

/**
 * @param context
 * @returns
 */
export const authenticateBasic = (
	context: LocalMiddlewareContext,
	validate: (user: { name: string; pass: string }) => boolean,
): BasicAuthUser => {
	const b64 = context.request.headers.get('authorization')?.split(' ')?.[1];

	if (b64) {
		const [name, pass] = Buffer.from(b64, 'base64').toString().split(':');
		if (name && pass) {
			validate({ name, pass });

			return { userName: name };
		}
	}

	/**
	 * Authentication failed
	 */
	context.response.headers = new Headers({
		...context.response.headers,
		'WWW-Authenticate': 'Basic',
	});

	context.response.status = 401;
	context.response.statusText = 'You are not authenticated!';

	return { userName: null };
};

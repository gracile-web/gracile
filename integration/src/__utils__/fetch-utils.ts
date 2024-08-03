import { deepEqual, equal } from 'node:assert/strict';

interface Options {
	status?: number;
	statusText?: string;
	headers?: Record<string, string>;
	text?: string;
	json?: unknown;
	redirected?: boolean;
	// body: ReadableStream { locked: false state: 'readable' supportsBYOB: true }
	// bodyUsed: false
	// ok: true
	// type: 'basic'
	// url: 'http://localhost:3033/gracile-api-endpoint/'
}

export async function checkResponse(
	r: Promise<Response> | Response,
	options: Options,
) {
	//
	const response = await Promise.resolve(r);

	// console.log({ response });

	await Promise.all(
		Object.entries(options).map(async ([key, val]) => {
			if (key in response === false)
				throw new TypeError(
					`\`${key}\` is not present in the response object.`,
				);

			let actual: unknown = response?.[key as keyof typeof response];

			if (key === 'text') actual = await response.text();
			if (key === 'json')
				actual = (await response.json().catch(() => null)) as unknown;

			if (key === 'headers') {
				Object.entries(options.headers ?? {}).forEach(([hKey, hVal]) => {
					equal(hVal, response.headers.get(hKey));
				});
				return;
			}

			if (typeof val === 'object' && val) deepEqual(actual, val);
			else equal(actual, val);

			// console.log(actual);
		}),
	);
}

/* 

Response {
  status: 200,
  statusText: 'OK',
  headers: Headers {
    'x-powered-by': 'Express',
    'access-control-allow-origin': '*',
    'content-type': 'text/plain;charset=UTF-8',
    date: 'Mon, 27 May 2024 20:43:08 GMT',
    connection: 'keep-alive',
    'keep-alive': 'timeout=5',
    'transfer-encoding': 'chunked'
  },
  body: ReadableStream { locked: false, state: 'readable', supportsBYOB: true },
  bodyUsed: false,
  ok: true,
  redirected: false,
  type: 'basic',
  url: 'http://localhost:3033/gracile-api-endpoint/'
}

*/

export const RESPONSE_INVENTORY = {
	ok: {
		statusText: 'OK',
		status: 200,
		redirected: false,
	},
	headers: {
		common: {
			// type: 'basic',
			// bodyUsed: false,
			// ok: true,
			// 'x-powered-by': 'Express',
			// 'access-control-allow-origin': '*',
			connection: 'keep-alive',
			'keep-alive': 'timeout=5',
			'transfer-encoding': 'chunked',
		},
		json: { 'content-type': 'application/json' },
	},
};

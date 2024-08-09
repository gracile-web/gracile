/* eslint-disable @typescript-eslint/no-floating-promises */
import { it } from 'node:test';

import { checkResponse, RESPONSE_INVENTORY } from '../__utils__/fetch-utils.js';

const ADDRESS = 'http://localhost:9874';
const API = '/api';
// const API_URL = ADDRESS + API;

export async function api(item: string) {
	// await it('return 404 response not found', async () => {
	// 	const url = new URL(`${API}/basic/NOT_EXISTING`, ADDRESS);
	// 	await checkResponse(fetch(url), {
	// 		statusText: 'Not Found',
	// 		status: 404,
	// 		redirected: false,
	// 		text: '404',
	// 		headers: {
	// 			// 'content-type': 'text/plain;charset=UTF-8',
	// 		},
	// 	});
	// });

	// eslint-disable-next-line no-restricted-syntax
	for (const method of [
		'GET',
		'PUT',
		'POST',
		'PATCH',
		'DELETE',
		// NOTE: Node 22+
		'QUERY',
		//
		// 'HEAD',
		// 'OPTIONS',
	]) {
		// eslint-disable-next-line no-await-in-loop
		await it(`return after ${method} - ${item}`, async () => {
			// console.log(new URL(`${API}/basic/`, ADDRESS));
			const hasBody = ['GET', 'HEAD', 'DELETE'].includes(method) === false;
			const hasResponse = ['HEAD'].includes(method) === false;

			const body = { [method]: Math.random() };
			const url = new URL(`${API}/basic/`, ADDRESS);

			url.searchParams.set('foo', 'bar');

			await checkResponse(
				fetch(url, {
					method,
					body: hasBody ? JSON.stringify(body) : null,
				}),
				{
					json: hasResponse
						? {
								url: url.href,
								[method]: 'ok',
								locals: { requestIdLength: 36 },
								param1: 'bar',
								...(hasBody ? { body } : {}),
							}
						: null,

					...RESPONSE_INVENTORY.ok,

					// FIXME: Hono doesn't understand custom statusText
					// It will just return the default message for each status code
					// statusText: 'unknown',
					// statusText: 'DONE',

					headers: {
						...RESPONSE_INVENTORY.headers.common,
						...RESPONSE_INVENTORY.headers.json,
						bar: 'baz',
					},
				},
			);
		});
	}

	await it(`return after POST with form data - ${item}`, async () => {
		const url = new URL(`${API}/basic/`, ADDRESS);

		url.searchParams.set('form', 'true');
		const body = new FormData();
		body.set('bar', 'baz');
		body.set('doz', 'diz');

		await checkResponse(
			fetch(url, {
				method: 'POST',
				body,
			}),
			{
				json: {
					formData: { bar: 'baz', doz: 'diz' },
				},

				...RESPONSE_INVENTORY.ok,
				headers: {
					...RESPONSE_INVENTORY.headers.common,
					...RESPONSE_INVENTORY.headers.json,
				},
			},
		);
	});
}

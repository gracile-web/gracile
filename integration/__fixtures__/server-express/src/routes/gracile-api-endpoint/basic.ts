import { defineRoute, Route } from '@gracile/gracile/route';

export default defineRoute({
	locals: (locals: Express.Locals) => ({ ...locals }),

	handler: {
		GET: async ({ url, request, locals }) => {
			console.log({ locals });
			return Response.json(
				{
					url,
					param1: url.searchParams.get('foo'),
					[Route.RequestMethod.GET]: 'ok',
					locals: { traceId: locals.traceId.length },
				},
				{ status: 200, statusText: 'DONE', headers: { bar: 'baz' } },
			);
		},
		POST: async ({ url, request, locals }) => {
			if (url.searchParams.get('form') === 'true') {
				const data = await request.formData();
				return Response.json({
					formData: { bar: data.get('bar'), doz: data.get('doz') },
				});
			}

			return Response.json(
				{
					url,
					param1: url.searchParams.get('foo'),
					[Route.RequestMethod.POST]: 'ok',
					body: await request.json(),
					locals: { traceId: locals.traceId.length },
				},
				{ status: 200, statusText: 'DONE', headers: { bar: 'baz' } },
			);
		},
		PUT: async ({ url, request, locals }) => {
			return Response.json(
				{
					url,
					param1: url.searchParams.get('foo'),
					[Route.RequestMethod.PUT]: 'ok',
					body: await request.json(),
					locals: { traceId: locals.traceId.length },
				},
				{ status: 200, statusText: 'DONE', headers: { bar: 'baz' } },
			);
		},
		QUERY: async ({ url, request, locals }) => {
			return Response.json(
				{
					url,
					param1: url.searchParams.get('foo'),
					[Route.RequestMethod.QUERY]: 'ok',
					body: await request.json(),
					locals: { traceId: locals.traceId.length },
				},
				{ status: 200, statusText: 'DONE', headers: { bar: 'baz' } },
			);
		},
		DELETE: async ({ url, request, locals }) => {
			return Response.json(
				{
					url,
					param1: url.searchParams.get('foo'),
					[Route.RequestMethod.DELETE]: 'ok',
					locals: { traceId: locals.traceId.length },
				},
				{ status: 200, statusText: 'DONE', headers: { bar: 'baz' } },
			);
		},
		PATCH: async ({ url, request, locals }) => {
			return Response.json(
				{
					url,
					param1: url.searchParams.get('foo'),
					[Route.RequestMethod.PATCH]: 'ok',
					body: await request.json(),
					locals: { traceId: locals.traceId.length },
				},
				{ status: 200, statusText: 'DONE', headers: { bar: 'baz' } },
			);
		},
		// HEAD: async ({ url, request }) => {
		// 	return new Response(null);
		// },
		// OPTIONS: async ({ url, request }) => {
		// 	return Response.json({url, [Route.RequestMethod.OPTIONS]: 'ok', body: await request.json() });
		// },
	},
});

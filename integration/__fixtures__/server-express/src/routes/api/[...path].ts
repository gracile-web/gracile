import { defineRoute } from '@gracile/gracile/route';

// NOTE: Unused

export default defineRoute({
	handler: {
		GET: ({ url }) => {
			return Response.json({ get: 'ok' });
		},
		POST: ({ url }) => {
			return Response.json({ post: 'ok' });
		},
		PUT: ({ url }) => {
			return Response.json({ put: 'ok' });
		},
	},
});

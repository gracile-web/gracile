import { defineRoute } from '@gracile/gracile/route';

export default defineRoute({
	handler: {
		GET: ({ url }) => {
			const newUrl = url;
			newUrl.pathname = '/about/';
			return Response.redirect(newUrl, 303);
		},
	},
});

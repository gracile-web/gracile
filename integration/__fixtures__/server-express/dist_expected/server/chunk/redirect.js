import { defineRoute } from '@gracile/gracile/route';

const redirect = defineRoute({
  handler: {
    GET: ({ url }) => {
      const newUrl = url;
      newUrl.pathname = "/about/";
      return Response.redirect(newUrl, 303);
    }
  }
});

export { redirect as default };

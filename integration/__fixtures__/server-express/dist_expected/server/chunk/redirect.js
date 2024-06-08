import { d as defineRoute } from './route.js';

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
//# sourceMappingURL=redirect.js.map

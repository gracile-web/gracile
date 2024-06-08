import { d as defineRoute } from './route.js';

const ____path_ = defineRoute({
  handler: {
    GET: ({ url }) => {
      return Response.json({ get: "ok" });
    },
    POST: ({ url }) => {
      return Response.json({ post: "ok" });
    },
    PUT: ({ url }) => {
      return Response.json({ put: "ok" });
    }
  }
});

export { ____path_ as default };
//# sourceMappingURL=_...path_.js.map

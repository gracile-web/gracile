import { defineRoute } from '@gracile/gracile/route';

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

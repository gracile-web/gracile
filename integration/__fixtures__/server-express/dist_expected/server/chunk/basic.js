import { DEV } from 'esm-env';
import { defineRoute, Route } from '@gracile/gracile/route';

const basic = defineRoute({
  handler: {
    GET: async ({ url, request, locals }) => {
      return Response.json(
        {
          url,
          param1: url.searchParams.get("foo"),
          [Route.RequestMethod.GET]: "ok",
          // TODO: When middleware are implemented, mock this properly
          locals: { requestIdLength: DEV ? 36 : locals.requestId?.length }
        },
        { status: 200, statusText: "DONE", headers: { bar: "baz" } }
      );
    },
    POST: async ({ url, request, locals }) => {
      if (url.searchParams.get("form") === "true") {
        const data = await request.formData();
        return Response.json({
          formData: { bar: data.get("bar"), doz: data.get("doz") }
        });
      }
      return Response.json(
        {
          url,
          param1: url.searchParams.get("foo"),
          [Route.RequestMethod.POST]: "ok",
          body: await request.json(),
          locals: { requestIdLength: DEV ? 36 : locals.requestId?.length }
        },
        { status: 200, statusText: "DONE", headers: { bar: "baz" } }
      );
    },
    PUT: async ({ url, request, locals }) => {
      return Response.json(
        {
          url,
          param1: url.searchParams.get("foo"),
          [Route.RequestMethod.PUT]: "ok",
          body: await request.json(),
          locals: { requestIdLength: DEV ? 36 : locals.requestId?.length }
        },
        { status: 200, statusText: "DONE", headers: { bar: "baz" } }
      );
    },
    QUERY: async ({ url, request, locals }) => {
      return Response.json(
        {
          url,
          param1: url.searchParams.get("foo"),
          [Route.RequestMethod.QUERY]: "ok",
          body: await request.json(),
          locals: { requestIdLength: DEV ? 36 : locals.requestId?.length }
        },
        { status: 200, statusText: "DONE", headers: { bar: "baz" } }
      );
    },
    DELETE: async ({ url, request, locals }) => {
      return Response.json(
        {
          url,
          param1: url.searchParams.get("foo"),
          [Route.RequestMethod.DELETE]: "ok",
          locals: { requestIdLength: DEV ? 36 : locals.requestId?.length }
        },
        { status: 200, statusText: "DONE", headers: { bar: "baz" } }
      );
    },
    PATCH: async ({ url, request, locals }) => {
      return Response.json(
        {
          url,
          param1: url.searchParams.get("foo"),
          [Route.RequestMethod.PATCH]: "ok",
          body: await request.json(),
          locals: { requestIdLength: DEV ? 36 : locals.requestId?.length }
        },
        { status: 200, statusText: "DONE", headers: { bar: "baz" } }
      );
    }
  }
});

export { basic as default };

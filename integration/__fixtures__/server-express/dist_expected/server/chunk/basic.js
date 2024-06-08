import { d as defineRoute } from './route.js';
import { R as RequestMethod } from '../server.js';
import 'node:stream';
import 'tty';
import '@lit-labs/ssr';
import '@lit-labs/ssr/lib/render-result.js';
import 'stream';
import 'fs';
import 'url';
import 'http';
import 'util';
import 'https';
import 'zlib';
import 'buffer';
import 'crypto';
import 'querystring';
import 'stream/web';
import 'express';
import 'path';

const basic = defineRoute({
  locals: (locals) => ({ ...locals }),
  handler: {
    GET: async ({ url, request, locals }) => {
      console.log({ locals });
      return Response.json(
        {
          url,
          param1: url.searchParams.get("foo"),
          [RequestMethod.GET]: "ok",
          locals: { traceId: locals.traceId.length }
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
          [RequestMethod.POST]: "ok",
          body: await request.json(),
          locals: { traceId: locals.traceId.length }
        },
        { status: 200, statusText: "DONE", headers: { bar: "baz" } }
      );
    },
    PUT: async ({ url, request, locals }) => {
      return Response.json(
        {
          url,
          param1: url.searchParams.get("foo"),
          [RequestMethod.PUT]: "ok",
          body: await request.json(),
          locals: { traceId: locals.traceId.length }
        },
        { status: 200, statusText: "DONE", headers: { bar: "baz" } }
      );
    },
    QUERY: async ({ url, request, locals }) => {
      return Response.json(
        {
          url,
          param1: url.searchParams.get("foo"),
          [RequestMethod.QUERY]: "ok",
          body: await request.json(),
          locals: { traceId: locals.traceId.length }
        },
        { status: 200, statusText: "DONE", headers: { bar: "baz" } }
      );
    },
    DELETE: async ({ url, request, locals }) => {
      return Response.json(
        {
          url,
          param1: url.searchParams.get("foo"),
          [RequestMethod.DELETE]: "ok",
          locals: { traceId: locals.traceId.length }
        },
        { status: 200, statusText: "DONE", headers: { bar: "baz" } }
      );
    },
    PATCH: async ({ url, request, locals }) => {
      return Response.json(
        {
          url,
          param1: url.searchParams.get("foo"),
          [RequestMethod.PATCH]: "ok",
          body: await request.json(),
          locals: { traceId: locals.traceId.length }
        },
        { status: 200, statusText: "DONE", headers: { bar: "baz" } }
      );
    }
    // HEAD: async ({ url, request }) => {
    // 	return new Response(null);
    // },
    // OPTIONS: async ({ url, request }) => {
    // 	return Response.json({url, [Route.RequestMethod.OPTIONS]: 'ok', body: await request.json() });
    // },
  }
});

export { basic as default };
//# sourceMappingURL=basic.js.map

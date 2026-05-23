# Routes and documents



API references extracted from the Gracile code base.  
Examples, functions, classes, constants, type declarations…
## Function: html()

```ts
function html(strings, ...values): ServerRenderedTemplate;
```

Defined in: node\_modules/.pnpm/@lit-labs+ssr@4.0.0\_@types+node@25.3.3/node\_modules/@lit-labs/ssr/lib/server-template.d.ts:35

A lit-html template that can only be rendered on the server, and cannot be
hydrated.

These templates can be used for rendering full documents, including the
doctype, and rendering into elements that Lit normally cannot, like
`<title>`, `<textarea>`, `<template>`, and non-executing `<script>` tags
like `<script type="text/json">`. They are also slightly more efficient than
normal Lit templates, because the generated HTML doesn't need to include
markers for updating.

Server-only `html` templates can be composed, and combined, and they support
almost all features that normal Lit templates do, with the exception of
features that don't have a pure HTML representation, like event handlers or
property bindings.

Server-only `html` templates can only be rendered on the server, they will
throw an Error if created in the browser. However if you render a normal Lit
template inside a server-only template, then it can be hydrated and updated.
Likewise, if you place a custom element inside a server-only template, it can
be hydrated and update like normal.

A server-only template can't be rendered inside a normal Lit template.

**Parameters**

<div class="typedoc-table"><table>
<thead>
<tr>
<th>Parameter</th>
<th>Type</th>
</tr>
</thead>
<tbody>
<tr>
<td>

`strings`

</td>
<td>

`TemplateStringsArray`

</td>
</tr>
<tr>
<td>

...`values`

</td>
<td>

`unknown`[]

</td>
</tr>
</tbody>
</table></div>

**Returns**

`ServerRenderedTemplate`

## Function: defineRoute()

```ts
function defineRoute<GetHandlerData, PostHandlerData, CatchAllHandlerData, StaticPathOptions, RouteContext>(options): DefinedRoute;
```

Defined in: packages/server/dist/route.d.ts:33

**Defines a file-based route** for Gracile to consume.

**Important: Property order matters for type inference.**
`handler` (or `staticPaths`) must be declared **before** `document` and
`template` in the options object. TypeScript resolves generic type
parameters from object properties in declaration order — the handler's
return type feeds into `RouteContext.props`, which is then used to type
the `context` parameter of `document` and `template`.
If `document`/`template` appear first, `props` will be inferred as
`undefined`.

**Type parameters**

<div class="typedoc-table"><table>
<thead>
<tr>
<th>Type Parameter</th>
<th>Default type</th>
</tr>
</thead>
<tbody>
<tr>
<td>

`GetHandlerData` *extends* `HandlerDataHtml`

</td>
<td>

`undefined`

</td>
</tr>
<tr>
<td>

`PostHandlerData` *extends* `HandlerDataHtml`

</td>
<td>

`undefined`

</td>
</tr>
<tr>
<td>

`CatchAllHandlerData` *extends* `HandlerDataHtml`

</td>
<td>

`undefined`

</td>
</tr>
<tr>
<td>

`StaticPathOptions` *extends* `StaticPathOptionsGeneric` \| `undefined`

</td>
<td>

`undefined`

</td>
</tr>
<tr>
<td>

`RouteContext` *extends* `RouteContextGeneric`

</td>
<td>

`object`

</td>
</tr>
</tbody>
</table></div>

**Parameters**

<div class="typedoc-table"><table>
<thead>
<tr>
<th>Parameter</th>
<th>Type</th>
<th>Description</th>
</tr>
</thead>
<tbody>
<tr>
<td>

`options`

</td>
<td>

\{ `document?`: `DocumentTemplate`\<`RouteContext`\>; `handler?`: `StaticPathOptions` *extends* `object` ? `never` : \| `Handler`\<`CatchAllHandlerData`\> \| \{ `DELETE?`: `Handler`\<`Response`\>; `GET?`: `Handler`\<`GetHandlerData`\>; `HEAD?`: `Handler`\<`Response`\>; `OPTIONS?`: `Handler`\<`Response`\>; `PATCH?`: `Handler`\<`Response`\>; `POST?`: `Handler`\<`PostHandlerData`\>; `PUT?`: `Handler`\<`Response`\>; `QUERY?`: `Handler`\<`Response`\>; \} \| `undefined`; `prerender?`: `boolean`; `staticPaths?`: () => `MaybePromise`\<`StaticPathOptions`[]\> \| `undefined`; `template?`: `BodyTemplate`\<`RouteContext`\>; \}

</td>
<td>

Options to populate the current route module.

</td>
</tr>
<tr>
<td>

`options.document?`

</td>
<td>

`DocumentTemplate`\<`RouteContext`\>

</td>
<td>

A function that returns a server only template.
Route context is provided at runtime during the build.

Receives the same `RouteContext` as `template` — including typed
`props` from `handler`. Declare `handler` **above** this property.

**See** [documentation](/docs/learn/usage/defining-routes/#doc_document)

</td>
</tr>
<tr>
<td>

`options.handler?`

</td>
<td>

`StaticPathOptions` *extends* `object` ? `never` : \| `Handler`\<`CatchAllHandlerData`\> \| \{ `DELETE?`: `Handler`\<`Response`\>; `GET?`: `Handler`\<`GetHandlerData`\>; `HEAD?`: `Handler`\<`Response`\>; `OPTIONS?`: `Handler`\<`Response`\>; `PATCH?`: `Handler`\<`Response`\>; `POST?`: `Handler`\<`PostHandlerData`\>; `PUT?`: `Handler`\<`Response`\>; `QUERY?`: `Handler`\<`Response`\>; \} \| `undefined`

</td>
<td>

A function or an object containing functions named after HTTP methods.
A handler can return either a standard `Response` that will terminate the
request pipeline, or any object to populate the current route template
and document contexts.

**Must be declared before `document` and `template`** so TypeScript can
infer `RouteContext.props` from the handler's return type.

**See** [documentation](/docs/learn/usage/defining-routes/#doc_handler)

</td>
</tr>
<tr>
<td>

`options.prerender?`

</td>
<td>

`boolean`

</td>
<td>

A switch to produce an HTML file as it was built with the `static` mode,
in the `dist/client` build directory.

Only available in `static` output mode.

**See** [documentation](/docs/learn/usage/defining-routes/#doc_prerender)

</td>
</tr>
<tr>
<td>

`options.staticPaths?`

</td>
<td>

() => `MaybePromise`\<`StaticPathOptions`[]\> \| `undefined`

</td>
<td>

A function that returns an array of route definition object.
Only available in `static` output mode.

**See** [documentation](/docs/learn/usage/defining-routes/#doc_staticpaths)

</td>
</tr>
<tr>
<td>

`options.template?`

</td>
<td>

`BodyTemplate`\<`RouteContext`\>

</td>
<td>

A function that returns a server only or a Lit client hydratable template.
Route context is provided at runtime during the build.

Receives the same `RouteContext` as `document` — including typed
`props` from `handler`. Declare `handler` **above** this property.

**See** [documentation](/docs/learn/usage/defining-routes/#doc_template)

</td>
</tr>
</tbody>
</table></div>

**Returns**

`DefinedRoute`

**Example**

```ts
// ✅ Correct — handler first
defineRoute({
  handler: { GET: async (ctx) => ({ id: 1 }) },
  document: (ctx) => html`…${ctx.props.GET.id}…`,
  template: (ctx) => html`…${ctx.props.GET.id}…`,
});

// ❌ Broken — document before handler, props is undefined
defineRoute({
  document: (ctx) => html`…`,
  handler: { GET: async (ctx) => ({ id: 1 }) },
  template: (ctx) => html`…${ctx.props.GET.id}…`, // TS error!
});
```

**See** full guide in the [documentation](/docs/learn/usage/defining-routes/).


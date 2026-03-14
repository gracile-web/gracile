# Routes and documents

API references extracted from the Gracile code base.  
Examples, functions, classes, constants, type declarations…

## Function: html()

```ts
function html(strings, ...values): ServerRenderedTemplate;
```

Defined in:
node_modules/.pnpm/@lit-labs+ssr@4.0.0_@types+node@25.3.3/node_modules/@lit-labs/ssr/lib/server-template.d.ts:35

A lit-html template that can only be rendered on the server, and cannot be
hydrated.

These templates can be used for rendering full documents, including the doctype,
and rendering into elements that Lit normally cannot, like `<title>`,
`<textarea>`, `<template>`, and non-executing `<script>` tags like
`<script type="text/json">`. They are also slightly more efficient than normal
Lit templates, because the generated HTML doesn't need to include markers for
updating.

Server-only `html` templates can be composed, and combined, and they support
almost all features that normal Lit templates do, with the exception of features
that don't have a pure HTML representation, like event handlers or property
bindings.

Server-only `html` templates can only be rendered on the server, they will throw
an Error if created in the browser. However if you render a normal Lit template
inside a server-only template, then it can be hydrated and updated. Likewise, if
you place a custom element inside a server-only template, it can be hydrated and
update like normal.

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
function defineRoute<
  GetHandlerData,
  PostHandlerData,
  CatchAllHandlerData,
  StaticPathOptions,
  RouteContext,
>(options): (RouteModule) => RouteModule;
```

Defined in: packages/server/dist/route.d.ts:7

**Defines a file-based route** for Gracile to consume.

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

`GetHandlerData` _extends_ `HandlerDataHtml`

</td>
<td>

`undefined`

</td>
</tr>
<tr>
<td>

`PostHandlerData` _extends_ `HandlerDataHtml`

</td>
<td>

`undefined`

</td>
</tr>
<tr>
<td>

`CatchAllHandlerData` _extends_ `HandlerDataHtml`

</td>
<td>

`undefined`

</td>
</tr>
<tr>
<td>

`StaticPathOptions` _extends_ `StaticPathOptionsGeneric` \| `undefined`

</td>
<td>

`undefined`

</td>
</tr>
<tr>
<td>

`RouteContext` _extends_ `RouteContextGeneric`

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

\{ `document?`: `DocumentTemplate`\<`RouteContext`\>; `handler?`:
`StaticPathOptions` _extends_ `object` ? `never` : \|
`Handler`\<`CatchAllHandlerData`\> \| \{ `DELETE?`: `Handler`\<`Response`\>;
`GET?`: `Handler`\<`GetHandlerData`\>; `HEAD?`: `Handler`\<`Response`\>;
`OPTIONS?`: `Handler`\<`Response`\>; `PATCH?`: `Handler`\<`Response`\>; `POST?`:
`Handler`\<`PostHandlerData`\>; `PUT?`: `Handler`\<`Response`\>; `QUERY?`:
`Handler`\<`Response`\>; \} \| `undefined`; `prerender?`: `boolean`;
`staticPaths?`: () => `MaybePromise`\<`StaticPathOptions`[]\> \| `undefined`;
`template?`: `BodyTemplate`\<`RouteContext`\>; \}

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

A function that returns a server only template. Route context is provided at
runtime during the build.

**See** [documentation](/docs/learn/usage/defining-routes/#doc_document)

</td>
</tr>
<tr>
<td>

`options.handler?`

</td>
<td>

`StaticPathOptions` _extends_ `object` ? `never` : \|
`Handler`\<`CatchAllHandlerData`\> \| \{ `DELETE?`: `Handler`\<`Response`\>;
`GET?`: `Handler`\<`GetHandlerData`\>; `HEAD?`: `Handler`\<`Response`\>;
`OPTIONS?`: `Handler`\<`Response`\>; `PATCH?`: `Handler`\<`Response`\>; `POST?`:
`Handler`\<`PostHandlerData`\>; `PUT?`: `Handler`\<`Response`\>; `QUERY?`:
`Handler`\<`Response`\>; \} \| `undefined`

</td>
<td>

A function or an object containing functions named after HTTP methods. A handler
can return either a standard `Response` that will terminate the request
pipeline, or any object to populate the current route template and document
contexts.

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

A switch to produce an HTML file as it was built with the `static` mode, in the
`dist/client` build directory.

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

A function that returns an array of route definition object. Only available in
`static` output mode.

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

A function that returns a server only or a Lit client hydratable template. Route
context is provided at runtime during the build.

**See** [documentation](/docs/learn/usage/defining-routes/#doc_template)

</td>
</tr>
</tbody>
</table></div>

**Returns**

```ts
(RouteModule): RouteModule;
```

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

`RouteModule`

</td>
<td>

_typeof_ `RouteModule`

</td>
</tr>
</tbody>
</table></div>

**Returns**

`RouteModule`

**See** full guide in the [documentation](/docs/learn/usage/defining-routes/).

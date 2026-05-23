# Gracile/Vite configuration



API references extracted from the Gracile code base.  
Examples, functions, classes, constants, type declarations…
## Interface: GracileConfig

Defined in: packages/engine/dist/user-config.d.ts:72

**Example**

`/vite.config.js`
```js
import { gracile } from '@gracile/gracile/plugin';
import { defineConfig } from 'vite';

export default defineConfig({
	plugins: [
		gracile({
			output: 'server',

			dev: {
				locals: (_context) => {
					return {
						requestId: crypto.randomUUID(),
						userEmail: 'admin@admin.home.arpa',
					};
				},
			},

			routes: {
				exclude: ['**/a-defective-route.ts'],
			},
		}),
	],
});
```

**Properties**

<div class="typedoc-table"><table>
<thead>
<tr>
<th>Property</th>
<th>Type</th>
<th>Default value</th>
<th>Description</th>
<th>Defined in</th>
</tr>
</thead>
<tbody>
<tr>
<td>

<a id="property-dev"></a> `dev?`

</td>
<td>

`object`

</td>
<td>

`undefined`

</td>
<td>

Settings for the development mode.

</td>
<td>

packages/engine/dist/user-config.d.ts:125

</td>
</tr>
<tr>
<td>

`dev.locals?`

</td>
<td>

(`context`) => `unknown`

</td>
<td>

`undefined`

</td>
<td>

Get incoming request context and apply locals for the Gracile request handler.
Useful for mocking the production server.

For `server` mode only.

Not needed when using `server.entry` — the user's own middleware
provides locals directly.

</td>
<td>

packages/engine/dist/user-config.d.ts:135

</td>
</tr>
<tr>
<td>

<a id="property-experimental"></a> `experimental?`

</td>
<td>

`object`

</td>
<td>

`undefined`

</td>
<td>

Future, unstable features flags.

</td>
<td>

packages/engine/dist/user-config.d.ts:242

</td>
</tr>
<tr>
<td>

`experimental.generateRoutesTypings?`

</td>
<td>

`boolean`

</td>
<td>

`undefined`

</td>
<td>

**`Experimental`**

Automatically typed route paths.

</td>
<td>

packages/engine/dist/user-config.d.ts:247

</td>
</tr>
<tr>
<td>

<a id="property-litssr"></a> `litSsr?`

</td>
<td>

`object`

</td>
<td>

`undefined`

</td>
<td>

&hyphen;

</td>
<td>

packages/engine/dist/user-config.d.ts:205

</td>
</tr>
<tr>
<td>

`litSsr.renderInfo?`

</td>
<td>

`Partial`\<`RenderInfo`\>

</td>
<td>

`undefined`

</td>
<td>

Lets you extend Gracile's SSR pipeline with
custom Lit SSR `ElementRenderer` subclasses. This is the foundation for
features like [Islands](/docs/add-ons/islands/), which register a renderer
for the `<is-land>` custom element to server-render components from other
UI frameworks.

In most cases, you do **not** set this option manually — add-on plugins
(like `gracileIslands()`) register their renderers automatically via the
plugin context communication channel. However,
you can use it directly for advanced use cases:

```ts
import { gracile } from '@gracile/gracile/plugin';
import { defineConfig } from 'vite';

export default defineConfig({
  plugins: [
    gracile({
      litSsr: {
        renderInfo: {
          elementRenderers: [
            // Your custom ElementRenderer subclass
          ],
        },
      },
    }),
  ],
});
```

</td>
<td>

packages/engine/dist/user-config.d.ts:237

</td>
</tr>
<tr>
<td>

<a id="property-output"></a> `output?`

</td>
<td>

`"static"` \| `"server"`

</td>
<td>

```ts
'static'
```

</td>
<td>

The target output for the build phase.

See the [documentation](/docs/learn/usage/output-modes/).

</td>
<td>

packages/engine/dist/user-config.d.ts:80

</td>
</tr>
<tr>
<td>

<a id="property-pages"></a> `pages?`

</td>
<td>

`object`

</td>
<td>

`undefined`

</td>
<td>

Settings for pages in `/src/routes`.

</td>
<td>

packages/engine/dist/user-config.d.ts:175

</td>
</tr>
<tr>
<td>

`pages.premises?`

</td>
<td>

`object`

</td>
<td>

`undefined`

</td>
<td>

Premises are the document and the properties necessary for page template
rendering.

You can access them via:

- `.../_my-route/__index.props.json`
- `.../_my-route/__index.doc.html`

They are accessible with the dev/server handler and are outputted as
static files for the static output or for server pre-rendered pages.

They can be use for implementing client-side routing.

</td>
<td>

packages/engine/dist/user-config.d.ts:190

</td>
</tr>
<tr>
<td>

`pages.premises.exclude?`

</td>
<td>

`string`[]

</td>
<td>

`undefined`

</td>
<td>

Exclude routes with a glob filter array.

</td>
<td>

packages/engine/dist/user-config.d.ts:202

</td>
</tr>
<tr>
<td>

`pages.premises.expose?`

</td>
<td>

`boolean`

</td>
<td>

```ts
false
```

</td>
<td>

&hyphen;

</td>
<td>

packages/engine/dist/user-config.d.ts:194

</td>
</tr>
<tr>
<td>

`pages.premises.include?`

</td>
<td>

`string`[]

</td>
<td>

`undefined`

</td>
<td>

Include routes with a glob filter array.

</td>
<td>

packages/engine/dist/user-config.d.ts:198

</td>
</tr>
<tr>
<td>

<a id="property-routes"></a> `routes?`

</td>
<td>

`object`

</td>
<td>

`undefined`

</td>
<td>

Settings for routes in `/src/routes`.

</td>
<td>

packages/engine/dist/user-config.d.ts:142

</td>
</tr>
<tr>
<td>

`routes.define?`

</td>
<td>

() => `MaybePromise`\<`ProgrammaticRoute`[]\>

</td>
<td>

`undefined`

</td>
<td>

Define programmatic routes alongside file-based routes.

The returned route definitions are merged with the file-based routes
found in `src/routes/`. If a programmatic route's pattern conflicts
with a file-based route, the programmatic route takes priority.

The async function signature allows fetching route definitions from
a CMS, reading an OpenAPI spec, or any other async source.

**Example**

```ts
gracile({
  routes: {
    define: async () => [
      { pattern: '/api/posts', filePath: 'src/api/posts.ts' },
      { pattern: '/blog/:slug', filePath: 'src/blog/post.ts' },
      { pattern: '/docs/:path*', filePath: 'src/docs/catchall.ts' },
    ],
  },
});
```

</td>
<td>

packages/engine/dist/user-config.d.ts:170

</td>
</tr>
<tr>
<td>

`routes.exclude?`

</td>
<td>

`string`[]

</td>
<td>

`undefined`

</td>
<td>

Exclude routes with an array of patterns. Useful for debugging.

</td>
<td>

packages/engine/dist/user-config.d.ts:146

</td>
</tr>
<tr>
<td>

<a id="property-server"></a> `server?`

</td>
<td>

`object`

</td>
<td>

`undefined`

</td>
<td>

Settings for server mode.

Only meaningful when `output` is `'server'`.

</td>
<td>

packages/engine/dist/user-config.d.ts:99

</td>
</tr>
<tr>
<td>

`server.entry?`

</td>
<td>

`string`

</td>
<td>

`undefined`

</td>
<td>

Path to the user's server entry file (e.g. `'./server.ts'`).

When set, Gracile will:
- **Dev**: load the file via the Vite SSR environment and bridge it
  into the dev server as middleware (Vite keeps the HTTP listener).
- **Build**: use it as the SSR build input so the entire server is
  bundled into `dist/server/`.

The entry file should `import { handler } from 'gracile:handler'`
and export a default app (Hono/Express) instance.

**Example**

```ts
gracile({
  output: 'server',
  server: { entry: './server.ts' },
})
```

</td>
<td>

packages/engine/dist/user-config.d.ts:120

</td>
</tr>
<tr>
<td>

<a id="property-trailingslash"></a> `trailingSlash?`

</td>
<td>

`"always"` \| `"never"` \| `"ignore"`

</td>
<td>

```ts
'ignore'
```

</td>
<td>

Controls how trailing slashes are matched on incoming URLs.

- `'ignore'` — Match regardless of whether a trailing `/` is present.
  `/about` and `/about/` both resolve to the same route. *(default)*
- `'always'` — Only match URLs that include a trailing slash (e.g. `/about/`).
  Requests without one are redirected: `301` for GET, `308` for other methods.
- `'never'` — Only match URLs that do not include a trailing slash (e.g. `/about`).
  Requests with one are redirected: `301` for GET, `308` for other methods.

</td>
<td>

packages/engine/dist/user-config.d.ts:93

</td>
</tr>
</tbody>
</table></div>


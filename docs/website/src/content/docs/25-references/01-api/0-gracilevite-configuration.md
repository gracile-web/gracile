# Gracile/Vite configuration

API references extracted from the Gracile code base.  
Examples, functions, classes, constants, type declarations…

## Interface: GracileConfig

Defined in: packages/engine/dist/user-config.d.ts:32

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

packages/engine/dist/user-config.d.ts:57

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

</td>
<td>

packages/engine/dist/user-config.d.ts:64

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

packages/engine/dist/user-config.d.ts:147

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

packages/engine/dist/user-config.d.ts:152

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

packages/engine/dist/user-config.d.ts:110

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

Lets you extend Gracile's SSR pipeline with custom Lit SSR `ElementRenderer`
subclasses. This is the foundation for features like
[Islands](/docs/add-ons/islands/), which register a renderer for the `<is-land>`
custom element to server-render components from other UI frameworks.

In most cases, you do **not** set this option manually — add-on plugins (like
`gracileIslands()`) register their renderers automatically via the plugin
context communication channel. However, you can use it directly for advanced use
cases:

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

packages/engine/dist/user-config.d.ts:142

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
'static';
```

</td>
<td>

The target output for the build phase.

See the [documentation](/docs/learn/usage/output-modes/).

</td>
<td>

packages/engine/dist/user-config.d.ts:40

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

packages/engine/dist/user-config.d.ts:80

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

They are accessible with the dev/server handler and are outputted as static
files for the static output or for server pre-rendered pages.

They can be use for implementing client-side routing.

</td>
<td>

packages/engine/dist/user-config.d.ts:95

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

packages/engine/dist/user-config.d.ts:107

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
false;
```

</td>
<td>

&hyphen;

</td>
<td>

packages/engine/dist/user-config.d.ts:99

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

packages/engine/dist/user-config.d.ts:103

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

packages/engine/dist/user-config.d.ts:71

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

packages/engine/dist/user-config.d.ts:75

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
'ignore';
```

</td>
<td>

Controls how trailing slashes are matched on incoming URLs.

- `'ignore'` — Match regardless of whether a trailing `/` is present. `/about`
  and `/about/` both resolve to the same route. _(default)_
- `'always'` — Only match URLs that include a trailing slash (e.g. `/about/`).
  Requests without one are redirected: `301` for GET, `308` for other methods.
- `'never'` — Only match URLs that do not include a trailing slash (e.g.
  `/about`). Requests with one are redirected: `301` for GET, `308` for other
  methods.

</td>
<td>

packages/engine/dist/user-config.d.ts:53

</td>
</tr>
</tbody>
</table></div>

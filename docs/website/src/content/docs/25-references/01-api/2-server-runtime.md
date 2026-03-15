# Server runtime

API references extracted from the Gracile code base.  
Examples, functions, classes, constants, type declarations…

## Function: nodeAdapter()

```ts
function nodeAdapter(handler, options?): GracileNodeHandler;
```

Defined in: packages/engine/dist/server/adapters/node.d.ts:24

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

`handler`

</td>
<td>

[`GracileHandler`](#doc_gracilegraciletype-alias-gracilehandler)

</td>
<td>

Takes a pre-built Gracile handler from `./dist/server/entrypoint.js`.

</td>
</tr>
<tr>
<td>

`options?`

</td>
<td>

`NodeAdapterOptions`

</td>
<td>

&hyphen;

</td>
</tr>
</tbody>
</table></div>

**Returns**

[`GracileNodeHandler`](#doc_gracilegraciletype-alias-gracilenodehandler)

**Example**

`/src/server.js`

```js
import express from 'express';

import * as gracile from '@gracile/gracile/node';

import { handler } from './dist/server/entrypoint.js';

const app = express();

app.use(gracile.nodeAdapter(handler));

const server = app.listen();
```

## Function: getClientBuildPath()

```ts
function getClientBuildPath(root): string;
```

Defined in: packages/engine/dist/server/adapters/hono.d.ts:46

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

`root`

</td>
<td>

`string`

</td>
<td>

resolve `dist/client` from this file path.

</td>
</tr>
</tbody>
</table></div>

**Returns**

`string`

**Example**

`/src/server.js`

```js
import * as gracile from '@gracile/gracile/node';
import { Hono } from 'hono';
import { serveStatic } from '@hono/node-server/serve-static';

const app = new Hono();

app.get(
  '*',
  serveStatic({ root: gracile.getClientBuildPath(import.meta.url) }),
);
```

## Function: printUrls()

```ts
function printUrls(server): void;
```

Defined in: packages/engine/dist/server/utilities.d.ts:20

Pretty print your server instance address as soon as it is listening. Matches
the dev. server CLI output style.

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

`server`

</td>
<td>

`string` \| `AddressInfo` \| `null`

</td>
<td>

Takes an `node:net` `AddressInfo` like object (address, family, port) or just a
provided, pre-constructed string.

</td>
</tr>
</tbody>
</table></div>

**Returns**

`void`

**Example**

```js
import * as gracile from '@gracile/gracile/hono';
import { serve } from '@hono/node-server';

// ...

serve({ fetch: app.fetch, port: 3030, hostname: 'localhost' }, (address) =>
  gracile.printUrls(address),
);
```

## Variable: server

```ts
const server: Readonly<{
  CLIENT_DIST_DIR: './dist/client';
  IP_EXPOSED: '0.0.0.0';
  IP_LOCALHOST: '127.0.0.1';
  LOCALHOST: 'localhost';
  PUBLIC_DIR: 'public';
  RANDOM_PORT: 0;
}>;
```

Defined in: packages/engine/dist/server/constants.d.ts:19

Server **constants**. Useful for setting up your HTTP framework options.

**Example**

`/src/server.js`

```js
import * as gracile from '@gracile/gracile/hono';
import { serve } from '@hono/node-server';

// ...

serve({ fetch: app.fetch, port: 3030, hostname: gracile.server.LOCALHOST });
```

## Variable: nodeCondition

```ts
const nodeCondition: Readonly<{
  BROWSER: boolean;
  DEV: boolean;
  PREVIEW: boolean;
  TEST: boolean;
}>;
```

Defined in: packages/internal/utils/dist/node-condition/production-ssr.d.ts:16

Resolve environment from Node export conditions.

**Example**

```ts twoslash
// @filename: /src/lib/my-lib.ts

import { nodeCondition } from '@gracile/gracile/node-condition';

if (nodeCondition.BROWSER) {
  // NOTE: Do stuff…
}
```

## Type Alias: GracileHandler()

```ts
type GracileHandler = (request, locals?) => Promise<HandlerResult>;
```

Defined in: packages/engine/dist/server/request.d.ts:11

The underlying handler interface that you can use to build your own adapter.

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

`request`

</td>
<td>

`Request`

</td>
</tr>
<tr>
<td>

`locals?`

</td>
<td>

`unknown`

</td>
</tr>
</tbody>
</table></div>

**Returns**

`Promise`\<`HandlerResult`\>

## Type Alias: GracileNodeHandler()

```ts
type GracileNodeHandler = (
  request,
  response,
  locals?,
) => Promise<ServerResponse<IncomingMessage> | null | void>;
```

Defined in: packages/engine/dist/server/adapters/node.d.ts:3

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

`request`

</td>
<td>

`IncomingMessage`

</td>
</tr>
<tr>
<td>

`response`

</td>
<td>

`ServerResponse`

</td>
</tr>
<tr>
<td>

`locals?`

</td>
<td>

`unknown`

</td>
</tr>
</tbody>
</table></div>

**Returns**

`Promise`\<`ServerResponse`\<`IncomingMessage`\> \| `null` \| `void`\>

## Type Alias: GracileHonoHandler()

```ts
type GracileHonoHandler = (context) => Promise<Response>;
```

Defined in: packages/engine/dist/server/adapters/hono.d.ts:2

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

`context`

</td>
<td>

\{ `req`: \{ `raw`: `Request`; \}; `var`: `unknown`; \}

</td>
</tr>
<tr>
<td>

`context.req`

</td>
<td>

\{ `raw`: `Request`; \}

</td>
</tr>
<tr>
<td>

`context.req.raw`

</td>
<td>

`Request`

</td>
</tr>
<tr>
<td>

`context.var`

</td>
<td>

`unknown`

</td>
</tr>
</tbody>
</table></div>

**Returns**

`Promise`\<`Response`\>

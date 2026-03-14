# Server runtime

API references extracted from the Gracile code base.  
Examples, functions, classes, constants, type declarations…

## Function: nodeAdapter()

```ts
function nodeAdapter(handler, options?): GracileNodeHandler;
```

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

`options`?

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

**Defined in**

packages/engine/dist/server/adapters/node.d.ts:24

## Function: honoAdapter()

```ts
function honoAdapter(handler, options?): GracileHonoHandler;
```

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

`options`?

</td>
<td>

`HonoAdapterOptions`

</td>
<td>

If you need more control.

</td>
</tr>
</tbody>
</table></div>

**Returns**

[`GracileHonoHandler`](#doc_gracilegraciletype-alias-gracilehonohandler)

**Example**

`/src/server.js`

```js
import { Hono } from 'hono';
import { serve } from '@hono/node-server';

import * as gracile from '@gracile/gracile/hono';

import { handler } from './dist/server/entrypoint.js';

const app = new Hono();

app.use(gracile.honoAdapter(handler));

serve(app);
```

**Defined in**

packages/engine/dist/server/adapters/hono.d.ts:30

## Function: getClientBuildPath()

```ts
function getClientBuildPath(root): string;
```

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

**Defined in**

packages/engine/dist/server/adapters/hono.d.ts:46

## Function: printUrls()

```ts
function printUrls(server): void;
```

Pretty print your server instance address as soon as it is listening.
Matches the dev. server CLI output style.

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

`null` \| `string` \| `AddressInfo`

</td>
<td>

Takes an `node:net` `AddressInfo` like object (address, family, port) or just a provided, pre-constructed string.

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

**Defined in**

packages/engine/dist/server/utils.d.ts:20

## Variable: server

```ts
const server: Readonly<object>;
```

Server **constants**.
Useful for setting up your HTTP framework options.

**Type declaration**

<div class="typedoc-table"><table>
<thead>
<tr>
<th>Name</th>
<th>Type</th>
<th>Defined in</th>
</tr>
</thead>
<tbody>
<tr>
<td>

`CLIENT_DIST_DIR`

</td>
<td>

`"./dist/client"`

</td>
<td>

packages/engine/dist/server/constants.d.ts:25

</td>
</tr>
<tr>
<td>

`IP_EXPOSED`

</td>
<td>

`"0.0.0.0"`

</td>
<td>

packages/engine/dist/server/constants.d.ts:22

</td>
</tr>
<tr>
<td>

`IP_LOCALHOST`

</td>
<td>

`"127.0.0.1"`

</td>
<td>

packages/engine/dist/server/constants.d.ts:21

</td>
</tr>
<tr>
<td>

`LOCALHOST`

</td>
<td>

`"localhost"`

</td>
<td>

packages/engine/dist/server/constants.d.ts:20

</td>
</tr>
<tr>
<td>

`PUBLIC_DIR`

</td>
<td>

`"public"`

</td>
<td>

packages/engine/dist/server/constants.d.ts:24

</td>
</tr>
<tr>
<td>

`RANDOM_PORT`

</td>
<td>

`0`

</td>
<td>

packages/engine/dist/server/constants.d.ts:23

</td>
</tr>
</tbody>
</table></div>

**Example**

`/src/server.js`

```js
import * as gracile from '@gracile/gracile/hono';
import { serve } from '@hono/node-server';

// ...

serve({ fetch: app.fetch, port: 3030, hostname: gracile.server.LOCALHOST });
```

**Defined in**

packages/engine/dist/server/constants.d.ts:19

## Variable: nodeCondition

```ts
const nodeCondition: Readonly<object>;
```

Resolve environment from Node export conditions.

**Type declaration**

<div class="typedoc-table"><table>
<thead>
<tr>
<th>Name</th>
<th>Type</th>
<th>Defined in</th>
</tr>
</thead>
<tbody>
<tr>
<td>

`BROWSER`

</td>
<td>

`boolean`

</td>
<td>

packages/internal/utils/dist/node-condition/production-ssr.d.ts:17

</td>
</tr>
<tr>
<td>

`DEV`

</td>
<td>

`boolean`

</td>
<td>

packages/internal/utils/dist/node-condition/production-ssr.d.ts:18

</td>
</tr>
<tr>
<td>

`PREVIEW`

</td>
<td>

`boolean`

</td>
<td>

packages/internal/utils/dist/node-condition/production-ssr.d.ts:19

</td>
</tr>
<tr>
<td>

`TEST`

</td>
<td>

`boolean`

</td>
<td>

packages/internal/utils/dist/node-condition/production-ssr.d.ts:20

</td>
</tr>
</tbody>
</table></div>

**Example**

```ts twoslash
// @filename: /src/lib/my-lib.ts

import { nodeCondition } from '@gracile/gracile/node-condition';

if (nodeCondition.BROWSER) {
  // NOTE: Do stuff…
}
```

**Defined in**

packages/internal/utils/dist/node-condition/production-ssr.d.ts:16

## Type Alias: GracileHandler()

```ts
type GracileHandler: (request, locals?) => Promise<StandardResponse | ResponseWithNodeReadable | null>;
```

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

`locals`?

</td>
<td>

`unknown`

</td>
</tr>
</tbody>
</table></div>

**Returns**

`Promise`\<`StandardResponse` \| `ResponseWithNodeReadable` \| `null`\>

**Defined in**

packages/engine/dist/server/request.d.ts:21

## Type Alias: GracileNodeHandler()

```ts
type GracileNodeHandler: (request, response, locals?) => Promise<ServerResponse<IncomingMessage> | null | void>;
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

`locals`?

</td>
<td>

`unknown`

</td>
</tr>
</tbody>
</table></div>

**Returns**

`Promise`\<`ServerResponse`\<`IncomingMessage`\> \| `null` \| `void`\>

**Defined in**

packages/engine/dist/server/adapters/node.d.ts:3

## Type Alias: GracileHonoHandler()

```ts
type GracileHonoHandler: (context) => Promise<Response>;
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

`context`

</td>
<td>

`object`

</td>
</tr>
<tr>
<td>

`context.req`

</td>
<td>

`object`

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

**Defined in**

packages/engine/dist/server/adapters/hono.d.ts:2

# Client router

API references extracted from the Gracile code base.  
Examples, functions, classes, constants, type declarations…

## Function: createRouter()

```ts
function createRouter(config?): GracileRouter;
```

Client-side routing that takes over the SSRed markup and browser navigation.

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

`config`?

</td>
<td>

`GracileRouterConfig`

</td>
<td>

Router instance configuration.

</td>
</tr>
</tbody>
</table></div>

**Returns**

`GracileRouter`

The client router as an observable or controllable event target.

## Version

experimental

**Example**

`./src/client-router.ts`

```js
import { createRouter } from '@gracile-labs/client-router/create';

export const router = createRouter();
```

**Defined in**

[create.ts:92](https://github.com/gracile-web/gracile/blob/dee2696d9d7b288a41c19fc3e6d3ce7da4b9f873/packages/labs/client-router/src/create.ts#L92)

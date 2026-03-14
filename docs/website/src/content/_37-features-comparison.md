# Comparison (Astro, Fresh, Remix,…)

<table>
<thead>
<tr>
<th>Feature</th>
<th>Gracile</th>
<th>Astro</th>
<th>Remix</th>
<th>Fresh</th>
<th>Next</th>
<th>Nuxt</th>
<th>SvelteKit</th>
<th>SolidStart</th>
</tr>
</thead>
<tbody>
<tr>
<td>File-based routing</td>
<td>✅</td>
<td>✅</td>
<td>✅</td>
<td>✅</td>
<td>✅</td>
<td>✅</td>
<td>✅</td>
<td>✅</td>
</tr>

<tr>
<td>Config-based routing</td>
<td>❌</td>
<td>✅</td>
<td>✅</td>
<td>✅</td>
<td>✅</td>
<td>✅</td>
<td>✅</td>
<td>✅</td>
</tr>

<tr>
<td>Component system</td>
<td>HTML literals, Custom Elements</td>
<td>Astro JSX-y HTML, Islands</td>
<td>React JSX</td>
<td>Preact JSX</td>
<td>React JSX</td>
<td>Vue</td>
<td>Svelte</td>
<td>Solid JSX</td>
</tr>

<tr>
<td>SSG</td>
<td>✅</td>
<td>✅</td>
<td>❌</td>
<td>✅</td>
<td>✅</td>
<td>✅</td>
<td>✅</td>
</tr>

<tr>
<td>Hydration</td>
<td>✅</td>
<td>✅</td>
<td>✅</td>
<td>✅</td>
<td>✅</td>
<td>✅</td>
<td>✅</td>
</tr>

<tr>
<td>MPA</td>
<td>✅</td>
<td>✅</td>
<td>✅</td>
<td>✅</td>
<td>✅</td>
<td>✅</td>
<td>✅</td>
</tr>

<tr>
<td>MPA+CSR</td>
<td>✅</td>
<td>❌</td>
<td>✅</td>
<td>✅</td>
<td>✅</td>
<td>✅</td>
<td>✅</td>
</tr>

<tr>
<td>API endpoints</td>
<td>✅</td>
<td>✅</td>
<td>✅</td>
<td>✅</td>
<td>✅</td>
<td>✅</td>
<td>✅</td>
</tr>

<tr>
<td>Server actions</td>
<td>❌</td>
<td>✅</td>
<td>✅</td>
<td>✅</td>
<td>✅</td>
<td>✅</td>
<td>✅</td>
</tr>

<tr>
<td>Static file endpoints</td>
<td>❌</td>
<td>✅</td>
<td>✅</td>
<td>✅</td>
<td>✅</td>
<td>✅</td>
<td>✅</td>
</tr>

<tr>
<td>Middlewares</td>
<td>❌</td>
<td>✅</td>
<td>✅</td>
<td>✅</td>
<td>✅</td>
<td>✅</td>
<td>✅</td>
</tr>

<tr>
<td>Nested routes</td>
<td>❌</td>
<td>❌</td>
<td>✅</td>
<td>✅</td>
<td>✅</td>
<td>✅</td>
<td>✅</td>
</tr>

<tr>
<td>Markdown+Frontmatter</td>
<td>✅</td>
<td>✅</td>
<td>✅</td>
<td>✅</td>
<td>✅</td>
<td>✅</td>
<td>✅</td>
</tr>

<tr>
<td>HTTP flavor</td>
<td>Fetch</td>
<td>Fetch</td>
<td>Node</td>
<td>Fetch</td>
<td>Node</td>
<td>Node</td>
<td>Fetch</td>
<td>Fetch</td>
</tr>
</tbody>
</table>

<!-- ✅❌❌🟠🟠 -->

## Workarounds for missing features

### Server actions

Use tRPC, OpenAPI and alike.

### Nested routes

Use conditionals in your templates and colocate related portions with,
e.g. `_my-route--{foo,bar}-part.ts` alongside the related route.

### Middlewares

Put them in your server host, before the Gracile server handler.

### Static file endpoints

Generate data with custom scripts or Vite plugin during build phase.  
This feature is planned.

### Server actions

Use tRPC, OpenAPI and alike.

### Config-based routing

This feature is planned. No workaround here.

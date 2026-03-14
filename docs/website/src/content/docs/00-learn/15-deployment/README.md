# <i-c o='ph:rocket-launch-duotone'></i-c>Deployment

Your Gracile website can be deployed either statically or built to a handler which can be integrated into any standard compliant web server/runtime.

See also [output modes](/docs/learn/usage/output-modes/).

## Static

Just copy the `dist` folder to your root `www` or equivalent.
Here, Gracile just works like all other SSG like Gatsby, Astro, Nuxt…  
It's the easiest path.

## Server

Assuming you have your `dist` or `dist/client` + `dist/server` built, you will
have many strategies at hand to make it live.

This is clearly out-of-scope to cover every possible ways, so instead we will
just review **general guidelines**.

First, Gracile is providing a handler, meaning you're responsible for its
hosting infrastructure (meaning your server code). Examples are providing
a minimal starting point, but you should harden your HTTP server, tailor it
to your needs, etc.

Gracile is a front-end framework with back-end capabilities. For heavy
back-end logic, you should have dedicated services for that, with a "traditional"
architecture (if that exists).

That doesn't mean you can't achieve pretty much everything backend-related with
Gracile, it is just that it's not its main focus.

That being said, when preparing your app, it can be a good idea to bundle it
with Rollup. That's a common pattern when preparing a Node app for a Docker
image build.  
That way, your `server.ts`, its imported Gracile handler and Node dependencies will be bundled in one file.  
This strategy has many benefits, this is why Gracile is not minifying your
server code by default, to keep further processing more efficient.

### Managed deployment

Vercel, Netlify, Cloudflare, etc. are all viable options, but there is some
limitations with "Edge" functions that do not support Node `Readable`.

Until `ReadableStream.from` becomes the norm, and more tests are made with
"Edge" functions, Gracile will continue to use Node-dependent APIs.

"Normal" functions should work just fine.

Keep an eye on [starter project for them](/docs/starter-projects/) to see if vendor-specific
implementations are added.

### Self-managed

- Use Docker, with multi-layering steps to trim images down.
- Use a battle-tested reverse proxy/HTTP server like Nginx, Apache, Traefik…
- Leverage caching with ["Stale-While-Revalidate" and "Content-Cache" policies](/docs/learn/usage/output-modes/#doc_smart-caching-advanced).

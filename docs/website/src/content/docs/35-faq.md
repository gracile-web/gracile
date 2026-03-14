# <i-c o='ph:seal-question-duotone'></i-c>FAQ

You might wonder yourself what Gracile has to offer which makes it apart from existing solutions. This section addresses general and specific issues about this full-stack web framework.

## Why?

There wasn't much (if any?) platform-oriented, **full-stack** meta-framework
yet.  
Rocket, Eleventy and Astro: all have great approaches on how to server render
Web Components (they all use Lit-SSR under the hood). However, Rocket and
Eleventy are _content-oriented_ (static output) and Astro has a JSX
processor/template compiler that you might not want to minimize layers.  
JSX _looks_ like HTML, but that also means you will still be tied to the React
world (TS JSX namespace, IDE language tools…).

While that appears antagonistic toward the decentralized ethos of web platform
enthusiasts, there is room for consolidation and reference implementations,
especially on the server side.

The base goal is to make the plunge easier for beginners but also to bring
comfortable bootstraps for accustomed developers.

## Is it tied to any vendor?

Build-less, vendor-free, etc. are all reasonable goals to aim for.  
Fewer tools generally mean fewer maintenance issues.

However, we didn't reach those yet, that's why we still need to use some tooling
to fill the gaps.  
Also, it is perfectly reasonable to use TypeScript or CSS preprocessors, because
for many, the gains largely outweigh the cost, and source-maps are here to help.  
In fact, this website is made with TS and SCSS. You don't have to throw away
your favorite language superset to enjoy the benefits of being closer to the web
platform!

Gracile relies heavily on Vite/Rollup's ecosystems but also on Lit's SSR
library, which, like all Lit contributions, are forward-thinking intents for the
web.  
Your server-side templates are just portable HTML, with JS-based composability,
safety and DX goodies underneath, meaning nearly zero lock-in.

Think of those as "blending" tools.  
They don't force you into unholy contortions.

## Do I need a specific server runtime?

Gracile's "server" mode build is just outputting a handler.  
From there, you're free to embed it in any standard-friendly HTTP server or use
a `Request`/`Response` adapter.

As for static builds, you'll get conformed assets that can be deployed anywhere.

When developing, any JavaScript engine that supports Vite can be used.

Efforts are made to keep Gracile as runtime agnostic as possible, with the
leading runtime, Node, as the standard baseline and WinterCG proposals as a
compass. We're slowly getting there, but fragmentation remains. That being said,
you're still free to engage in side-ways, if that's your will!

## How does it compare to XYZ?

You'll find Gracile is inspired by Fresh, Astro, Elder.js, Nuxt, Rocket, Remix…
you name it!  
At one point, everyone is copying everyone when an idea is valuable.  
However, there are those things that make it a bit different:  
It's not centered around one or a few UI libraries, nor is it tied to
domain-specific languages or deep bundler-tied abstractions.

Every time a standard is going mainstream, that should be the occasion to prune
user-land stopgaps (the `node_modules` black-hole, browser pony-fills…).  
Also, expanding the scope of a framework outside core features has a cost: more
dependencies, maintenance and opinions.  
"_Scope creep_" is what makes you ultimately dependent on a framework.  
_Do-everything_ frameworks are cool (think Rails, Laravel…), but that's not the
goal of Gracile. It's up to you to choose your data-sourcing strategy, UI stack,
HTTP server…

## Do I need to use Web Components / Shadow DOM?

Not at all!  
This whole website is mostly made with composed function calls returning
streamed, serialized light DOM, then rendered ahead of time.

Progressive enhancements can be achieved with good old, per-route or site-wide
inline JavaScript or modules.  
It's also possible to bring Alpine, HTMX, HTMZ, etc. if that's your jam!

When you need more interactivity and composition superpowers, or if you are
already an avid Lit user you can jump straight into Lit flavored Web Components.
They are the only ones that are server renderable and client hydratable. That's
because of their intrinsic template serialization capabilities.  
Lit's renderer is stitching template strings on the client and server, and guess
what, that's already a perfect base for server rendering!  
Strings concats are the inevitable approach used by every SSR engine (Astro,
SolidStart, Next.js…).

Conceivably, at some point, we'll get "Vanilla" HTML Custom Elements to be
SSR'ed canonically.

## What is the current state of this project?

It's **experimental** notably the **server** mode.  
Lately, things are changing **very** fast in the web components or
platform-related spaces.  
Declarative Shadow DOM has just rooted in every major browser, Constructible
StyleSheets and CSS Modules are following the same path… and that's a few
"glaring" stuff. Lit SSR itself is an experimental tech., even though it has
[already been implemented](https://lit.dev/docs/ssr/overview/) successfully in
well-known frameworks (Astro, Next, Nuxt, Rocket, Eleventy…).

This project is an attempt to normalize using the web platform amongst developer
who are more familiar with "branded" UI libraries and their respective
server/client meta-frameworks.  
We are getting there, but what we often hear is Web Components and other modern
native APIs are "hidden gems" that need to be **polished** up, put in
**context**, and from there, really start to excel.  
The big picture is better painted with a cohesive experience. It's an invitation
to dig deeper in web knowledge, which can be overwhelming otherwise.

Hopefully, big names will start to invest in this niche and make it grow, as
they did with WC design systems (Spectrum, Carbon, Material, FAST…).  
More competition will make this ecosystem flourish even more.

# Copilot Instructions

## Dependency Deduping

`workspace:` (maybe?) or `link:` (surely) installs can load multiple Lit-family
package instances unless Vite dedupe/local resolution is aligned. This can fail
in dev or build.

## Faulty Chunk Side-Effect Order

Some Vite/Rolldown builds can misplace side-effect imports in production chunks.
Lit SSR hydration can then fail silently; doubled custom-element output such as
`<i-c>` is one symptom.

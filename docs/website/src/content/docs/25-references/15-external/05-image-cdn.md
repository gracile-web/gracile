# Image embeds from a CDN

Generally, the simplest way to add images for your static/server project is to
use a media CDN, and a tailored component for make it optimized in your
templates.

Those optimizations can avoid flash of unstyled content, download the right set
of responsive images, crop them depending on the viewport dimensions and other
transformations…

---

[Unpic](https://unpic.pics/) is a universal adapter that offers a **Lit element
`<img>`** wrapper in its toolkit.

**It works very well with Lit SSR**, that makes it perfect to use with the
Gracile framework.

> **Unpic** is the ultimate open source toolkit for displaying images on the
> web.

```sh
npm install @unpic/lit
```

```ts
// @filename: ./src/features/my-template.ts

const src =
  'https://ik.imagekit.io/jc0/my_photos/' +
  '06-Four%20Lads%20on%20a%20Bench%20and%20the%20View-20171017_rDaCcsdEg.jpg' +
  '?updatedAt=1731191960589';

export const MyTemplate = () => html`
  <unpic-img
    src=${src}
    layout="constrained"
    width="800"
    height="600"
    alt="Four Lads on a Bench and the View"
  ></unpic-img>
`;
```

Yields:

<unpic-img src="https://ik.imagekit.io/jc0/my_photos/06-Four%20Lads%20on%20a%20Bench%20and%20the%20View-20171017_rDaCcsdEg.jpg?updatedAt=1731191960589" layout="constrained" width="800" height="600" alt="Four Lads on a Bench and the View"></unpic-img>

---

Inspect the HTML static sources above, you'll see the DOM is already there, on
the first HTML rendering pass.

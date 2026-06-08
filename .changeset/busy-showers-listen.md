---
'jsx-forge': minor
---

Update JSX bootstrap types expansions (WEA)

Now reflects CSS Custom Properties as a `style:map` facet.

```tsx
<my-mighty-element
  style:map={{
    '--text-colour': 'cyan',
    // 🫥 Oh no, this CSS custom property is mispelled.
    '--text-color': 'tomato',
  }}
/>;

/**
 * @cssProp --text-colour - Sober or crazy.
 * ...
 */
export class MyMightyElement extends HTMLElement {
  // ...
}
```

For when JSX Forge namespace is used in conjunction with WEA automatic
namespaces augmentation.

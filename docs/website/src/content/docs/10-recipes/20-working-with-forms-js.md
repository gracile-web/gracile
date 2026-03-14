# Handle forms (JS augmented)

This is a full example of how to handle forms in Gracile, with client-side JavaScript augmentation.  
In this recipe, both approaches will work, so the user can start submitting the form even if the JS has yet to be parsed! And if it is, that will avoid a full-page reload by using the JSON API with `fetch`.

If you haven't done it yet, you should read the [form recipe without JS](/docs/recipes/working-with-forms/) before diving into the progressive enhancement below.  
Some principles hold; because if the user interacts with your form before JS is loaded or if it's broken, you still have to handle the submission gracefully, with the PRG pattern etc.

```ts twoslash
// @filename: /src/document.ts
import { html } from '@gracile/gracile/server-html';
export const document = () => html` ... `;
// ---cut---
// @filename: /src/routes/form-js.client.ts

customElements.define(
  'form-augmented',
  class extends HTMLElement {
    #form = this.querySelector('form')!;
    #debugger = this.querySelector('#debugger')!;

    connectedCallback() {
      this.#form.addEventListener('submit', (event) => {
        event.preventDefault();

        // NOTE: This will re-emit a "formdata" event.
        new FormData(this.#form);
      });

      this.#form.addEventListener('formdata', (event) =>
        this.post(event.formData),
      );
    }

    async post(formData: FormData) {
      // TIP: Inform the server to respond with JSON instead of doing a POST/Redirect/GET.
      formData.set('format', 'json');

      const result = await fetch('', { method: 'POST', body: formData }).then(
        (r) => r.json(),
      );

      // NOTE: Do stuff with the result without doing a full page reload…
      console.log({ result });

      this.#debugger.innerHTML = JSON.stringify(result, null, 2);
    }
  },
);

// @filename: /src/routes/form.ts

import { defineRoute } from '@gracile/gracile/route';
import { html } from 'lit';

import { document } from '../document.js';

let myData = 'untouched';

type Props = {
  success: boolean;
  message: string | null;
  myData: unknown;
};

export default defineRoute({
  handler: {
    GET: () => {
      const props: Props = { success: true, message: null, myData };
      return props;
    },

    POST: async (context) => {
      const formData = await context.request.formData();

      const props: Props = { success: false, message: null, myData };

      const myFieldValue = formData.get('my_field')?.toString();
      if (!myFieldValue) {
        context.responseInit.status = 400;
        props.message = 'Missing field.';
      } else {
        props.success = true;
        myData = myFieldValue;
        props.myData = myData;
      }

      if (formData.get('format') === 'json') {
        return Response.json(props, context.responseInit);
      }
      // TIP: No-JS fallback
      if (props.success) {
        return Response.redirect(context.url, 303);
      }

      // IMPORTANT: We want the user data to be repopulated in the page after a failed `POST`.
      return props;
    },
  },

  document: (context) => document({ ...context, title: 'Form with JS' }),

  template: (context) => {
    console.log(context);

    return html`
      <code>${context.request.method}</code>
      <form-augmented>
        <form method="post">
          <input type="text" value=${myData} name="my_field" />
          <button>Change field value</button>
        </form>

        <pre id="debugger">${JSON.stringify(context.props, null, 2)}</pre>
      </form-augmented>
    `;
  },
});
```

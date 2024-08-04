import { defineRoute } from '@gracile/gracile/route';
import '@gracile/gracile/server-html';
import { d as document } from './document.js';
import '@gracile/gracile/document';

const throws = defineRoute({
  document: (context) => document({ ...context, title: "Gracile - Oh no" }),
  template: (context) => {
    throw new Error("!!! OH NO !!! I AM A FAKE ERROR !!!");
  }
});

export { throws as default };

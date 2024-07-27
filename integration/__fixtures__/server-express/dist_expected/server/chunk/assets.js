import { d as defineRoute } from './route.js';
import { html as html$1 } from '@lit-labs/ssr/lib/server-template.js';
import { d as document } from './document.js';
import { css, LitElement, html } from 'lit';
import { state, property, customElement } from 'lit/decorators.js';
import '../server.js';
import 'node:stream';
import 'tty';
import '@lit-labs/ssr';
import '@lit-labs/ssr/lib/render-result.js';
import 'stream';
import 'fs';
import 'url';
import 'http';
import 'util';
import 'https';
import 'zlib';
import 'buffer';
import 'crypto';
import 'querystring';
import 'stream/web';
import 'express';
import 'path';
import 'lit/directives/unsafe-html.js';

const customStylesheet = "/assets/_assets-my-el-2-_K7WEQ-5.css";

const styles = "/assets/_assets-my-el-BZ8-Dbhw.css";

var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __decorateClass = (decorators, target, key, kind) => {
  var result = kind > 1 ? void 0 : kind ? __getOwnPropDesc(target, key) : target;
  for (var i = decorators.length - 1, decorator; i >= 0; i--)
    if (decorator = decorators[i])
      result = (kind ? decorator(target, key, result) : decorator(result)) || result;
  if (kind && result) __defProp(target, key, result);
  return result;
};
let MyEl = class extends LitElement {
  constructor() {
    super(...arguments);
    this.toggled = false;
    this["extra-styles"] = null;
  }
  render() {
    if (typeof this["extra-styles"] === "string") throw new Error();
    return html`
			<!--  -->
			<link rel="stylesheet" href=${styles} />

			${this["extra-styles"]?.join(" --- ")}
			${this["extra-styles"]?.map(
      (styleSheet) => html`<link rel="stylesheet" href=${styleSheet} />`
    )}

			<div class="color-me-red">RED</div>
			<div class="color-me-green">GREEN</div>

			${this.toggled ? html` <!--  -->
						<h2>elephant</h2>
						<div class="color-me-red">RED</div>
						<div class="color-me-green">GREEN</div>

						<button
							@click=${() => {
      this.toggled = false;
      console.log("elephant");
    }}
						>
							CLICK ME
						</button>` : html` <!--  -->
						<h2>lion</h2>
						<div class="color-me-red">RED</div>
						<div class="color-me-green">GREEN</div>

						<button
							@click=${() => {
      this.toggled = true;
      console.log("lion");
    }}
						>
							CLICK ME
						</button>`}
		`;
  }
};
MyEl.styles = [
  css`
			:host {
				display: block;
			}
		`
];
__decorateClass([
  state()
], MyEl.prototype, "toggled", 2);
__decorateClass([
  property({ type: Array, converter: (s) => s?.split(",") })
], MyEl.prototype, "extra-styles", 2);
MyEl = __decorateClass([
  customElement("my-el")
], MyEl);

const assets = defineRoute({
  handler: {
    GET: ({ url }) => {
      return { query: url.searchParams.get("q") };
    }
  },
  document: (context) => document({ ...context, title: "Gracile Home" }),
  template: (context) => html$1`
		<!--  -->

		<my-el extra-styles=${[customStylesheet].toString()}></my-el>
	`
});

export { assets as default };
//# sourceMappingURL=assets.js.map

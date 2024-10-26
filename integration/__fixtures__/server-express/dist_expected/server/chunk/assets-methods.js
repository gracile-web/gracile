import { defineRoute } from '@gracile/gracile/route';
import { html as html$1 } from '@gracile/gracile/server-html';
import { d as document } from './document.js';
import { css, LitElement, html } from 'lit';
import { state, property, customElement } from 'lit/decorators.js';

const customStylesheet = "/assets/_assets-methods-my-el-2-B-0f4ddQ.css";

const styles = "/assets/_assets-methods-my-el-Bq1tmW6L.css";

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

const assetsMethods = defineRoute({
  document: (context) => document({ ...context, title: "Gracile Assets" }),
  template: (context) => html$1`
		<!--  -->

		<my-el extra-styles=${[customStylesheet].toString()}></my-el>
	`
});

export { assetsMethods as default };

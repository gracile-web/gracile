var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __decorateClass = (decorators, target, key, kind) => {
  var result = kind > 1 ? void 0 : kind ? __getOwnPropDesc(target, key) : target;
  for (var i = decorators.length - 1, decorator; i >= 0; i--)
    if (decorator = decorators[i])
      result = (kind ? decorator(target, key, result) : decorator(result)) || result;
  if (kind && result)
    __defProp(target, key, result);
  return result;
};
import { css, html, LitElement } from "/@fs__REPLACED_FOR_TESTS__/node_modules/.vite/deps/lit.js?v=__REPLACED_FOR_TESTS__";
import { customElement, property } from "/@fs__REPLACED_FOR_TESTS__/node_modules/.vite/deps/lit_decorators__js.js?v=__REPLACED_FOR_TESTS__";
export let MyLitElement = class extends LitElement {
  constructor() {
    super(...arguments);
    this.count = 0;
  }
  render() {
    return html`
			<button
				@click=${() => {
      this.count += 1;
    }}
			>
				Increment
			</button>

			<hr />
			<data>${this.count}</data>
		`;
  }
};
MyLitElement.styles = [
  css`
			:host {
				display: block;
			}
		`
];
__decorateClass([
  property({ type: Number })
], MyLitElement.prototype, "count", 2);
MyLitElement = __decorateClass([
  customElement("lit-element")
], MyLitElement);

// __REPLACED_FOR_TESTS__
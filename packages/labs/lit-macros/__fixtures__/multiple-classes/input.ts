import { LitElement, html } from 'lit';
import { customElement, property, state } from 'lit/decorators.js';

@customElement('app-header')
export class AppHeader extends LitElement {
	@property({type: String})
	title = '';

	render() {
		return html`<header>${this.title}</header>`;
	}
}

@customElement('app-footer')
export class AppFooter extends LitElement {
	@state()
	_year = new Date().getFullYear();

	render() {
		return html`<footer>&copy; ${this._year}</footer>`;
	}
}

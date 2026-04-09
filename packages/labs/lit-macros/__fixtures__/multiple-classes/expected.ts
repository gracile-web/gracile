import { LitElement, html } from 'lit';

export class AppHeader extends LitElement {
	static properties = {
		title: {type: String},
	};

	constructor() {
		super();
		this.title = '';
	}

	render() {
		return html`<header>${this.title}</header>`;
	}
}
customElements.define('app-header', AppHeader);

export class AppFooter extends LitElement {
	static properties = {
		_year: {state: true},
	};

	constructor() {
		super();
		this._year = new Date().getFullYear();
	}

	render() {
		return html`<footer>&copy; ${this._year}</footer>`;
	}
}
customElements.define('app-footer', AppFooter);

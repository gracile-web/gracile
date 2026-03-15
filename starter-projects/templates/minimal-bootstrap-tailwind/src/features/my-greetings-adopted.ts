import { css, html, isServer, LitElement } from 'lit';
import { customElement, property } from 'lit/decorators.js';

@customElement('my-greetings-adopted')
export class MyGreetingsAdopted extends LitElement {
	@property() name = 'World';

	async firstUpdated() {
		setInterval(() => {
			this.name = this.name === 'Gracile' ? 'World' : 'Gracile';
		}, 2500);
	}

	render() {
		// <adopted-style
		//   .sheets=${['/adopted-1.css', '/adopted-2.css']}
		// ></adopted-style>
		return html`
			<adopted-style sheets="/adopted-1.css, /adopted-2.css"></adopted-style>

			<h1>Hello</h1>
			<button>${this.name}</button>
		`;
	}
	// <h3>Hello ${this.name}!</h3>

	// <div>
	//   <button type="button" class="btn btn-primary">Primary</button>
	//   <button type="button" class="btn btn-secondary">Secondary</button>
	//   <button type="button" class="btn btn-success">Success</button>
	//   <button type="button" class="btn btn-danger">Danger</button>
	//   <button type="button" class="btn btn-warning">Warning</button>
	//   <button type="button" class="btn btn-info">Info</button>
	//   <button type="button" class="btn btn-light">Light</button>
	//   <button type="button" class="btn btn-dark">Dark</button>

	//   <button type="button" class="btn btn-link">Link</button>
	// </div>

	// <hr />

	// <h4>Using Boostrap JS inside Shadow DOM!</h4>

	// <div class="dropdown">
	//   <button
	//     class="btn btn-secondary dropdown-toggle"
	//     type="button"
	//     id="dropdownMenuButton1"
	//     data-bs-toggle="dropdown"
	//     aria-expanded="false"
	//   >
	//     Dropdown button (click me)
	//   </button>
	//   <ul class="dropdown-menu" aria-labelledby="dropdownMenuButton1">
	//     <li><a class="dropdown-item" href="#">Action</a></li>
	//     <li><a class="dropdown-item" href="#">Another action</a></li>
	//     <li><a class="dropdown-item" href="#">Something else here</a></li>
	//   </ul>
	// </div>

	static styles = [
		css`
			:host {
				display: block;
			}
		`,
	];
}

declare global {
	interface HTMLElementTagNameMap {
		'my-greetings-adopted': MyGreetingsAdopted;
	}
}

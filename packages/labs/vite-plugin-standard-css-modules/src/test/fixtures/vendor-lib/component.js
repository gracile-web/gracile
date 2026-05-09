import styles from './component.css' with { type: 'css' };

export class MyElement extends HTMLElement {
	constructor() {
		super();
		this.attachShadow({ mode: 'open' });
		this.shadowRoot.adoptedStyleSheets = [styles];
	}
}

export { styles };

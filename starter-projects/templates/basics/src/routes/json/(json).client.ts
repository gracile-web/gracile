const API_BASE = '/json/api/simple';

customElements.define(
	'simple-api-fetcher',
	class extends HTMLElement {
		#pet = this.querySelector('#pet');

		#noPet = this.querySelector('#no-pet');

		#wrongMethod = this.querySelector('#wrong-method');

		#dump = this.querySelector('pre');

		connectedCallback() {
			[this.#pet, this.#noPet, this.#wrongMethod].forEach((button) => {
				button?.addEventListener('click', () => {
					console.log('Action', button.id);

					this.action(button.id).catch(() => null);
				});
			});
		}

		actions = {
			pet: () => fetch(`${API_BASE}/pet/1/`),
			'no-pet': () => fetch(`${API_BASE}/pet/10/`),
			'wrong-method': () => fetch(`${API_BASE}/pet/1/`, { method: 'DELETE' }),
		};

		async action(id: string) {
			if (id in this.actions && this.#dump) {
				const response = await this.actions[id as keyof typeof this.actions]();

				const json = (await response.json()) as unknown;

				console.log({ response, json });

				this.#dump.innerHTML = `${response.status} - ${JSON.stringify(json, null, 2)}`;
			}
		}
	},
);

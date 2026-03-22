customElements.define(
	'form-augmented',
	class extends HTMLElement {
		#form = this.querySelector('form')!;

		#debugger = this.querySelector('#debugger')!;

		connectedCallback() {
			this.#form.addEventListener('submit', (event) => {
				event.preventDefault();

				// NOTE: This will re-emit a "formdata" event.
				// eslint-disable-next-line no-new
				new FormData(this.#form);
			});

			this.#form.addEventListener('formdata', (event) => {
				this.post(event.formData).catch(() => null);
			});
		}

		async post(formData: FormData) {
			// TIP: Inform the server to respond with JSON instead of doing a POST/Redirect/GET.
			formData.set('format', 'json');

			const result = await fetch('', { method: 'POST', body: formData }).then(
				(r) => r.json() as unknown,
			);

			// NOTE: Do stuff with the result without doing a full page reload…
			console.log({ result });

			this.#debugger.innerHTML = JSON.stringify(result, null, 2);
		}
	},
);

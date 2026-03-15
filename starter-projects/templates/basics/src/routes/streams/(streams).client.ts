const eventSourceUrl = '/streams/server-events/';

customElements.define(
	'simple-event-sourcer',
	class extends HTMLElement {
		#eventSource = new EventSource(eventSourceUrl);

		#dump = this.querySelector('pre')!;

		connectedCallback() {
			this.#eventSource.addEventListener('open', (event) => {
				console.log(event);
			});

			this.#eventSource.addEventListener('message', (event) => {
				console.log(event);

				this.dump(event);
			});
		}

		dump(event: Event) {
			if (('data' in event && typeof event.data === 'string') === false)
				throw new Error('Incorrect stream!');

			this.#dump.append(
				(document.createElement('code').innerHTML = `${event.data}\n`),
			);
		}
	},
);

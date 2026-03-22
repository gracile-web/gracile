export class CoolCanvas extends HTMLElement {
	count = 0;

	init() {
		// Stolen from https://codepen.io/jordienric/pen/rNepyxy

		const context = this.#canvas.getContext('2d')!;

		let time = 0;

		const color = (x: number, y: number, r: number, g: number, b: number) => {
			context.fillStyle = `rgb(${r}, ${g}, ${b})`;
			context.fillRect(x, y, 10, 10);
		};
		const R = (x: number, y: number, t: number) => {
			return Math.floor(192 + 64 * Math.cos((x * x - y * y) / 300 + t));
		};

		const G = (x: number, y: number, t: number) => {
			return Math.floor(
				192 +
					64 *
						Math.sin((x * x * Math.cos(t / 4) + y * y * Math.sin(t / 3)) / 300),
			);
		};

		const B = (x: number, y: number, t: number) => {
			return Math.floor(
				192 +
					64 *
						Math.sin(
							5 * Math.sin(t / 9) +
								((x - 100) * (x - 100) + (y - 100) * (y - 100)) / 1100,
						),
			);
		};

		const speed = 15;
		const startAnimation = () => {
			for (let x = 0; x <= 30; x += 1) {
				for (let y = 0; y <= 30; y += 1) {
					color(x, y, R(x, y, time), G(x, y, time), B(x, y, time));
				}
			}
			time += speed / 1000;
			window.requestAnimationFrame(startAnimation);
		};

		startAnimation();
	}

	#shadow;

	#canvas;

	constructor() {
		super();

		this.style.display = 'block';
		this.style.width = '100%';
		this.style.height = '100%';

		this.#shadow = this.attachShadow({ mode: 'open' });

		this.#canvas = document.createElement('canvas');
		this.#shadow.appendChild(this.#canvas);

		this.#canvas.width = 32;
		this.#canvas.height = 32;
		this.#canvas.style.width = '100%';
		this.#canvas.style.height = '100%';

		this.#canvas.style.opacity = '0';
		this.#canvas.style.transition = 'opacity 2s';

		this.style.maskImage =
			'radial-gradient(black 0%, black 20%, transparent 75%)';

		this.init();

		setTimeout(() => {
			this.#canvas.style.opacity = 'var(--cool-canvas-opacity, 0.2)';
		}, 100);
	}
}

customElements.define('cool-canvas', CoolCanvas);

declare global {
	interface HTMLCounterTagNameMap {
		'cool-canvas': CoolCanvas;
	}
}

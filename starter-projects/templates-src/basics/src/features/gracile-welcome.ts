import { html } from 'lit';

import logo from '../assets/gracile-logo.svg';
import { mainCard } from '../content/home.js';

export const gracileWelcome = html`
	<header class="gracile-welcome">
		<cool-canvas></cool-canvas>

		<div class="greetings">
			<span>Welcome to</span>
			<div class="logo">${logo}</div>
		</div>

		<ul class="cards">
			<li>
				<div class="card">${mainCard}</div>
			</li>

			<li>
				<a class="card" href="https://gracile.js.org/docs/" target="_blank">
					<h2>Documentation</h2>
					<p>
						Explore the official API docs to level up and understand how Gracile
						works.
					</p>
				</a>
			</li>

			<li>
				<a
					class="card"
					href="https://github.com/gracile-web/starter-projects"
					target="_blank"
				>
					<h2>Starters</h2>
					<p>
						Checkout the framework features and get inspired with these clonable
						<strong>starter projects</strong>.
					</p>
				</a>
			</li>

			<li>
				<a
					class="card"
					href="https://gracile.js.org/docs/add-ons/"
					target="_blank"
				>
					<h2>Add-ons</h2>
					<p>
						Add extra capabilities to your app/website in a pinch, thanks to
						Gracile's modular architecture.
					</p>
				</a>
			</li>

			<li>
				<a
					class="card"
					href="https://gracile.js.org/docs/playground/"
					target="_blank"
				>
					<h2>Online playground</h2>
					<p>
						Demos, containerized in your browser.
						<br />
						No need to install anything on your machine.
					</p>
				</a>
			</li>
		</ul>
	</header>
`;

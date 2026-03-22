import { html } from 'lit';

export const mainCard = html`
	<h2>
		Get started with the <em><strong>Basics Tour</strong> template</em>
	</h2>

	<ol>
		<li>
			<p>
				Start tweaking the home route 👉

				<code>src/routes/(home).ts</code>, and see what happens!
			</p>
		</li>
		<li>
			<p>
				Play with the
				<a href="#custom-elements">HTML Custom Elements</a>
				in <code>src/features/counters</code>, get a taste of interactivity ✨.
			</p>
		</li>
		<li>
			<p>
				Head over to
				<code>src/routes</code>
				to edit the
				<a href="/json/">JSON fetcher</a>, the HTML
				<a href="/form/regular/">forms</a>, or the
				<a href="/markdown-editor/">Markdown editor</a>.
			</p>
		</li>
	</ol>
`;

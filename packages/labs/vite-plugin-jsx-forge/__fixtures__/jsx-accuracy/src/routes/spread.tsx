import { defineRoute } from '@gracile/gracile/route';

import { document } from '../document.js';

// --- Spread scenario ---
const linkProps = {
	href: 'https://example.com',
	target: '_blank' as const,
	rel: 'noopener',
};

// --- Fragment scenario ---
function FragmentContent() {
	return (
		<>
			<li>First</li>
			<li>Second</li>
			<li>Third</li>
		</>
	);
}

export default defineRoute({
	document: (context) =>
		document({ ...context, title: 'JSX Accuracy - Spread' }),

	template: () => (
		<main>
			{/* Spread attributes */}
			<section id="spread">
				<a {...linkProps}>Spread link</a>
			</section>

			{/* Fragment usage */}
			<section id="fragments">
				<ul>
					<FragmentContent />
				</ul>
			</section>

			{/* Inline expressions */}
			<section id="expressions">
				<p>{String(2 + 2)}</p>
				<p>{['a', 'b', 'c'].join(', ')}</p>
			</section>

			{/* Conditional rendering */}
			<section id="conditional">
				{true ? <p>Truthy</p> : <p>Falsy</p>}
				{false ? <span>Hidden</span> : null}
			</section>

			{/* List rendering */}
			<section id="list">
				<ul>
					{['alpha', 'beta', 'gamma'].map((item) => (
						<li>{item}</li>
					))}
				</ul>
			</section>
		</main>
	),
});

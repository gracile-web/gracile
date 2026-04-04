import { defineRoute } from '@gracile/gracile/route';

import { document } from '../document.js';

// ---------- Type-aware attribute scenarios ----------

// Boolean type → ?attr binding
const isDisabled: boolean = true;
const isHidden: boolean = false;

// Undefined union → ifDefined wrapping
const maybeTitle: string | undefined = 'hello';
const missingTitle: string | undefined = undefined;

// Plain string (no special handling)
const className = 'my-class';

// Numeric
const widthValue = 42;

// Explicit namespace bindings
function handleClick(): void {
	/* noop — server-side just needs the shape */
}

export default defineRoute({
	document: (context) =>
		document({ ...context, title: 'JSX Accuracy - Types' }),

	template: () => (
		<main>
			{/* Boolean attribute — should produce ?disabled binding */}
			<section id="boolean-attrs">
				<button disabled={isDisabled}>Disabled button</button>
				<p hidden={isHidden}>Should be visible</p>
			</section>

			{/* Undefined union — should produce ifDefined wrapping */}
			<section id="maybe-attrs">
				<div title={maybeTitle}>Has title</div>
				<div title={missingTitle}>Missing title</div>
			</section>

			{/* Plain string attribute */}
			<section id="plain-attrs">
				<div class={className}>Classed</div>
				<div data-width={widthValue}>Numbered</div>
			</section>

			{/* Explicit namespace bindings */}
			<section id="explicit-bindings">
				<button on:click={handleClick}>Event bound</button>
				<input bool:checked={true} />
				<a if:href={maybeTitle}>Conditional href</a>
			</section>

			{/* Static content (no expressions) */}
			<section id="static-only">
				<p>Just plain text, no bindings.</p>
			</section>

			{/* Mixed static + dynamic */}
			<section id="mixed">
				<p>
					Value is <strong>{maybeTitle}</strong> here.
				</p>
			</section>

			{/* Nested elements */}
			<section id="nested">
				<div>
					<span>
						<em>Deeply nested</em>
					</span>
				</div>
			</section>
		</main>
	),
});

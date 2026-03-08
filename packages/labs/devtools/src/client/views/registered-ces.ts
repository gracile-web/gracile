/**
 * Registered Custom Elements view — placeholder.
 *
 * This tab will eventually introspect the `customElements` registry
 * to list all defined elements, their constructors, observed attributes,
 * etc.  For now it shows a placeholder with basic registry info.
 *
 * @module
 */

export function renderRegisteredCEsView(): string {
	// Basic introspection: we can't enumerate the registry, but we can
	// scan the DOM for any custom elements currently in the page and
	// check if they're defined.
	const ceTagsInPage = collectCETagsInPage();
	const defined = ceTagsInPage.filter(
		(tag) => customElements.get(tag) !== undefined,
	);
	const undefined_ = ceTagsInPage.filter(
		(tag) => customElements.get(tag) === undefined,
	);

	if (ceTagsInPage.length === 0) {
		return /* html */ `
			<div class="view-header">
				<h2>Custom Elements</h2>
			</div>
			<div class="placeholder">
				<div class="placeholder__icon">
					<svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 256 256" fill="currentColor"><path d="M223.68,66.15,135.68,18a15.88,15.88,0,0,0-15.36,0l-88,48.17a16,16,0,0,0-8.32,14v95.64a16,16,0,0,0,8.32,14l88,48.17a15.88,15.88,0,0,0,15.36,0l88-48.17a16,16,0,0,0,8.32-14V80.18A16,16,0,0,0,223.68,66.15ZM128,32l80.34,44L128,120,47.66,76ZM40,90l80,43.78v85.79L40,175.82Zm96,129.57V133.82L216,90v85.82Z"/></svg>
				</div>
				<p class="placeholder__text">No Custom Elements detected in the page.</p>
				<p class="placeholder__sub">This feature will be expanded in a future release.</p>
			</div>
		`;
	}

	return /* html */ `
		<div class="view-header">
			<h2>Custom Elements <span style="opacity:0.4; font-weight:400; font-size:14px;">(${ceTagsInPage.length})</span></h2>
			<div class="view-actions">
				<button class="action-btn action-refresh">↻ Refresh</button>
			</div>
		</div>

		<div class="info-grid" style="margin-bottom: 16px;">
			<div class="info-card">
				<span class="info-card__label">Defined</span>
				<span class="info-card__value">${defined.length}</span>
			</div>
			<div class="info-card">
				<span class="info-card__label">Undefined</span>
				<span class="info-card__value" ${undefined_.length > 0 ? 'style="color: var(--dt-danger)"' : ''}>${undefined_.length}</span>
			</div>
		</div>

		<ul class="route-list">
			${ceTagsInPage
				.map((tag) => {
					const isDefined = customElements.get(tag) !== undefined;
					const ctor = customElements.get(tag);
					const ctorName = ctor?.name ?? '—';
					return /* html */ `
						<li class="route-item" style="grid-template-columns: minmax(160px, auto) 1fr auto;">
							<span class="route-pattern">&lt;${tag}&gt;</span>
							<span class="route-file">${isDefined ? ctorName : '<em style="opacity:0.5">not defined</em>'}</span>
							${isDefined ? '<span class="route-badge" style="border-color: var(--dt-accent-dim); color: var(--dt-accent);">defined</span>' : '<span class="route-badge" style="border-color: var(--dt-danger); color: var(--dt-danger);">undefined</span>'}
						</li>
					`;
				})
				.join('')}
		</ul>

		<div class="placeholder" style="min-height: 80px; margin-top: 20px;">
			<p class="placeholder__sub">
				Full registry introspection (observed attributes, properties, etc.)
				will be available in a future release.
			</p>
		</div>
	`;
}

// ── Helpers ──────────────────────────────────────────────────────────

/**
 * Walk the DOM to collect unique custom element tag names present in the page.
 * Also recurses into shadow roots.
 */
function collectCETagsInPage(): string[] {
	const tags = new Set<string>();

	function walk(root: Element | DocumentFragment) {
		const children =
			root instanceof Element && root.shadowRoot
				? [...root.children, ...root.shadowRoot.children]
				: [...root.children];

		for (const child of children) {
			if (!(child instanceof HTMLElement)) continue;

			if (child.tagName.includes('-')) {
				tags.add(child.tagName.toLowerCase());
			}

			walk(child);

			if (child.shadowRoot) {
				walk(child.shadowRoot);
			}
		}
	}

	walk(document.body);
	return [...tags].sort();
}

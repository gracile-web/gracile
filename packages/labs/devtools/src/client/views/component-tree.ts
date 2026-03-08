/**
 * Component Tree view.
 *
 * Walks the live DOM to find Custom Elements and presents them in a
 * collapsible tree.  For each CE that uses Shadow DOM, lists adopted
 * stylesheets count.
 *
 * This is purely client-side — no server data needed.
 *
 * @module
 */

export function renderComponentTreeView(): string {
	// Build tree from the live document
	const tree = buildCETree(document.body);

	if (tree.length === 0) {
		return /* html */ `
			<div class="view-header">
				<h2>Component Tree</h2>
				<div class="view-actions">
					<button class="action-btn action-refresh">↻ Refresh</button>
				</div>
			</div>
			<div class="placeholder">
				<div class="placeholder__icon">
					<svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 256 256" fill="currentColor"><path d="M160,112h48a16,16,0,0,0,16-16V64a16,16,0,0,0-16-16H176V40a8,8,0,0,0-16,0v8H136V40a8,8,0,0,0-16,0V88H88V64A16,16,0,0,0,72,48H24A16,16,0,0,0,8,64V96a16,16,0,0,0,16,16H72a16,16,0,0,0,16-16V88h32v24a16,16,0,0,0,16,16h24v24H136a16,16,0,0,0-16,16v32a16,16,0,0,0,16,16h48a16,16,0,0,0,16-16V168a16,16,0,0,0-16-16H160V128h48a16,16,0,0,0,16-16V96h0ZM72,96H24V64H72Zm112,72h48v32H136V168Zm0-104h48V96h0H160Z"/></svg>
				</div>
				<p class="placeholder__text">No Custom Elements found in the page.</p>
			</div>
		`;
	}

	return /* html */ `
		<div class="view-header">
			<h2>Component Tree</h2>
			<div class="view-actions">
				<button class="action-btn action-refresh">↻ Refresh</button>
			</div>
		</div>
		<ul class="tree">
			${renderTreeNodes(tree)}
		</ul>
	`;
}

// ── Tree building ────────────────────────────────────────────────────

interface CETreeNode {
	tagName: string;
	hasShadow: boolean;
	adoptedSheetsCount: number;
	children: CETreeNode[];
}

/**
 * Recursively walk the DOM (including shadow roots) to find Custom Elements.
 * Returns only CE nodes; standard HTML nodes are traversed but not included
 * unless they contain CE descendants.
 */
function buildCETree(root: Element | DocumentFragment): CETreeNode[] {
	const nodes: CETreeNode[] = [];

	const children =
		root instanceof Element && root.shadowRoot
			? [...root.shadowRoot.children]
			: [...root.children];

	for (const child of children) {
		if (!(child instanceof HTMLElement)) continue;

		const isCE = child.tagName.includes('-');
		const hasShadow = child.shadowRoot !== null;
		const adoptedSheetsCount = hasShadow
			? (child.shadowRoot?.adoptedStyleSheets?.length ?? 0)
			: 0;

		// Recurse into children (and shadow root if present)
		const ceChildren = buildCETree(child);

		if (hasShadow) {
			const shadowChildren = buildCETree(child.shadowRoot!);
			ceChildren.push(...shadowChildren);
		}

		if (isCE) {
			nodes.push({
				tagName: child.tagName.toLowerCase(),
				hasShadow,
				adoptedSheetsCount,
				children: ceChildren,
			});
		} else {
			// Hoist CE descendants found inside standard elements
			nodes.push(...ceChildren);
		}
	}

	return nodes;
}

// ── Tree rendering ───────────────────────────────────────────────────

function renderTreeNodes(nodes: CETreeNode[], depth = 0): string {
	return nodes
		.map((node) => {
			const hasKids = node.children.length > 0;
			const indent = depth > 0 ? `style="padding-left: ${depth * 16}px"` : '';

			const shadowBadge = node.hasShadow
				? `<span class="tree-attr"> shadow</span>`
				: '';

			const sheetsBadge =
				node.adoptedSheetsCount > 0
					? `<span class="tree-sheets">${node.adoptedSheetsCount} sheet${node.adoptedSheetsCount > 1 ? 's' : ''}</span>`
					: '';

			if (hasKids) {
				return /* html */ `
					<li class="tree-node" ${indent}>
						<button class="tree-toggle" aria-expanded="true">
							▾ <span class="tree-tag">&lt;${node.tagName}&gt;</span>${shadowBadge}${sheetsBadge}
						</button>
						<ul>
							${renderTreeNodes(node.children, depth + 1)}
						</ul>
					</li>
				`;
			}

			return /* html */ `
				<li class="tree-node" ${indent}>
					<span class="tree-tag">&lt;${node.tagName} /&gt;</span>${shadowBadge}${sheetsBadge}
				</li>
			`;
		})
		.join('');
}

/**
 * Routes view.
 *
 * Lists all collected file-system routes with their pattern, file path,
 * and whether they have dynamic parameters.
 *
 * @module
 */

import type { RouteInfo } from '../devtools-panel.js';

interface RoutesState {
	routes: RouteInfo[];
	isLoading: boolean;
}

export function renderRoutesView(state: RoutesState): string {
	if (state.isLoading) {
		return /* html */ `
			<div class="loading">
				<div class="spinner"></div>
				Loading routes…
			</div>
		`;
	}

	if (state.routes.length === 0) {
		return /* html */ `
			<div class="view-header">
				<h2>Routes</h2>
				<div class="view-actions">
					<button class="action-btn action-refresh">↻ Refresh</button>
				</div>
			</div>
			<div class="empty-state">
				<p>No routes found.</p>
				<p>Routes are auto-detected from <code>src/routes/</code>.</p>
			</div>
		`;
	}

	const routeItems = state.routes
		.map(
			(route) => /* html */ `
		<li class="route-item">
			<span class="route-pattern">${escapeHtml(route.patternString)}</span>
			<span class="route-file">${escapeHtml(route.filePath)}</span>
			${route.hasParams ? '<span class="route-badge route-badge--dynamic">dynamic</span>' : '<span class="route-badge">static</span>'}
		</li>
	`,
		)
		.join('');

	return /* html */ `
		<div class="view-header">
			<h2>Routes <span style="opacity:0.4; font-weight:400; font-size:14px;">(${state.routes.length})</span></h2>
			<div class="view-actions">
				<button class="action-btn action-refresh">↻ Refresh</button>
			</div>
		</div>
		<ul class="route-list">
			${routeItems}
		</ul>
	`;
}

function escapeHtml(str: string): string {
	return str
		.replace(/&/g, '&amp;')
		.replace(/</g, '&lt;')
		.replace(/>/g, '&gt;')
		.replace(/"/g, '&quot;');
}

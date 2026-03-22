/**
 * General / Welcome view.
 *
 * Shows Gracile + Vite versions and a welcome message.
 *
 * @module
 */

import { GRACILE_LOGO_SVG } from '../icons.js';

interface GeneralState {
	gracileVersion: string;
	viteVersion: string;
	routes: { patternString: string }[];
	isLoading: boolean;
}

export function renderGeneralView(state: GeneralState): string {
	if (state.isLoading) {
		return /* html */ `
			<div class="loading">
				<div class="spinner"></div>
				Loading…
			</div>
		`;
	}

	const pageUrl = globalThis.location?.pathname ?? '/';

	return /* html */ `
		<div class="welcome">
			<div class="welcome__logo">${GRACILE_LOGO_SVG}</div>
			<h2 class="welcome__heading">Gracile DevTools</h2>
			<p class="welcome__sub">Inspect your application's routes, components, and state.</p>
		</div>

		<div class="info-grid">
			<div class="info-card">
				<span class="info-card__label">Gracile</span>
				<span class="info-card__value">v${escapeHtml(state.gracileVersion)}</span>
			</div>
			<div class="info-card">
				<span class="info-card__label">Vite</span>
				<span class="info-card__value">v${escapeHtml(state.viteVersion)}</span>
			</div>
			<div class="info-card">
				<span class="info-card__label">Routes</span>
				<span class="info-card__value">${state.routes.length}</span>
			</div>
			<div class="info-card">
				<span class="info-card__label">Current page</span>
				<span class="info-card__value">${escapeHtml(pageUrl)}</span>
			</div>
		</div>
	`;
}

function escapeHtml(string_: string): string {
	return string_
		.replaceAll('&', '&amp;')
		.replaceAll('<', '&lt;')
		.replaceAll('>', '&gt;')
		.replaceAll('"', '&quot;');
}

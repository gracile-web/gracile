/**
 * Gracile DevTools — client-side Custom Element.
 *
 * `<gracile-devtools>` renders as a floating Gracile logo button.
 * Clicking it opens a popover panel with tabs for inspecting the
 * running application: routes, component tree, general info, etc.
 *
 * The panel is intentionally self-contained (shadow DOM, no external
 * deps) so it never conflicts with user styles or scripts.
 *
 * @module
 */

import { DEVTOOLS_STYLES } from './styles.js';
import { GRACILE_LOGO_SVG } from './icons.js';
import {
	renderGeneralView,
	renderRoutesView,
	renderComponentTreeView,
	renderRegisteredCEsView,
} from './views/index.js';

// ── Types ────────────────────────────────────────────────────────────

type TabId = 'general' | 'routes' | 'components' | 'custom-elements';

interface DevtoolsState {
	activeTab: TabId;
	routes: RouteInfo[];
	gracileVersion: string;
	viteVersion: string;
	isLoading: boolean;
}

export interface RouteInfo {
	patternString: string;
	filePath: string;
	hasParams: boolean;
	pageAssets: string[];
}

// ── Constants ────────────────────────────────────────────────────────

const TAG_NAME = 'gracile-devtools';

const TABS: { id: TabId; label: string; icon: string }[] = [
	{ id: 'general', label: 'General', icon: 'info' },
	{ id: 'routes', label: 'Routes', icon: 'signpost' },
	{ id: 'components', label: 'Components', icon: 'tree-structure' },
	{ id: 'custom-elements', label: 'Custom Elements', icon: 'cube' },
];

// ── Custom Element ───────────────────────────────────────────────────

class GracileDevtools extends HTMLElement {
	#shadow: ShadowRoot;
	#state: DevtoolsState = {
		activeTab: 'general',
		routes: [],
		gracileVersion: '…',
		viteVersion: '…',
		isLoading: true,
	};

	constructor() {
		super();
		this.#shadow = this.attachShadow({ mode: 'open' });
	}

	connectedCallback(): void {
		this.#render();
		void this.#fetchData();
	}

	// ── Data fetching ──────────────────────────────────────────────

	async #fetchData(): Promise<void> {
		try {
			const res = await fetch('/__gracile_devtools__/api');
			if (res.ok) {
				const data = await res.json();
				this.#state.routes = data.routes ?? [];
				this.#state.gracileVersion = data.gracileVersion ?? '?';
				this.#state.viteVersion = data.viteVersion ?? '?';
			}
		} catch {
			// API not available — will show placeholder data
		} finally {
			this.#state.isLoading = false;
			this.#render();
		}
	}

	// ── Rendering ──────────────────────────────────────────────────

	#render(): void {
		const position = this.getAttribute('position') ?? 'bottom-center';

		this.#shadow.innerHTML = /* html */ `
			<style>${DEVTOOLS_STYLES}</style>

			<!-- Floating trigger button -->
			<button
				id="devtools-trigger"
				class="trigger trigger--${position}"
				popovertarget="devtools-panel"
				aria-label="Toggle Gracile DevTools"
			>
				${GRACILE_LOGO_SVG}
			</button>

			<!-- Popover panel -->
			<div
				id="devtools-panel"
				class="panel"
				popover
			>
				<div class="panel__layout">
					<!-- Sidebar navigation -->
					<nav class="panel__sidebar" aria-label="DevTools navigation">
						<div class="panel__sidebar-header">
							<span class="panel__logo">${GRACILE_LOGO_SVG}</span>
							<span class="panel__title">Gracile DevTools</span>
						</div>

						<ul class="panel__nav" role="tablist">
							${TABS.map(
								(tab) => /* html */ `
								<li role="presentation">
									<button
										role="tab"
										class="nav-item ${this.#state.activeTab === tab.id ? 'nav-item--active' : ''}"
										data-tab="${tab.id}"
										aria-selected="${this.#state.activeTab === tab.id}"
									>
										<span class="nav-item__icon">${getPhosphorIcon(tab.icon)}</span>
										<span class="nav-item__label">${tab.label}</span>
									</button>
								</li>
							`,
							).join('')}
						</ul>

						<div class="panel__sidebar-footer">
							<span class="badge">DEV</span>
						</div>
					</nav>

					<!-- Main content area -->
					<main class="panel__content" role="tabpanel">
						${this.#renderActiveView()}
					</main>
				</div>
			</div>
		`;

		// Attach event listeners
		this.#attachListeners();
	}

	#renderActiveView(): string {
		switch (this.#state.activeTab) {
			case 'general': {
				return renderGeneralView(this.#state);
			}
			case 'routes': {
				return renderRoutesView(this.#state);
			}
			case 'components': {
				return renderComponentTreeView();
			}
			case 'custom-elements': {
				return renderRegisteredCEsView();
			}
			default: {
				return '<p>Unknown view</p>';
			}
		}
	}

	// ── Event handling ─────────────────────────────────────────────

	#attachListeners(): void {
		// Tab switching
		const navItems =
			this.#shadow.querySelectorAll<HTMLButtonElement>('.nav-item');
		for (const item of navItems) {
			item.addEventListener('click', () => {
				const tabId = item.dataset['tab'] as TabId | undefined;
				if (tabId && tabId !== this.#state.activeTab) {
					this.#state.activeTab = tabId;
					this.#render();
				}
			});
		}

		// Component tree: expand/collapse
		const treeToggles =
			this.#shadow.querySelectorAll<HTMLElement>('.tree-toggle');
		for (const toggle of treeToggles) {
			toggle.addEventListener('click', () => {
				const target = toggle.nextElementSibling;
				if (target instanceof HTMLElement) {
					const isHidden = target.hidden;
					target.hidden = !isHidden;
					toggle.setAttribute('aria-expanded', String(!isHidden));
				}
			});
		}

		// Refresh button
		const refreshButton =
			this.#shadow.querySelector<HTMLButtonElement>('.action-refresh');
		if (refreshButton) {
			refreshButton.addEventListener('click', () => {
				this.#state.isLoading = true;
				this.#render();
				void this.#fetchData();
			});
		}
	}
}

// ── Icon helper ──────────────────────────────────────────────────────

/**
 * Returns an inline SVG for a Phosphor icon by name.
 * Uses the "regular" weight from https://phosphoricons.com/
 *
 * NOTE: We inline a small subset of icons to avoid a runtime dependency.
 * If an icon is not found, a generic placeholder is returned.
 */
function getPhosphorIcon(name: string): string {
	const icons: Record<string, string> = {
		// Info (circle-i)
		info: '<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 256 256" fill="currentColor"><path d="M128,24A104,104,0,1,0,232,128,104.11,104.11,0,0,0,128,24Zm0,192a88,88,0,1,1,88-88A88.1,88.1,0,0,1,128,216Zm-8-80V100a8,8,0,0,1,16,0v36a8,8,0,0,1-16,0Zm20-68a12,12,0,1,1-12-12A12,12,0,0,1,140,68Z"/></svg>',

		// Signpost
		signpost:
			'<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 256 256" fill="currentColor"><path d="M246.64,132.44l-40-40A8,8,0,0,0,201,88H136V40h24a8,8,0,0,0,0-16H96a8,8,0,0,0,0,16h24V88H40a8,8,0,0,0-8,8v64a8,8,0,0,0,8,8h80v56H96a8,8,0,0,0,0,16h64a8,8,0,0,0,0-16H136V168h65a8,8,0,0,0,5.66-2.34l40-40A8,8,0,0,0,246.64,132.44ZM198.34,152H48V104H198.34l32,24Z"/></svg>',

		// TreeStructure
		'tree-structure':
			'<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 256 256" fill="currentColor"><path d="M160,112h48a16,16,0,0,0,16-16V64a16,16,0,0,0-16-16H176V40a8,8,0,0,0-16,0v8H136V40a8,8,0,0,0-16,0V88H88V64A16,16,0,0,0,72,48H24A16,16,0,0,0,8,64V96a16,16,0,0,0,16,16H72a16,16,0,0,0,16-16V88h32v24a16,16,0,0,0,16,16h24v24H136a16,16,0,0,0-16,16v32a16,16,0,0,0,16,16h48a16,16,0,0,0,16-16V168a16,16,0,0,0-16-16H160V128h48a16,16,0,0,0,16-16V96h0ZM72,96H24V64H72Zm112,72h48v32H136V168Zm0-104h48V96h0H160Z"/></svg>',

		// Cube
		cube: '<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 256 256" fill="currentColor"><path d="M223.68,66.15,135.68,18a15.88,15.88,0,0,0-15.36,0l-88,48.17a16,16,0,0,0-8.32,14v95.64a16,16,0,0,0,8.32,14l88,48.17a15.88,15.88,0,0,0,15.36,0l88-48.17a16,16,0,0,0,8.32-14V80.18A16,16,0,0,0,223.68,66.15ZM128,32l80.34,44L128,120,47.66,76ZM40,90l80,43.78v85.79L40,175.82Zm96,129.57V133.82L216,90v85.82Z"/></svg>',
	};

	return (
		icons[name] ??
		'<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 256 256" fill="currentColor"><circle cx="128" cy="128" r="96" fill="none" stroke="currentColor" stroke-width="16"/></svg>'
	);
}

// ── Register ─────────────────────────────────────────────────────────

if (!customElements.get(TAG_NAME)) {
	customElements.define(TAG_NAME, GracileDevtools);
}

export { GracileDevtools };

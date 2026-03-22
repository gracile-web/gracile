/**
 * Gracile DevTools — scoped styles for the panel CE.
 *
 * All styles live inside Shadow DOM so they never leak out.
 * We use CSS custom properties for theming and native `popover`
 * for the panel show/hide behaviour.
 *
 * @module
 */

export const DEVTOOLS_STYLES = /* css */ `
	:host {
		/* Design tokens */
		--dt-bg:          #1a1a2e;
		--dt-bg-sidebar:  #16162a;
		--dt-bg-hover:    #252547;
		--dt-bg-active:   #2d2d5a;
		--dt-border:      #2a2a4a;
		--dt-text:        #e0e0f0;
		--dt-text-dim:    #8888aa;
		--dt-accent:      #57d5a3;
		--dt-accent-dim:  #3a9d76;
		--dt-danger:      #e06070;
		--dt-radius:      8px;
		--dt-radius-sm:   4px;
		--dt-font:        system-ui, -apple-system, 'Segoe UI', Roboto, sans-serif;
		--dt-font-mono:   'SF Mono', 'Cascadia Code', 'Fira Code', Consolas, monospace;
		--dt-font-size:   13px;

		display: block;
		font-family: var(--dt-font);
		font-size: var(--dt-font-size);
		position: fixed;
		z-index: 2147483647;
		pointer-events: none;
	}

	*, *::before, *::after {
		box-sizing: border-box;
	}

	/* ── Trigger button ─────────────────────────────────────────── */

	.trigger {
		pointer-events: auto;
		position: fixed;
		z-index: 2147483647;
		width: 42px;
		height: 42px;
		border-radius: 50%;
		border: 2px solid var(--dt-border);
		background: var(--dt-bg);
		cursor: pointer;
		padding: 6px;
		display: flex;
		align-items: center;
		justify-content: center;
		transition: transform 0.2s ease, box-shadow 0.2s ease, border-color 0.2s ease;
		box-shadow: 0 2px 12px rgba(0, 0, 0, 0.4);
		anchor-name: --devtools-trigger;
	}

	.trigger:hover {
		transform: scale(1.1);
		border-color: var(--dt-accent);
		box-shadow: 0 2px 20px rgba(87, 213, 163, 0.3);
	}

	.trigger:active {
		transform: scale(0.95);
	}

	.trigger svg {
		width: 26px;
		height: 26px;
	}

	/* Position variants */
	.trigger--bottom-center {
		bottom: 16px;
		left: 50%;
		translate: -50% 0;
	}
	.trigger--bottom-left {
		bottom: 16px;
		left: 16px;
	}
	.trigger--bottom-right {
		bottom: 16px;
		right: 16px;
	}

	/* ── Panel (popover) ────────────────────────────────────────── */

	.panel {
		pointer-events: auto;
		position: fixed;
		inset: unset;
		bottom: 72px;
		left: 50%;
		translate: -50% 0;
		margin: 0;
		padding: 0;
		border: 1px solid var(--dt-border);
		border-radius: var(--dt-radius);
		background: var(--dt-bg);
		color: var(--dt-text);
		width: min(900px, calc(100vw - 32px));
		height: min(520px, calc(100vh - 120px));
		box-shadow: 0 8px 40px rgba(0, 0, 0, 0.5),
		            0 0 0 1px rgba(87, 213, 163, 0.1);
		overflow: hidden;
		font-family: var(--dt-font);
		font-size: var(--dt-font-size);
	}

	/* Popover animation (progressive enhancement) */
	.panel:popover-open {
		opacity: 1;
		transform: translateY(0);
	}

	@starting-style {
		.panel:popover-open {
			opacity: 0;
			transform: translateY(8px);
		}
	}

	.panel {
		transition: opacity 0.2s ease, transform 0.2s ease,
		            display 0.2s ease allow-discrete,
		            overlay 0.2s ease allow-discrete;
	}

	/* ── Panel layout ───────────────────────────────────────────── */

	.panel__layout {
		display: grid;
		grid-template-columns: 200px 1fr;
		height: 100%;
	}

	/* ── Sidebar ─────────────────────────────────────────────────── */

	.panel__sidebar {
		display: flex;
		flex-direction: column;
		background: var(--dt-bg-sidebar);
		border-right: 1px solid var(--dt-border);
		overflow-y: auto;
	}

	.panel__sidebar-header {
		display: flex;
		align-items: center;
		gap: 8px;
		padding: 14px 14px 10px;
		border-bottom: 1px solid var(--dt-border);
	}

	.panel__logo {
		width: 22px;
		height: 22px;
		flex-shrink: 0;
	}

	.panel__logo svg {
		width: 100%;
		height: 100%;
	}

	.panel__title {
		font-size: 13px;
		font-weight: 600;
		color: var(--dt-text);
		white-space: nowrap;
	}

	.panel__nav {
		list-style: none;
		margin: 0;
		padding: 8px 6px;
		flex: 1;
	}

	.panel__nav li {
		margin-bottom: 2px;
	}

	.nav-item {
		display: flex;
		align-items: center;
		gap: 8px;
		width: 100%;
		padding: 8px 10px;
		border: none;
		border-radius: var(--dt-radius-sm);
		background: transparent;
		color: var(--dt-text-dim);
		cursor: pointer;
		font: inherit;
		font-size: var(--dt-font-size);
		text-align: left;
		transition: background 0.15s, color 0.15s;
	}

	.nav-item:hover {
		background: var(--dt-bg-hover);
		color: var(--dt-text);
	}

	.nav-item--active {
		background: var(--dt-bg-active);
		color: var(--dt-accent);
	}

	.nav-item__icon {
		display: flex;
		align-items: center;
		flex-shrink: 0;
	}

	.nav-item__icon svg {
		width: 18px;
		height: 18px;
	}

	.nav-item__label {
		white-space: nowrap;
	}

	/* Sidebar footer */
	.panel__sidebar-footer {
		padding: 10px 14px;
		border-top: 1px solid var(--dt-border);
	}

	.badge {
		display: inline-block;
		padding: 2px 8px;
		font-size: 10px;
		font-weight: 700;
		letter-spacing: 0.05em;
		border-radius: 9999px;
		background: var(--dt-accent-dim);
		color: var(--dt-bg);
	}

	/* ── Content area ────────────────────────────────────────────── */

	.panel__content {
		overflow-y: auto;
		padding: 20px 24px;
	}

	/* ── Shared view styles ──────────────────────────────────────── */

	.view-header {
		display: flex;
		align-items: center;
		justify-content: space-between;
		margin-bottom: 20px;
	}

	.view-header h2 {
		margin: 0;
		font-size: 18px;
		font-weight: 600;
		color: var(--dt-text);
	}

	.view-header .view-actions {
		display: flex;
		gap: 8px;
	}

	/* Action buttons */
	.action-btn {
		display: inline-flex;
		align-items: center;
		gap: 4px;
		padding: 5px 10px;
		border: 1px solid var(--dt-border);
		border-radius: var(--dt-radius-sm);
		background: transparent;
		color: var(--dt-text-dim);
		cursor: pointer;
		font: inherit;
		font-size: 12px;
		transition: border-color 0.15s, color 0.15s;
	}

	.action-btn:hover {
		border-color: var(--dt-accent);
		color: var(--dt-accent);
	}

	/* Info cards */
	.info-grid {
		display: grid;
		grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
		gap: 12px;
	}

	.info-card {
		background: var(--dt-bg-sidebar);
		border: 1px solid var(--dt-border);
		border-radius: var(--dt-radius-sm);
		padding: 14px;
	}

	.info-card__label {
		display: block;
		font-size: 11px;
		font-weight: 600;
		text-transform: uppercase;
		letter-spacing: 0.04em;
		color: var(--dt-text-dim);
		margin-bottom: 6px;
	}

	.info-card__value {
		display: block;
		font-size: 16px;
		font-weight: 500;
		color: var(--dt-accent);
		font-family: var(--dt-font-mono);
	}

	/* Route list */
	.route-list {
		list-style: none;
		margin: 0;
		padding: 0;
	}

	.route-item {
		display: grid;
		grid-template-columns: minmax(120px, auto) 1fr auto;
		gap: 12px;
		align-items: center;
		padding: 10px 12px;
		border-bottom: 1px solid var(--dt-border);
		transition: background 0.1s;
	}

	.route-item:hover {
		background: var(--dt-bg-hover);
	}

	.route-item:last-child {
		border-bottom: none;
	}

	.route-pattern {
		font-family: var(--dt-font-mono);
		font-size: 13px;
		color: var(--dt-accent);
		word-break: break-all;
	}

	.route-file {
		font-family: var(--dt-font-mono);
		font-size: 12px;
		color: var(--dt-text-dim);
		word-break: break-all;
	}

	.route-badge {
		font-size: 10px;
		padding: 2px 6px;
		border-radius: 9999px;
		border: 1px solid var(--dt-border);
		color: var(--dt-text-dim);
		white-space: nowrap;
	}

	.route-badge--dynamic {
		border-color: var(--dt-accent-dim);
		color: var(--dt-accent);
	}

	/* Component tree */
	.tree {
		list-style: none;
		margin: 0;
		padding: 0;
		font-family: var(--dt-font-mono);
		font-size: 13px;
	}

	.tree ul {
		list-style: none;
		margin: 0;
		padding-left: 20px;
	}

	.tree-node {
		padding: 3px 0;
	}

	.tree-toggle {
		background: none;
		border: none;
		color: var(--dt-text-dim);
		cursor: pointer;
		padding: 2px 6px;
		border-radius: var(--dt-radius-sm);
		font: inherit;
		display: inline-flex;
		align-items: center;
		gap: 4px;
		transition: background 0.1s, color 0.1s;
	}

	.tree-toggle:hover {
		background: var(--dt-bg-hover);
		color: var(--dt-text);
	}

	.tree-tag {
		color: var(--dt-accent);
	}

	.tree-attr {
		color: var(--dt-text-dim);
		font-size: 11px;
	}

	.tree-sheets {
		color: var(--dt-text-dim);
		font-size: 11px;
		font-style: italic;
		margin-left: 8px;
	}

	/* Placeholder */
	.placeholder {
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		min-height: 200px;
		text-align: center;
		color: var(--dt-text-dim);
		gap: 8px;
	}

	.placeholder__icon {
		opacity: 0.4;
	}

	.placeholder__icon svg {
		width: 48px;
		height: 48px;
	}

	.placeholder__text {
		font-size: 14px;
	}

	.placeholder__sub {
		font-size: 12px;
		opacity: 0.6;
	}

	/* Loading spinner */
	.loading {
		display: flex;
		align-items: center;
		justify-content: center;
		min-height: 100px;
		color: var(--dt-text-dim);
	}

	@keyframes spin {
		to { transform: rotate(360deg); }
	}

	.spinner {
		width: 20px;
		height: 20px;
		border: 2px solid var(--dt-border);
		border-top-color: var(--dt-accent);
		border-radius: 50%;
		animation: spin 0.8s linear infinite;
		margin-right: 8px;
	}

	/* Welcome section */
	.welcome {
		text-align: center;
		padding: 20px 0 30px;
	}

	.welcome__logo {
		width: 64px;
		height: 64px;
		margin: 0 auto 16px;
	}

	.welcome__logo svg {
		width: 100%;
		height: 100%;
	}

	.welcome__heading {
		font-size: 20px;
		font-weight: 600;
		margin: 0 0 4px;
		color: var(--dt-text);
	}

	.welcome__sub {
		font-size: 13px;
		color: var(--dt-text-dim);
		margin: 0 0 24px;
	}

	/* Empty state for route list */
	.empty-state {
		padding: 32px 0;
		text-align: center;
		color: var(--dt-text-dim);
	}
`;

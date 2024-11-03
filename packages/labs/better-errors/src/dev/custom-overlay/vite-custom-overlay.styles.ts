import { css } from 'lit';

export const style = css`
	:host {
		--sl-color-emerald-50: rgb(236, 253, 245);
		--sl-color-emerald-100: rgb(209, 250, 229);
		--sl-color-emerald-200: rgb(167, 243, 208);
		--sl-color-emerald-300: rgb(110, 231, 183);
		--sl-color-emerald-400: rgb(52, 211, 153);
		--sl-color-emerald-500: rgb(16, 185, 129);
		--sl-color-emerald-600: rgb(5, 150, 105);
		--sl-color-emerald-700: rgb(4, 120, 87);
		--sl-color-emerald-800: rgb(6, 95, 70);
		--sl-color-emerald-900: rgb(6, 78, 59);
		--sl-color-emerald-950: rgb(3, 45, 34);

		--sl-color-neutral-50: var(--sl-color-gray-50);
		--sl-color-neutral-100: var(--sl-color-gray-100);
		--sl-color-neutral-200: var(--sl-color-gray-200);
		--sl-color-neutral-300: var(--sl-color-gray-300);
		--sl-color-neutral-400: var(--sl-color-gray-400);
		--sl-color-neutral-500: var(--sl-color-gray-500);
		--sl-color-neutral-600: var(--sl-color-gray-600);
		--sl-color-neutral-700: var(--sl-color-gray-700);
		--sl-color-neutral-800: var(--sl-color-gray-800);
		--sl-color-neutral-900: var(--sl-color-gray-900);
		--sl-color-neutral-950: var(--sl-color-gray-950);

		--sl-color-sky-50: hsl(203 63.8% 20.9%);
		--sl-color-sky-100: hsl(203.4 70.4% 28%);
		--sl-color-sky-200: hsl(202.7 75.8% 30.8%);
		--sl-color-sky-300: hsl(203.1 80.4% 36.1%);
		--sl-color-sky-400: hsl(202.1 80.5% 44.3%);
		--sl-color-sky-500: hsl(199.7 85.9% 47.7%);
		--sl-color-sky-600: hsl(198.7 97.9% 57.2%);
		--sl-color-sky-700: hsl(198.7 100% 70.5%);
		--sl-color-sky-800: hsl(198.8 100% 82.5%);
		--sl-color-sky-900: hsl(198.5 100% 89.9%);
		--sl-color-sky-950: hsl(186 100% 95.5%);
	}

	/*  */

	* {
		box-sizing: border-box;
	}

	:host {
		/** Needed so Playwright can find the element */
		position: fixed;
		top: 0;
		left: 0;
		width: 100%;
		height: 100%;
		z-index: 99999;

		/* Fonts */
		--font-normal: system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI',
			'Roboto', 'Oxygen', 'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans',
			'Helvetica Neue', Arial, sans-serif;
		--font-monospace: ui-monospace, Menlo, Monaco, 'Cascadia Mono',
			'Segoe UI Mono', 'Roboto Mono', 'Oxygen Mono', 'Ubuntu Monospace',
			'Source Code Pro', 'Fira Mono', 'Droid Sans Mono', 'Courier New',
			monospace;

		/* Borders */
		--roundiness: 4px;

		/* Colors */
		--background: #ffffff;
		--error-text: #ba1212;
		--error-text-hover: #a10000;
		--title-text: #090b11;
		--box-background: #f3f4f7;
		--box-background-hover: #dadbde;
		--hint-text: #505d84;
		--hint-text-hover: #37446b;
		--border: #c3cadb;
		--accent: var(--sl-color-emerald-700);
		--accent-hover: var(--sl-color-emerald-800);
		/* --accent: #5f11a6;
		--accent-hover: #792bc0; */
		--stack-text: #3d4663;
		--misc-text: #6474a2;

		--betterr-logo-overlay: linear-gradient(
			180deg,
			rgba(255, 255, 255, 0) 3.95%,
			rgba(255, 255, 255, 0.0086472) 9.68%,
			rgba(255, 255, 255, 0.03551) 15.4%,
			rgba(255, 255, 255, 0.0816599) 21.13%,
			rgba(255, 255, 255, 0.147411) 26.86%,
			rgba(255, 255, 255, 0.231775) 32.58%,
			rgba(255, 255, 255, 0.331884) 38.31%,
			rgba(255, 255, 255, 0.442691) 44.03%,
			rgba(255, 255, 255, 0.557309) 49.76%,
			rgba(255, 255, 255, 0.668116) 55.48%,
			rgba(255, 255, 255, 0.768225) 61.21%,
			rgba(255, 255, 255, 0.852589) 66.93%,
			rgba(255, 255, 255, 0.91834) 72.66%,
			rgba(255, 255, 255, 0.96449) 78.38%,
			rgba(255, 255, 255, 0.991353) 84.11%,
			#ffffff 89.84%
		);

		/* Theme toggle */
		--toggle-ball-color: var(--accent);
		--toggle-table-background: var(--background);
		--sun-icon-color: #ffffff;
		--moon-icon-color: #a3acc8;
		--toggle-border-color: #c3cadb;

		/* Syntax Highlighting */
		--betterr-code-foreground: #000000;
		--betterr-code-token-constant: #4ca48f;
		--betterr-code-token-string: #9f722a;
		--betterr-code-token-comment: #8490b5;
		--betterr-code-token-keyword: var(--accent);
		--betterr-code-token-parameter: #aa0000;
		--betterr-code-token-function: #4ca48f;
		--betterr-code-token-string-expression: #9f722a;
		--betterr-code-token-punctuation: #000000;
		--betterr-code-token-link: #9f722a;
	}

	:host(.betterr-dark) {
		--background: #090b11;
		--error-text: #f49090;
		--error-text-hover: #ffaaaa;
		--title-text: #ffffff;
		--box-background: #141925;
		--box-background-hover: #2e333f;
		--hint-text: #a3acc8;
		--hint-text-hover: #bdc6e2;
		--border: #283044;
		--accent: var(--sl-color-emerald-300);
		--accent-hover: var(--sl-color-emerald-200);
		/* --accent: #c490f4;
		--accent-hover: #deaaff; */
		--stack-text: #c3cadb;
		--misc-text: #8490b5;

		--betterr-logo-overlay: linear-gradient(
			180deg,
			rgba(9, 11, 17, 0) 3.95%,
			rgba(9, 11, 17, 0.0086472) 9.68%,
			rgba(9, 11, 17, 0.03551) 15.4%,
			rgba(9, 11, 17, 0.0816599) 21.13%,
			rgba(9, 11, 17, 0.147411) 26.86%,
			rgba(9, 11, 17, 0.231775) 32.58%,
			rgba(9, 11, 17, 0.331884) 38.31%,
			rgba(9, 11, 17, 0.442691) 44.03%,
			rgba(9, 11, 17, 0.557309) 49.76%,
			rgba(9, 11, 17, 0.668116) 55.48%,
			rgba(9, 11, 17, 0.768225) 61.21%,
			rgba(9, 11, 17, 0.852589) 66.93%,
			rgba(9, 11, 17, 0.91834) 72.66%,
			rgba(9, 11, 17, 0.96449) 78.38%,
			rgba(9, 11, 17, 0.991353) 84.11%,
			#090b11 89.84%
		);

		/* Theme toggle */
		--sun-icon-color: #505d84;
		--moon-icon-color: #090b11;
		--toggle-border-color: #3d4663;

		/* Syntax Highlighting */
		--betterr-code-foreground: #ffffff;
		--betterr-code-token-constant: #90f4e3;
		--betterr-code-token-string: #f4cf90;
		--betterr-code-token-comment: #8490b5;
		--betterr-code-token-keyword: var(--accent);
		--betterr-code-token-parameter: #aa0000;
		--betterr-code-token-function: #90f4e3;
		--betterr-code-token-string-expression: #f4cf90;
		--betterr-code-token-punctuation: #ffffff;
		--betterr-code-token-link: #f4cf90;
	}

	#theme-toggle-wrapper {
		position: relative;
		display: inline-block;
	}

	#theme-toggle-wrapper > div {
		position: absolute;
		right: 3px;
		margin-top: 3px;
	}

	.theme-toggle-checkbox {
		opacity: 0;
		position: absolute;
	}

	#theme-toggle-label {
		background-color: var(--toggle-table-background);
		border-radius: 50px;
		cursor: pointer;
		display: flex;
		align-items: center;
		justify-content: space-between;
		padding: 7.5px;
		position: relative;
		width: 66px;
		height: 30px;
		transform: scale(1.2);
		box-shadow: 0 0 0 1px var(--toggle-border-color);
		outline: 1px solid transparent;
	}

	.theme-toggle-checkbox:focus ~ #theme-toggle-label {
		outline: 2px solid var(--toggle-border-color);
		outline-offset: 4px;
	}

	#theme-toggle-label #theme-toggle-ball {
		background-color: var(--accent);
		border-radius: 50%;
		position: absolute;
		height: 30px;
		width: 30px;
		transform: translateX(-7.5px);
		transition: all 0.5s cubic-bezier(0.23, 1, 0.32, 1) 0ms;
	}

	@media (forced-colors: active) {
		#theme-toggle-label {
			--moon-icon-color: CanvasText;
			--sun-icon-color: CanvasText;
		}
		#theme-toggle-label #theme-toggle-ball {
			background-color: SelectedItem;
		}
	}

	.theme-toggle-checkbox:checked + #theme-toggle-label #theme-toggle-ball {
		transform: translateX(28.5px);
	}

	.sr-only {
		border: 0 !important;
		clip: rect(1px, 1px, 1px, 1px) !important;
		-webkit-clip-path: inset(50%) !important;
		clip-path: inset(50%) !important;
		height: 1px !important;
		margin: -1px !important;
		overflow: hidden !important;
		padding: 0 !important;
		position: absolute !important;
		width: 1px !important;
		white-space: nowrap !important;
	}

	.icon-tabler {
		transition: all 0.5s cubic-bezier(0.23, 1, 0.32, 1) 0ms;
		z-index: 10;
	}

	.icon-tabler-moon {
		color: var(--moon-icon-color);
	}

	.icon-tabler-sun {
		color: var(--sun-icon-color);
	}

	#backdrop {
		font-family: var(--font-monospace);
		position: fixed;
		z-index: 99999;
		top: 0;
		left: 0;
		width: 100%;
		height: 100%;
		background: var(--background);
		overflow-y: auto;
	}

	#layout {
		max-width: min(100%, 1280px);
		position: relative;
		width: 1280px;
		margin: 0 auto;
		padding: 40px;
		display: flex;
		flex-direction: column;
		gap: 24px;
	}

	@media (max-width: 768px) {
		#header {
			padding: 12px;
			margin-top: 12px;
		}

		#theme-toggle-wrapper > div {
			position: absolute;
			right: 22px;
			margin-top: 47px;
		}

		#layout {
			padding: 0;
		}
	}

	@media (max-width: 1024px) {
		#betterr-logo,
		#betterr-logo-overlay {
			display: none;
		}
	}

	#header {
		position: relative;
		margin-top: 48px;
	}

	#header-left {
		min-height: 63px;
		display: flex;
		align-items: flex-start;
		flex-direction: column;
		justify-content: end;
	}

	#name {
		font-size: 18px;
		font-weight: normal;
		line-height: 22px;
		color: var(--error-text);
		margin: 0;
		padding: 0;
	}

	#title {
		font-size: 34px;
		line-height: 41px;
		font-weight: 600;
		margin: 0;
		padding: 0;
		color: var(--title-text);
		font-family: var(--font-normal);
	}

	#betterr-logo {
		position: absolute;
		bottom: -50px;
		right: 72px;
		top: -20px;

		z-index: -50;
		color: var(--error-text);
	}

	#betterr-logo-overlay {
		width: 175px;
		height: 250px;
		position: absolute;
		bottom: -100px;
		right: 32px;
		z-index: -25;
		background: var(--betterr-logo-overlay);
	}

	#message-hints,
	#stack,
	#code,
	#cause {
		border-radius: var(--roundiness);
		background-color: var(--box-background);
	}

	#message,
	#hint {
		display: flex;
		padding: 16px;
		gap: 16px;
	}

	#message-content,
	#hint-content {
		white-space: pre-wrap;
		line-height: 26px;
		flex-grow: 1;
	}

	#message {
		color: var(--error-text);
	}

	#message-content a {
		color: var(--error-text);
	}

	#message-content a:hover {
		color: var(--error-text-hover);
	}

	#hint {
		color: var(--hint-text);
		border-top: 1px solid var(--border);
		display: none;
	}

	#hint a {
		color: var(--hint-text);
	}

	#hint a:hover {
		color: var(--hint-text-hover);
	}

	#message-hints code {
		font-family: var(--font-monospace);
		background-color: var(--border);
		padding: 2px 4px;
		border-radius: var(--roundiness);
		white-space: nowrap;
	}

	.link {
		min-width: fit-content;
		padding-right: 8px;
		padding-top: 8px;
	}

	.link button {
		background: none;
		border: none;
		font-size: inherit;
		font-family: inherit;
	}

	.link a,
	.link button {
		color: var(--accent);
		text-decoration: none;
		display: flex;
		gap: 8px;
	}

	.link a:hover,
	.link button:hover {
		color: var(--accent-hover);
		text-decoration: underline;
		cursor: pointer;
	}

	.link svg {
		vertical-align: text-top;
	}

	#code {
		display: none;
	}

	#code header {
		padding: 24px;
		display: flex;
		justify-content: space-between;
		gap: 1rem;
	}

	#code h2 {
		font-family: var(--font-monospace);
		color: var(--title-text);
		font-size: 18px;
		margin: 0;
		overflow-wrap: anywhere;
	}

	#code .link {
		padding: 0;
	}

	.shiki {
		margin: 0;
		border-top: 1px solid var(--border);
		max-height: 17rem;
		overflow: auto;
	}

	.shiki code {
		font-family: var(--font-monospace);
		counter-reset: step;
		counter-increment: step 0;
		font-size: 14px;
		line-height: 21px;
		tab-size: 1;
	}

	.shiki code .line:not(.error-caret)::before {
		content: counter(step);
		counter-increment: step;
		width: 1rem;
		margin-right: 16px;
		display: inline-block;
		text-align: right;
		padding: 0 8px;
		color: var(--misc-text);
		border-right: solid 1px var(--border);
	}

	.shiki code .line:first-child::before {
		padding-top: 8px;
	}

	.shiki code .line:last-child::before {
		padding-bottom: 8px;
	}

	.error-line {
		background-color: #f4909026;
		display: inline-block;
		width: 100%;
	}

	.error-caret {
		margin-left: calc(33px + 1rem);
		color: var(--error-text);
	}

	#stack h2,
	#cause h2 {
		color: var(--title-text);
		font-family: var(--font-normal);
		font-size: 22px;
		margin: 0;
		padding: 24px;
		border-bottom: 1px solid var(--border);
	}

	#stack-content,
	#cause-content {
		font-size: 14px;
		white-space: pre;
		line-height: 21px;
		overflow: auto;
		padding: 24px;
		color: var(--stack-text);
	}

	#cause {
		/* display: none; */
	}
`;

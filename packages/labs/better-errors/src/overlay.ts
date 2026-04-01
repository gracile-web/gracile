/**
 * Self-contained Vite error overlay for Gracile.
 *
 * Ported from Astro's error overlay (MIT License, Astro contributors).
 * @see https://github.com/withastro/astro/blob/main/packages/astro/src/core/errors/overlay.ts
 *
 * Customized with Gracile branding (logo, accent colors, localStorage keys).
 * The overlay is designed to be fully inlined into Vite's client bundle
 * with no external runtime dependencies (no Lit, no framework imports).
 */

import type { BetterErrorPayload } from './dev/vite.js';

// Gracile logo SVG (compact "g" mark) used in the overlay header.
const gracileLogo =
	/* html */
	`<svg xmlns="http://www.w3.org/2000/svg" aria-hidden="true" width="120" height="120" xml:space="preserve" style="fill-rule:evenodd;clip-rule:evenodd;stroke-linejoin:round;stroke-miterlimit:2" viewBox="0 0 630 630"><g transform="matrix(.877 .23499 -.25635 .95673 119.498 -60.39)"><circle cx="315" cy="315" r="315" style="fill:url(#gracile-logo-grad)"/><path d="M315 0c173.853 0 315 141.147 315 315S488.853 630 315 630 0 488.853 0 315 141.147 0 315 0Zm0 13.125c166.309 0 300.682 135.566 300.682 301.875S481.309 616.875 315 616.875C148.691 616.875 14.318 481.309 14.318 315S148.691 13.125 315 13.125Z" style="fill:currentColor"/></g><path d="M.238.087A.195.195 0 0 1 .135.058.215.215 0 0 1 .06-.029a.293.293 0 0 1-.028-.135c0-.051.008-.103.024-.156a.699.699 0 0 1 .162-.278.475.475 0 0 1 .115-.089.258.258 0 0 1 .121-.032.14.14 0 0 1 .07.016c.017.011.03.026.038.044a.158.158 0 0 1 .011.058.215.215 0 0 1-.012.07.181.181 0 0 1-.034.058C.512-.458.496-.45.479-.45a.036.036 0 0 1-.022-.007.073.073 0 0 1-.02-.026.162.162 0 0 0 .034-.035.303.303 0 0 0 .032-.056.135.135 0 0 0 .014-.054.05.05 0 0 0-.012-.034C.496-.671.482-.675.463-.675a.16.16 0 0 0-.092.033.447.447 0 0 0-.091.089.764.764 0 0 0-.152.4c0 .061.013.108.04.141.026.034.057.051.094.051A.127.127 0 0 0 .338.013a.243.243 0 0 0 .061-.069.454.454 0 0 0 .062-.19.9.9 0 0 0-.051-.008 1.011 1.011 0 0 0-.056-.002H.322l-.034.002a.1.1 0 0 1 .029-.052.076.076 0 0 1 .051-.016c.02 0 .04.003.061.009a4.452 4.452 0 0 0 .123.039l-.01.031-.029.091a.854.854 0 0 0-.026.108l-.002.043.001.042.002.052C.468.09.453.085.444.076A.063.063 0 0 1 .425.044.148.148 0 0 1 .42.009v-.01l.001-.01a.317.317 0 0 1-.08.071.2.2 0 0 1-.103.027Z" style="fill-rule:nonzero" transform="translate(115.745 497.368) scale(589.0308)"/><defs><radialGradient id="gracile-logo-grad" cx="0" cy="0" r="1" gradientTransform="matrix(315 0 0 315 315 315)" gradientUnits="userSpaceOnUse"><stop offset="0" style="stop-color:white;stop-opacity:1"/><stop offset="1" style="stop-color:#57d5a3;stop-opacity:1"/></radialGradient></defs></svg>`;

const style = /* css */ `
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
  --font-normal: system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI",
    "Roboto", "Oxygen", "Ubuntu", "Cantarell", "Fira Sans", "Droid Sans",
    "Helvetica Neue", Arial, sans-serif;
  --font-monospace: ui-monospace, Menlo, Monaco, "Cascadia Mono",
    "Segoe UI Mono", "Roboto Mono", "Oxygen Mono", "Ubuntu Monospace",
    "Source Code Pro", "Fira Mono", "Droid Sans Mono", "Courier New", monospace;

  /* Borders */
  --roundiness: 4px;

  /* Colors — Gracile green accent */
  --background: #ffffff;
  --error-text: #ba1212;
  --error-text-hover: #a10000;
  --success-text: #10b981;
  --title-text: #090b11;
  --box-background: #f3f4f7;
  --box-background-hover: #dadbde;
  --hint-text: #505d84;
  --hint-text-hover: #37446b;
  --border: #c3cadb;
  --accent: #0fa878;
  --accent-hover: #12c98f;
  --stack-text: #3d4663;
  --misc-text: #6474a2;

  --logo-overlay: linear-gradient(
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
    --toggle-border-color: #C3CADB;

  /* Syntax Highlighting */
  --gracile-code-foreground: #000000;
  --gracile-code-token-constant: #4ca48f;
  --gracile-code-token-string: #9f722a;
  --gracile-code-token-comment: #8490b5;
  --gracile-code-token-keyword: var(--accent);
  --gracile-code-token-parameter: #aa0000;
  --gracile-code-token-function: #4ca48f;
  --gracile-code-token-string-expression: #9f722a;
  --gracile-code-token-punctuation: #000000;
  --gracile-code-token-link: #9f722a;
}

:host(.gracile-dark) {
  --background: #090b11;
  --error-text: #f49090;
  --error-text-hover: #ffaaaa;
  --title-text: #ffffff;
  --box-background: #141925;
  --box-background-hover: #2e333f;
  --hint-text: #a3acc8;
  --hint-text-hover: #bdc6e2;
  --border: #283044;
  --accent: #57d5a3;
  --accent-hover: #7ae4bb;
  --stack-text: #c3cadb;
  --misc-text: #8490b5;

  --logo-overlay: linear-gradient(
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
  --sun-icon-color: #505D84;
  --moon-icon-color: #090B11;
  --toggle-border-color: #3D4663;

  /* Syntax Highlighting */
  --gracile-code-foreground: #ffffff;
  --gracile-code-token-constant: #90f4e3;
  --gracile-code-token-string: #f4cf90;
  --gracile-code-token-comment: #8490b5;
  --gracile-code-token-keyword: var(--accent);
  --gracile-code-token-parameter: #aa0000;
  --gracile-code-token-function: #90f4e3;
  --gracile-code-token-string-expression: #f4cf90;
  --gracile-code-token-punctuation: #ffffff;
  --gracile-code-token-link: #f4cf90;
}

#theme-toggle-wrapper{
  position: relative;
  display: inline-block
}

#theme-toggle-wrapper > div{
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

.icon-tabler{
  transition: all 0.5s cubic-bezier(0.23, 1, 0.32, 1) 0ms;
  z-index: 10;
}

.icon-tabler-moon {
	color: var(--moon-icon-color);
}

.icon-tabler-sun {
	color: var(--sun-icon-color);
}

.icon-tabler-copy {
	color: var(--title-text);
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

  #theme-toggle-wrapper > div{
    position: absolute;
    right: 22px;
    margin-top: 47px;
  }

  #layout {
    padding: 0;
  }
}

@media (max-width: 1024px) {
  #gracile-logo,
  #logo-overlay {
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

#gracile-logo {
  position: absolute;
  bottom: -50px;
  right: 32px;
  z-index: -50;
  width: 120px;
  height: 120px;
  color: var(--error-text);
}

#logo-overlay {
  width: 175px;
  height: 250px;
  position: absolute;
  bottom: -100px;
  right: 32px;
  z-index: -25;
  background: var(--logo-overlay);
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

.link a, .link button {
  color: var(--accent);
  text-decoration: none;
  display: flex;
  gap: 8px;
}

.link a:hover, .link button:hover {
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

#code header,
#stack header {
  padding: 24px;
  display: flex;
  justify-content: space-between;
  gap: 1rem;
}

#stack header {
  border-bottom: 1px solid var(--border);
}

#copy-btn {
  cursor: pointer;
}

#copy-btn:hover {
  color: var(--accent-hover);
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
}

#cause h2 {
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
  display: none;
}
`;

const overlayTemplate = /* html */ `
<style>
${style.trim()}
</style>
<div id="backdrop">
  <div id="layout">
    <div id="theme-toggle-wrapper">
      <div>
        <input type="checkbox" class="theme-toggle-checkbox" id="chk" />
        <label id="theme-toggle-label" for="chk">
          <svg xmlns="http://www.w3.org/2000/svg" aria-hidden="true" class="icon-tabler icon-tabler-sun" width="15px" height="15px" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" fill="none" stroke-linecap="round" stroke-linejoin="round">
            <path stroke="none" d="M0 0h24v24H0z" fill="none"/>
            <circle cx="12" cy="12" r="4" />
            <path d="M3 12h1m8 -9v1m8 8h1m-9 8v1m-6.4 -15.4l.7 .7m12.1 -.7l-.7 .7m0 11.4l.7 .7m-12.1 -.7l-.7 .7" />
          </svg>
          <svg xmlns="http://www.w3.org/2000/svg" aria-hidden="true" class="icon-tabler icon-tabler-moon"  width="15" height="15" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" fill="none" stroke-linecap="round" stroke-linejoin="round">
            <path stroke="none" d="M0 0h24v24H0z" fill="none"/>
            <path d="M12 3c.132 0 .263 0 .393 0a7.5 7.5 0 0 0 7.92 12.446a9 9 0 1 1 -8.313 -12.454z" />
          </svg>
          <div id="theme-toggle-ball">
            <span class="sr-only">Use dark theme</span>
          </div>
        </label>
      </div>
    </div>
    <header id="header">
      <section id="header-left">
        <h2 id="name"></h2>
        <h1 id="title">An error occurred.</h1>
      </section>
      <div id="logo-overlay"></div>
      <div id="gracile-logo">
        ${gracileLogo}
      </div>
    </header>

    <section id="message-hints">
      <section id="message">
        <span id="message-icon">
          <svg xmlns="http://www.w3.org/2000/svg" aria-hidden="true" width="24" height="24" fill="none"><path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M12 7v6m0 4.01.01-.011M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10Z"/></svg>
        </span>
        <div id="message-content"></div>
      </section>
      <section id="hint">
        <span id="hint-icon">
          <svg xmlns="http://www.w3.org/2000/svg" aria-hidden="true" width="24" height="24" fill="none"><path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="m21 2-1 1M3 2l1 1m17 13-1-1M3 16l1-1m5 3h6m-5 3h4M12 3C8 3 5.952 4.95 6 8c.023 1.487.5 2.5 1.5 3.5S9 13 9 15h6c0-2 .5-2.5 1.5-3.5h0c1-1 1.477-2.013 1.5-3.5.048-3.05-2-5-6-5Z"/></svg>
        </span>
        <div id="hint-content"></div>
      </section>
    </section>

		<section id="code">
			<header>
				<h2></h2>
			</header>
			<div id="code-content"></div>
		</section>

    <section id="stack">
      <header>
        <h2>Stack Trace</h2>
        <span id="copy-btn">
          <svg xmlns="http://www.w3.org/2000/svg" aria-hidden="true" class="icon-tabler icon-tabler-copy" width="24" height="24" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" fill="none" stroke-linecap="round" stroke-linejoin="round">
            <path stroke="none" d="M0 0h24v24H0z" fill="none"/>
            <path d="M8 8m0 2a2 2 0 0 1 2 -2h8a2 2 0 0 1 2 2v8a2 2 0 0 1 -2 2h-8a2 2 0 0 1 -2 -2z" />
            <path d="M16 8v-2a2 2 0 0 0 -2 -2h-8a2 2 0 0 0 -2 2v8a2 2 0 0 0 2 2h2" />
          </svg>
        </span>
      </header>
      <div id="stack-content"></div>
    </section>

    <section id="cause">
      <h2>Cause</h2>
      <div id="cause-content"></div>
    </section>
  </div>
</div>
`;

const openNewWindowIcon =
	/* html */
	'<svg xmlns="http://www.w3.org/2000/svg" aria-hidden="true" width="16" height="16" fill="none"><path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M14 2h-4m4 0L8 8m6-6v4"/><path stroke="currentColor" stroke-linecap="round" stroke-width="1.5" d="M14 8.667V12a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h3.333"/></svg>';

const checkmarkIconSvg =
	/* html */
	`<svg xmlns="http://www.w3.org/2000/svg" aria-hidden="true" class="icon-tabler icon-tabler-check" width="24" height="24" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" fill="none" stroke-linecap="round" stroke-linejoin="round"><path stroke="none" d="M0 0h24v24H0z" fill="none"/><path d="M5 12l5 5l10 -10" /></svg>`;

// Make HTMLElement available in non-browser environments
// eslint-disable-next-line @typescript-eslint/no-extraneous-class
const { HTMLElement = class {} as typeof globalThis.HTMLElement } = globalThis;
class ErrorOverlay extends HTMLElement {
	root: ShadowRoot;

	constructor(err: BetterErrorPayload['err']) {
		super();
		this.root = this.attachShadow({ mode: 'open' });
		this.root.innerHTML = overlayTemplate;
		this.dir = 'ltr';

		// theme toggle logic
		const themeToggle = this.root.querySelector<HTMLInputElement>(
			'.theme-toggle-checkbox',
		);
		if (
			localStorage['gracileErrorOverlayTheme'] === 'dark' ||
			(!('gracileErrorOverlayTheme' in localStorage) &&
				globalThis.matchMedia('(prefers-color-scheme: dark)').matches)
		) {
			this?.classList.add('gracile-dark');
			localStorage['gracileErrorOverlayTheme'] = 'dark';
			themeToggle!.checked = true;
		} else {
			this?.classList.remove('gracile-dark');
			themeToggle!.checked = false;
		}
		themeToggle?.addEventListener('click', () => {
			const isDark =
				localStorage['gracileErrorOverlayTheme'] === 'dark' ||
				this?.classList.contains('gracile-dark');
			this?.classList.toggle('gracile-dark', !isDark);
			localStorage['gracileErrorOverlayTheme'] = isDark ? 'light' : 'dark';
		});

		this.text('#name', err.name);
		this.text('#title', err.title);
		this.text('#message-content', err['message'], true);

		const cause = this.root.querySelector<HTMLElement>('#cause');
		if (cause && err.cause) {
			if (typeof err.cause === 'string') {
				this.text('#cause-content', err.cause);
				cause.style.display = 'block';
			} else {
				this.text('#cause-content', JSON.stringify(err.cause, null, 2));
				cause.style.display = 'block';
			}
		}

		const hint = this.root.querySelector<HTMLElement>('#hint');
		if (hint && err.hint) {
			this.text('#hint-content', err.hint, true);
			hint.style.display = 'flex';
		}

		const docslink = this.root.querySelector<HTMLElement>('#message');
		if (docslink && err.docslink) {
			docslink.append(
				this.createLink(`See Docs Reference${openNewWindowIcon}`, err.docslink),
			);
		}

		const code = this.root.querySelector<HTMLElement>('#code');
		if (code && err.loc?.file) {
			code.style.display = 'block';
			const codeHeader = code.querySelector<HTMLHeadingElement>('#code header');
			const codeContent = code.querySelector<HTMLDivElement>('#code-content');

			if (codeHeader) {
				const separator = err.loc.file.includes('/') ? '/' : '\\';
				const cleanFile = err.loc.file.split(separator).slice(-2).join('/');
				const fileLocation = [cleanFile, err.loc.line, err.loc.column]
					.filter(Boolean)
					.join(':');
				const absoluteFileLocation = [
					err.loc.file,
					err.loc.line,
					err.loc.column,
				]
					.filter(Boolean)
					.join(':');

				const codeFile = codeHeader.querySelector('h2');
				if (codeFile) {
					codeFile.textContent = fileLocation;
					codeFile.title = absoluteFileLocation;
				}

				const editorLink = this.createLink(
					`Open in editor${openNewWindowIcon}`,
					// eslint-disable-next-line unicorn/no-useless-undefined
					undefined,
				);
				editorLink.addEventListener('click', () => {
					void fetch(
						'/__open-in-editor?file=' +
							encodeURIComponent(absoluteFileLocation),
					);
				});

				codeHeader.append(editorLink);
			}

			if (codeContent && err.highlightedCode) {
				codeContent.innerHTML = err.highlightedCode;

				globalThis.requestAnimationFrame(() => {
					// NOTE: This cannot be `codeContent.querySelector` because `codeContent` still contain the old HTML
					const errorLine =
						this.root.querySelector<HTMLSpanElement>('.error-line');

					if (errorLine) {
						if (errorLine.parentElement?.parentElement) {
							errorLine.parentElement.parentElement.scrollTop =
								errorLine.offsetTop -
								errorLine.parentElement.parentElement.offsetTop -
								8;
						}

						// Add an empty line below the error line so we can show a caret under the error
						if (err.loc?.column) {
							errorLine.insertAdjacentHTML(
								'afterend',
								`\n<span class="line error-caret"><span style="padding-left:${
									err.loc.column - 1
								}ch;">^</span></span>`,
							);
						}
					}
				});
			}
		}

		const copyIcon = this.root.querySelector<HTMLSpanElement>('#copy-btn');
		if (copyIcon) {
			const copyIconSvg = copyIcon.innerHTML;

			copyIcon.addEventListener('click', () => {
				void navigator.clipboard.writeText(err['stack']);

				const RESET_TIME = 2000;
				copyIcon.innerHTML = checkmarkIconSvg;
				copyIcon.style.color = 'var(--success-text)';

				// Reset to copy icon after 2 seconds
				setTimeout(() => {
					copyIcon.innerHTML = copyIconSvg;
					copyIcon.style.color = 'var(--title-text)';
				}, RESET_TIME);
			});
		}

		this.text('#stack-content', err['stack']);
	}

	text(selector: string, text: string | undefined, html = false): void {
		if (!text) {
			return;
		}

		const el = this.root.querySelector(selector);

		if (!el) {
			return;
		}

		if (html) {
			// Automatically detect links
			text = text
				.split(' ')
				.map((v) => {
					if (!v.startsWith('https://')) return v;
					if (v.endsWith('.'))
						return `<a target="_blank" href="${v.slice(0, -1)}">${v.slice(0, -1)}</a>.`;
					return `<a target="_blank" href="${v}">${v}</a>`;
				})
				.join(' ');

			el.innerHTML = text.trim();
		} else {
			el.textContent = text.trim();
		}
	}

	createLink(text: string, href: string | undefined): HTMLDivElement {
		const linkContainer = document.createElement('div');
		const linkElement = href
			? document.createElement('a')
			: document.createElement('button');
		linkElement.innerHTML = text;

		if (href && linkElement instanceof HTMLAnchorElement) {
			linkElement.href = href;
			linkElement.target = '_blank';
		}

		linkContainer.append(linkElement);
		linkContainer.className = 'link';

		return linkContainer;
	}

	close(): void {
		this?.remove();
	}
}

function getOverlayCode(): string {
	return `
		const overlayTemplate = \`${overlayTemplate}\`;
		const openNewWindowIcon = \`${openNewWindowIcon}\`;
		const checkmarkIconSvg = \`${checkmarkIconSvg}\`;
		${ErrorOverlay.toString()}
	`;
}

export function patchOverlay(code: string): string {
	return code.replace(
		'var ErrorOverlay',
		getOverlayCode() + '\nvar ViteErrorOverlay',
	);
}

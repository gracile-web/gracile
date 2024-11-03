// // TODO: Convert remaining imperative code

// // import { customElement, property } from 'lit/decorators.js';

// import type { BetterErrorPayload } from '../vite.js';

// import * as assets from './assets.js';
// import { style } from './vite-custom-overlay.styles.js';
// // import { unsafeHTML } from 'lit/directives/unsafe-html.js';
// // import { render } from 'lit/html.js';
// // import { html } from 'lit/static-html.js';

// export class ViteCustomOverlay extends HTMLElement {
// 	// static styles = [
// 	// 	style,
// 	// 	css`
// 	// 		:host {
// 	// 			display: contents;
// 	// 		}
// 	// 	`,
// 	// ];

// 	errorPayload: BetterErrorPayload['err'] | null = null;

// 	root = this.shadowRoot!;

// 	// protected firstUpdated(): void {

// 	// }

// 	initTheme() {
// 		const themeToggle = this.root.querySelector<HTMLInputElement>(
// 			'.theme-toggle-checkbox',
// 		);
// 		if (
// 			localStorage['betterrErrorOverlayTheme'] === 'dark' ||
// 			(!('betterrErrorOverlayTheme' in localStorage) &&
// 				globalThis.matchMedia('(prefers-color-scheme: dark)').matches)
// 		) {
// 			this?.classList.add('betterr-dark');
// 			localStorage['betterrErrorOverlayTheme'] = 'dark';
// 			themeToggle!.checked = true;
// 		} else {
// 			this?.classList.remove('betterr-dark');
// 			themeToggle!.checked = false;
// 		}
// 		themeToggle?.addEventListener('click', () => {
// 			const isDark =
// 				localStorage['betterrErrorOverlayTheme'] === 'dark' ||
// 				this?.classList.contains('betterr-dark');
// 			this?.classList.toggle('betterr-dark', !isDark);
// 			localStorage['betterrErrorOverlayTheme'] = isDark ? 'light' : 'dark';
// 		});
// 	}

// 	static createLink(text: string, href: string | undefined): HTMLDivElement {
// 		const linkContainer = document.createElement('div');
// 		const linkElement = href
// 			? document.createElement('a')
// 			: document.createElement('button');
// 		linkElement.innerHTML = text;

// 		if (href && linkElement instanceof HTMLAnchorElement) {
// 			linkElement.href = href;
// 			linkElement.target = '_blank';
// 		}

// 		linkContainer.append(linkElement);
// 		linkContainer.className = 'link';

// 		return linkContainer;
// 	}

// 	appendCode() {
// 		const error = this.errorPayload;
// 		if (!error) throw new ReferenceError('No error.');

// 		const code = this.root.querySelector<HTMLElement>('#code');
// 		if (code && error.loc?.file) {
// 			const codeHeader = code.querySelector<HTMLHeadingElement>('#code header');

// 			if (codeHeader) {
// 				const separator = error.loc.file.includes('/') ? '/' : '\\';
// 				const cleanFile = error.loc.file.split(separator).slice(-2).join('/');
// 				const fileLocation = [cleanFile, error.loc.line, error.loc.column]
// 					.filter(Boolean)
// 					.join(':');
// 				const absoluteFileLocation = [
// 					error.loc.file,
// 					error.loc.line,
// 					error.loc.column,
// 				]
// 					.filter(Boolean)
// 					.join(':');

// 				const codeFile = codeHeader.querySelectorAll('h2')[0];
// 				if (codeFile) {
// 					codeFile.textContent = fileLocation;
// 					codeFile.title = absoluteFileLocation;
// 				}

// 				const editorLink = ViteCustomOverlay.createLink(
// 					`Open in editor${assets.openNewWindowIcon}`,
// 				);
// 				editorLink.addEventListener('click', () => {
// 					fetch(
// 						`/__open-in-editor?file=${encodeURIComponent(
// 							absoluteFileLocation,
// 						)}`,
// 					).catch(console.error);
// 				});

// 				codeHeader.append(editorLink);
// 			}

// 			const hint = this.root.querySelector<HTMLElement>('#hint');
// 			if (hint && error.hint) {
// 				hint.style.display = 'flex';
// 			}

// 			const docslink = this.root.querySelector<HTMLElement>('#message');
// 			if (docslink && error.docslink) {
// 				docslink.append(
// 					ViteCustomOverlay.createLink(
// 						`See Docs Reference${assets.openNewWindowIcon}`,
// 						error.docslink,
// 					),
// 				);
// 			}

// 			if (error.highlightedCode) {
// 				globalThis.requestAnimationFrame(() => {
// 					// NOTE: This cannot be `codeContent.querySelector` because `codeContent` still contain the old HTML
// 					const errorLine =
// 						this.root.querySelector<HTMLSpanElement>('.error-line');

// 					if (errorLine) {
// 						if (errorLine.parentElement?.parentElement) {
// 							errorLine.parentElement.parentElement.scrollTop =
// 								errorLine.offsetTop -
// 								errorLine.parentElement.parentElement.offsetTop -
// 								8;
// 						}

// 						// Add an empty line below the error line so we can show a caret under the error
// 						if (error.loc?.column) {
// 							errorLine.insertAdjacentHTML(
// 								'afterend',
// 								`\n<span class="line error-caret"><span style="padding-left:${
// 									error.loc.column - 1
// 								}ch;">^</span></span>`,
// 							);
// 						}
// 					}
// 				});
// 			}
// 		}
// 	}

// 	connectedCallback() {
// 		if (!this.errorPayload) throw new ReferenceError('Missing payload!');

// 		this.root = this.attachShadow({ mode: 'open' });
// 		// this.classList.add('betterr-dark');
// 		// // this.root = this.shadowRoot!;

// 		// const s = new CSSStyleSheet()
// 		// s.replaceSync(style.styleSheet)
// 		this.shadowRoot?.adoptedStyleSheets.push(style.styleSheet!);

// 		// const tpl = html`
// 		// 	<div id="backdrop" class="betterr-dark">
// 		// 		<div id="layout">
// 		// 			<div id="theme-toggle-wrapper">
// 		// 				<div>
// 		// 					<input type="checkbox" class="theme-toggle-checkbox" id="chk" />
// 		// 					<label id="theme-toggle-label" for="chk">
// 		// 						${assets.iconTablerSun} ${assets.iconTablerMoon}

// 		// 						<div id="theme-toggle-ball">
// 		// 							<span class="sr-only">Use dark theme</span>
// 		// 						</div>
// 		// 					</label>
// 		// 				</div>
// 		// 			</div>

// 		// 			<header id="header">
// 		// 				<section id="header-left">
// 		// 					<h2 id="name">${this.errorPayload.name}</h2>
// 		// 					<h1 id="title">
// 		// 						${this.errorPayload.title || 'An error occurred.'}
// 		// 					</h1>
// 		// 				</section>
// 		// 				<div id="betterr-logo-overlay"></div>
// 		// 				<div id="betterr-logo">${assets.logo}</div>
// 		// 			</header>

// 		// 			<section id="message-hints">
// 		// 				<section id="message">
// 		// 					<span id="message-icon">${assets.messageIcon}</span>
// 		// 					<!-- prettier-ignore -->
// 		// 					<div id="message-content">${unsafeHTML(
// 		// 						this.errorPayload['message'],
// 		// 					)}</div>
// 		// 				</section>

// 		// 				<section id="hint">
// 		// 					<span id="hint-icon"> ${assets.hintIcon} </span>
// 		// 					<div id="hint-content">${this.errorPayload.hint}</div>
// 		// 				</section>
// 		// 			</section>

// 		// 			<section id="code">
// 		// 				<header>
// 		// 					<h2></h2>
// 		// 				</header>

// 		// 				${this.errorPayload.highlightedCode
// 		// 					? html`<div id="code-content">
// 		// 							${unsafeHTML(this.errorPayload.highlightedCode)}
// 		// 						</div>`
// 		// 					: null}
// 		// 			</section>

// 		// 			<section id="stack">
// 		// 				<h2>Stack Trace</h2>
// 		// 				<div id="stack-content">${this.errorPayload['stack']}</div>
// 		// 			</section>

// 		// 			${this.errorPayload.cause
// 		// 				? html` <!--  -->
// 		// 						<section id="cause">
// 		// 							<h2>Cause</h2>
// 		// 							<div id="cause-content">${this.errorPayload.cause}</div>
// 		// 						</section>`
// 		// 				: null}
// 		// 		</div>
// 		// 	</div>
// 		// `;

// 		// render(tpl, this.root);

// 		// this.appendCode();
// 		// this.initTheme();

// 		this.root.innerHTML = 'TEST';
// 	}
// }

// customElements.define('vite-custom-overlay', ViteCustomOverlay);

// declare global {
// 	interface HTMLElementTagNameMap {
// 		'vite-custom-overlay': ViteCustomOverlay;
// 	}
// }

throw new Error('Empty');

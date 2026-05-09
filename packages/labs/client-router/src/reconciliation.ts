// MARK: Head / root reconciliation helpers

/** Diff and sync all attributes from `source` onto `target`. */
export function syncAttributes(target: Element, source: Element): void {
	// Add/update attributes present on source
	for (const attr of source.attributes)
		if (target.getAttribute(attr.name) !== attr.value)
			target.setAttribute(attr.name, attr.value);
	// Remove attributes not present on source.
	// Snapshot names first since we mutate during iteration.
	const toRemove: string[] = [];
	for (const attr of target.attributes)
		if (!source.hasAttribute(attr.name)) toRemove.push(attr.name);
	for (const name of toRemove) target.removeAttribute(name);
}

/**
 * Reconcile `<link>` elements in `<head>`.
 * Adds missing links (awaiting their `load` event) and removes orphans.
 */
export async function syncLinks(incoming: Document): Promise<void> {
	const existing = new Map<string, HTMLLinkElement>();
	for (const link of document.querySelectorAll<HTMLLinkElement>('head link'))
		existing.set(link.href, link);

	const upcoming = new Map<string, HTMLLinkElement>();
	for (const link of incoming.querySelectorAll<HTMLLinkElement>('head link'))
		upcoming.set(link.href, link);

	await Promise.all(
		[...upcoming.values()].map(async (link) => {
			if (existing.has(link.href) === false)
				await new Promise<void>((resolve) => {
					const clonedLink = link.cloneNode();
					clonedLink.addEventListener('load', () => resolve());
					document.head.append(clonedLink);
				});
		}),
	);
	for (const link of existing.values())
		if (upcoming.has(link.href) === false) link.remove();
}

/** Reconcile title, root element attributes, `<base>`, `<meta>`, inline `<style>`. */
export function syncDocumentMetadata(incoming: Document): void {
	// Title
	document.title = incoming.title;

	// <html> and <body> attributes (lang, dir, class, style, data-*, …)
	syncAttributes(document.documentElement, incoming.documentElement);
	syncAttributes(document.body, incoming.body);

	// <base> (at most one per spec)
	syncBase(incoming);

	// <meta> tags — keyed by name, property, http-equiv, or charset
	syncMetas(incoming);

	// Inline <style> in <head>
	syncInlineStyles(incoming);
}

/** Reconcile the single `<base>` element (at most one per spec). */
function syncBase(incoming: Document): void {
	const incomingBase = incoming.querySelector<HTMLBaseElement>('head base');
	const currentBase = document.querySelector<HTMLBaseElement>('head base');

	if (incomingBase) {
		if (currentBase) {
			syncAttributes(currentBase, incomingBase);
		} else {
			document.head.prepend(incomingBase.cloneNode(true));
		}
	} else {
		currentBase?.remove();
	}
}

/**
 * Build the identifying key for a `<meta>` element.
 * Precedence: `name` > `property` (OG/Twitter) > `http-equiv` > `charset`.
 * Returns `null` for unkeyed metas (shouldn't exist per spec, but defensive).
 */
function metaKey(meta: HTMLMetaElement): string | null {
	if (meta.name) return `name=${meta.name}`;

	const property = meta.getAttribute('property');
	if (property) return `property=${property}`;

	if (meta.httpEquiv) return `http-equiv=${meta.httpEquiv}`;
	if (meta.hasAttribute('charset')) return 'charset';

	return null;
}

/** Reconcile `<meta>` tags by their identifying attribute. */
function syncMetas(incoming: Document): void {
	const existing = new Map<string, HTMLMetaElement>();
	for (const meta of document.querySelectorAll<HTMLMetaElement>('head meta')) {
		const key = metaKey(meta);
		if (key) existing.set(key, meta);
	}

	const seen = new Set<string>();
	for (const meta of incoming.querySelectorAll<HTMLMetaElement>('head meta')) {
		const key = metaKey(meta);
		if (!key) continue;
		seen.add(key);

		const current = existing.get(key);
		if (current) {
			syncAttributes(current, meta);
		} else {
			document.head.append(meta.cloneNode(true));
		}
	}

	for (const [key, meta] of existing) if (!seen.has(key)) meta.remove();
}

/**
 * Reconcile inline `<style>` elements in `<head>`.
 * Keyed by `textContent` — if the same CSS block exists, keep it; otherwise
 * remove stale ones and add new ones.
 */
function syncInlineStyles(incoming: Document): void {
	const existing = new Map<string, HTMLStyleElement>();
	for (const style of document.querySelectorAll<HTMLStyleElement>(
		'head style:not([data-vite-dev-id])',
	))
		existing.set(style.textContent ?? '', style);

	const seen = new Set<string>();
	for (const style of incoming.querySelectorAll<HTMLStyleElement>(
		'head style',
	)) {
		const key = style.textContent ?? '';
		seen.add(key);
		if (!existing.has(key)) document.head.append(style.cloneNode(true));
	}

	for (const [key, style] of existing) if (!seen.has(key)) style.remove();
}

/**
 * Import module scripts that are new in the incoming document.
 * Already-loaded modules are deduplicated by ESM semantics.
 */
export async function syncExternalScripts(incoming: Document): Promise<void> {
	const existing = new Map<string, HTMLScriptElement>();
	for (const script of document.querySelectorAll<HTMLScriptElement>(
		'head script[src]',
	))
		existing.set(script.src, script);

	const upcoming = new Map<string, HTMLScriptElement>();
	for (const script of incoming.querySelectorAll<HTMLScriptElement>(
		'head script[src]',
	))
		upcoming.set(script.src, script);

	const scriptImports: Promise<unknown>[] = [];
	for (const script of upcoming.values()) {
		if (existing.has(script.src) === false) {
			// NOTE 1: Appending a script tag seems to be ignored by the
			// browser. Maybe a security feature or something?
			// NOTE 2: Rollup will yell without this comment.
			// It's fine, we are getting already processed `<link>`, so,
			// their always correct and well funded.
			scriptImports.push(import(/* @vite-ignore */ script.src));
		}
	}
	await Promise.all(scriptImports);
}

/**
 * Re-execute all inline scripts from the incoming document, matching
 * "fresh page load" semantics. This covers both classic `<script>`
 * and `<script type="module">` without a `src` attribute.
 * The clone-and-append trick forces browser re-evaluation even when
 * the content is identical to what was already in the DOM.
 * Opt-out: add `data-gracile-no-rerun` to skip re-execution.
 */
export function syncInlineScripts(incoming: Document): void {
	for (const script of document.querySelectorAll<HTMLScriptElement>(
		'head script:not([src])',
	))
		script.remove();

	for (const script of incoming.querySelectorAll<HTMLScriptElement>(
		'head script:not([src])',
	)) {
		if (script.hasAttribute('data-gracile-no-rerun')) continue;

		const fresh = document.createElement('script');
		for (const attr of script.attributes)
			fresh.setAttribute(attr.name, attr.value);
		fresh.textContent = script.textContent;
		document.head.append(fresh);
	}
}

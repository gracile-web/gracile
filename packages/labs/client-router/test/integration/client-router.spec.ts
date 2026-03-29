import { expect, test } from '@playwright/test';

// Playwright pierces shadow DOM with its CSS engine by default.

// Use `networkidle` so the client router's initial hydration
// (queueMicrotask → fetch → requestAnimationFrame) finishes before we interact.
const GOTO_OPTIONS = { waitUntil: 'networkidle' as const };

test.describe('Client Router — Navigation', () => {
	test.describe.configure({ mode: 'serial' });

	test('home page renders with correct title', async ({ page }) => {
		await page.goto('/', GOTO_OPTIONS);

		await expect(page).toHaveTitle('Home');
		await expect(page.locator('h1')).toHaveText('Home Page');
		await expect(page.locator('.description')).toHaveText(
			'Welcome to the client routing test fixture.',
		);
	});

	test('navigates to about via click (client-side)', async ({ page }) => {
		await page.goto('/', GOTO_OPTIONS);
		await expect(page).toHaveTitle('Home');

		// Track full page reloads — a client-side navigation should NOT trigger one.
		let fullReload = false;
		page.on('load', () => {
			fullReload = true;
		});

		await page.click('a[href="/about/"]');
		await page.waitForURL('**/about/');

		await expect(page).toHaveTitle('About');
		await expect(page.locator('h1')).toHaveText('About Page');

		expect(fullReload).toBe(false);
	});

	test('navigates to contact via click (client-side)', async ({ page }) => {
		await page.goto('/', GOTO_OPTIONS);

		let fullReload = false;
		page.on('load', () => {
			fullReload = true;
		});

		await page.click('a[href="/contact/"]');
		await page.waitForURL('**/contact/');

		await expect(page).toHaveTitle('Contact');
		await expect(page.locator('h1')).toHaveText('Contact Page');
		await expect(page.locator('.contact-list')).toBeVisible();

		expect(fullReload).toBe(false);
	});

	test('navigates back and forward with browser history', async ({ page }) => {
		await page.goto('/', GOTO_OPTIONS);
		await expect(page).toHaveTitle('Home');

		await page.click('a[href="/about/"]');
		await page.waitForURL('**/about/');
		await expect(page).toHaveTitle('About');

		await page.click('a[href="/contact/"]');
		await page.waitForURL('**/contact/');
		await expect(page).toHaveTitle('Contact');

		// Go back to About
		await page.goBack();
		await expect(page).toHaveTitle('About');
		await expect(page.locator('h1')).toHaveText('About Page');

		// Go back to Home
		await page.goBack();
		await expect(page).toHaveTitle('Home');
		await expect(page.locator('h1')).toHaveText('Home Page');

		// Go forward to About
		await page.goForward();
		await expect(page).toHaveTitle('About');
	});

	test('multi-step navigation across all routes', async ({ page }) => {
		await page.goto('/', GOTO_OPTIONS);

		// Home → About → Contact → Home (full cycle)
		await page.click('a[href="/about/"]');
		await page.waitForURL('**/about/');
		await expect(page.locator('h1')).toHaveText('About Page');

		await page.click('a[href="/contact/"]');
		await page.waitForURL('**/contact/');
		await expect(page.locator('h1')).toHaveText('Contact Page');

		await page.click('a[href="/"]');
		await page.waitForURL(/\/$/);
		await expect(page.locator('h1')).toHaveText('Home Page');
	});
});

test.describe('Client Router — Direct URL Access', () => {
	test('loads about page directly', async ({ page }) => {
		await page.goto('/about/', GOTO_OPTIONS);

		await expect(page).toHaveTitle('About');
		await expect(page.locator('h1')).toHaveText('About Page');
	});

	test('loads contact page directly', async ({ page }) => {
		await page.goto('/contact/', GOTO_OPTIONS);

		await expect(page).toHaveTitle('Contact');
		await expect(page.locator('h1')).toHaveText('Contact Page');
	});
});

test.describe('Client Router — Head Reconciliation', () => {
	test.describe.configure({ mode: 'serial' });

	test('document title updates on navigation', async ({ page }) => {
		await page.goto('/', GOTO_OPTIONS);
		await expect(page).toHaveTitle('Home');

		await page.click('a[href="/about/"]');
		await page.waitForURL('**/about/');
		await expect(page).toHaveTitle('About');

		await page.click('a[href="/contact/"]');
		await page.waitForURL('**/contact/');
		await expect(page).toHaveTitle('Contact');

		await page.click('a[href="/"]');
		await page.waitForURL(/\/$/);
		await expect(page).toHaveTitle('Home');
	});
});

test.describe('Client Router — Navigation Menu', () => {
	test('all nav links are present', async ({ page }) => {
		await page.goto('/', GOTO_OPTIONS);

		const nav = page.locator('nav.top-menu');
		await expect(nav).toBeVisible();

		await expect(nav.locator('a[href="/"]')).toHaveText('Home');
		await expect(nav.locator('a[href="/about/"]')).toHaveText('About');
		await expect(nav.locator('a[href="/contact/"]')).toHaveText('Contact');
	});

	test('nav persists across client-side navigations', async ({ page }) => {
		await page.goto('/', GOTO_OPTIONS);
		await expect(page.locator('nav.top-menu')).toBeVisible();

		await page.click('a[href="/about/"]');
		await page.waitForURL('**/about/');
		await expect(page.locator('nav.top-menu')).toBeVisible();

		await page.click('a[href="/contact/"]');
		await page.waitForURL('**/contact/');
		await expect(page.locator('nav.top-menu')).toBeVisible();
	});
});

test.describe('Client Router — Web Components', () => {
	test('custom element renders in home page', async ({ page }) => {
		await page.goto('/', GOTO_OPTIONS);

		const greeting = page.locator('my-greetings');
		await expect(greeting).toBeVisible();
		// Shadow DOM — Playwright pierces it by default.
		await expect(greeting.locator('.greeting')).toContainText('Hello World!');
	});

	test('custom element survives client-side round-trip', async ({ page }) => {
		await page.goto('/', GOTO_OPTIONS);
		await expect(page.locator('my-greetings')).toBeVisible();

		// Navigate away
		await page.click('a[href="/about/"]');
		await page.waitForURL('**/about/');
		await expect(page.locator('h1')).toHaveText('About Page');

		// Navigate back
		await page.click('a[href="/"]');
		await page.waitForURL(/\/$/);
		await expect(page.locator('my-greetings')).toBeVisible();
		await expect(
			page.locator('my-greetings').locator('.greeting'),
		).toContainText('Hello World!');
	});
});

test.describe('Client Router — Per-Route Sibling CSS', () => {
	test.describe.configure({ mode: 'serial' });

	test('home route loads its sibling CSS', async ({ page }) => {
		await page.goto('/', GOTO_OPTIONS);

		const homeCSS = page.locator('head link[rel="stylesheet"]').filter({
			has: page.locator('[href*="home"]'),
		});
		// Fallback: also try matching with the full filename pattern
		const homeCSSAlt = page.locator(
			'head link[rel="stylesheet"][href*="(home)"]',
		);

		const count = await homeCSSAlt.count();
		if (count > 0) {
			await expect(homeCSSAlt.first()).toBeAttached();
		} else {
			await expect(homeCSS.first()).toBeAttached();
		}
	});

	test('about route loads its sibling CSS', async ({ page }) => {
		await page.goto('/about/', GOTO_OPTIONS);

		await expect(
			page.locator('head link[rel="stylesheet"][href*="about"]'),
		).toBeAttached();
	});

	test('contact route has no sibling CSS', async ({ page }) => {
		await page.goto('/contact/', GOTO_OPTIONS);

		// Contact has no sibling CSS, so no route-specific stylesheet link.
		await expect(
			page.locator('head link[rel="stylesheet"][href*="contact"]'),
		).not.toBeAttached();
	});

	test('per-route CSS swaps on navigation (Home → About)', async ({ page }) => {
		await page.goto('/', GOTO_OPTIONS);

		// Home CSS is present
		await expect(
			page.locator('head link[rel="stylesheet"][href*="home"]'),
		).toBeAttached();
		// About CSS is absent
		await expect(
			page.locator('head link[rel="stylesheet"][href*="about"]'),
		).not.toBeAttached();

		// Navigate to about
		await page.click('a[href="/about/"]');
		await page.waitForURL('**/about/');
		await expect(page.locator('h1')).toHaveText('About Page');

		// About CSS is present
		await expect(
			page.locator('head link[rel="stylesheet"][href*="about"]'),
		).toBeAttached();
		// Home CSS is removed
		await expect(
			page.locator('head link[rel="stylesheet"][href*="home"]'),
		).not.toBeAttached();
	});

	test('per-route CSS survives A → B → A round-trip', async ({ page }) => {
		await page.goto('/', GOTO_OPTIONS);

		// Verify home CSS present initially
		await expect(
			page.locator('head link[rel="stylesheet"][href*="home"]'),
		).toBeAttached();

		// Home → About
		await page.click('a[href="/about/"]');
		await page.waitForURL('**/about/');
		await expect(page.locator('h1')).toHaveText('About Page');

		await expect(
			page.locator('head link[rel="stylesheet"][href*="about"]'),
		).toBeAttached();
		await expect(
			page.locator('head link[rel="stylesheet"][href*="home"]'),
		).not.toBeAttached();

		// About → Home (back to A)
		await page.click('a[href="/"]');
		await page.waitForURL(/\/$/);
		await expect(page.locator('h1')).toHaveText('Home Page');

		// Home CSS is back
		await expect(
			page.locator('head link[rel="stylesheet"][href*="home"]'),
		).toBeAttached();
		// About CSS is gone
		await expect(
			page.locator('head link[rel="stylesheet"][href*="about"]'),
		).not.toBeAttached();

		// Verify the CSS is actually applied
		const accentColor = await page
			.locator('.home-accent')
			.evaluate((el) => getComputedStyle(el).color);
		// crimson = rgb(220, 20, 60)
		expect(accentColor).toBe('rgb(220, 20, 60)');
	});

	test('per-route CSS survives A → B → C → A full cycle', async ({ page }) => {
		await page.goto('/', GOTO_OPTIONS);
		await expect(
			page.locator('head link[rel="stylesheet"][href*="home"]'),
		).toBeAttached();

		// Home → About
		await page.click('a[href="/about/"]');
		await page.waitForURL('**/about/');
		await expect(
			page.locator('head link[rel="stylesheet"][href*="about"]'),
		).toBeAttached();

		// About → Contact (no sibling CSS)
		await page.click('a[href="/contact/"]');
		await page.waitForURL('**/contact/');
		await expect(
			page.locator('head link[rel="stylesheet"][href*="about"]'),
		).not.toBeAttached();
		await expect(
			page.locator('head link[rel="stylesheet"][href*="home"]'),
		).not.toBeAttached();

		// Contact → Home (back to A)
		await page.click('a[href="/"]');
		await page.waitForURL(/\/$/);
		await expect(page.locator('h1')).toHaveText('Home Page');

		await expect(
			page.locator('head link[rel="stylesheet"][href*="home"]'),
		).toBeAttached();
		await expect(
			page.locator('head link[rel="stylesheet"][href*="about"]'),
		).not.toBeAttached();

		const accentColor = await page
			.locator('.home-accent')
			.evaluate((el) => getComputedStyle(el).color);
		expect(accentColor).toBe('rgb(220, 20, 60)');
	});
});

test.describe('Client Router — Custom Elements Survivance', () => {
	test.describe.configure({ mode: 'serial' });

	// --- Server-only CE (imported in route .ts file) ---

	test('server-only CE renders on about page', async ({ page }) => {
		await page.goto('/about/', GOTO_OPTIONS);

		const widget = page.locator('server-only-widget');
		await expect(widget).toBeVisible();
		await expect(widget.locator('.badge')).toContainText('Server CE');
	});

	test('server-only CE survives round-trip (About → Home → About)', async ({
		page,
	}) => {
		await page.goto('/about/', GOTO_OPTIONS);
		await expect(page.locator('server-only-widget')).toBeVisible();

		// Navigate away
		await page.click('a[href="/"]');
		await page.waitForURL(/\/$/);
		await expect(page.locator('h1')).toHaveText('Home Page');
		await expect(page.locator('server-only-widget')).not.toBeVisible();

		// Navigate back
		await page.click('a[href="/about/"]');
		await page.waitForURL('**/about/');
		await expect(page.locator('h1')).toHaveText('About Page');

		const widget = page.locator('server-only-widget');
		await expect(widget).toBeVisible();
		await expect(widget.locator('.badge')).toContainText('Server CE');
	});

	// --- Client-only CE (imported in route .client.ts file) ---

	test('client-only CE renders on contact page', async ({ page }) => {
		await page.goto('/contact/', GOTO_OPTIONS);

		const widget = page.locator('client-only-widget');
		await expect(widget).toBeVisible();
		await expect(widget.locator('.badge')).toContainText('Client CE');
	});

	test('client-only CE survives round-trip (Contact → Home → Contact)', async ({
		page,
	}) => {
		await page.goto('/contact/', GOTO_OPTIONS);
		await expect(page.locator('client-only-widget')).toBeVisible();

		// Navigate away
		await page.click('a[href="/"]');
		await page.waitForURL(/\/$/);
		await expect(page.locator('h1')).toHaveText('Home Page');
		await expect(page.locator('client-only-widget')).not.toBeVisible();

		// Navigate back
		await page.click('a[href="/contact/"]');
		await page.waitForURL('**/contact/');
		await expect(page.locator('h1')).toHaveText('Contact Page');

		const widget = page.locator('client-only-widget');
		await expect(widget).toBeVisible();
		await expect(widget.locator('.badge')).toContainText('Client CE');
	});

	// --- Full-stack CE (imported in both route .ts and .client.ts) ---

	test('full-stack CE renders on home page', async ({ page }) => {
		await page.goto('/', GOTO_OPTIONS);

		const widget = page.locator('full-stack-widget');
		await expect(widget).toBeVisible();
		await expect(widget.locator('.badge')).toContainText('Full-Stack CE');
	});

	test('full-stack CE survives round-trip (Home → About → Home)', async ({
		page,
	}) => {
		await page.goto('/', GOTO_OPTIONS);
		await expect(page.locator('full-stack-widget')).toBeVisible();

		// Navigate away
		await page.click('a[href="/about/"]');
		await page.waitForURL('**/about/');
		await expect(page.locator('h1')).toHaveText('About Page');
		await expect(page.locator('full-stack-widget')).not.toBeVisible();

		// Navigate back
		await page.click('a[href="/"]');
		await page.waitForURL(/\/$/);
		await expect(page.locator('h1')).toHaveText('Home Page');

		const widget = page.locator('full-stack-widget');
		await expect(widget).toBeVisible();
		await expect(widget.locator('.badge')).toContainText('Full-Stack CE');
	});

	// --- Multi-hop survivance across all CE types ---

	test('all CE types survive a full navigation cycle', async ({ page }) => {
		// Start at Home (full-stack CE)
		await page.goto('/', GOTO_OPTIONS);
		await expect(page.locator('full-stack-widget')).toBeVisible();

		// Home → About (server-only CE)
		await page.click('a[href="/about/"]');
		await page.waitForURL('**/about/');
		await expect(page.locator('server-only-widget')).toBeVisible();
		await expect(page.locator('full-stack-widget')).not.toBeVisible();

		// About → Contact (client-only CE)
		await page.click('a[href="/contact/"]');
		await page.waitForURL('**/contact/');
		await expect(page.locator('client-only-widget')).toBeVisible();
		await expect(page.locator('server-only-widget')).not.toBeVisible();

		// Contact → Home (full-stack CE again)
		await page.click('a[href="/"]');
		await page.waitForURL(/\/$/);
		await expect(page.locator('full-stack-widget')).toBeVisible();
		await expect(
			page.locator('full-stack-widget').locator('.badge'),
		).toContainText('Full-Stack CE');
		await expect(page.locator('client-only-widget')).not.toBeVisible();

		// Home → Contact (client-only CE again)
		await page.click('a[href="/contact/"]');
		await page.waitForURL('**/contact/');
		await expect(page.locator('client-only-widget')).toBeVisible();
		await expect(
			page.locator('client-only-widget').locator('.badge'),
		).toContainText('Client CE');

		// Contact → About (server-only CE again)
		await page.click('a[href="/about/"]');
		await page.waitForURL('**/about/');
		await expect(page.locator('server-only-widget')).toBeVisible();
		await expect(
			page.locator('server-only-widget').locator('.badge'),
		).toContainText('Server CE');
	});
});

test.describe('Client Router — Error Handling', () => {
	test('no console errors during navigation', async ({ page }) => {
		const errors: string[] = [];
		page.on('console', (msg) => {
			if (msg.type() === 'error') {
				errors.push(msg.text());
			}
		});

		await page.goto('/', GOTO_OPTIONS);
		await page.click('a[href="/about/"]');
		await page.waitForURL('**/about/');
		await expect(page.locator('h1')).toHaveText('About Page');
		await page.click('a[href="/contact/"]');
		await page.waitForURL('**/contact/');
		await expect(page.locator('h1')).toHaveText('Contact Page');
		await page.click('a[href="/"]');
		await page.waitForURL(/\/$/);
		await expect(page.locator('h1')).toHaveText('Home Page');

		expect(errors).toEqual([]);
	});

	test('no uncaught exceptions during navigation', async ({ page }) => {
		const exceptions: Error[] = [];
		page.on('pageerror', (error) => {
			exceptions.push(error);
		});

		await page.goto('/', GOTO_OPTIONS);
		await page.click('a[href="/about/"]');
		await page.waitForURL('**/about/');
		await expect(page).toHaveTitle('About');
		await page.click('a[href="/"]');
		await page.waitForURL(/\/$/);
		await expect(page).toHaveTitle('Home');

		expect(exceptions).toEqual([]);
	});
});

test.describe('Client Router — Page Content', () => {
	test('route-specific content is isolated', async ({ page }) => {
		await page.goto('/', GOTO_OPTIONS);
		await expect(page.locator('.description')).toHaveText(
			'Welcome to the client routing test fixture.',
		);
		// Contact-specific content should NOT exist on home
		await expect(page.locator('.contact-list')).not.toBeVisible();

		await page.click('a[href="/contact/"]');
		await page.waitForURL('**/contact/');
		await expect(page.locator('.contact-list')).toBeVisible();
		// Home greeting should NOT exist on contact
		await expect(page.locator('my-greetings')).not.toBeVisible();
	});

	test('page body is fully replaced on navigation', async ({ page }) => {
		await page.goto('/', GOTO_OPTIONS);
		const homeContent = await page.locator('main').innerHTML();

		await page.click('a[href="/about/"]');
		await page.waitForURL('**/about/');
		// Wait for the new route to render before capturing the content.
		await expect(page.locator('h1')).toHaveText('About Page');
		const aboutContent = await page.locator('main').innerHTML();

		expect(homeContent).not.toEqual(aboutContent);
	});
});

// ---------------------------------------------------------------------------
// Shadow DOM adoptedStyleSheets — reproduces the hydration-support bug where
// `createRenderRoot` (patched by @lit-labs/ssr-client) doesn't call
// `adoptStyles` on elements freshly created during client-side navigation.
// ---------------------------------------------------------------------------
test.describe('Client Router — Shadow DOM Styles After Navigation', () => {
	test.describe.configure({ mode: 'serial' });

	// Helper: get the computed color of an element *inside* a CE's shadow DOM.
	// Playwright pierces shadow DOM for selectors, but `evaluate` needs an
	// explicit shadow root traversal for `getComputedStyle`.
	async function shadowColor(
		page: import('@playwright/test').Page,
		hostSelector: string,
		innerSelector: string,
	): Promise<string> {
		return page.evaluate(
			([host, inner]) => {
				const el = document.querySelector(host);
				if (!el?.shadowRoot) return 'NO_SHADOW_ROOT';
				const target = el.shadowRoot.querySelector(inner);
				if (!target) return 'NO_INNER_ELEMENT';
				return getComputedStyle(target).color;
			},
			[hostSelector, innerSelector],
		);
	}

	// Helper: count adoptedStyleSheets on a CE's shadow root.
	async function adoptedCount(
		page: import('@playwright/test').Page,
		hostSelector: string,
	): Promise<number> {
		return page.evaluate((sel) => {
			const el = document.querySelector(sel);
			return el?.shadowRoot?.adoptedStyleSheets?.length ?? -1;
		}, hostSelector);
	}

	// -- Direct load (SSR + hydration) — baseline sanity check ----------------

	test('SSR: full-stack-widget has styles on direct load', async ({
		page,
	}) => {
		await page.goto('/', GOTO_OPTIONS);
		await expect(page.locator('full-stack-widget')).toBeVisible();
		// SSR delivers styles via DSD <style> tags, not adoptedStyleSheets.
		// Verify the styles actually apply (teal badge = rgb(0, 128, 128)).
		expect(await shadowColor(page, 'full-stack-widget', '.badge')).toBe(
			'rgb(0, 128, 128)',
		);
	});

	test('SSR: full-stack-widget .badge is teal on direct load', async ({
		page,
	}) => {
		await page.goto('/', GOTO_OPTIONS);
		await expect(page.locator('full-stack-widget')).toBeVisible();
		// teal = rgb(0, 128, 128)
		expect(await shadowColor(page, 'full-stack-widget', '.badge')).toBe(
			'rgb(0, 128, 128)',
		);
	});

	test('SSR: my-greetings .greeting is darkblue on direct load', async ({
		page,
	}) => {
		await page.goto('/', GOTO_OPTIONS);
		await expect(page.locator('my-greetings')).toBeVisible();
		// darkblue = rgb(0, 0, 139)
		expect(await shadowColor(page, 'my-greetings', '.greeting')).toBe(
			'rgb(0, 0, 139)',
		);
	});

	// -- Client-side navigation — this is where the bug manifests -------------

	test('CSR: full-stack-widget keeps styles after Home → About → Home', async ({
		page,
	}) => {
		await page.goto('/', GOTO_OPTIONS);
		await expect(page.locator('full-stack-widget')).toBeVisible();

		// Navigate away
		await page.click('a[href="/about/"]');
		await page.waitForURL('**/about/');
		await expect(page.locator('h1')).toHaveText('About Page');

		// Navigate back — full-stack-widget is freshly created (CSR render)
		await page.click('a[href="/"]');
		await page.waitForURL(/\/$/);
		await expect(page.locator('full-stack-widget')).toBeVisible();

		expect(await adoptedCount(page, 'full-stack-widget')).toBeGreaterThan(0);
		expect(await shadowColor(page, 'full-stack-widget', '.badge')).toBe(
			'rgb(0, 128, 128)',
		);
	});

	test('CSR: my-greetings keeps styles after Home → About → Home', async ({
		page,
	}) => {
		await page.goto('/', GOTO_OPTIONS);
		await expect(page.locator('my-greetings')).toBeVisible();

		await page.click('a[href="/about/"]');
		await page.waitForURL('**/about/');
		await expect(page.locator('h1')).toHaveText('About Page');

		await page.click('a[href="/"]');
		await page.waitForURL(/\/$/);
		await expect(page.locator('my-greetings')).toBeVisible();

		expect(await adoptedCount(page, 'my-greetings')).toBeGreaterThan(0);
		expect(await shadowColor(page, 'my-greetings', '.greeting')).toBe(
			'rgb(0, 0, 139)',
		);
	});

	test('CSR: server-only-widget keeps styles after Home → About', async ({
		page,
	}) => {
		await page.goto('/', GOTO_OPTIONS);

		// Navigate to about — server-only-widget is freshly created (CSR)
		await page.click('a[href="/about/"]');
		await page.waitForURL('**/about/');
		await expect(page.locator('server-only-widget')).toBeVisible();

		expect(await adoptedCount(page, 'server-only-widget')).toBeGreaterThan(0);
		// green = rgb(0, 128, 0)
		expect(await shadowColor(page, 'server-only-widget', '.badge')).toBe(
			'rgb(0, 128, 0)',
		);
	});

	test('CSR: client-only-widget keeps styles after Home → Contact', async ({
		page,
	}) => {
		await page.goto('/', GOTO_OPTIONS);

		// Navigate to contact — client-only-widget is freshly created (CSR)
		await page.click('a[href="/contact/"]');
		await page.waitForURL('**/contact/');
		await expect(page.locator('client-only-widget')).toBeVisible();

		expect(await adoptedCount(page, 'client-only-widget')).toBeGreaterThan(0);
		// purple = rgb(128, 0, 128)
		expect(await shadowColor(page, 'client-only-widget', '.badge')).toBe(
			'rgb(128, 0, 128)',
		);
	});

	test('CSR: all CEs keep styles across full navigation cycle', async ({
		page,
	}) => {
		await page.goto('/', GOTO_OPTIONS);

		// Home — check full-stack-widget
		await expect(page.locator('full-stack-widget')).toBeVisible();
		expect(await shadowColor(page, 'full-stack-widget', '.badge')).toBe(
			'rgb(0, 128, 128)',
		);

		// → About
		await page.click('a[href="/about/"]');
		await page.waitForURL('**/about/');
		await expect(page.locator('server-only-widget')).toBeVisible();
		expect(await shadowColor(page, 'server-only-widget', '.badge')).toBe(
			'rgb(0, 128, 0)',
		);

		// → Contact
		await page.click('a[href="/contact/"]');
		await page.waitForURL('**/contact/');
		await expect(page.locator('client-only-widget')).toBeVisible();
		expect(await shadowColor(page, 'client-only-widget', '.badge')).toBe(
			'rgb(128, 0, 128)',
		);

		// → Home (full cycle)
		await page.click('a[href="/"]');
		await page.waitForURL(/\/$/);
		await expect(page.locator('full-stack-widget')).toBeVisible();
		expect(await shadowColor(page, 'full-stack-widget', '.badge')).toBe(
			'rgb(0, 128, 128)',
		);
		expect(await shadowColor(page, 'my-greetings', '.greeting')).toBe(
			'rgb(0, 0, 139)',
		);
	});
});

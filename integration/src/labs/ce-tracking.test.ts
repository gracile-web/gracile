/* eslint-disable @typescript-eslint/no-floating-promises */

import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { after, afterEach, before, describe, it } from 'node:test';
import { fileURLToPath } from 'node:url';

import {
	installCeTracker,
	blockCesForModule,
	hasCeRegistrations,
	resetCeTracker,
	getBlockedTags,
	getModuleToTags,
} from '@gracile/engine/dev/ssr-ce-tracker';
import { getText } from '../helpers/fetch.js';
import { createTestServer, type TestServer } from '../helpers/server.js';

// ── Mock registry ───────────────────────────────────────────────────

const registryStore = new Map<string, CustomElementConstructor>();

function createMockRegistry(): Pick<CustomElementRegistry, 'define' | 'get'> {
	return {
		define(name: string, ctor: CustomElementConstructor) {
			if (registryStore.has(name))
				throw new Error(`"${name}" has already been defined`);
			registryStore.set(name, ctor);
		},
		get(name: string) {
			return registryStore.get(name);
		},
	};
}

/** Dummy constructor — the tracker never inspects it. */
const fakeCtor = () => class {} as unknown as CustomElementConstructor;

// ── Helpers ─────────────────────────────────────────────────────────

interface CeTrackerGlobal {
	setModule: (id: string) => void;
	clearModule: () => void;
}

function tracker(): CeTrackerGlobal {
	return (globalThis as Record<string, unknown>)[
		'__gracile_ce_tracker'
	] as CeTrackerGlobal;
}

/** Simulate what the Vite transform injects around a CE module. */
function simulateModuleEval(
	moduleId: string,
	definitions: Record<string, CustomElementConstructor>,
) {
	tracker().setModule(moduleId);
	for (const [name, ctor] of Object.entries(definitions)) {
		globalThis.customElements.define(name, ctor);
	}
	tracker().clearModule();
}

// ── Registry wrapper tests ──────────────────────────────────────────

describe('ssr-ce-tracker', () => {
	before(() => {
		(globalThis as Record<string, unknown>)['customElements'] =
			createMockRegistry();
		installCeTracker();
	});

	after(() => {
		// Full teardown so the smoke test's Vite server can install fresh.
		resetCeTracker(true);
		delete (globalThis as Record<string, unknown>)['customElements'];
		delete (globalThis as Record<string, unknown>)['__gracile_ce_tracker'];
	});

	afterEach(() => {
		resetCeTracker();
		registryStore.clear();
	});

	it('tracks CE registrations per module', () => {
		simulateModuleEval('/src/components/my-btn.ts', {
			'my-btn': fakeCtor(),
		});

		assert.ok(hasCeRegistrations('/src/components/my-btn.ts'));
		assert.deepEqual(
			[...getModuleToTags().get('/src/components/my-btn.ts')!],
			['my-btn'],
		);
	});

	it('tracks multiple CEs from the same module', () => {
		simulateModuleEval('/src/components/buttons.ts', {
			'my-btn': fakeCtor(),
			'my-icon-btn': fakeCtor(),
		});

		const tags = getModuleToTags().get('/src/components/buttons.ts')!;
		assert.deepEqual([...tags].sort(), ['my-btn', 'my-icon-btn']);
	});

	it('blocks CEs for a module', () => {
		simulateModuleEval('/src/components/my-btn.ts', {
			'my-btn': fakeCtor(),
		});

		assert.ok(globalThis.customElements.get('my-btn'));

		blockCesForModule('/src/components/my-btn.ts');

		assert.equal(globalThis.customElements.get('my-btn'), undefined);
		assert.ok(getBlockedTags().has('my-btn'));
	});

	it('unblocks on re-define (simulates HMR re-evaluation)', () => {
		simulateModuleEval('/src/components/my-btn.ts', {
			'my-btn': fakeCtor(),
		});
		blockCesForModule('/src/components/my-btn.ts');
		assert.equal(globalThis.customElements.get('my-btn'), undefined);

		// Module is re-evaluated after invalidation → define() fires again.
		simulateModuleEval('/src/components/my-btn.ts', {
			'my-btn': fakeCtor(),
		});

		assert.ok(globalThis.customElements.get('my-btn'));
		assert.ok(!getBlockedTags().has('my-btn'));
	});

	it('blocking one module does not affect another', () => {
		simulateModuleEval('/src/components/my-btn.ts', {
			'my-btn': fakeCtor(),
		});
		simulateModuleEval('/src/components/my-card.ts', {
			'my-card': fakeCtor(),
		});

		blockCesForModule('/src/components/my-btn.ts');

		assert.equal(globalThis.customElements.get('my-btn'), undefined);
		assert.ok(globalThis.customElements.get('my-card'));
	});

	it('resetCeTracker clears all state', () => {
		simulateModuleEval('/src/components/my-btn.ts', {
			'my-btn': fakeCtor(),
		});
		blockCesForModule('/src/components/my-btn.ts');

		resetCeTracker();

		assert.ok(!hasCeRegistrations('/src/components/my-btn.ts'));
		assert.equal(getBlockedTags().size, 0);
		assert.equal(getModuleToTags().size, 0);
	});

	it('swallows duplicate define errors', () => {
		simulateModuleEval('/src/components/my-btn.ts', {
			'my-btn': fakeCtor(),
		});

		// Second define with same tag — wrapper should catch the throw.
		assert.doesNotThrow(() => {
			simulateModuleEval('/src/components/my-btn.ts', {
				'my-btn': fakeCtor(),
			});
		});
	});
});

// ── Heuristic tests (pure pattern matching, no registry needed) ─────

describe('mightDefineCE heuristic', () => {
	/** Replicate the heuristic from plugin-ce-tracker.ts. */
	function mightDefineCE(code: string): boolean {
		return (
			code.includes('customElements.define') ||
			/\bcustomElement\s*\(/.test(code)
		);
	}

	it('matches customElements.define', () => {
		assert.ok(mightDefineCE("customElements.define('my-btn', MyBtn)"));
	});

	it('matches @customElement decorator (TS source)', () => {
		assert.ok(mightDefineCE("@customElement('my-btn')"));
	});

	it('matches compiled decorator output', () => {
		assert.ok(
			mightDefineCE('__decorate([customElement("my-btn")], MyBtn)'),
		);
	});

	it('matches customElement with whitespace before paren', () => {
		assert.ok(mightDefineCE('customElement ("my-btn")'));
	});

	it('does not match customElements.get', () => {
		assert.ok(!mightDefineCE("customElements.get('my-btn')"));
	});

	it('does not match isCustomElement function call', () => {
		assert.ok(!mightDefineCE('isCustomElement(el)'));
	});

	it('does not match unrelated lit/decorators imports', () => {
		assert.ok(
			!mightDefineCE(
				"import { property, state } from 'lit/decorators.js';",
			),
		);
	});
});

// ── Smoke test: real Vite dev server with file mutations ────────────

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const routeFile = path.resolve(
	__dirname,
	'../../__fixtures__/ce-tracker/src/routes/index.ts',
);

const ROUTE_WITH_CE = `import './_my-widget.js';

import { defineRoute } from '@gracile/server/route';
import { html } from 'lit';

import { document } from './_document.js';

export default defineRoute({
\tdocument: (context) => document(context),

\ttemplate: () => html\`
\t\t<h1>CE Tracker</h1>
\t\t<my-widget></my-widget>
\t\`,
});
`;

const ROUTE_WITHOUT_CE = `// import './_my-widget.js';

import { defineRoute } from '@gracile/server/route';
import { html } from 'lit';

import { document } from './_document.js';

export default defineRoute({
\tdocument: (context) => document(context),

\ttemplate: () => html\`
\t\t<h1>CE Tracker</h1>
\t\t<my-widget></my-widget>
\t\`,
});
`;

/**
 * Poll-fetch until the HTML satisfies a condition.
 * Handles the async delay between writing a file and Vite's HMR processing.
 */
async function waitForHtml(
	address: string,
	urlPath: string,
	condition: (html: string) => boolean,
	timeout = 10_000,
	interval = 300,
): Promise<string> {
	const start = Date.now();
	let lastHtml = '';
	while (Date.now() - start < timeout) {
		lastHtml = await getText(address, urlPath);
		if (condition(lastHtml)) return lastHtml;
		await new Promise((r) => setTimeout(r, interval));
	}
	throw new Error(
		`Condition not met within ${timeout}ms.\nLast HTML (500 chars): ${lastHtml.slice(0, 500)}`,
	);
}

describe('CE tracker smoke (dev server)', () => {
	let server: TestServer;
	let originalContent: string;

	before(async () => {
		originalContent = fs.readFileSync(routeFile, 'utf8');
		fs.writeFileSync(routeFile, ROUTE_WITH_CE, 'utf8');
		server = await createTestServer('ce-tracker');
	});

	after(async () => {
		fs.writeFileSync(routeFile, originalContent, 'utf8');
		await server?.close();
	});

	it('renders CE shadow DOM when import is present', async () => {
		const html = await getText(server.address, '/');

		assert.ok(
			html.includes('widget-ssr-content'),
			'CE shadow DOM should be SSR-rendered',
		);
	});

	it('stops rendering CE shadow DOM when import is removed', async () => {
		fs.writeFileSync(routeFile, ROUTE_WITHOUT_CE, 'utf8');

		const html = await waitForHtml(
			server.address,
			'/',
			(h) => !h.includes('widget-ssr-content'),
		);

		assert.ok(
			html.includes('<my-widget'),
			'Tag should still be in template',
		);
	});

	it('re-renders CE shadow DOM when import is restored', async () => {
		fs.writeFileSync(routeFile, ROUTE_WITH_CE, 'utf8');

		const html = await waitForHtml(
			server.address,
			'/',
			(h) => h.includes('widget-ssr-content'),
		);

		assert.ok(html.includes('widget-ssr-content'));
	});
});

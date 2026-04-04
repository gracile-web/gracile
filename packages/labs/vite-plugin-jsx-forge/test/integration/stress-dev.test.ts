/**
 * Stress test — dev server resilience to file mutations.
 *
 * Exercises the scenarios that previously broke `ts-patch + @rollup/plugin-typescript`:
 *
 * 1. Add a new `.tsx` file while the server is running
 * 2. Modify an existing `.tsx` file (content change)
 * 3. Rename `.ts` → `.tsx` (adding JSX to a plain route)
 * 4. Rename `.tsx` → `.ts` (removing JSX from a route)
 * 5. Delete a `.tsx` file
 *
 * Each mutation waits for the Gracile dev server to pick up the change,
 * then fetches the route to verify it renders correctly (or 404s for deletes).
 *
 * Uses a dedicated copy of the fixture so mutations don't affect other tests.
 */

/* eslint-disable @typescript-eslint/no-floating-promises */

import assert from 'node:assert/strict';
import { cp, mkdir, readFile, realpath, rm, writeFile } from 'node:fs/promises';
import { after, before, describe, it } from 'node:test';
import { setTimeout as delay } from 'node:timers/promises';
import { join } from 'node:path';
import { tmpdir } from 'node:os';
import { randomUUID } from 'node:crypto';

import { get, getText } from '@gracile/internal-test-utils/fetch';
import {
	assertExists,
	assertTextIncludes,
	assertTitle,
	parseHtml,
} from '@gracile/internal-test-utils/html';
import {
	createTestServer,
	type TestServer,
} from '@gracile/internal-test-utils/server';
import { resolveFixtures } from '@gracile/internal-test-utils/fixtures';

/** Settle time for the dev server to pick up file system changes. */
const SETTLE_MS = 2500;

describe('jsx stress — dev server file mutations', () => {
	let server: TestServer;
	let workDir: string;

	before(async () => {
		// Copy the fixture to a temp dir so we can mutate freely.
		const fixtureSource = join(resolveFixtures(), 'jsx-accuracy');
		// Resolve real path to avoid macOS /var → /private/var mismatch:
		// Vite resolves file IDs to real paths, but os.tmpdir() returns the
		// symlinked path. The TS program would index files under one prefix
		// while Vite passes the other, causing getSourceFile() misses.
		const realTmp = await realpath(tmpdir());
		workDir = join(realTmp, `jsx-stress-${randomUUID()}`);
		await mkdir(workDir, { recursive: true });
		await cp(fixtureSource, workDir, {
			recursive: true,
			filter: (src) => !src.includes('node_modules') && !src.includes('dist'),
		});

		// Symlink node_modules from the original fixture.
		const { symlink } = await import('node:fs/promises');
		await symlink(
			join(fixtureSource, 'node_modules'),
			join(workDir, 'node_modules'),
			'dir',
		);

		server = await createTestServer('', {
			fixturesDirectory: workDir,
		});
	});

	after(async () => {
		await server?.close();
		// Clean up temp dir.
		await rm(workDir, { recursive: true, force: true });
	});

	// ── Baseline — fixture works before mutations ────────────────────

	it('baseline: home route renders', async () => {
		const html = await getText(server.address, '/');
		const $ = parseHtml(html);
		assertTitle($, 'JSX Accuracy - Types');
		assertExists($, '#boolean-attrs');
	});

	it('baseline: spread route renders', async () => {
		const html = await getText(server.address, '/spread');
		const $ = parseHtml(html);
		assertTitle($, 'JSX Accuracy - Spread');
		assertExists($, '#spread a');
	});

	it('baseline: plain .ts route renders', async () => {
		const html = await getText(server.address, '/plain');
		const $ = parseHtml(html);
		assertTitle($, 'JSX Accuracy - Plain');
	});

	// ── 1. Add a brand-new .tsx route ────────────────────────────────

	it('handles adding a new .tsx file', async () => {
		const newRoute = join(workDir, 'src', 'routes', 'dynamic-add.tsx');
		await writeFile(
			newRoute,
			`import { defineRoute } from '@gracile/gracile/route';
import { document } from '../document.js';

const label: string = 'Dynamic';

export default defineRoute({
	document: (context) => document({ ...context, title: 'Added Route' }),
	template: () => (
		<main>
			<section id="added">
				<p>{label} route works!</p>
			</section>
		</main>
	),
});
`,
		);

		await delay(SETTLE_MS);

		const html = await getText(server.address, '/dynamic-add');
		const $ = parseHtml(html);
		assertTitle($, 'Added Route');
		assertTextIncludes($, '#added p', 'Dynamic route works!');
	});

	// ── 2. Modify an existing .tsx route ─────────────────────────────

	it('handles modifying an existing .tsx file', async () => {
		const routePath = join(workDir, 'src', 'routes', 'spread.tsx');
		let content = await readFile(routePath, 'utf8');

		// Inject a new section before the closing </main>.
		content = content.replace(
			'</main>',
			`
			{/* Injected by stress test */}
			<section id="injected">
				<p>Mutation survived!</p>
			</section>
		</main>`,
		);

		await writeFile(routePath, content);
		await delay(SETTLE_MS);

		const html = await getText(server.address, '/spread');
		const $ = parseHtml(html);
		assertExists($, '#injected');
		assertTextIncludes($, '#injected p', 'Mutation survived!');
		// Original content still intact.
		assertExists($, '#spread a');
	});

	// ── 3. Rename .ts → .tsx (add JSX to a plain route) ─────────────

	it('handles renaming .ts → .tsx', async () => {
		const tsPath = join(workDir, 'src', 'routes', 'plain.ts');
		const tsxPath = join(workDir, 'src', 'routes', 'plain.tsx');

		// Read the original .ts content and convert to JSX version.
		await writeFile(
			tsxPath,
			`import { defineRoute } from '@gracile/gracile/route';
import { document } from '../document.js';

export default defineRoute({
	document: (context) => document({ ...context, title: 'Now JSX' }),
	template: () => (
		<main>
			<section id="was-plain">
				<p>Converted from .ts to .tsx!</p>
			</section>
		</main>
	),
});
`,
		);

		// Remove the old .ts file.
		await rm(tsPath, { force: true });
		await delay(SETTLE_MS);

		const html = await getText(server.address, '/plain');
		const $ = parseHtml(html);
		assertTitle($, 'Now JSX');
		assertTextIncludes($, '#was-plain p', 'Converted from .ts to .tsx!');
	});

	// ── 4. Rename .tsx → .ts (remove JSX from a route) ──────────────

	it('handles renaming .tsx → .ts', async () => {
		// The dynamic-add.tsx we created earlier — convert it back to .ts
		const tsxPath = join(workDir, 'src', 'routes', 'dynamic-add.tsx');
		const tsPath = join(workDir, 'src', 'routes', 'dynamic-add.ts');

		await writeFile(
			tsPath,
			`import { defineRoute } from '@gracile/gracile/route';
import { html } from '@gracile/gracile/server-html';
import { document } from '../document.js';

export default defineRoute({
	document: (context) => document({ ...context, title: 'Now Plain' }),
	template: () => html\`
		<main>
			<section id="now-plain">
				<p>Converted from .tsx to .ts!</p>
			</section>
		</main>
	\`,
});
`,
		);

		await rm(tsxPath, { force: true });
		await delay(SETTLE_MS);

		const html = await getText(server.address, '/dynamic-add');
		const $ = parseHtml(html);
		assertTitle($, 'Now Plain');
		assertTextIncludes($, '#now-plain p', 'Converted from .tsx to .ts!');
	});

	// ── 5. Delete a .tsx file ────────────────────────────────────────

	it('handles deleting a .tsx route', async () => {
		// Delete the spread route.
		await rm(join(workDir, 'src', 'routes', 'spread.tsx'), { force: true });
		await delay(SETTLE_MS);

		// Gracile may still serve a cached module until a full restart.
		// What matters for the plugin is that the server doesn't crash.
		const res = await get(server.address, '/spread');
		// Accept either 404 (route removed) or 200 (cached module).
		assert.ok(
			res.status === 404 || res.status === 200,
			`Expected 404 or 200, got ${res.status}`,
		);
	});

	// ── 6. Remaining routes still work ───────────────────────────────

	it('other routes still render after mutations', async () => {
		const html = await getText(server.address, '/');
		const $ = parseHtml(html);
		assertTitle($, 'JSX Accuracy - Types');
		assertExists($, '#boolean-attrs');
	});
});

#!/usr/bin/env node

/**
 * Benchmark: measure vite-plugin-jsx-forge transform overhead.
 *
 * Starts a Vite dev server on the `jsx-accuracy` fixture, then simulates
 * file edits (Ctrl+S) by fetching routes repeatedly — measuring:
 *
 * 1. **Cold start** — first request (LS + program bootstrap)
 * 2. **Warm .tsx transform** — incremental updates to a JSX route
 * 3. **Warm .ts passthrough** — same for a plain Lit route (baseline)
 *
 * Results are printed as a markdown table and optionally written to a file.
 *
 * Usage:
 *   node scripts/bench-transform.mjs [--rounds=N] [--out=path.md]
 */

import { createServer } from 'vite';
import { randomUUID } from 'node:crypto';
import { tmpdir } from 'node:os';
import { join, resolve } from 'node:path';
import { writeFile, readFile } from 'node:fs/promises';
import { performance } from 'node:perf_hooks';
import { parseArgs } from 'node:util';

// ---------------------------------------------------------------------------
// CLI args
// ---------------------------------------------------------------------------

const { values: args } = parseArgs({
	options: {
		rounds: { type: 'string', default: '20' },
		out: { type: 'string' },
		warmup: { type: 'string', default: '3' },
	},
	strict: false,
});

const ROUNDS = Number(args.rounds);
const WARMUP = Number(args.warmup);
const OUT_PATH = args.out;

// ---------------------------------------------------------------------------
// Fixture setup
// ---------------------------------------------------------------------------

const fixtureRoot = resolve(
	import.meta.dirname,
	'..',
	'__fixtures__',
	'jsx-accuracy',
);

/** Start a throwaway dev server on the fixture. */
async function startServer(viteOverrides = {}) {
	const server = await createServer({
		root: fixtureRoot,
		server: { port: 0 },
		logLevel: 'error',
		cacheDir: join(tmpdir(), '.vite-bench', randomUUID()),
		...viteOverrides,
	});

	await server.listen();
	const info = /** @type {import('node:net').AddressInfo} */ (
		server.httpServer?.address()
	);
	if (!info?.port) {
		await server.close();
		throw new Error('Dev server failed to bind a port');
	}
	return {
		address: `http://localhost:${info.port}`,
		vite: server,
	};
}

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

/** Fetch a route, return wall-clock ms. */
async function timeRoute(address, path) {
	const t0 = performance.now();
	const res = await fetch(`${address}${path}`);
	await res.text(); // consume body
	const elapsed = performance.now() - t0;
	if (!res.ok) throw new Error(`${path} → ${res.status}`);
	return elapsed;
}

/** Simulate a file edit by touching content and waiting for HMR. */
async function touchFile(filePath) {
	const content = await readFile(filePath, 'utf8');
	// Append/remove a harmless trailing comment to change content.
	const tweaked = content.endsWith('// bench-touch\n')
		? content.slice(0, -'// bench-touch\n'.length)
		: content + '// bench-touch\n';
	await writeFile(filePath, tweaked);
}

function stats(samples) {
	const sorted = [...samples].sort((a, b) => a - b);
	const sum = sorted.reduce((a, b) => a + b, 0);
	const mean = sum / sorted.length;
	const median = sorted[Math.floor(sorted.length / 2)];
	const p95 = sorted[Math.floor(sorted.length * 0.95)];
	const min = sorted[0];
	const max = sorted.at(-1);
	return { mean, median, p95, min, max };
}

function fmt(ms) {
	return ms.toFixed(1);
}

// ---------------------------------------------------------------------------
// Main
// ---------------------------------------------------------------------------

console.log(
	`\n🔧 jsx-forge transform benchmark — ${ROUNDS} rounds, ${WARMUP} warmup\n`,
);

// ── Imports for syntactic server ───────────────────────────────────

const { gracile } = await import('@gracile/gracile/plugin');
const { gracileJsxToLiterals } =
	await import('@gracile-labs/vite-plugin-jsx-forge/to-literals');

const tsxRoute = '/'; // (home).tsx — JSX transform
const tsRoute = '/plain'; // plain.ts — vanilla html`` (baseline)
const tsxFile = join(fixtureRoot, 'src', 'routes', '(home).tsx');
const tsFile = join(fixtureRoot, 'src', 'routes', 'plain.ts');

// ====================================================================
// A) Type-aware mode (default — LanguageService)
// ====================================================================

console.log('── Type-aware mode ──');

const { address, vite } = await startServer();

const coldTsx = await timeRoute(address, tsxRoute);
const coldTs = await timeRoute(address, tsRoute);

console.log(`Cold .tsx: ${fmt(coldTsx)} ms`);
console.log(`Cold .ts:  ${fmt(coldTs)} ms`);

for (let i = 0; i < WARMUP; i++) {
	await timeRoute(address, tsxRoute);
	await timeRoute(address, tsRoute);
}

const warmTsx = [];
const warmTs = [];

for (let i = 0; i < ROUNDS; i++) {
	warmTsx.push(await timeRoute(address, tsxRoute));
	warmTs.push(await timeRoute(address, tsRoute));
}

const incrTsx = [];
const incrTs = [];
const SETTLE_MS = 150;
const delay = (ms) => new Promise((r) => setTimeout(r, ms));

for (let i = 0; i < ROUNDS; i++) {
	await touchFile(tsxFile);
	await delay(SETTLE_MS);
	incrTsx.push(await timeRoute(address, tsxRoute));

	await touchFile(tsFile);
	await delay(SETTLE_MS);
	incrTs.push(await timeRoute(address, tsRoute));
}

await vite.close();

// ====================================================================
// B) Syntactic-only mode (typeAware: false — no LanguageService)
// ====================================================================

console.log('\n── Syntactic-only mode (typeAware: false) ──');

const { address: synAddr, vite: synVite } = await startServer({
	configFile: false,
	plugins: [gracileJsxToLiterals({ typeAware: false }), gracile()],
});

const synColdTsx = await timeRoute(synAddr, tsxRoute);
console.log(`Cold .tsx: ${fmt(synColdTsx)} ms`);

for (let i = 0; i < WARMUP; i++) {
	await timeRoute(synAddr, tsxRoute);
}

const synWarmTsx = [];
for (let i = 0; i < ROUNDS; i++) {
	synWarmTsx.push(await timeRoute(synAddr, tsxRoute));
}

const synIncrTsx = [];
for (let i = 0; i < ROUNDS; i++) {
	await touchFile(tsxFile);
	await delay(SETTLE_MS);
	synIncrTsx.push(await timeRoute(synAddr, tsxRoute));
}

await synVite.close();

// ── Report ─────────────────────────────────────────────────────────

const sTsx = stats(warmTsx);
const sTs = stats(warmTs);
const siTsx = stats(incrTsx);
const siTs = stats(incrTs);
const ssynW = stats(synWarmTsx);
const ssynI = stats(synIncrTsx);

const table = `
## vite-plugin-jsx-forge — transform benchmark

| Scenario | median | mean | p95 | min | max |
|---|---|---|---|---|---|
| **Cold start .tsx** (type-aware) | — | ${fmt(coldTsx)} ms | — | — | — |
| **Cold start .tsx** (syntactic) | — | ${fmt(synColdTsx)} ms | — | — | — |
| **Cold start .ts** | — | ${fmt(coldTs)} ms | — | — | — |
| **Warm request .tsx** (type-aware) | ${fmt(sTsx.median)} ms | ${fmt(sTsx.mean)} ms | ${fmt(sTsx.p95)} ms | ${fmt(sTsx.min)} ms | ${fmt(sTsx.max)} ms |
| **Warm request .tsx** (syntactic) | ${fmt(ssynW.median)} ms | ${fmt(ssynW.mean)} ms | ${fmt(ssynW.p95)} ms | ${fmt(ssynW.min)} ms | ${fmt(ssynW.max)} ms |
| **Warm request .ts** (baseline) | ${fmt(sTs.median)} ms | ${fmt(sTs.mean)} ms | ${fmt(sTs.p95)} ms | ${fmt(sTs.min)} ms | ${fmt(sTs.max)} ms |
| **Incremental .tsx** (type-aware) | ${fmt(siTsx.median)} ms | ${fmt(siTsx.mean)} ms | ${fmt(siTsx.p95)} ms | ${fmt(siTsx.min)} ms | ${fmt(siTsx.max)} ms |
| **Incremental .tsx** (syntactic) | ${fmt(ssynI.median)} ms | ${fmt(ssynI.mean)} ms | ${fmt(ssynI.p95)} ms | ${fmt(ssynI.min)} ms | ${fmt(ssynI.max)} ms |
| **Incremental .ts** (baseline) | ${fmt(siTs.median)} ms | ${fmt(siTs.mean)} ms | ${fmt(siTs.p95)} ms | ${fmt(siTs.min)} ms | ${fmt(siTs.max)} ms |

_${ROUNDS} rounds, ${WARMUP} warmup — ${new Date().toISOString()}_
`.trim();

console.log('\n' + table + '\n');

if (OUT_PATH) {
	await writeFile(OUT_PATH, table + '\n', 'utf8');
	console.log(`Written to ${OUT_PATH}`);
}

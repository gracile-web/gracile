#!/usr/bin/env node

/**
 * Benchmark: measure lit-macros transform time + output size difference.
 *
 * Usage:
 *   node scripts/bench-transform.mjs [--rounds=N] [--out=path.md]
 */

import { readFileSync, readdirSync, statSync } from 'node:fs';
import { writeFile } from 'node:fs/promises';
import { join, resolve } from 'node:path';
import { performance } from 'node:perf_hooks';
import { parseArgs } from 'node:util';

// ---------------------------------------------------------------------------
// CLI args
// ---------------------------------------------------------------------------

const { values: args } = parseArgs({
	options: {
		rounds: { type: 'string', default: '500' },
		out: { type: 'string' },
	},
	strict: false,
});

const ROUNDS = Number(args.rounds);
const OUT_PATH = args.out;

// ---------------------------------------------------------------------------
// Resolve deps & import transform
// ---------------------------------------------------------------------------

const { resolveParseSync, resolveVisitor } =
	await import('@gracile-labs/lit-macros');
const { transformLitMacros } = await import('@gracile-labs/lit-macros');

const [parseSync, Visitor] = await Promise.all([
	resolveParseSync(),
	resolveVisitor(),
]);

// ---------------------------------------------------------------------------
// Fixtures
// ---------------------------------------------------------------------------

const fixturesDir = resolve(import.meta.dirname, '..', '__fixtures__');
const fixtures = readdirSync(fixturesDir).filter((name) => {
	const inputPath = join(fixturesDir, name, 'input.ts');
	try {
		statSync(inputPath);
		return true;
	} catch {
		return false;
	}
});

/** @type {Array<{name: string, source: string}>} */
const inputs = fixtures.map((name) => ({
	name,
	source: readFileSync(join(fixturesDir, name, 'input.ts'), 'utf8'),
}));

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

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

function fmt(us) {
	return us.toFixed(1);
}

function bytes(n) {
	if (n < 1024) return `${n} B`;
	return `${(n / 1024).toFixed(1)} KB`;
}

// ---------------------------------------------------------------------------
// Benchmark: per-fixture transform time
// ---------------------------------------------------------------------------

console.log(
	`\n⚡ lit-macros transform benchmark — ${ROUNDS} rounds per fixture\n`,
);

/** @type {Array<{name: string, stats: ReturnType<typeof stats>, inputSize: number, outputSize: number}>} */
const results = [];

for (const { name, source } of inputs) {
	const samples = [];

	// Warmup (5 rounds)
	for (let i = 0; i < 5; i++) {
		transformLitMacros(source, parseSync, Visitor, {
			sourceFileName: `${name}.ts`,
		});
	}

	for (let i = 0; i < ROUNDS; i++) {
		const t0 = performance.now();
		transformLitMacros(source, parseSync, Visitor, {
			sourceFileName: `${name}.ts`,
		});
		const elapsed = (performance.now() - t0) * 1000; // µs
		samples.push(elapsed);
	}

	const result = transformLitMacros(source, parseSync, Visitor, {
		sourceFileName: `${name}.ts`,
	});

	const inputSize = Buffer.byteLength(source, 'utf8');
	const outputSize = result
		? Buffer.byteLength(result.code, 'utf8')
		: inputSize;

	const st = stats(samples);
	results.push({ name, stats: st, inputSize, outputSize });

	console.log(
		`  ${name.padEnd(20)} median ${fmt(st.median)} µs  |  ` +
			`${bytes(inputSize)} → ${bytes(outputSize)} ` +
			`(${inputSize === outputSize ? 'no change' : (((outputSize - inputSize) / inputSize) * 100).toFixed(1) + '%'})`,
	);
}

// ---------------------------------------------------------------------------
// Aggregate: all fixtures concatenated
// ---------------------------------------------------------------------------

const bigSource = inputs.map((f) => f.source).join('\n\n');
const bigSamples = [];

for (let i = 0; i < 5; i++) {
	transformLitMacros(bigSource, parseSync, Visitor, {
		sourceFileName: 'all.ts',
	});
}
for (let i = 0; i < ROUNDS; i++) {
	const t0 = performance.now();
	transformLitMacros(bigSource, parseSync, Visitor, {
		sourceFileName: 'all.ts',
	});
	const elapsed = (performance.now() - t0) * 1000;
	bigSamples.push(elapsed);
}

const bigStats = stats(bigSamples);
console.log(
	`\n  ${'ALL COMBINED'.padEnd(20)} median ${fmt(bigStats.median)} µs\n`,
);

// ---------------------------------------------------------------------------
// Markdown report
// ---------------------------------------------------------------------------

const rows = results.map(
	(r) =>
		`| ${r.name} | ${fmt(r.stats.median)} µs | ${fmt(r.stats.mean)} µs | ${fmt(r.stats.p95)} µs | ${fmt(r.stats.min)} µs | ${fmt(r.stats.max)} µs | ${bytes(r.inputSize)} → ${bytes(r.outputSize)} |`,
);

const table = `
## lit-macros — transform benchmark

| Fixture | median | mean | p95 | min | max | size |
|---|---|---|---|---|---|---|
${rows.join('\n')}
| **ALL COMBINED** | ${fmt(bigStats.median)} µs | ${fmt(bigStats.mean)} µs | ${fmt(bigStats.p95)} µs | ${fmt(bigStats.min)} µs | ${fmt(bigStats.max)} µs | — |

_${ROUNDS} rounds — ${new Date().toISOString()}_
`.trim();

console.log('\n' + table + '\n');

if (OUT_PATH) {
	await writeFile(OUT_PATH, table + '\n', 'utf8');
	console.log(`Written to ${OUT_PATH}`);
}

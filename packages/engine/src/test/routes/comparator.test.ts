/* eslint-disable @typescript-eslint/no-floating-promises */
import assert from 'node:assert/strict';
import { describe, test } from 'node:test';

import {
	prepareSortableRoutes,
	routeComparator,
	type RouteCompareObject,
} from '../../routes/comparator.js';

// ── Helper ───────────────────────────────────────────────────────────

/** Prepare two routes and return the comparator result. */
function compare(a: string, b: string): number {
	const [parsedA, parsedB] = prepareSortableRoutes([a, b]) as [
		RouteCompareObject,
		RouteCompareObject,
	];
	return routeComparator(parsedA, parsedB);
}

/** Sort an array of route file paths using the full pipeline. */
function sortRoutes(routes: string[]): string[] {
	return prepareSortableRoutes(routes)
		.sort((a, b) => routeComparator(a, b))
		.map((r) => r.route);
}

// ── prepareSortableRoutes ────────────────────────────────────────────

describe('prepareSortableRoutes — segment parsing', () => {
	test('static route has no dynamic or spread flags', () => {
		const [parsed] = prepareSortableRoutes(['about.ts']);
		assert.ok(parsed);
		assert.equal(parsed.segments.length, 1);
		assert.equal(parsed.segments[0]!.dynamic, false);
		assert.equal(parsed.segments[0]!.spread, false);
	});

	test('dynamic [param] segment is flagged', () => {
		const [parsed] = prepareSortableRoutes(['[slug].ts']);
		assert.ok(parsed);
		assert.equal(parsed.segments[0]!.dynamic, true);
		assert.equal(parsed.segments[0]!.spread, false);
	});

	test('rest [...param].ts segment is flagged as spread', () => {
		const [parsed] = prepareSortableRoutes(['[...slug].ts']);
		assert.ok(parsed);
		assert.equal(parsed.segments[0]!.spread, true);
	});

	test('partial dynamic game-[title].ts is dynamic but not allDynamic', () => {
		const [parsed] = prepareSortableRoutes(['game-[title].ts']);
		assert.ok(parsed);
		assert.equal(parsed.segments[0]!.dynamic, true);
		assert.equal(parsed.segments[0]!.allDynamic, false);
	});

	test('fully dynamic [bored].ts is allDynamic', () => {
		const [parsed] = prepareSortableRoutes(['[bored].ts']);
		assert.ok(parsed);
		assert.equal(parsed.segments[0]!.allDynamic, true);
	});
});

// ── routeComparator — pairwise ───────────────────────────────────────

describe('routeComparator — static vs. dynamic', () => {
	test('static before dynamic at same depth', () => {
		assert.ok(compare('about.ts', '[slug].ts') < 0);
	});

	test('dynamic after static at same depth', () => {
		assert.ok(compare('[slug].ts', 'about.ts') > 0);
	});
});

describe('routeComparator — dynamic vs. rest', () => {
	test('dynamic param before rest at same depth', () => {
		assert.ok(compare('[slug].ts', '[...slug].ts') < 0);
	});

	test('rest after dynamic param', () => {
		assert.ok(compare('[...slug].ts', '[slug].ts') > 0);
	});
});

describe('routeComparator — partial vs. full dynamic', () => {
	test('partial dynamic before fully dynamic', () => {
		assert.ok(compare('game-[title].ts', '[title].ts') < 0);
	});
});

describe('routeComparator — depth', () => {
	test('deeper route (more segments) comes first', () => {
		assert.ok(compare('foo/bar.ts', 'foo.ts') < 0);
	});

	test('shallower route after deeper', () => {
		assert.ok(compare('foo.ts', 'foo/bar.ts') > 0);
	});
});

describe('routeComparator — alphabetical tiebreak', () => {
	test('alpha before beta when otherwise equal', () => {
		assert.ok(compare('alpha.ts', 'beta.ts') < 0);
	});

	test('beta after alpha', () => {
		assert.ok(compare('beta.ts', 'alpha.ts') > 0);
	});
});

describe('routeComparator — rest with length difference', () => {
	test('/foo is more specific than /foo/[...bar]', () => {
		// /foo (1 segment) vs /foo/[...bar].ts (2 segments, last is rest)
		assert.ok(compare('foo.ts', 'foo/[...bar].ts') > 0);
	});
});

// ── Full sort — integration-style with realistic fixture paths ───────

describe('sortRoutes — full ordering of a realistic set', () => {
	test('mirrors the static-site torture test fixture ordering', () => {
		const input = [
			'[bored].ts',
			'(movie-index).ts',
			'shoot-or.ts',
			'[arrow]-noon.ts',
			'[arrow]-noon-[dive].ts',
			'[besides]-noon.ts',
			'[street]-mars.ts',
			'[trustee]/index.ts',
			'[trustee]/research.ts',
			'[trustee]/[...verdict].ts',
			'[zebras]-noon/index.ts',
			'make/[advance].ts',
			'make/[vast].ts',
			'car/bike/boat/index.ts',
			'car/bike/boat/train.ts',
			'car/bike/boat/zeppelin.ts',
			'car/bike/boat/[...period].ts',
			'car/bike/boat/train/red.ts',
		];

		const sorted = sortRoutes(input);

		// Verify key ordering invariants:

		// 1. Static 'shoot-or' before any dynamic at same level
		assert.ok(sorted.indexOf('shoot-or.ts') < sorted.indexOf('[bored].ts'));

		// 2. Partial dynamic '[arrow]-noon' before fully dynamic '[bored]'
		assert.ok(sorted.indexOf('[arrow]-noon.ts') < sorted.indexOf('[bored].ts'));

		// 3. Deeper 'car/bike/boat/train/red.ts' before 'car/bike/boat/train.ts'
		assert.ok(
			sorted.indexOf('car/bike/boat/train/red.ts') <
				sorted.indexOf('car/bike/boat/train.ts'),
		);

		// 4. Static 'car/bike/boat/train.ts' before rest 'car/bike/boat/[...period].ts'
		assert.ok(
			sorted.indexOf('car/bike/boat/train.ts') <
				sorted.indexOf('car/bike/boat/[...period].ts'),
		);

		// 5. '[trustee]/research.ts' (static child) before '[trustee]/[...verdict].ts' (rest child)
		assert.ok(
			sorted.indexOf('[trustee]/research.ts') <
				sorted.indexOf('[trustee]/[...verdict].ts'),
		);

		// 6. Parenthesized index '(movie-index).ts' is at same level as others
		//    (it still gets compared normally, just a single segment)
		assert.ok(sorted.includes('(movie-index).ts'));
	});
});

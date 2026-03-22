/**
 * Build output structural assertions.
 *
 * Instead of comparing the entire dist/ tree byte-for-byte (which breaks on
 * every hash change), these helpers verify that the build produced the
 * expected _structure_: key files exist, HTML files have valid markup,
 * asset directories are populated, etc.
 *
 * All paths are relative to a configurable fixtures directory (defaults to
 * `${process.cwd()}/__fixtures__`).
 */

import assert from 'node:assert/strict';
import { access, readdir, readFile } from 'node:fs/promises';
import { join } from 'node:path';

import { resolveFixtures } from './fixtures.js';

/** Assert that a file exists within a fixture directory. */
export async function assertFileExists(
	fixture: string,
	...pathParts: string[]
) {
	const fixturesDirectory = resolveFixtures();
	const fullPath = join(fixturesDirectory, fixture, ...pathParts);
	try {
		await access(fullPath);
	} catch {
		assert.fail(`Expected file to exist: ${(pathParts as string[]).join('/')}`);
	}
}

/**
 * Assert that a directory exists and return its entries (recursive).
 */
export async function listDirectory(
	fixture: string,
	...pathParts: string[]
): Promise<string[]> {
	const fixturesDirectory = resolveFixtures();
	const fullPath = join(fixturesDirectory, fixture, ...pathParts);
	try {
		const entries = await readdir(fullPath, { recursive: true });
		return entries.sort();
	} catch {
		assert.fail(`Expected directory to exist: ${pathParts.join('/')}`);
	}
}

/** Read a file from a fixture directory. */
export async function readFixtureFile(
	fixture: string,
	...pathParts: string[]
): Promise<string> {
	const fixturesDirectory = resolveFixtures();
	return readFile(join(fixturesDirectory, fixture, ...pathParts), 'utf8');
}

/**
 * Assert that the build output contains files matching the given substrings.
 * Each pattern is checked against the full recursive file list.
 */
export async function assertBuildContains(
	fixture: string,
	distributionDirectory: string,
	expectedPatterns: string[],
) {
	const files = await listDirectory(fixture, distributionDirectory);
	for (const pattern of expectedPatterns) {
		const found = files.some((f) => f.includes(pattern));
		assert.ok(
			found,
			`Expected build output "${distributionDirectory}" to contain a file matching "${pattern}"\nFiles found: ${files.join(', ')}`,
		);
	}
}

/**
 * Assert that an HTML file in the build output has valid structure and
 * optionally check for content patterns.
 */
export async function assertHtmlFile(
	fixture: string,
	filePath: string,
	checks?: {
		titleIncludes?: string;
		bodyIncludes?: string[];
		bodyExcludes?: string[];
	},
) {
	const content = await readFixtureFile(fixture, filePath);
	assert.ok(
		content.includes('<!') || content.includes('<html'),
		`Expected ${filePath} to look like HTML`,
	);

	if (checks?.titleIncludes) {
		assert.ok(
			content.includes(checks.titleIncludes),
			`Expected ${filePath} title to contain "${checks.titleIncludes}"`,
		);
	}
	if (checks?.bodyIncludes) {
		for (const text of checks.bodyIncludes) {
			assert.ok(
				content.includes(text),
				`Expected ${filePath} to contain "${text}"`,
			);
		}
	}
	if (checks?.bodyExcludes) {
		for (const text of checks.bodyExcludes) {
			assert.ok(
				!content.includes(text),
				`Expected ${filePath} NOT to contain "${text}"`,
			);
		}
	}
}

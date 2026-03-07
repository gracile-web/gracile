/* eslint-disable @typescript-eslint/no-floating-promises */
import { describe, test } from 'node:test';
import assert from 'node:assert/strict';

import { parseArguments as parseArguments } from '../phases/parse-arguments.js';

const BASE_OPTS = { cliVersion: 'v0.1.0' };

describe('parseArgs', () => {
	test('parses --location flag', () => {
		const result = parseArguments(
			['node', 'create-gracile', '-d', 'my-project'],
			BASE_OPTS,
		);
		assert.equal(result.location, 'my-project');
	});

	test('parses --template flag', () => {
		const result = parseArguments(
			['node', 'create-gracile', '-t', 'minimal-static'],
			BASE_OPTS,
		);
		assert.equal(result.template, 'minimal-static');
	});

	test('parses --next flag', () => {
		const result = parseArguments(['node', 'create-gracile', '-n'], BASE_OPTS);
		assert.equal(result.next, true);
	});

	test('parses --install-dependencies flag', () => {
		const result = parseArguments(['node', 'create-gracile', '-i'], BASE_OPTS);
		assert.equal(result.installDependencies, true);
	});

	test('parses --initialize-git flag', () => {
		const result = parseArguments(['node', 'create-gracile', '-g'], BASE_OPTS);
		assert.equal(result.initializeGit, true);
	});

	test('parses --dry-run flag', () => {
		const result = parseArguments(['node', 'create-gracile', '-D'], BASE_OPTS);
		assert.equal(result.dryRun, true);
	});

	test('parses multiple flags together', () => {
		const result = parseArguments(
			[
				'node',
				'create-gracile',
				'-d',
				'my-project',
				'-t',
				'basics',
				'-n',
				'-i',
				'-g',
				'-D',
			],
			BASE_OPTS,
		);
		assert.equal(result.location, 'my-project');
		assert.equal(result.template, 'basics');
		assert.equal(result.next, true);
		assert.equal(result.installDependencies, true);
		assert.equal(result.initializeGit, true);
		assert.equal(result.dryRun, true);
	});

	test('returns empty settings when no flags provided', () => {
		const result = parseArguments(['node', 'create-gracile'], BASE_OPTS);
		assert.equal(result.location, undefined);
		assert.equal(result.template, undefined);
		assert.equal(result.next, undefined);
		assert.equal(result.installDependencies, undefined);
		assert.equal(result.initializeGit, undefined);
		assert.equal(result.dryRun, undefined);
	});

	test('parses --use-previous-settings flag', () => {
		const result = parseArguments(['node', 'create-gracile', '-s'], BASE_OPTS);
		assert.equal(result.usePreviousSettings, true);
	});

	test('parses --clear-previous-settings flag', () => {
		const result = parseArguments(['node', 'create-gracile', '-r'], BASE_OPTS);
		assert.equal(result.clearPreviousSettings, true);
	});
});

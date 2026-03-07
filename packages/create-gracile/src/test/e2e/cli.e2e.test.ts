/* eslint-disable unicorn/prevent-abbreviations */
/* eslint-disable @typescript-eslint/no-floating-promises */
import { describe, test } from 'node:test';
import assert from 'node:assert/strict';
import { resolve } from 'node:path';
import { execFile } from 'node:child_process';
import { promisify } from 'node:util';

const execFileAsync = promisify(execFile);

const CLI_PATH = resolve(
	import.meta.dirname ?? new URL('.', import.meta.url).pathname,
	'../../cli.js',
);

describe('CLI E2E', () => {
	test('--version prints version', async () => {
		const { stdout } = await execFileAsync('node', [CLI_PATH, '--version']);
		assert.match(stdout.trim(), /^v?\d+\.\d+\.\d+/);
	});

	test('--help prints usage information', async () => {
		const { stdout } = await execFileAsync('node', [CLI_PATH, '--help']);
		assert.ok(stdout.includes('create-gracile'));
		assert.ok(stdout.includes('--location'));
		assert.ok(stdout.includes('--template'));
		assert.ok(stdout.includes('--dry-run'));
		assert.ok(stdout.includes('gracile.js.org'));
	});

	test('--dry-run with all flags completes without errors', async () => {
		const { stdout, stderr } = await execFileAsync('node', [
			CLI_PATH,
			'-d',
			'e2e-test-project',
			'-t',
			'minimal-static',
			'-i',
			'-g',
			'-D',
		]);

		const combined = stdout + stderr;

		// Should contain intro
		assert.ok(
			combined.includes('Gracile') || combined.includes('gracile'),
			'Expected CLI intro output',
		);

		// Should contain dry-run messages
		assert.ok(
			combined.includes('[dry-run]'),
			'Expected dry-run output messages',
		);

		// Should contain outro
		assert.ok(
			combined.includes('all set') || combined.includes('cd e2e-test-project'),
			'Expected outro output',
		);
	});

	test('--dry-run does not create files on disk', async () => {
		const { existsSync } = await import('node:fs');

		await execFileAsync('node', [
			CLI_PATH,
			'-d',
			'e2e-phantom-project',
			'-t',
			'minimal-static',
			'-i',
			'-g',
			'-D',
		]);

		assert.equal(
			existsSync('e2e-phantom-project'),
			false,
			'Dry-run should not create any files',
		);
		assert.equal(
			existsSync('e2e-phantom-project__tmp_clone'),
			false,
			'Dry-run should not create temp clone',
		);
	});
});

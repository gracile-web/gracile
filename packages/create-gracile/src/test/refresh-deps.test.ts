import { describe, test } from 'node:test';
import assert from 'node:assert/strict';

import { refreshDeps } from '../phases/refresh-deps.js';

import { createMockDeps, createMockRecorder } from './mock-deps.js';

const MOCK_PACKAGE_JSON = JSON.stringify({
	dependencies: {
		'@gracile/gracile': '0.0.0',
		lit: '3.0.0',
	},
	devDependencies: {
		'@gracile/engine': '0.0.0',
		typescript: '5.0.0',
	},
});

describe('refreshDeps', () => {
	test('fetches latest versions for all dependencies', async () => {
		const recorder = createMockRecorder();
		const mockDeps = createMockDeps(recorder, {
			readFileResults: new Map([
				['test-project/package.json', MOCK_PACKAGE_JSON],
			]),
			fetchLatestVersionResult: '2.0.0',
		});

		await refreshDeps(
			{ location: 'test-project' },
			{
				fs: mockDeps.fs,
				fetchLatestVersion: mockDeps.fetchLatestVersion,
				logger: mockDeps.logger,
			},
		);

		// Should fetch for all 4 packages
		assert.equal(recorder.fetchLatestVersionCalls.length, 4);

		const packageNames = new Set(
			recorder.fetchLatestVersionCalls.map((c) => c.packageName),
		);
		assert.ok(packageNames.has('@gracile/gracile'));
		assert.ok(packageNames.has('lit'));
		assert.ok(packageNames.has('@gracile/engine'));
		assert.ok(packageNames.has('typescript'));
	});

	test('uses "latest" version tag for @gracile packages by default', async () => {
		const recorder = createMockRecorder();
		const mockDeps = createMockDeps(recorder, {
			readFileResults: new Map([
				['test-project/package.json', MOCK_PACKAGE_JSON],
			]),
		});

		await refreshDeps(
			{ location: 'test-project' },
			{
				fs: mockDeps.fs,
				fetchLatestVersion: mockDeps.fetchLatestVersion,
				logger: mockDeps.logger,
			},
		);

		const gracileCalls = recorder.fetchLatestVersionCalls.filter((c) =>
			c.packageName.startsWith('@gracile/'),
		);
		for (const call of gracileCalls) {
			assert.equal(call.options?.version, 'latest');
		}
	});

	test('uses "next" version tag for @gracile packages when next=true', async () => {
		const recorder = createMockRecorder();
		const mockDeps = createMockDeps(recorder, {
			readFileResults: new Map([
				['test-project/package.json', MOCK_PACKAGE_JSON],
			]),
		});

		await refreshDeps(
			{ location: 'test-project', next: true },
			{
				fs: mockDeps.fs,
				fetchLatestVersion: mockDeps.fetchLatestVersion,
				logger: mockDeps.logger,
			},
		);

		const gracileCalls = recorder.fetchLatestVersionCalls.filter((c) =>
			c.packageName.startsWith('@gracile/'),
		);
		for (const call of gracileCalls) {
			assert.equal(call.options?.version, 'next');
		}
	});

	test('uses existing version tag for non-gracile packages', async () => {
		const recorder = createMockRecorder();
		const mockDeps = createMockDeps(recorder, {
			readFileResults: new Map([
				['test-project/package.json', MOCK_PACKAGE_JSON],
			]),
		});

		await refreshDeps(
			{ location: 'test-project' },
			{
				fs: mockDeps.fs,
				fetchLatestVersion: mockDeps.fetchLatestVersion,
				logger: mockDeps.logger,
			},
		);

		const litCall = recorder.fetchLatestVersionCalls.find(
			(c) => c.packageName === 'lit',
		);
		assert.equal(litCall?.options?.version, '3.0.0');

		const tsCall = recorder.fetchLatestVersionCalls.find(
			(c) => c.packageName === 'typescript',
		);
		assert.equal(tsCall?.options?.version, '5.0.0');
	});

	test('writes updated package.json with caret versions', async () => {
		const recorder = createMockRecorder();
		const mockDeps = createMockDeps(recorder, {
			readFileResults: new Map([
				['test-project/package.json', MOCK_PACKAGE_JSON],
			]),
			fetchLatestVersionResult: '2.5.0',
		});

		await refreshDeps(
			{ location: 'test-project' },
			{
				fs: mockDeps.fs,
				fetchLatestVersion: mockDeps.fetchLatestVersion,
				logger: mockDeps.logger,
			},
		);

		assert.equal(recorder.writeFileCalls.length, 1);
		assert.equal(recorder.writeFileCalls[0]!.path, 'test-project/package.json');

		const written = JSON.parse(recorder.writeFileCalls[0]!.data) as {
			dependencies: Record<string, string>;
			devDependencies: Record<string, string>;
		};
		assert.equal(written.dependencies['@gracile/gracile'], '^2.5.0');
		assert.equal(written.dependencies['lit'], '^2.5.0');
		assert.equal(written.devDependencies['@gracile/engine'], '^2.5.0');
		assert.equal(written.devDependencies['typescript'], '^2.5.0');
	});

	test('skips in dry-run mode', async () => {
		const recorder = createMockRecorder();
		const mockDeps = createMockDeps(recorder);

		await refreshDeps(
			{ location: 'test-project', dryRun: true },
			{
				fs: mockDeps.fs,
				fetchLatestVersion: mockDeps.fetchLatestVersion,
				logger: mockDeps.logger,
			},
		);

		assert.equal(recorder.readFileCalls.length, 0);
		assert.equal(recorder.writeFileCalls.length, 0);
		assert.equal(recorder.fetchLatestVersionCalls.length, 0);
	});

	test('throws when no destination provided', async () => {
		const recorder = createMockRecorder();
		const mockDeps = createMockDeps(recorder);

		await assert.rejects(
			() =>
				refreshDeps(
					{},
					{
						fs: mockDeps.fs,
						fetchLatestVersion: mockDeps.fetchLatestVersion,
						logger: mockDeps.logger,
					},
				),
			{ message: 'No destination.' },
		);
	});
});

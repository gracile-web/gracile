/* eslint-disable @typescript-eslint/no-floating-promises */
import { describe, test } from 'node:test';
import assert from 'node:assert/strict';

import { postSetup } from '../phases/post-setup.js';

import { createMockDeps, createMockRecorder } from './mock-deps.js';

describe('postSetup', () => {
	test('runs install when installDependencies is true', async () => {
		const recorder = createMockRecorder();
		const mockDeps = createMockDeps(recorder);

		await postSetup(
			{
				location: 'test-project',
				template: 'minimal-static',
				installDependencies: true,
			},
			'pnpm',
			{
				exec: mockDeps.exec,
				prompts: mockDeps.prompts,
				logger: mockDeps.logger,
			},
		);

		const installCall = recorder.execCalls.find((c) =>
			c.command.includes('install'),
		);
		assert.ok(installCall, 'Expected an install command');
		assert.equal(installCall.command, 'pnpm install');
		assert.equal(installCall.options?.cwd, 'test-project');
	});

	test('skips install when installDependencies is falsy', async () => {
		const recorder = createMockRecorder();
		const mockDeps = createMockDeps(recorder);

		await postSetup(
			{
				location: 'test-project',
				template: 'minimal-static',
				installDependencies: false,
			},
			'pnpm',
			{
				exec: mockDeps.exec,
				prompts: mockDeps.prompts,
				logger: mockDeps.logger,
			},
		);

		const installCall = recorder.execCalls.find((c) =>
			c.command.includes('install'),
		);
		assert.equal(installCall, undefined);
	});

	test('runs git init and git add when initializeGit is true', async () => {
		const recorder = createMockRecorder();
		const mockDeps = createMockDeps(recorder);

		await postSetup(
			{
				location: 'test-project',
				template: 'minimal-static',
				initializeGit: true,
			},
			'npm',
			{
				exec: mockDeps.exec,
				prompts: mockDeps.prompts,
				logger: mockDeps.logger,
			},
		);

		const gitInitCall = recorder.execCalls.find(
			(c) => c.command === 'git init',
		);
		assert.ok(gitInitCall, 'Expected git init command');
		assert.equal(gitInitCall.options?.cwd, 'test-project');

		const gitAddCall = recorder.execCalls.find(
			(c) => c.command === 'git add .',
		);
		assert.ok(gitAddCall, 'Expected git add command');
		assert.equal(gitAddCall.options?.cwd, 'test-project');
	});

	test('skips git init when initializeGit is falsy', async () => {
		const recorder = createMockRecorder();
		const mockDeps = createMockDeps(recorder);

		await postSetup(
			{
				location: 'test-project',
				template: 'minimal-static',
				initializeGit: false,
			},
			'npm',
			{
				exec: mockDeps.exec,
				prompts: mockDeps.prompts,
				logger: mockDeps.logger,
			},
		);

		const gitCalls = recorder.execCalls.filter((c) =>
			c.command.startsWith('git'),
		);
		assert.equal(gitCalls.length, 0);
	});

	test('uses correct package manager for install command', async () => {
		const recorder = createMockRecorder();
		const mockDeps = createMockDeps(recorder);

		await postSetup(
			{
				location: 'test-project',
				template: 'minimal-static',
				installDependencies: true,
			},
			'npm',
			{
				exec: mockDeps.exec,
				prompts: mockDeps.prompts,
				logger: mockDeps.logger,
			},
		);

		assert.equal(recorder.execCalls[0]!.command, 'npm install');
	});

	test('logs dry-run messages instead of executing in dry-run mode', async () => {
		const recorder = createMockRecorder();
		const mockDeps = createMockDeps(recorder);

		await postSetup(
			{
				location: 'test-project',
				template: 'minimal-static',
				installDependencies: true,
				initializeGit: true,
				dryRun: true,
			},
			'pnpm',
			{
				exec: mockDeps.exec,
				prompts: mockDeps.prompts,
				logger: mockDeps.logger,
			},
		);

		assert.equal(recorder.execCalls.length, 0);

		const dryRunLogs = recorder.logMessages.filter((m) =>
			String(m.args.join(' ')).includes('[dry-run]'),
		);
		assert.ok(
			dryRunLogs.length >= 3,
			'Expected dry-run log messages for install + git init + git add',
		);
	});

	test('throws when no destination provided', async () => {
		const recorder = createMockRecorder();
		const mockDeps = createMockDeps(recorder);

		await assert.rejects(
			() =>
				postSetup({ template: 'minimal-static' }, 'npm', {
					exec: mockDeps.exec,
					prompts: mockDeps.prompts,
					logger: mockDeps.logger,
				}),
			{ message: 'No destination.' },
		);
	});
});

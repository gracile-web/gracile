/* eslint-disable @typescript-eslint/no-floating-promises */
import { describe, test } from 'node:test';
import assert from 'node:assert/strict';

import { cloneTemplate } from '../phases/clone-template.js';

import { createMockDeps, createMockRecorder, ExitError } from './mock-deps.js';

describe('cloneTemplate', () => {
	test('executes correct git commands sequence', async () => {
		const recorder = createMockRecorder();
		const mockDeps = createMockDeps(recorder);

		await cloneTemplate(
			{ location: 'test-project', template: 'minimal-static' },
			{
				exec: mockDeps.exec,
				fs: mockDeps.fs,
				prompts: mockDeps.prompts,
				exit: mockDeps.exit,
				logger: mockDeps.logger,
			},
		);

		assert.equal(recorder.execCalls.length, 3);

		// Clone command
		assert.ok(recorder.execCalls[0]!.command.includes('git clone'));

		assert.ok(recorder.execCalls[0]!.command.includes('gracile-web/gracile'));
		assert.ok(
			recorder.execCalls[0]!.command.includes('test-project__tmp_clone'),
		);

		// Sparse checkout
		assert.ok(recorder.execCalls[1]!.command.includes('git sparse-checkout'));
		assert.ok(
			recorder.execCalls[1]!.command.includes('templates/minimal-static'),
		);
		assert.equal(
			recorder.execCalls[1]!.options?.cwd,
			'test-project__tmp_clone',
		);

		// Checkout
		assert.equal(recorder.execCalls[2]!.command, 'git checkout');
		assert.equal(
			recorder.execCalls[2]!.options?.cwd,
			'test-project__tmp_clone',
		);
	});

	test('includes -b next flag when next is true', async () => {
		const recorder = createMockRecorder();
		const mockDeps = createMockDeps(recorder);

		await cloneTemplate(
			{
				location: 'test-project',
				template: 'minimal-static',
				next: true,
			},
			{
				exec: mockDeps.exec,
				fs: mockDeps.fs,
				prompts: mockDeps.prompts,
				exit: mockDeps.exit,
				logger: mockDeps.logger,
			},
		);

		assert.ok(recorder.execCalls[0]!.command.includes('-b next'));
	});

	test('does not include -b next flag when next is falsy', async () => {
		const recorder = createMockRecorder();
		const mockDeps = createMockDeps(recorder);

		await cloneTemplate(
			{ location: 'test-project', template: 'minimal-static' },
			{
				exec: mockDeps.exec,
				fs: mockDeps.fs,
				prompts: mockDeps.prompts,
				exit: mockDeps.exit,
				logger: mockDeps.logger,
			},
		);

		assert.ok(!recorder.execCalls[0]!.command.includes('-b next'));
	});

	test('renames template directory and cleans up', async () => {
		const recorder = createMockRecorder();
		const mockDeps = createMockDeps(recorder);

		await cloneTemplate(
			{ location: 'test-project', template: 'basics' },
			{
				exec: mockDeps.exec,
				fs: mockDeps.fs,
				prompts: mockDeps.prompts,
				exit: mockDeps.exit,
				logger: mockDeps.logger,
			},
		);

		// rename: tmp/templates/basics → test-project
		assert.equal(recorder.renameCalls.length, 1);
		assert.ok(
			recorder.renameCalls[0]!.oldPath.includes('test-project__tmp_clone'),
		);
		assert.ok(recorder.renameCalls[0]!.oldPath.includes('templates/basics'));
		assert.equal(recorder.renameCalls[0]!.updatedPath, 'test-project');

		// rm: cleanup tmp dir + .git
		assert.equal(recorder.rmCalls.length, 2);
		assert.ok(recorder.rmCalls[0]!.path.includes('test-project__tmp_clone'));
		assert.ok(recorder.rmCalls[1]!.path.includes('.git'));
	});

	test('skips execution in dry-run mode', async () => {
		const recorder = createMockRecorder();
		const mockDeps = createMockDeps(recorder);

		const result = await cloneTemplate(
			{
				location: 'test-project',
				template: 'minimal-static',
				dryRun: true,
			},
			{
				exec: mockDeps.exec,
				fs: mockDeps.fs,
				prompts: mockDeps.prompts,
				exit: mockDeps.exit,
				logger: mockDeps.logger,
			},
		);

		// No exec calls, no fs calls
		assert.equal(recorder.execCalls.length, 0);
		assert.equal(recorder.renameCalls.length, 0);
		assert.equal(recorder.rmCalls.length, 0);

		// But commands are still returned
		assert.ok(result.commands.length > 0);

		// Logger received dry-run messages
		const dryRunLogs = recorder.logMessages.filter((m) =>
			String(m.args.join(' ')).includes('[dry-run]'),
		);
		assert.ok(dryRunLogs.length > 0);
	});

	test('throws when no destination provided', async () => {
		const recorder = createMockRecorder();
		const mockDeps = createMockDeps(recorder);

		await assert.rejects(
			() =>
				cloneTemplate(
					{ template: 'minimal-static' },
					{
						exec: mockDeps.exec,
						fs: mockDeps.fs,
						prompts: mockDeps.prompts,
						exit: mockDeps.exit,
						logger: mockDeps.logger,
					},
				),
			{ message: 'No destination.' },
		);
	});

	test('throws when no template provided', async () => {
		const recorder = createMockRecorder();
		const mockDeps = createMockDeps(recorder);

		await assert.rejects(
			() =>
				cloneTemplate(
					{ location: 'test-project' },
					{
						exec: mockDeps.exec,
						fs: mockDeps.fs,
						prompts: mockDeps.prompts,
						exit: mockDeps.exit,
						logger: mockDeps.logger,
					},
				),
			{ message: 'No template.' },
		);
	});

	test('exits with code 1 when rename fails', async () => {
		const recorder = createMockRecorder();
		const mockDeps = createMockDeps(recorder);

		// Override rename to reject
		// eslint-disable-next-line @typescript-eslint/require-await
		mockDeps.fs.rename = async () => {
			throw new Error('rename failed');
		};

		await assert.rejects(
			() =>
				cloneTemplate(
					{ location: 'test-project', template: 'nonexistent' },
					{
						exec: mockDeps.exec,
						fs: mockDeps.fs,
						prompts: mockDeps.prompts,
						exit: mockDeps.exit,
						logger: mockDeps.logger,
					},
				),
			(error) => error instanceof ExitError && error.code === 1,
		);
	});
});

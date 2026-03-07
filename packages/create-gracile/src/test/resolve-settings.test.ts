/* eslint-disable @typescript-eslint/no-floating-promises */
import { describe, test } from 'node:test';
import assert from 'node:assert/strict';

import { resolveSettings } from '../phases/resolve-settings.js';

import { createMockDeps, createMockRecorder } from './mock-deps.js';

describe('resolveSettings', () => {
	test('returns CLI flags when fully specified (no prompts needed)', async () => {
		const recorder = createMockRecorder();
		const mockDeps = createMockDeps(recorder);

		const result = await resolveSettings(
			{
				location: 'my-app',
				template: 'minimal-static',
				installDependencies: true,
				initializeGit: true,
			},
			{
				prompts: mockDeps.prompts,
				config: mockDeps.config,
				existsSync: mockDeps.fs.existsSync,
				exit: mockDeps.exit,
			},
		);

		assert.equal(result.location, 'my-app');
		assert.equal(result.template, 'minimal-static');
		assert.equal(result.installDependencies, true);
		assert.equal(result.initializeGit, true);
	});

	test('prompts for location when not provided and dir does not exist', async () => {
		const recorder = createMockRecorder();
		const mockDeps = createMockDeps(recorder, {
			textAnswers: ['prompted-location'],
			selectAnswers: ['minimal-static'],
			confirmAnswers: [true, false],
		});

		const result = await resolveSettings(
			{},
			{
				prompts: mockDeps.prompts,
				config: mockDeps.config,
				existsSync: mockDeps.fs.existsSync,
				exit: mockDeps.exit,
			},
		);

		// Location was prompted (not from CLI flags)
		assert.ok(result.location);
		assert.equal(result.template, 'minimal-static');
		assert.equal(result.installDependencies, true);
		assert.equal(result.initializeGit, false);
	});

	test('prompts for location when directory already exists', async () => {
		const recorder = createMockRecorder();
		const mockDeps = createMockDeps(recorder, {
			existsSyncResult: true,
			textAnswers: ['new-location'],
			selectAnswers: ['basics'],
			confirmAnswers: [false, true],
		});

		await resolveSettings(
			{ location: 'existing-dir' },
			{
				prompts: mockDeps.prompts,
				config: mockDeps.config,
				existsSync: mockDeps.fs.existsSync,
				exit: mockDeps.exit,
			},
		);

		// Should have shown an error and re-prompted
		const errorLogs = recorder.logMessages.filter((m) => m.level === 'error');
		assert.ok(
			errorLogs.length > 0,
			'Expected an error log about existing location',
		);
	});

	test('clears saved settings when clearPreviousSettings is set', async () => {
		const recorder = createMockRecorder();
		const mockDeps = createMockDeps(recorder, {
			initialConfigStore: { template: 'basics' },
			textAnswers: ['test-project'],
			selectAnswers: ['minimal-static'],
			confirmAnswers: [true, true],
		});

		await resolveSettings(
			{ clearPreviousSettings: true },
			{
				prompts: mockDeps.prompts,
				config: mockDeps.config,
				existsSync: mockDeps.fs.existsSync,
				exit: mockDeps.exit,
			},
		);

		// Config should have been cleared (then set with new values)
		const successLogs = recorder.logMessages.filter(
			(m) => m.level === 'success',
		);
		assert.ok(
			successLogs.some((m) =>
				String(m.args[0]).includes('Previous setting cleared'),
			),
		);
	});

	test('reports error for unknown template and falls back to select', async () => {
		const recorder = createMockRecorder();
		const mockDeps = createMockDeps(recorder, {
			textAnswers: ['my-proj'],
			selectAnswers: ['minimal-static'],
			confirmAnswers: [true, true],
		});

		const result = await resolveSettings(
			{ template: 'nonexistent-template' },
			{
				prompts: mockDeps.prompts,
				config: mockDeps.config,
				existsSync: mockDeps.fs.existsSync,
				exit: mockDeps.exit,
			},
		);

		const errorLogs = recorder.logMessages.filter((m) => m.level === 'error');
		assert.ok(
			errorLogs.some((m) => String(m.args[0]).includes('not found')),
			'Expected error about template not found',
		);
		// Falls back to the select answer
		assert.equal(result.template, 'minimal-static');
	});

	test('passes through dryRun flag from CLI settings', async () => {
		const recorder = createMockRecorder();
		const mockDeps = createMockDeps(recorder);

		const result = await resolveSettings(
			{
				location: 'my-app',
				template: 'minimal-static',
				installDependencies: true,
				initializeGit: true,
				dryRun: true,
			},
			{
				prompts: mockDeps.prompts,
				config: mockDeps.config,
				existsSync: mockDeps.fs.existsSync,
				exit: mockDeps.exit,
			},
		);

		assert.equal(result.dryRun, true);
	});
});

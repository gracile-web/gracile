#!/usr/bin/env tsx

/// <reference types="node" />

/*------------------------------------------------------------------------------

Changesets release orchestrator — runs in CI on pushes to `main` / `next`.

Flow:
1. Detect current branch; exit early if it is not a release branch.
2. Exit early when no pending changeset files exist (unless --phase=publish).
3. prepare phase
    a. Configure git user from GITHUB_ACTOR.
    b. Enter / exit Changesets pre-mode depending on the branch.
    c. Run `changeset version` to bump versions and consume changeset files.
    d. Validate: stable branch must have no prerelease versions;
      next branch must have only `-<preTag>.N` versions on changed packages.
    e. Commit the version bumps.
4. publish phase
  a. Run `changeset publish`.
    b. Retry once on failure to recover partially published packages.
    c. Push the commit and tags to origin.
		d. Create GitHub releases for package tags pointing at HEAD.
		e. On stable branch, merge main back into next (--no-ff).

CLI flags (all optional):
  --dry-run            Print mutating commands without executing them.
  --phase              all (default) | prepare | publish
  --pre-tag            Pre-mode tag for prerelease versions (default: "next").
  --stable-branch      Default: "main".
  --next-branch        Default: "next".
  --skip-merge-back    Skip the main→next merge after a stable release.

------------------------------------------------------------------------------*/

import { spawnSync, type SpawnSyncReturns } from 'node:child_process';
import {
	existsSync,
	mkdtempSync,
	readdirSync,
	readFileSync,
	rmSync,
} from 'node:fs';
import { tmpdir } from 'node:os';
import path from 'node:path';
import process from 'node:process';
import { parseArgs } from 'node:util';

const { values: args } = parseArgs({
	options: {
		'dry-run': { type: 'boolean', default: false },
		phase: { type: 'string', default: 'all' },
		'pre-tag': { type: 'string', default: 'next' },
		'skip-merge-back': { type: 'boolean', default: false },
		'stable-branch': { type: 'string', default: 'main' },
		'next-branch': { type: 'string', default: 'next' },
	},
});

const cwd = process.cwd();

const dryRun = args['dry-run'];
const phase = args.phase;
const preTag = args['pre-tag'];
const skipMergeBack = args['skip-merge-back'];
const stableBranch = args['stable-branch'];
const nextBranch = args['next-branch'];

const supportedPhases = new Set(['all', 'prepare', 'publish']);
if (!supportedPhases.has(phase)) {
	fail(`Unsupported --phase=${phase}. Expected all, prepare, or publish.`);
}

const branch = getBranch();
const isStable = branch === stableBranch;
const isNext = branch === nextBranch;

if (!isStable && !isNext) {
	log(
		`Branch ${branch} is not ${stableBranch} or ${nextBranch}; skipping release.`,
	);
	process.exit(0);
}

const pendingChangesets = hasPendingChangesets();
if (!pendingChangesets && phase !== 'publish') {
	log('No pending changesets; skipping release.');
	process.exit(0);
}

if (phase === 'all' || phase === 'prepare') {
	prepareRelease();
}

if (phase === 'all' || phase === 'publish') {
	publishRelease();
}

// ---------------------------------------------------------------------------

function prepareRelease(): void {
	configureGitUser();
	validateNoUnplannedUnpublishedPublicPackages();

	if (isNext) {
		enterPreModeIfNeeded();
	}

	if (isStable) {
		exitPreModeIfNeeded();
	}

	run('pnpm', ['changeset', 'version'], { env: githubEnv() });

	if (isStable) {
		validateStableRelease();
	}

	if (isNext) {
		validateNextRelease();
	}

	commitVersionBumps();
}

function publishRelease(): void {
	const publishArgs = ['changeset', 'publish'];

	try {
		run('pnpm', publishArgs, { env: publishEnv() });
	} catch {
		warn(
			'Publish failed; retrying once to recover partially published packages.',
		);
		run('pnpm', publishArgs, { env: publishEnv() });
	}

	run('git', ['push', 'origin', `HEAD:${branch}`]);
	run('git', ['push', '--tags']);
	createGitHubReleases();

	if (isStable && !skipMergeBack) {
		mergeBackMainIntoNext();
	}
}

function configureGitUser(): void {
	const actor =
		process.env.GITHUB_ACTOR || process.env.USER || 'github-actions';
	run('git', ['config', '--global', 'user.name', actor]);
	run('git', [
		'config',
		'--global',
		'user.email',
		`${actor}@users.noreply.github.com`,
	]);
}

function enterPreModeIfNeeded(): void {
	const preJson = path.join(cwd, '.changeset', 'pre.json');
	if (existsSync(preJson)) {
		log(`Already in Changesets pre mode for ${preTag}.`);
		return;
	}

	run('pnpm', ['changeset', 'pre', 'enter', preTag]);
}

function exitPreModeIfNeeded(): void {
	const preJson = path.join(cwd, '.changeset', 'pre.json');
	if (!existsSync(preJson)) {
		log('Not in Changesets pre mode.');
		return;
	}

	run('pnpm', ['changeset', 'pre', 'exit']);
}

interface PackageJson {
	name?: string;
	version?: string;
	private?: boolean;
}

interface PackageEntry {
	file: string;
	packageJson: PackageJson;
}

interface TagInfo {
	packageName: string;
	version: string;
	raw: string;
}

interface PnpmListPackage {
	path?: string;
}

interface ChangesetStatus {
	releases?: ChangesetRelease[];
}

interface ChangesetRelease {
	name?: string;
	type?: string;
}

function validateStableRelease(): void {
	const preJson = path.join(cwd, '.changeset', 'pre.json');
	if (existsSync(preJson)) {
		fail(
			'.changeset/pre.json is still present on the stable branch after versioning.',
		);
	}

	const badPackages = readPackageJsonFiles()
		.filter(({ packageJson }) => typeof packageJson.version === 'string')
		.filter(({ packageJson }) => packageJson.version!.includes('-'));

	if (badPackages.length > 0) {
		for (const { file, packageJson } of badPackages) {
			error(
				`${packageJson.name} has prerelease version ${packageJson.version} in ${file}.`,
			);
		}
		fail('Stable release validation failed.');
	}
}

function validateNextRelease(): void {
	const badPackages = changedPackageJsonFiles()
		.filter(({ packageJson }) => packageJson.private !== true)
		.filter(({ packageJson }) => typeof packageJson.version === 'string')
		.filter(({ packageJson }) => !packageJson.version!.includes(`-${preTag}.`));

	if (badPackages.length > 0) {
		for (const { file, packageJson } of badPackages) {
			error(
				`${packageJson.name} has non-${preTag} version ${packageJson.version} in ${file}.`,
			);
		}
		fail(`Prerelease validation failed for ${nextBranch}.`);
	}
}

function commitVersionBumps(): void {
	run('git', ['add', '-A']);

	const diff = run('git', ['diff', '--cached', '--quiet'], {
		check: false,
		stdio: 'pipe',
	});

	if (diff.status === 0) {
		log('No version changes to commit.');
		return;
	}

	const message = isNext
		? `Version packages [${preTag}] [skip ci]`
		: 'Version packages [skip ci]';

	run('git', ['commit', '-m', message]);
}

function mergeBackMainIntoNext(): void {
	try {
		run('git', ['fetch', 'origin', nextBranch]);
		run('git', ['checkout', '-B', nextBranch, `origin/${nextBranch}`]);
		run('git', [
			'merge',
			stableBranch,
			'--no-ff',
			'-m',
			`Auto-merge ${stableBranch} into ${nextBranch} [skip ci]`,
		]);
		run('git', ['push', 'origin', nextBranch]);
	} catch {
		warn(
			`Could not merge ${stableBranch} back into ${nextBranch}. Resolve manually if needed.`,
		);
	}
}

function hasPendingChangesets(): boolean {
	const changesetDir = path.join(cwd, '.changeset');
	if (!existsSync(changesetDir)) {
		return false;
	}

	return readdirSync(changesetDir).some(
		(file: string) => file.endsWith('.md') && file !== 'README.md',
	);
}

function validateNoUnplannedUnpublishedPublicPackages(): void {
	const plannedReleasePackages = changesetReleasePackageNames();
	const unplannedUnpublishedPackages = readPackageJsonFiles()
		.filter(({ packageJson }) => packageJson.private !== true)
		.filter(
			({ packageJson }) =>
				typeof packageJson.name === 'string' &&
				typeof packageJson.version === 'string',
		)
		.filter(({ packageJson }) => !plannedReleasePackages.has(packageJson.name!))
		.filter(
			({ packageJson }) =>
				!npmPackageVersionExists(packageJson.name!, packageJson.version!),
		);

	if (unplannedUnpublishedPackages.length === 0) {
		return;
	}

	for (const { file, packageJson } of unplannedUnpublishedPackages) {
		error(
			`${packageJson.name}@${packageJson.version} is public and missing from npm, but is not in the current Changesets release plan (${file}).`,
		);
	}

	fail(
		'Changesets would try to publish unplanned public packages. Add changesets for them, bootstrap/publish them intentionally, or mark them private.',
	);
}

function changesetReleasePackageNames(): Set<string> {
	const tempDir = mkdtempSync(path.join(tmpdir(), 'changeset-status-'));
	const outputFile = path.join(tempDir, 'status.json');

	try {
		run('pnpm', ['changeset', 'status', '--output', outputFile], {
			stdio: 'pipe',
		});

		const status = JSON.parse(
			readFileSync(outputFile, 'utf8'),
		) as ChangesetStatus;

		return new Set(
			(status.releases ?? [])
				.filter((release) => release.type !== 'none')
				.map((release) => release.name)
				.filter((name): name is string => typeof name === 'string'),
		);
	} finally {
		rmSync(tempDir, { recursive: true, force: true });
	}
}

function npmPackageVersionExists(name: string, version: string): boolean {
	const result = run(
		'npm',
		['view', `${name}@${version}`, 'version', '--json'],
		{
			check: false,
			stdio: 'pipe',
		},
	);

	return result.status === 0;
}

function createGitHubReleases(): void {
	const tags = getHeadTags();
	if (tags.length === 0) {
		log('No package tags point at HEAD; skipping GitHub Releases.');
		return;
	}

	for (const tag of tags) {
		if (gitHubReleaseExists(tag.raw)) {
			log(`GitHub release already exists for ${tag.raw}; skipping.`);
			continue;
		}

		const commandArgs = [
			'release',
			'create',
			tag.raw,
			'--verify-tag',
			'--title',
			tag.raw,
		];

		if (tag.version.includes('-')) {
			commandArgs.push('--prerelease');
		}

		const notes = getReleaseNotes(tag);
		if (notes) {
			commandArgs.push('--notes', notes);
		}

		run('gh', commandArgs, { env: githubEnv() });
	}
}

function gitHubReleaseExists(tag: string): boolean {
	const result = run('gh', ['release', 'view', tag], {
		check: false,
		env: githubEnv(),
		stdio: 'pipe',
	});

	return result.status === 0;
}

function getHeadTags(): TagInfo[] {
	const output = run('git', ['tag', '--points-at', 'HEAD'], {
		stdio: 'pipe',
	}).stdout;

	return (output ?? '')
		.split('\n')
		.map((line: string) => line.trim())
		.filter(Boolean)
		.map(parseTag)
		.filter((tag: TagInfo | undefined): tag is TagInfo => tag !== undefined);
}

function parseTag(raw: string): TagInfo | undefined {
	const match = /^(.*)@([^@]+)$/.exec(raw);
	if (!match) {
		warn(`Skipping unparseable tag ${raw}.`);
		return undefined;
	}

	const [, packageName, version] = match;
	return { packageName, version, raw };
}

function getReleaseNotes(tag: TagInfo): string | undefined {
	const changelogFile = getChangelogFile(tag.packageName);
	if (!changelogFile) {
		log(
			`No changelog found for ${tag.packageName}; creating GitHub release without notes.`,
		);
		return undefined;
	}

	const changelogText = readFileSync(path.join(cwd, changelogFile), 'utf8');
	const notes = extractReleaseNotes(changelogText, tag.version);
	if (!notes) {
		warn(`Could not find release notes for ${tag.raw} in ${changelogFile}.`);
	}

	return notes;
}

function getChangelogFile(packageName: string): string | undefined {
	const entry = readPackageJsonFiles().find(
		({ packageJson }) => packageJson.name === packageName,
	);
	if (!entry) {
		return undefined;
	}

	const changelogFile = path.join(path.dirname(entry.file), 'CHANGELOG.md');
	if (existsSync(path.join(cwd, changelogFile))) {
		return changelogFile;
	}

	return undefined;
}

function extractReleaseNotes(
	changelogText: string,
	version: string,
): string | undefined {
	const lines = changelogText.split('\n');
	const versionHeading = `## ${version}`;
	const startIndex = lines.findIndex((line) => line.trim() === versionHeading);
	if (startIndex === -1) {
		return undefined;
	}

	let endIndex = lines.length;
	for (let index = startIndex + 1; index < lines.length; index += 1) {
		if (lines[index].startsWith('## ')) {
			endIndex = index;
			break;
		}
	}

	const notes = lines
		.slice(startIndex + 1, endIndex)
		.join('\n')
		.trim();
	return notes || undefined;
}

function changedPackageJsonFiles(): PackageEntry[] {
	const packageJsonFiles = workspacePackageJsonFiles();
	if (packageJsonFiles.length === 0) {
		return [];
	}

	const output = run(
		'git',
		['diff', '--name-only', '--', ...packageJsonFiles],
		{ stdio: 'pipe' },
	).stdout;

	return (output ?? '')
		.split('\n')
		.map((line: string) => line.trim())
		.filter(Boolean)
		.map(readPackageJsonFile);
}

function readPackageJsonFiles(): PackageEntry[] {
	return workspacePackageJsonFiles().map(readPackageJsonFile);
}

function workspacePackageJsonFiles(): string[] {
	const output = run(
		'pnpm',
		['list', '--recursive', '--depth', '-1', '--json'],
		{
			stdio: 'pipe',
		},
	).stdout;
	const packages = JSON.parse(output ?? '[]') as PnpmListPackage[];
	const files = packages
		.map((pkg) => pkg.path)
		.filter(
			(packagePath): packagePath is string => typeof packagePath === 'string',
		)
		.map((packagePath) => path.join(packagePath, 'package.json'))
		.filter((file) => existsSync(file))
		.map((file) => path.relative(cwd, file));

	return [...new Set(files)].sort();
}

function readPackageJsonFile(file: string): PackageEntry {
	return {
		file,
		packageJson: JSON.parse(
			readFileSync(path.join(cwd, file), 'utf8'),
		) as PackageJson,
	};
}

function getBranch(): string {
	if (process.env.GITHUB_REF_NAME) {
		return process.env.GITHUB_REF_NAME;
	}

	const output =
		run('git', ['branch', '--show-current'], {
			stdio: 'pipe',
		}).stdout?.trim() ?? '';

	if (!output) {
		fail('Could not determine current branch.');
	}

	return output;
}

function githubEnv(): NodeJS.ProcessEnv {
	return {
		...process.env,
		GITHUB_TOKEN: process.env.GITHUB_TOKEN || process.env.GH_TOKEN || '',
	};
}

function publishEnv(): NodeJS.ProcessEnv {
	return {
		...githubEnv(),
		GH_TOKEN: process.env.GH_TOKEN || process.env.GITHUB_TOKEN || '',
		NODE_AUTH_TOKEN: process.env.NODE_AUTH_TOKEN || process.env.NPM_TOKEN || '',
		NPM_CONFIG_PROVENANCE: process.env.NPM_CONFIG_PROVENANCE || 'true',
	};
}

interface RunOptions {
	env?: NodeJS.ProcessEnv;
	check?: boolean;
	stdio?: 'inherit' | 'pipe';
}

function run(
	command: string,
	commandArgs: string[],
	options: RunOptions = {},
): SpawnSyncReturns<string> {
	const printable = [command, ...commandArgs].join(' ');
	if (dryRun && isMutatingCommand(command, commandArgs)) {
		log(`[dry-run] ${printable}`);
		return {
			status: 0,
			stdout: '',
			stderr: '',
			pid: 0,
			signal: null,
			output: [],
		};
	}

	log(`$ ${printable}`);
	const result = spawnSync(command, commandArgs, {
		cwd,
		env: options.env ?? process.env,
		encoding: 'utf8',
		shell: false,
		stdio: options.stdio ?? 'inherit',
	});

	if (result.error) {
		throw result.error;
	}

	if (options.check === false) {
		return result;
	}

	if (result.status !== 0) {
		throw new Error(`${printable} exited with status ${result.status}`);
	}

	return result;
}

function isMutatingCommand(command: string, commandArgs: string[]): boolean {
	const commandText = [command, ...commandArgs].join(' ');
	return /(^| )(add|commit|push|checkout|merge|fetch|changeset pre|changeset version|changeset publish|gh release create)( |$)/.test(
		commandText,
	);
}

function log(message: string): void {
	console.log(`[release] ${message}`);
}

function warn(message: string): void {
	console.warn(`::warning::${message}`);
}

function error(message: string): void {
	console.error(`::error::${message}`);
}

function fail(message: string): never {
	error(message);
	process.exit(1);
	throw new Error(message);
}

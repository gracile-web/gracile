import { join } from 'node:path';

import type {
	CliFetchLatestVersion,
	CliFsDeps,
	PartialSettings,
} from '../types.js';

export interface RefreshDepsDeps {
	fs: Pick<CliFsDeps, 'readFile' | 'writeFile'>;
	fetchLatestVersion: CliFetchLatestVersion;
	logger: { info: (...arguments_: unknown[]) => void };
}

interface ProjectPackageJson {
	dependencies: Record<string, string>;
	devDependencies: Record<string, string>;
}

export async function refreshDeps(
	settings: PartialSettings,
	deps: RefreshDepsDeps,
): Promise<void> {
	const { location: projectDestination, next, dryRun } = settings;
	if (!projectDestination) throw new Error('No destination.');

	if (dryRun) {
		deps.logger.info(
			'[dry-run] Would refresh dependencies in',
			join(projectDestination, 'package.json'),
		);
		return;
	}

	const pJsonPath = join(projectDestination, 'package.json');
	const pJson = JSON.parse(
		// eslint-disable-next-line unicorn/prefer-json-parse-buffer
		await deps.fs.readFile(pJsonPath, 'utf8'),
	) as ProjectPackageJson;

	const gracileVersion = next ? 'next' : 'latest';

	async function update(
		[packageName, version]: [string, string],
		type: keyof ProjectPackageJson,
	) {
		const replacedProtocol =
			version.startsWith('catalog:') || version.startsWith('workspace:')
				? 'latest'
				: version;
		const shiftedVersion = packageName.startsWith('@gracile/')
			? gracileVersion
			: replacedProtocol;
		const updatedVersion = await deps.fetchLatestVersion(packageName, {
			version: shiftedVersion,
		});
		pJson[type][packageName] = `^${updatedVersion}`;
	}

	await Promise.all([
		...Object.entries(pJson.dependencies).map((arguments_) =>
			update(arguments_, 'dependencies'),
		),
		...Object.entries(pJson.devDependencies).map((arguments_) =>
			update(arguments_, 'devDependencies'),
		),
	]);

	await deps.fs.writeFile(pJsonPath, `${JSON.stringify(pJson, null, 2)}\n`);
}

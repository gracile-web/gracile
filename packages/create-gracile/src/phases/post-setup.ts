import c from 'picocolors';

import type {
	CliExecFn as CliExecFunction,
	CliPromptsDeps,
	PartialSettings,
} from '../types.js';

export interface PostSetupDeps {
	exec: CliExecFunction;
	prompts: Pick<CliPromptsDeps, 'spinner'>;
	logger: { info: (...arguments_: unknown[]) => void };
}

export async function postSetup(
	settings: PartialSettings,
	packageManager: string,
	deps: PostSetupDeps,
): Promise<void> {
	const { location: projectDestination, template } = settings;
	if (!projectDestination) throw new Error('No destination.');

	// MARK: Install deps
	if (settings.installDependencies) {
		const installDepsSpinner = deps.prompts.spinner();
		const installCmd = `${packageManager} install`;

		installDepsSpinner.start(
			`Installing ${c.cyan('project dependencies')} via ${c.green(packageManager)}`,
		);

		if (settings.dryRun) {
			deps.logger.info(
				`[dry-run] Would execute: ${installCmd} (cwd: ${projectDestination})`,
			);
		} else {
			await deps.exec(installCmd, { cwd: projectDestination });
		}

		installDepsSpinner.stop(`${c.cyan('Dependencies')} installation finished`);
	}

	// MARK: Init repository
	if (settings.initializeGit) {
		const initGitSpinner = deps.prompts.spinner();
		initGitSpinner.start(
			`Initializing the ${c.green(`"${template}"`)} git repository…`,
		);

		if (settings.dryRun) {
			deps.logger.info(
				`[dry-run] Would execute: git init (cwd: ${projectDestination})`,
			);
			deps.logger.info(
				`[dry-run] Would execute: git add . (cwd: ${projectDestination})`,
			);
		} else {
			await deps.exec(`git init`, { cwd: projectDestination });
			await deps.exec(`git add .`, { cwd: projectDestination });
		}

		initGitSpinner.stop(`${c.cyan('Git repository')} initialization finished`);
	}
}

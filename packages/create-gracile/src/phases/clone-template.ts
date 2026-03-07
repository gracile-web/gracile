import { join } from 'node:path';

import c from 'picocolors';

import type {
	CliExecFn as CliExecFunction,
	CliFsDeps,
	CliPromptsDeps,
	PartialSettings,
} from '../types.js';

export interface CloneTemplateDeps {
	exec: CliExecFunction;
	fs: Pick<CliFsDeps, 'rename' | 'rm'>;
	prompts: Pick<CliPromptsDeps, 'spinner' | 'log'>;
	exit: (code?: number) => never;
	logger: { info: (...arguments_: unknown[]) => void };
}

export interface CloneTemplateResult {
	commands: string[];
}

export async function cloneTemplate(
	settings: PartialSettings,
	deps: CloneTemplateDeps,
): Promise<CloneTemplateResult> {
	const { template, location: projectDestination } = settings;
	if (!projectDestination) throw new Error('No destination.');
	if (!template) throw new Error('No template.');

	const REPO_BASE = 'https://github.com/gracile-web/gracile';
	const projectDestinationTemporary = `${projectDestination}__tmp_clone`;

	const commands: string[] = [];

	const cloneSpinner = deps.prompts.spinner();
	cloneSpinner.start(
		`Cloning of the ${c.green(`"${template}"`)}` +
			` template to ${c.green(`\`${projectDestination}\``)}`,
	);

	const cloneCmd = `git clone${settings.next ? ' -b next' : ''} -n --depth=1 --filter=tree:0 ${REPO_BASE} ${projectDestinationTemporary}`;
	const sparseCmd = `git sparse-checkout set --no-cone starter-projects/templates/${template}`;
	const checkoutCmd = `git checkout`;

	commands.push(cloneCmd, sparseCmd, checkoutCmd);

	if (settings.dryRun) {
		deps.logger.info('[dry-run] Would execute:', cloneCmd);
		deps.logger.info('[dry-run] Would execute:', sparseCmd);
		deps.logger.info('[dry-run] Would execute:', checkoutCmd);
		deps.logger.info(
			'[dry-run] Would rename:',
			join(
				projectDestinationTemporary,
				'starter-projects',
				'templates',
				template,
			),
			'→',
			projectDestination,
		);
		deps.logger.info('[dry-run] Would remove:', projectDestinationTemporary);
		deps.logger.info(
			'[dry-run] Would remove:',
			join(projectDestination, '.git'),
		);
	} else {
		await deps.exec(cloneCmd);

		await deps.exec(sparseCmd, {
			cwd: projectDestinationTemporary,
		});

		await deps.exec(checkoutCmd, {
			cwd: projectDestinationTemporary,
		});

		await deps.fs
			.rename(
				join(
					projectDestinationTemporary,
					'starter-projects',
					'templates',
					template,
				),
				projectDestination,
			)
			.catch(() => {
				deps.prompts.log.error(
					'It looks like this template is not available in the starter-projects repository.\nIt may be a Gracile error, or you have a CLI version mismatch.',
				);
				deps.exit(1);
			});

		await deps.fs.rm(projectDestinationTemporary, {
			force: true,
			recursive: true,
		});

		await deps.fs.rm(join(process.cwd(), projectDestination, '.git'), {
			recursive: true,
			force: true,
		});
	}

	cloneSpinner.stop(
		`${c.cyan('Copying')} of the ${c.green(`"${template}"`)} template to ` +
			`the ${c.green(`\`${settings.location}\``)} folder has finished`,
	);

	return { commands };
}

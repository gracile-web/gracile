import c from 'picocolors';

import type {
	CliLoggerDeps,
	CliPromptsDeps,
	PartialSettings,
} from '../types.js';

export interface DisplayDeps {
	prompts: Pick<CliPromptsDeps, 'intro' | 'outro' | 'log'>;
	logger: CliLoggerDeps;
}

export function displayIntro(
	cliVersion: string,
	packageManager: string,
	isDevelopment: boolean,
	deps: DisplayDeps,
) {
	deps.logger.info('' /* Blank line */);
	deps.prompts.intro(
		c.cyan(
			`✨🧚 Create your new ${c.underline(c.white(c.italic('Gracile')))} project`,
		),
	);

	deps.prompts.log.info(c.dim(`CLI ${cliVersion}`));

	if (isDevelopment) deps.prompts.log.warn(c.yellow(`Development mode`));
	deps.prompts.log.info(
		`Detected ${c.yellow(`package manager${c.reset(`:`)} ${c.yellow(c.bold(packageManager))}`)}`,
	);
}

export function displayOutro(
	settings: PartialSettings,
	packageManager: string,
	deps: DisplayDeps,
) {
	deps.prompts.outro(c.bold(`You're all set ✨! You can now do:`));

	deps.logger.info(`${c.green(`cd ${settings.location}`)}`);
	deps.logger.info(
		`${c.green(`${packageManager}${packageManager === 'npm' ? ' run' : ''} dev\n`)}`,
	);
}

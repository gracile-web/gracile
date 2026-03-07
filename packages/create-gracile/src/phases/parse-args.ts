import { Command } from '@commander-js/extra-typings';
import c from 'picocolors';

import { type PartialSettings, TEMPLATE_LIST } from '../types.js';

export interface ParseArgumentsOptions {
	cliVersion: string;
}

export function parseArgs(
	argv: string[],
	options: ParseArgumentsOptions,
): PartialSettings {
	const program = new Command()
		.name(c.bold(`create-gracile`))
		.description(`${c.gray(`Creates a new ${c.bold('Gracile')} project.`)}`)

		.option(
			'-d, --location <string>',
			`${c.yellow(`Project directory location.\n`)}`,
		)
		.option(
			'-t, --template <string>',
			`${c.yellow(
				`Choose a starter template. Available: ${TEMPLATE_LIST.map((name) =>
					c.green(name),
				).join(', ')}\n`,
			)}`,
		)
		.option(
			'-n, --next',
			`${c.yellow(`Use the \`next\` version of the selected template.\n`)}`,
		)
		.option(
			'-i, --install-dependencies',
			`${c.yellow(`Automatically install dependencies with your detected package manager.\n`)}`,
		)
		.option(
			'-g, --initialize-git',
			`${c.yellow(`Initialize a git repository after setting up your project.\n`)}`,
		)
		.option(
			'-s, --use-previous-settings',
			`${c.yellow(`Whether or not we should load previous settings.\n`)}`,
		)
		.option(
			'-r, --clear-previous-settings',
			`${c.yellow(`Clear previously saved settings.\n`)}`,
		)
		.option(
			'-D, --dry-run',
			`${c.yellow(`Simulate the CLI without performing destructive operations.\n`)}`,
		)
		.version(
			options.cliVersion,
			'-v, --version',
			`${c.yellow(`Output the version number.\n`)}`,
		)
		.addHelpText(
			'after',
			`\n---\nOnline docs: ${c.cyan('https://gracile.js.org/')}`,
		)
		.parse(argv);

	return program.opts() as PartialSettings;
}

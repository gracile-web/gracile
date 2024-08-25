#!/usr/bin/env node
/* eslint-disable max-lines */
import { exec as e } from 'node:child_process';
import { existsSync } from 'node:fs';
import { readFile, rename, rm, writeFile } from 'node:fs/promises';
import { join } from 'node:path';
import { promisify } from 'node:util';

import * as clack from '@clack/prompts';
import { Command } from '@commander-js/extra-typings';
import Conf from 'conf';
import latestVersion from 'latest-version';
import c from 'picocolors';
import { generate } from 'random-words';

import { availableTemplates } from './available.js';
import { type Settings, TEMPLATE_LIST, TEMPLATE_LIST_ANON } from './types.js';

const { DEV } = process.env;

// MARK: Create CLI

const cliPjson = JSON.parse(
	await readFile(new URL('../package.json', import.meta.url), 'utf8'),
) as unknown as { version: string };
const cliVersion = `v${cliPjson.version}`;

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
	.version(
		cliVersion,
		'-v, --version',
		`${c.yellow(`Output the version number.\n`)}`,
	)
	// TODO: Find how to customize `-h, --help    display help for command`
	// .configureHelp({ })
	.addHelpText(
		'after',
		`\n---\nOnline docs: ${c.cyan('https://gracile.js.org/')}`,
	)
	.parse();

// MARK: Intro

const exec = promisify(e);

const packageManager =
	process.env['npm_config_user_agent']?.split(' ').at(0)?.split('/').at(0) ||
	'npm';

type PartialSettings = Partial<Settings>;

function handleCancel(result: unknown) {
	if (clack.isCancel(result)) {
		clack.cancel('Operation cancelled by user. Exiting…');
		process.exit(0);
	}
}

// eslint-disable-next-line no-console
console.log('' /* Blank line */);
clack.intro(
	c.cyan(
		`✨🧚 Create your new ${c.underline(c.white(c.italic('Gracile')))} project`,
	),
); // 🧚🏻‍♀️

clack.log.info(c.dim(`CLI ${cliVersion}`));

if (DEV) clack.log.warn(c.yellow(`Development mode`));
clack.log.info(
	`Detected ${c.yellow(`package manager${c.reset(`:`)} ${c.yellow(c.bold(packageManager))}`)}`,
);

// MARK: Saved settings

const cliSettings: PartialSettings = program.opts();

const savedConfig = new Conf<PartialSettings>({
	projectName: 'create-gracile',
});

// eslint-disable-next-line no-console
if (DEV) console.log({ cliSettings });

if (cliSettings.clearPreviousSettings) {
	savedConfig.clear();
	clack.log.success('Previous setting cleared');
}

const savedSettings =
	cliSettings.usePreviousSettings === true ? savedConfig.store : {};

function settingsNote(settings: PartialSettings, title: string) {
	const savedSettingsNote = [];

	if (typeof settings.location !== 'undefined')
		savedSettingsNote.push(
			`${c.green('Location')}: ${c.bold(settings.location)}`,
		);
	if (typeof settings.template !== 'undefined')
		savedSettingsNote.push(
			`${c.green('Template')}: ${c.bold(settings.template)}`,
		);
	if (typeof settings.next !== 'undefined')
		savedSettingsNote.push(
			`${c.green('Next version')}: ${c.bold(String(settings.next))}`,
		);
	if (typeof settings.initializeGit !== 'undefined')
		savedSettingsNote.push(
			`${c.green('Initialize git')}: ${c.bold(String(settings.initializeGit))}`,
		);
	if (typeof settings.installDependencies !== 'undefined')
		savedSettingsNote.push(
			`${c.green('Install dependencies')}: ${c.bold(String(settings.installDependencies))}`,
		);
	if (typeof settings.usePreviousSettings !== 'undefined')
		savedSettingsNote.push(
			`${c.green('Use previous settings')}: ${c.bold(String(settings.usePreviousSettings))}`,
		);
	if (typeof settings.clearPreviousSettings !== 'undefined')
		savedSettingsNote.push(
			`${c.green('Clear previous settings')}: ${c.bold(String(settings.clearPreviousSettings))}`,
		);
	clack.note(savedSettingsNote.join('\n'), title);
}

if (Object.keys(savedSettings).length > 0)
	settingsNote(
		savedSettings,
		`${c.bold('Global preferences')} found on your computer.`,
	);

if (Object.keys(cliSettings).length > 0)
	settingsNote(cliSettings, `${c.bold('Command line flags')} provided.`);
else clack.log.info('No command line flags were provided.');

// MARK: Project location

let location = cliSettings.location ?? generate({ exactly: 3, join: '-' });

const locationExists = existsSync(location);

if (locationExists) {
	clack.log.error(
		`Location ${location} already exists! Please change another name or delete/move the existing one`,
	);
}
if (locationExists || (!cliSettings.location && !savedSettings.location)) {
	const result = await clack.text({
		message: `Enter your new ${c.cyan('project location')}`,
		placeholder: location,
		validate(value) {
			if (locationExists && value === '') return 'Already exist!';
			if (value.length > 0) {
				if (locationExists && location === value) return 'Already exist!';

				location = value;
			}
			return undefined;
		},
	});

	handleCancel(result);
}

// MARK: Project template

const requestedTemplate = cliSettings.template || savedSettings.template;
const templateFound =
	requestedTemplate && TEMPLATE_LIST_ANON.includes(requestedTemplate);

if (templateFound === false)
	clack.log.error(`Template "${c.yellow(requestedTemplate)}" not found.`);

const template = templateFound
	? requestedTemplate
	: await clack
			.select({
				message: `Choose your ${c.cyan('starter template')}`,
				options: availableTemplates,
			})
			.then((result) => {
				handleCancel(result);
				return result as string;
			});

savedConfig.set('template', template);

const next = cliSettings.next;
// savedConfig.set('next', next);

// MARK: Post actions

const installDependencies =
	cliSettings.installDependencies || savedSettings.installDependencies
		? true
		: await clack
				.confirm({
					message: `${c.cyan('Install dependencies')} with ${packageManager}?`,
				})
				.then((result) => {
					handleCancel(result);
					return typeof result === 'boolean' ? result : undefined;
				});

savedConfig.set('installDependencies', installDependencies);

const initializeGit =
	cliSettings.initializeGit || savedSettings.initializeGit
		? true
		: await clack
				.confirm({
					message: `Initialize a ${c.cyan('Git repository')}?`,
				})
				.then((result) => {
					handleCancel(result);
					return typeof result === 'boolean' ? result : undefined;
				});

savedConfig.set('initializeGit', initializeGit);

// MARK: Final settings

const settings: PartialSettings = {
	packageManager,
	location,
	template,
	next,
	installDependencies,
	initializeGit,
};

const projectDestination = settings.location;
if (!projectDestination) throw Error();

settingsNote(settings, 'Final configuration');
// eslint-disable-next-line no-console
if (DEV) console.log(settings);

const cloneSpinner = clack.spinner();
cloneSpinner.start(
	`Cloning of the ${c.green(`"${template}"`)}` +
		` template to ${c.green(`\`${projectDestination}\``)}`,
);

// MARK: Clone repository

// const REPO_BASE = DEV
// 	? '../../../../../../demo-projects/'
// 	: 'https://github.com/gracile-web/starter-projects/tree/main/';
const REPO_BASE = 'https://github.com/gracile-web/starter-projects';

const projectDestinationTmp = `${projectDestination}__tmp_clone`;

await exec(
	`git clone${settings.next ? ' -b next' : ''} -n --depth=1 --filter=tree:0 ${REPO_BASE} ${projectDestinationTmp}`,
);

await exec(`git sparse-checkout set --no-cone templates/${template}`, {
	cwd: projectDestinationTmp,
});

await exec(`git checkout`, {
	cwd: projectDestinationTmp,
});

await rename(
	join(projectDestinationTmp, 'templates', template),
	projectDestination,
).catch(() => {
	clack.log.error(
		'It looks like this template is not available in the starter-projects repository.\nIt may be a Gracile error, or you have a CLI version mismatch.',
	);
	process.exit(1);
});
await rm(projectDestinationTmp, { force: true, recursive: true });

await rm(join(process.cwd(), projectDestination, '.git'), {
	recursive: true,
	force: true,
});

cloneSpinner.stop(
	`${c.cyan('Copying')} of the ${c.green(`"${template}"`)} template to ` +
		`the ${c.green(`\`${settings.location}\``)} folder has finished`,
);

// MARK: Refresh deps.

const pJsonPath = join(projectDestination, 'package.json');
const pJson = await readFile(pJsonPath).then(
	(r) =>
		JSON.parse(r as unknown as string) as {
			dependencies: Record<string, string>;
			devDependencies: Record<string, string>;
		},
);

const gracileVersion = next ? 'next' : 'latest';
async function update(
	[packageName, version]: [string, string],
	type: keyof typeof pJson,
) {
	const shiftedVersion = packageName.startsWith('@gracile/')
		? gracileVersion
		: version;
	const updatedVersion = await latestVersion(packageName, {
		version: shiftedVersion,
	});
	pJson[type][packageName] = `^${updatedVersion}`;
}
await Promise.all([
	...Object.entries(pJson.dependencies).map((args) =>
		update(args, 'dependencies'),
	),
	...Object.entries(pJson.devDependencies).map((args) =>
		update(args, 'devDependencies'),
	),
]);
await writeFile(pJsonPath, `${JSON.stringify(pJson, null, 2)}\n`);

// MARK: Install deps.

if (settings.installDependencies) {
	const installDepsSpinner = clack.spinner();
	installDepsSpinner.start(
		`Installing ${c.cyan('project dependencies')} via ${c.green(packageManager)}`,
	);

	await exec(`${packageManager} install`, { cwd: settings.location });

	installDepsSpinner.stop(`${c.cyan('Dependencies')} installation finished`);
}

// MARK: Init repository

if (settings.initializeGit) {
	const initGitSpinner = clack.spinner();
	initGitSpinner.start(
		`Initializing the ${c.green(`"${template}"`)} git repository…`,
	);

	await exec(`git init`, { cwd: projectDestination });
	await exec(`git add .`, { cwd: projectDestination });
	// NOTE: Maybe it's preferable to let the user commit himself.
	// await exec(`git commit -m "chore: initial commit"`, {
	// 	cwd: projectDestination,
	// });

	initGitSpinner.stop(`${c.cyan('Git repository')} initialization finished`);
}

// MARK: Outro

clack.outro(c.bold(`You're all set ✨! You can now do:`));

// eslint-disable-next-line no-console
console.info(`${c.green(`cd ${settings.location}`)}`);
// eslint-disable-next-line no-console
console.info(
	`${c.green(`${packageManager}${packageManager === 'npm' ? ' run' : ''} dev\n`)}`,
);

//

process.exit();

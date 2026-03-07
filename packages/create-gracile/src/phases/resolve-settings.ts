import c from 'picocolors';
import { generate } from 'random-words';

import { availableTemplates } from '../available.js';
import type {
	CliConfigDeps,
	CliFsDeps,
	CliPromptsDeps,
	PartialSettings,
	Settings,
} from '../types.js';
import { TEMPLATE_LIST_ANON } from '../types.js';

export interface ResolveSettingsDeps {
	prompts: CliPromptsDeps;
	config: CliConfigDeps<PartialSettings>;
	existsSync: CliFsDeps['existsSync'];
	exit: (code?: number) => never;
}

function handleCancel(
	result: unknown,
	deps: Pick<ResolveSettingsDeps, 'prompts' | 'exit'>,
) {
	if (deps.prompts.isCancel(result)) {
		deps.prompts.cancel('Operation cancelled by user. Exiting…');
		deps.exit(0);
	}
}

export function settingsNote(
	settings: PartialSettings,
	title: string,
	prompts: CliPromptsDeps,
) {
	const savedSettingsNote = [];

	if (settings.location !== undefined)
		savedSettingsNote.push(
			`${c.green('Location')}: ${c.bold(settings.location)}`,
		);
	if (settings.template !== undefined)
		savedSettingsNote.push(
			`${c.green('Template')}: ${c.bold(settings.template)}`,
		);
	if (settings.next !== undefined)
		savedSettingsNote.push(
			`${c.green('Next version')}: ${c.bold(String(settings.next))}`,
		);
	if (settings.initializeGit !== undefined)
		savedSettingsNote.push(
			`${c.green('Initialize git')}: ${c.bold(String(settings.initializeGit))}`,
		);
	if (settings.installDependencies !== undefined)
		savedSettingsNote.push(
			`${c.green('Install dependencies')}: ${c.bold(String(settings.installDependencies))}`,
		);
	if (settings.usePreviousSettings !== undefined)
		savedSettingsNote.push(
			`${c.green('Use previous settings')}: ${c.bold(String(settings.usePreviousSettings))}`,
		);
	if (settings.clearPreviousSettings !== undefined)
		savedSettingsNote.push(
			`${c.green('Clear previous settings')}: ${c.bold(String(settings.clearPreviousSettings))}`,
		);
	prompts.note(savedSettingsNote.join('\n'), title);
}

export async function resolveSettings(
	cliSettings: PartialSettings,
	deps: ResolveSettingsDeps,
): Promise<PartialSettings> {
	// MARK: Saved settings
	if (cliSettings.clearPreviousSettings) {
		deps.config.clear();
		deps.prompts.log.success('Previous setting cleared');
	}

	const savedSettings =
		cliSettings.usePreviousSettings === true ? deps.config.store : {};

	if (Object.keys(savedSettings).length > 0)
		settingsNote(
			savedSettings,
			`${c.bold('Global preferences')} found on your computer.`,
			deps.prompts,
		);

	if (Object.keys(cliSettings).length > 0)
		settingsNote(
			cliSettings,
			`${c.bold('Command line flags')} provided.`,
			deps.prompts,
		);
	else deps.prompts.log.info('No command line flags were provided.');

	// MARK: Project location
	let location = cliSettings.location ?? generate({ exactly: 3, join: '-' });

	const locationExists = deps.existsSync(location);

	if (locationExists) {
		deps.prompts.log.error(
			`Location ${location} already exists! Please change another name or delete/move the existing one`,
		);
	}
	if (locationExists || (!cliSettings.location && !savedSettings.location)) {
		const result = await deps.prompts.text({
			message: `Enter your new ${c.cyan('project location')}`,
			placeholder: location,
			validate(value) {
				if (!value) return;
				if (locationExists && value === '') return 'Already exist!';
				if (value.length > 0) {
					if (locationExists && location === value) return 'Already exist!';

					location = value;
				}
				return;
			},
		});

		handleCancel(result, deps);
	}

	// MARK: Project template
	const requestedTemplate = cliSettings.template || savedSettings.template;
	const templateFound =
		requestedTemplate && TEMPLATE_LIST_ANON.includes(requestedTemplate);

	if (templateFound === false)
		deps.prompts.log.error(
			`Template "${c.yellow(requestedTemplate)}" not found.`,
		);

	const template = templateFound
		? requestedTemplate
		: await deps.prompts
				.select({
					message: `Choose your ${c.cyan('starter template')}`,
					options: availableTemplates,
				})
				.then((result) => {
					handleCancel(result, deps);
					return result as string;
				});

	deps.config.set('template', template);

	const next = cliSettings.next;

	// MARK: Post actions
	const installDependencies =
		cliSettings.installDependencies || savedSettings.installDependencies
			? true
			: await deps.prompts
					.confirm({
						message: `${c.cyan('Install dependencies')} with the detected package manager?`,
					})
					.then((result) => {
						handleCancel(result, deps);
						return typeof result === 'boolean' ? result : undefined;
					});

	deps.config.set('installDependencies', installDependencies);

	const initializeGit =
		cliSettings.initializeGit || savedSettings.initializeGit
			? true
			: await deps.prompts
					.confirm({
						message: `Initialize a ${c.cyan('Git repository')}?`,
					})
					.then((result) => {
						handleCancel(result, deps);
						return typeof result === 'boolean' ? result : undefined;
					});

	deps.config.set('initializeGit', initializeGit);

	return {
		location,
		template,
		next,
		installDependencies,
		initializeGit,
		dryRun: cliSettings.dryRun,
	};
}

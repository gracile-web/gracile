import type { CliDeps, PartialSettings } from './types.js';
import { cloneTemplate } from './phases/clone-template.js';
import { displayIntro, displayOutro } from './phases/display.js';
import { parseArgs as parseArguments } from './phases/parse-args.js';
import { postSetup } from './phases/post-setup.js';
import { refreshDeps } from './phases/refresh-deps.js';
import { resolveSettings, settingsNote } from './phases/resolve-settings.js';

export async function run(deps: CliDeps, argv: string[]): Promise<void> {
	// MARK: Read CLI version
	const cliPjson = JSON.parse(
		await deps.fs.readFile(
			new URL('../package.json', import.meta.url),
			// eslint-disable-next-line unicorn/prefer-json-parse-buffer
			'utf8',
		),
	) as unknown as { version: string };
	const cliVersion = `v${cliPjson.version}`;

	// MARK: Parse args (includes --dry-run)
	const cliSettings = parseArguments(argv, { cliVersion });

	// MARK: Detect package manager
	const packageManager =
		deps.env.npm_config_user_agent?.split(' ').at(0)?.split('/').at(0) || 'npm';

	const isDevelopment = Boolean(deps.env.DEV);

	if (isDevelopment) deps.logger.info({ cliSettings });

	// MARK: Intro display
	displayIntro(cliVersion, packageManager, isDevelopment, {
		prompts: deps.prompts,
		logger: deps.logger,
	});

	// MARK: Resolve all settings (interactive prompts)
	const settings: PartialSettings = {
		packageManager,
		...(await resolveSettings(cliSettings, {
			prompts: deps.prompts,
			config: deps.config,
			existsSync: deps.fs.existsSync,
			exit: deps.exit,
		})),
	};

	const projectDestination = settings.location;
	if (!projectDestination) throw new Error('No destination.');

	settingsNote(settings, 'Final configuration', deps.prompts);

	if (isDevelopment) deps.logger.info(settings);

	// MARK: Clone template
	await cloneTemplate(settings, {
		exec: deps.exec,
		fs: deps.fs,
		prompts: deps.prompts,
		exit: deps.exit,
		logger: deps.logger,
	});

	// MARK: Refresh deps
	await refreshDeps(settings, {
		fs: deps.fs,
		fetchLatestVersion: deps.fetchLatestVersion,
		logger: deps.logger,
	});

	// MARK: Post setup (install deps, git init)
	await postSetup(settings, packageManager, {
		exec: deps.exec,
		prompts: deps.prompts,
		logger: deps.logger,
	});

	// MARK: Outro display
	displayOutro(settings, packageManager, {
		prompts: deps.prompts,
		logger: deps.logger,
	});

	deps.exit();
}

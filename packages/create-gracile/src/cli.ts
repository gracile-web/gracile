#!/usr/bin/env node

import { exec as exec_ } from 'node:child_process';
import { existsSync } from 'node:fs';
import { readFile, rename, rm, writeFile } from 'node:fs/promises';
import { promisify } from 'node:util';

import * as clack from '@clack/prompts';
import Conf from 'conf';
import latestVersion from 'latest-version';

import { run } from './run.js';
import type { CliDeps, PartialSettings } from './types.js';

const exec = promisify(exec_);

const deps: CliDeps = {
	fs: {
		readFile: (path, encoding) => readFile(path, encoding) as Promise<string>,
		writeFile,
		rename,
		rm,
		existsSync,
	},
	exec,
	prompts: {
		intro: clack.intro,
		outro: clack.outro,
		text: clack.text as CliDeps['prompts']['text'],
		select: clack.select as CliDeps['prompts']['select'],
		confirm: clack.confirm as CliDeps['prompts']['confirm'],
		log: clack.log,
		note: clack.note,
		spinner: clack.spinner,
		cancel: clack.cancel,
		isCancel: clack.isCancel,
	},
	config: new Conf<PartialSettings>({ projectName: 'create-gracile' }),
	fetchLatestVersion: latestVersion,
	exit: (code?: number) => process.exit(code) as never,
	logger: {
		// eslint-disable-next-line no-console
		info: (...arguments_: unknown[]) => console.info(...arguments_),
		// eslint-disable-next-line no-console
		error: (...arguments_: unknown[]) => console.error(...arguments_),
		// eslint-disable-next-line no-console
		warn: (...arguments_: unknown[]) => console.warn(...arguments_),
	},
	env: {
		DEV: process.env['DEV'],
		npm_config_user_agent: process.env['npm_config_user_agent'],
	},
};

await run(deps, process.argv);

#!/usr/bin/env node

/**
 * @license
 * Julian Cataldo
 * SPDX-License-Identifier: ISC
 */

import { program } from 'commander';
import c from 'picocolors';

import { generateOgImages } from './api.js';
import type { PathsOptions } from './collect.js';

console.log(c.bold(c.magenta('OG Image Generator')) + c.green(' - CLI'));

program.option('--base <string>').option('-b');
program.option('--out <string>').option('-o');
program.option('--json <string>').option('-j');

program.parse();

const options: PathsOptions | undefined = program.opts();

if (Object.keys(options).length > 0) {
	console.log(c.bold(c.magenta('Options:')) + c.green(' - CLI'));
	console.table(options);
}

await generateOgImages(options);

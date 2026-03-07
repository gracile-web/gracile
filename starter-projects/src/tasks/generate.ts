import { exec } from 'node:child_process';
import { readFile, writeFile } from 'node:fs/promises';
import { join } from 'node:path';
import { promisify } from 'node:util';

// import { watch } from 'chokidar';
// import glob from 'fast-glob';
// import { cp, rm } from 'fs/promises';
import latestVersion from 'latest-version';

import type pjsonType from '../../package.json';
import { partials } from '../config/partials.js';
import { templates } from '../config/templates.js';
// import { dirname } from 'path';

// const watcher = watch(['templates-src','inventory']);

const linkPackages = false;
const useNext = true;

// await glob('')
const e = promisify(exec);

await Promise.all(
	// MARK: COPY/MERGE
	[...templates].map(async (template) => {
		// eslint-disable-next-line no-restricted-syntax
		for (const merge of ['inventory/__common', ...template.merge]) {
			console.log(
				// eslint-disable-next-line no-await-in-loop
				await e(
					`rsync -av ${merge}/ templates/${template.name} --exclude="node_modules"`,
				),
			);
		}

		// MARK: README
		const rdme = join(process.cwd(), 'templates', template.name, 'README.md');
		await writeFile(rdme, '…'); // NOTE: DUMMY
		const readme = await partials.readme(template);
		await writeFile(rdme, readme);

		const dest = `templates/${template.name}`;

		// MARK: PJSON
		if (linkPackages === false) {
			const pjsonDest = join(dest, 'package.json');
			// eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
			const pjson = JSON.parse(
				await readFile(pjsonDest, 'utf8'),
			) as unknown as typeof pjsonType;
			// Object.fromEntries(Object.entries(pjson.dependencies))
			await Promise.all(
				Object.entries(pjson.dependencies).map(async ([k]) => {
					if (k.startsWith('@gracile/')) {
						const version = await latestVersion(k, {
							version: useNext ? 'next' : 'latest',
						});
						pjson.dependencies[k as keyof typeof pjson.dependencies] = version;
					}
				}),
			);
			await writeFile(pjsonDest, `${JSON.stringify(pjson, null, 2)}\n`);
		}

		// MARK: Install
		await e(`pnpm install --prefix templates/${template.name}`);

		// 		await rm(`./templates/${template.name}`, { recursive: true }).catch(
		// 			() => null,
		// 		);

		// 		const toCopy = await glob(
		// 			[
		// 				...template.merge,
		// 				'./inventory/__common/**',
		// 				`./templates-src/${template.name}/**`,
		// 				// '**/*',
		// 			],
		// 			{ dot: true },
		// 		);

		// 		const dest = `templates/${template.name}`;
		// 		await Promise.all(
		// 			toCopy.map(async (file) => {
		// 				// console.log([mergeWith]);
		// 				// console.log(file.split('/').slice(3).join('/'));
		// 				await cp(file, join(dest, file.split('/').slice(3).join('/')), {
		// 					recursive: true,
		// 					errorOnExist: false,
		// 					force: true,
		// 				});
		// 			}),
		// 		);
	}),
);

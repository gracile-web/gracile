import { exec } from 'node:child_process';
import { mkdir, writeFile } from 'node:fs/promises';
import { join } from 'node:path';
import { promisify } from 'node:util';

import { partials } from '../config/partials.js';
import { templates } from '../config/templates.js';

const e = promisify(exec);

console.log('Generating templates');

await Promise.all(
	// MARK: COPY/MERGE
	[...templates].map(async (template) => {
		await mkdir(`templates/${template.name}`, { recursive: true });

		// eslint-disable-next-line no-restricted-syntax
		for (const merge of template.merge) {
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
	}),
);

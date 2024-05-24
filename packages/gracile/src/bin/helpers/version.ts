import { readFile } from 'node:fs/promises';

export const version = (
	JSON.parse(
		await readFile(new URL('../../../package.json', import.meta.url), 'utf8'),
	) as {
		version?: string;
	}
).version;

if (!version) throw new Error('Incorrect package.json.');

process.env['__GRACILE_VERSION'] = version;

import { readFile } from 'fs/promises';

export { gracile } from '@gracile/engine/plugin';
export { createGracileHandler as createGracileMiddleware } from '@gracile/engine/server/request';

const { version } = JSON.parse(
	await readFile(new URL('../package.json', import.meta.url), 'utf-8'),
) as {
	version: string;
};

// eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
process.env['__GRACILE_VERSION__'] = version;

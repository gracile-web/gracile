import fs from 'node:fs';
import crypto from 'node:crypto';

export function save(
	data: string | NodeJS.ArrayBufferView,
	destination: string,
	type: 'json' | 'buffer',
): void {
	let toWrite: string | NodeJS.ArrayBufferView = data;
	if (type === 'json') toWrite = JSON.stringify(data, null, 2);

	fs.writeFileSync(
		process.cwd() + '/test/__artefacts__/' + destination,
		toWrite,
	);
}

export function hash(data: unknown): string {
	return crypto.createHash('md5').update(String(data)).digest('hex');
}

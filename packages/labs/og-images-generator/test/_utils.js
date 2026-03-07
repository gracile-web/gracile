import fs from 'node:fs';
import crypto from 'node:crypto';
/**
 * @param {any} data
 * @param {string} dest
 * @param {'json' | 'buffer'} type
 */
export function save(data, dest, type) {
	let toWrite = data;
	if (type === 'json') data = JSON.stringify(data, null, 2);

	fs.writeFileSync(process.cwd() + '/test/__artefacts__/' + dest, toWrite);
}
/**
 * @param {any} data
 * @returns {string}
 */
export function hash(data) {
	return crypto.createHash('md5').update(String(data)).digest('hex');
}

export function removeAllExtension(p: string) {
	return p.replace(/\.(.*)$/, '');
}

export function isWindows() {
	if ('process' in globalThis && 'platform' in globalThis.process)
		return process.platform === 'win32' ? true : false;

	throw new Error(`Are you in a Node environment?`);
}

export const WINDOWS_PATH_SEPARATOR = '\\';

export function normalizeToPosix(input: string) {
	if (isWindows()) return input.replaceAll(WINDOWS_PATH_SEPARATOR, '/');

	return input;
}

export function removeLeadingForwardSlashWindows(path: string) {
	return path.startsWith('/') && path[2] === ':' ? path.slice(1) : path;
}

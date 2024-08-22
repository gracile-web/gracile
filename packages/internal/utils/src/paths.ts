export function removeAllExt(p: string) {
	return p.replace(/\.(.*)$/, '');
}

export function windowsToPosix(input: string) {
	return input.replaceAll('\\', '/');
}

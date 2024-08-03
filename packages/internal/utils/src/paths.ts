export function removeAllExt(p: string) {
	return p.replace(/\.(.*)$/, '');
}

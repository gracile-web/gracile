import path from 'node:path';

let cwd = process.cwd();

export function setCurrentWorkingDirectory(root?: string | undefined) {
	if (root) cwd = root;
	process.env['__GRACILE_PROJECT_CWD'] = cwd;
	return cwd;
}

export function user(p: string | string[]) {
	if (typeof p === 'string') return path.join(cwd, p);
	return path.join(cwd, ...p);
}

export function relativeToProject(p: string) {
	return path.relative(cwd, p);
}

export function removeJsTsExt(p: string) {
	return p.replace(/\.(js|ts)$/, '');
}

export function removeAllExt(p: string) {
	return p.replace(/\.(.*)$/, '');
}
export function removeLastExt(p: string) {
	return p.split('.').slice(0, -1).join('.');
}

export function relativeToProjectNoJsTs(p: string) {
	return removeJsTsExt(relativeToProject(p));
}

export function relativeToAbsoluteProject(p: string) {
	return path.join(cwd, p);
}

export function tsToJs(p: string) {
	return p.replace(/\.ts$/, '.js');
}

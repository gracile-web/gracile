const versionSymbol = Symbol('gracile-version');

export function setVersion(version: string): void {
	// @ts-expect-error ............
	globalThis[versionSymbol] = version;
}

export function getVersion(): string {
	// @ts-expect-error ............
	const version = globalThis[versionSymbol] as string | undefined;
	if (version) return version;
	throw new ReferenceError(versionSymbol.toString());
}

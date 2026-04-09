// ---------------------------------------------------------------------------
// Lazy dependency resolution.
// Prefer rolldown (ships with Vite 8+) over standalone packages.
// ---------------------------------------------------------------------------

// --- OXC parser (parseSync) ------------------------------------------------

type ParseSync = typeof import('rolldown/utils').parseSync;

let _parseSync: ParseSync | undefined;

export async function resolveParseSync(): Promise<ParseSync> {
	if (_parseSync) return _parseSync;

	try {
		const mod = await import('rolldown/utils');
		_parseSync = mod.parseSync as ParseSync;
	} catch {
		const mod = await import('oxc-parser');
		_parseSync = mod.parseSync as ParseSync;
	}

	return _parseSync;
}

// --- OXC Visitor -----------------------------------------------------------

type VisitorClass = typeof import('rolldown/utils').Visitor;
let _Visitor: VisitorClass | undefined;

export async function resolveVisitor(): Promise<VisitorClass> {
	if (_Visitor) return _Visitor;

	try {
		const mod = await import('rolldown/utils');
		_Visitor = mod.Visitor as VisitorClass;
	} catch {
		const mod = await import('oxc-parser');
		_Visitor = mod.Visitor as VisitorClass;
	}

	return _Visitor;
}

export type { ParseSync, VisitorClass };

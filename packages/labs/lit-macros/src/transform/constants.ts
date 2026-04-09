// ---------------------------------------------------------------------------
// Well-known Lit decorator import sources.
// ---------------------------------------------------------------------------

export const LIT_DECORATORS_RE =
	/^(?:lit\/decorators|@lit\/reactive-element\/decorators)(?:\.js)?$/;

/** Names of Lit decorators we transform. */
export const HANDLED_DECORATORS = new Set([
	'customElement',
	'property',
	'state',
	'query',
	'queryAll',
	'queryAsync',
	'queryAssignedElements',
	'queryAssignedNodes',
]);

export const QUERY_DECORATORS = new Set([
	'query',
	'queryAll',
	'queryAsync',
	'queryAssignedElements',
	'queryAssignedNodes',
]);

/** Fast pre-filter — skip files that can't contain handled decorators. */
export const QUICK_CHECK_RE =
	/@(?:customElement|property|state|query(?:All|Async|AssignedElements|AssignedNodes)?)\b/;

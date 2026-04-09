/* eslint-disable @typescript-eslint/no-explicit-any */

// ---------------------------------------------------------------------------
// Query decorator → getter builders
// ---------------------------------------------------------------------------

/**
 * Build a getter method body for the given query decorator.
 * Returns `null` if the decorator args are non-static or unrecognised.
 */
export function buildQueryGetter(
	importedName: string,
	fieldName: string,
	callExpression: any | null,
	indent: string,
): string | null {
	switch (importedName) {
		case 'query': {
			return buildQuery(fieldName, callExpression, indent);
		}
		case 'queryAll': {
			return buildQueryAll(fieldName, callExpression, indent);
		}
		case 'queryAsync': {
			return buildQueryAsync(fieldName, callExpression, indent);
		}
		case 'queryAssignedElements': {
			return buildQueryAssignedElements(fieldName, callExpression, indent);
		}
		case 'queryAssignedNodes': {
			return buildQueryAssignedNodes(fieldName, callExpression, indent);
		}
		default: {
			return null;
		}
	}
}

/** Extract a string literal value from a call argument, or null. */
function staticStringArg(callExpression: any, index: number): string | null {
	const argument = callExpression?.arguments?.[index];
	if (argument && typeof argument.value === 'string') return argument.value;
	return null;
}

// @query(selector)
// → get field() { return this.renderRoot?.querySelector(selector) ?? null; }
function buildQuery(
	fieldName: string,
	callExpression: any,
	indent: string,
): string | null {
	const selector = staticStringArg(callExpression, 0);
	if (selector == null) return null;
	return `${indent}get ${fieldName}() { return this.renderRoot?.querySelector('${selector}') ?? null; }`;
}

// @queryAll(selector)
// → get field() { return this.renderRoot?.querySelectorAll(selector) ?? []; }
function buildQueryAll(
	fieldName: string,
	callExpression: any,
	indent: string,
): string | null {
	const selector = staticStringArg(callExpression, 0);
	if (selector == null) return null;
	return `${indent}get ${fieldName}() { return this.renderRoot?.querySelectorAll('${selector}') ?? []; }`;
}

// @queryAsync(selector)
// → get field() { return this.updateComplete.then(() => this.renderRoot.querySelector(selector)); }
function buildQueryAsync(
	fieldName: string,
	callExpression: any,
	indent: string,
): string | null {
	const selector = staticStringArg(callExpression, 0);
	if (selector == null) return null;
	return (
		`${indent}get ${fieldName}() {\n` +
		`${indent}\treturn this.updateComplete.then(\n` +
		`${indent}\t\t() => this.renderRoot.querySelector('${selector}'),\n` +
		`${indent}\t);\n` +
		`${indent}}`
	);
}

// @queryAssignedElements({slot?, selector?, flatten?})
// → get field() {
//     const slot = this.renderRoot?.querySelector('slot[name="…"]');
//     const els = slot?.assignedElements({flatten}) ?? [];
//     return selector ? els.filter(e => e.matches(selector)) : els;
//   }
function buildQueryAssignedElements(
	fieldName: string,
	callExpression: any,
	indent: string,
): string | null {
	const opts = parseAssignedOptions(callExpression);
	const slotSelector = opts.slot
		? `'slot[name="${opts.slot}"]'`
		: `'slot:not([name])'`;
	const flattenArg = opts.flatten === true ? '{flatten: true}' : undefined;

	let body =
		`${indent}get ${fieldName}() {\n` +
		`${indent}\tconst slot = this.renderRoot?.querySelector(${slotSelector});\n`;

	body += flattenArg
		? `${indent}\tconst els = slot?.assignedElements(${flattenArg}) ?? [];\n`
		: `${indent}\tconst els = slot?.assignedElements() ?? [];\n`;

	body += opts.selector
		? `${indent}\treturn els.filter(e => e.matches('${opts.selector}'));\n`
		: `${indent}\treturn els;\n`;

	body += `${indent}}`;
	return body;
}

// @queryAssignedNodes({slot?, flatten?})
// → get field() {
//     const slot = this.renderRoot?.querySelector('slot[name="…"]');
//     return slot?.assignedNodes({flatten}) ?? [];
//   }
function buildQueryAssignedNodes(
	fieldName: string,
	callExpression: any,
	indent: string,
): string | null {
	const opts = parseAssignedOptions(callExpression);
	const slotSelector = opts.slot
		? `'slot[name="${opts.slot}"]'`
		: `'slot:not([name])'`;
	const flattenArg = opts.flatten === true ? '{flatten: true}' : undefined;

	let body =
		`${indent}get ${fieldName}() {\n` +
		`${indent}\tconst slot = this.renderRoot?.querySelector(${slotSelector});\n`;

	body += flattenArg
		? `${indent}\treturn slot?.assignedNodes(${flattenArg}) ?? [];\n`
		: `${indent}\treturn slot?.assignedNodes() ?? [];\n`;

	body += `${indent}}`;
	return body;
}

/** Parse the options object for @queryAssignedElements / @queryAssignedNodes. */
function parseAssignedOptions(callExpression: any): {
	slot: string | null;
	selector: string | null;
	flatten: boolean;
} {
	const result = {
		slot: null as string | null,
		selector: null as string | null,
		flatten: false,
	};
	const argument = callExpression?.arguments?.[0];
	if (!argument || argument.type !== 'ObjectExpression') return result;

	for (const prop of argument.properties ?? []) {
		if (prop.type !== 'Property') continue;
		const key = prop.key?.name;
		if (key === 'slot' && typeof prop.value?.value === 'string') {
			result.slot = prop.value.value;
		} else if (key === 'selector' && typeof prop.value?.value === 'string') {
			result.selector = prop.value.value;
		} else if (key === 'flatten' && prop.value?.value === true) {
			result.flatten = true;
		}
	}

	return result;
}

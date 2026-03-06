/** @typedef {import('@babel/types').ClassDeclaration} ClassDeclaration */
/** @typedef {import('@babel/types').ClassExpression} ClassExpression */
/** @template T @typedef {import('@babel/core').NodePath<T>} NodePath<T> */

import { singlePath } from './utils.js';

/**
 * @param {NodePath<ClassDeclaration> | NodePath<ClassExpression>} classDeclOrExpr
 * @returns {NodePath<any> | undefined}
 */
function walkClassMixins(classDeclOrExpr) {
	let element = /** @type {NodePath<any>} */ (
		classDeclOrExpr.get('superClass')
	);
	// walk possible mixin functions
	while (singlePath(element) && element.isCallExpression()) {
		const result = element.get('arguments');
		if (Array.isArray(result) && result[0]) {
			element = /** @type {NodePath<any>} */ (result[0]);
		}
	}

	return singlePath(element) ? element : undefined;
}

/**
 * @param {NodePath<ClassDeclaration> | NodePath<ClassExpression>} classDeclOrExpr
 * @param {Set<string>} baseClassNames
 */
export function implementsBaseClass(classDeclOrExpr, baseClassNames) {
	const element = walkClassMixins(classDeclOrExpr);

	if (element && element.isIdentifier()) {
		const { name } = element.node;
		return baseClassNames.has(name);
	}
}

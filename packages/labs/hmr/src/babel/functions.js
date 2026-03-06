/** @typedef {import('@babel/types').VariableDeclaration} VariableDeclaration */
/** @typedef {import('@babel/types').CallExpression} CallExpression */
/** @typedef {import('@babel/types').Identifier} Identifier */
/** @typedef {import('./babel-plugin-wc-hmr.js').Decorator} Decorator */
/** @template T @typedef {import('@babel/core').NodePath<T>} NodePath<T> */

import { singlePath } from './utils.js';

/**
 * @param {NodePath<CallExpression>} callExpr
 * @param {Set<string>} functionNames
 */
export function isFunctionComponent(callExpr, functionNames) {
	const callee = callExpr.get('callee');
	if (!singlePath(callee) || !callee.isIdentifier()) {
		return false;
	}
	return functionNames.has(callee.node.name);
}

/** @typedef {import('@babel/types').Identifier} Identifier */
/** @typedef {import('./babel-plugin-wc-hmr.js').Decorator} Decorator */
/** @template T @typedef {import('@babel/core').NodePath<T>} NodePath<T> */

import { findComponentDefinition, singlePath } from './utils.js';

/**
 * @param {Set<string>} decoratorNames
 * @param {NodePath<Identifier>} callee
 * @param {NodePath<any>[]} arguments_
 */
function findCompiledTsDecoratedCustomElement(
	decoratorNames,
	callee,
	arguments_,
) {
	// is this a decorator helper function?
	if (callee.node.name !== '__decorate') {
		return;
	}

	const [arrayExpr, decoratedClass] =
		/** @type {[NodePath<any>, NodePath<any>]} */ (arguments_);
	// are we decorating an identifier (of a class)
	if (!singlePath(decoratedClass) || !decoratedClass.isIdentifier()) {
		return;
	}
	// is the first parameter an array of decorator functions?
	if (!singlePath(arrayExpr) || !arrayExpr.isArrayExpression()) {
		return;
	}
	const elements = arrayExpr.get('elements');
	if (!Array.isArray(elements)) {
		return;
	}

	// find a decorator function called customElement
	const decoratorCall = elements.find((e) => {
		if (!e.isCallExpression()) {
			return false;
		}
		const eCallee = e.get('callee');
		if (!singlePath(eCallee) || !eCallee.isIdentifier()) {
			return false;
		}
		return decoratorNames.has(eCallee.node.name);
	});

	if (!decoratorCall) {
		return;
	}

	const found = findComponentDefinition(decoratedClass);
	return found;
}

/**
 * @param {Set<string>} decoratorNames
 * @param {NodePath<Identifier>} callee
 * @param {NodePath<any>[]} arguments_
 * @returns {NodePath<any> | undefined}
 */
export function findDecoratedCustomElement(decoratorNames, callee, arguments_) {
	// TODO: add non-compiled decorator when it becomes stage 3 and properly supported by babel
	return findCompiledTsDecoratedCustomElement(
		decoratorNames,
		callee,
		arguments_,
	);
}

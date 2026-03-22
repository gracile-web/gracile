/** @typedef {import('@babel/types').MemberExpression} MemberExpression */
/** @typedef {import('@babel/types').CallExpression} CallExpression */
/** @typedef {import('@babel/types').ClassDeclaration} ClassDeclaration */
/** @typedef {import('@babel/types').Expression} Expression */
/** @template T @typedef {import('@babel/core').NodePath<T>} NodePath<T> */

import { resolvePath, findComponentDefinition, singlePath } from './utils.js';

const GLOBALS = new Set(['window', 'self', 'globalThis']);

/**
 * @param {NodePath<MemberExpression>} callee
 * @param {NodePath<unknown>[]} arguments_
 */
function isDefineCall(callee, arguments_) {
	const property = callee.get('property');

	if (
		!singlePath(property) ||
		!property.isIdentifier() ||
		property.node.name !== 'define'
	) {
		return false;
	}

	if (!arguments_ || !Array.isArray(arguments_)) {
		return false;
	}

	return (
		arguments_.length >= 2 &&
		(arguments_[1]?.isIdentifier() ||
			arguments_[1]?.isClassExpression() ||
			arguments_[1]?.isCallExpression())
	);
}

/** @param {NodePath<MemberExpression>} memberExpr */
function isCallOnCustomElementObject(memberExpr) {
	const object = memberExpr.get('object');
	if (!singlePath(object)) {
		return false;
	}

	if (object.isIdentifier()) {
		// we are dealing with <something>.define(), check if <something> references global customElements
		const resolvedIdPath = resolvePath(object);
		if (!resolvedIdPath || !resolvedIdPath.isIdentifier()) {
			return false;
		}
		return resolvedIdPath.node.name === 'customElements';
	}

	if (object.isMemberExpression()) {
		const property = object.get('property');
		if (
			!singlePath(property) ||
			!property.isIdentifier() ||
			property.node.name !== 'customElements'
		) {
			return false;
		}
		// we are dealing with <something>.customElements.define, check if <something> is the global scope

		const subObject = object.get('object');
		if (!singlePath(subObject) || !subObject.isIdentifier()) {
			return false;
		}
		const resolvedIdPath = resolvePath(subObject);
		return (
			resolvedIdPath &&
			resolvedIdPath.isIdentifier() &&
			GLOBALS.has(resolvedIdPath.node.name)
		);
	}

	return false;
}

/**
 * @param {NodePath<MemberExpression>} memberExpr
 * @param {NodePath<any>[]} arguments_
 */
export function findDefinedCustomElement(memberExpr, arguments_) {
	if (
		isDefineCall(memberExpr, arguments_) &&
		isCallOnCustomElementObject(memberExpr) &&
		arguments_[1]
	) {
		return findComponentDefinition(arguments_[1]);
	}
}

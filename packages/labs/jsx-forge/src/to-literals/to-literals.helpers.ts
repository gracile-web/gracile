import type { Ts } from '../types.js';

export function getBuiltinType(
	checker: Ts.TypeChecker,
	typeText: string,
): Ts.Type {
	switch (typeText) {
		case 'any': {
			return checker.getAnyType();
		}
		case 'bigint': {
			return checker.getBigIntType();
		}
		case 'boolean': {
			return checker.getBooleanType();
		}
		case 'never': {
			return checker.getNeverType();
		}
		case 'nonNullable': {
			return checker.getNonNullableType(checker.getAnyType());
		}
		case 'null': {
			return checker.getNullType();
		}
		case 'number': {
			return checker.getNumberType();
		}
		case 'string': {
			return checker.getStringType();
		}
		case 'symbol': {
			return checker.getESSymbolType();
		}
		case 'undefined': {
			return checker.getUndefinedType();
		}
		case 'void': {
			return checker.getVoidType();
		}
		// FIXME:
		// unknown
	}

	throw new Error('Incorrect type');
}

function hasRealPosition(node: Ts.Node): boolean {
	return node.pos >= 0 && node.end >= 0 && node.pos <= node.end;
}

function getSourceSlice(node: Ts.Node): string | undefined {
	if (!hasRealPosition(node)) return;

	return node.getSourceFile().text.slice(node.pos, node.end);
}

export function getImportModuleSpecifierText(
	node: Ts.Expression,
): string | undefined {
	if (
		node.kind === 11 /* StringLiteral */ ||
		node.kind === 15 /* NoSubstitutionTemplateLiteral */
	) {
		return (node as Ts.StringLiteralLike).text;
	}

	const sourceSlice = getSourceSlice(node)?.trim();
	if (
		sourceSlice?.length &&
		((sourceSlice.startsWith('"') && sourceSlice.endsWith('"')) ||
			(sourceSlice.startsWith("'") && sourceSlice.endsWith("'")) ||
			(sourceSlice.startsWith('`') && sourceSlice.endsWith('`')))
	) {
		return sourceSlice.slice(1, -1);
	}
}

// NOTE: All text getter functions are for addressing an (undiscovered) issue
// that started arise for some reasons:
// Error: Debug Failure. False expression: Node must have a real position for this operation
//     at NodeObject.assertHasRealPosition… at NodeObject.getText

export function getJsxTagNameText(
	ts: typeof Ts,
	node: Ts.JsxTagNameExpression,
): string | undefined {
	if (ts.isIdentifier(node)) return node.text;
	if (ts.isJsxNamespacedName(node)) {
		return `${node.namespace.text}:${node.name.text}`;
	}
	if (ts.isPropertyAccessExpression(node)) {
		const left = getExpressionText(ts, node.expression);
		return left ? `${left}.${node.name.text}` : node.name.text;
	}
	if (node.kind === ts.SyntaxKind.ThisKeyword) return 'this';

	return getSourceSlice(node)?.trim();
}

export function getJsxAttributeNameText(
	ts: typeof Ts,
	node: Ts.JsxAttributeName,
): string | undefined {
	if (ts.isIdentifier(node)) return node.text;
	if (ts.isJsxNamespacedName(node)) {
		return `${node.namespace.text}:${node.name.text}`;
	}

	return getSourceSlice(node)?.trim();
}

export function getJsxCommentText(node: Ts.JsxExpression): string | undefined {
	const match = getSourceSlice(node)?.match(
		/^{\s*\/\*\s*<!--([\S\s]*?)-->\s*\*\/\s*}$/,
	);

	return match?.[1];
}

function getExpressionText(
	ts: typeof Ts,
	node: Ts.Expression,
): string | undefined {
	if (ts.isIdentifier(node)) return node.text;
	if (ts.isPropertyAccessExpression(node)) {
		const left = getExpressionText(ts, node.expression);
		return left ? `${left}.${node.name.text}` : node.name.text;
	}
	if (node.kind === ts.SyntaxKind.ThisKeyword) return 'this';

	return getSourceSlice(node)?.trim();
}

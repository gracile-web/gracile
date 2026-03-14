import type { Ts } from '../types.js';

import type { Context, Preset, PresetAttribute } from './types.js';
import { getBuiltinType } from './to-literals.helpers.js';

export function appendAttribute(
	childNode: Ts.JsxAttribute,
	context: Context,
): Ts.Expression | undefined {
	const {
		appendExpressionToCurrentLiteral,
		appendStaticToCurrentLiteral,
		preset,
		program,
		ts,
		visitNode,
	} = context;

	let bodyReplacement: Ts.Expression | undefined;

	const namespaceName = ts.isJsxNamespacedName(childNode.name)
		? childNode.name.namespace.getText()
		: undefined;

	const attributeName = ts.isJsxNamespacedName(childNode.name)
		? childNode.name.name.getText()
		: childNode.name.getText();

	const checker = program.getTypeChecker();

	const expression =
		childNode.initializer &&
		ts.isJsxExpression(childNode.initializer) &&
		childNode.initializer.expression
			? childNode.initializer.expression
			: undefined;

	const type = expression ? checker.getTypeAtLocation(expression) : undefined;

	const customAttribute = getCustomAttribute(
		preset,
		namespaceName,
		attributeName,
		ts,
		checker,
		type,
	);

	if (expression && customAttribute) {
		bodyReplacement = handleCustomAttribute(
			customAttribute,
			context,
			expression,
			attributeName,
			namespaceName,
		);
	} else if (childNode.initializer) {
		if (ts.isStringLiteral(childNode.initializer)) {
			appendStaticToCurrentLiteral(` ${attributeName}=`);
			appendStaticToCurrentLiteral(`"${childNode.initializer.text}"`);
		}
		if (expression) {
			appendStaticToCurrentLiteral(` ${attributeName}=`);

			const visited = visitNode(expression);

			appendExpressionToCurrentLiteral(visited);
		}
	} else {
		appendStaticToCurrentLiteral(` ${childNode.name.getText()}`);
	}

	return bodyReplacement;
}

export function getCustomAttribute(
	preset: Preset,
	namespaceName: string | undefined,
	attributeName: string,
	ts: typeof Ts,
	checker: Ts.TypeChecker,
	type: Ts.Type | undefined,
): PresetAttribute | undefined {
	return preset.attributes.find(
		(attribute) =>
			(attribute.when.namespace && attribute.when.name
				? attribute.when.namespace === namespaceName &&
					attribute.when.name === attributeName
				: false) ||
			(attribute.when.namespace && !attribute.when.name
				? attribute.when.namespace === namespaceName
				: false) ||
			(!attribute.when.namespace && attribute.when.name
				? attribute.when.name === attributeName
				: false) ||
			(type /* && !attribute.when.namespace */
				? attribute.when.type?.isAssignableTo &&
					checker.isTypeAssignableTo(
						getBuiltinType(checker, attribute.when.type.isAssignableTo),
						type,
					)
				: false),
	);
}

export function handleCustomAttribute(
	customAttribute: PresetAttribute,
	context: Context,
	expression: Ts.Expression,
	attributeName: string,
	namespaceName?: string,
): Ts.Expression | undefined {
	let bodyReplacement: Ts.Expression | undefined;

	const {
		appendExpressionToCurrentLiteral,
		appendStaticToCurrentLiteral,
		imports,
		preset,
		ts,
		visitNode,
	} = context;

	const namespace = namespaceName ? namespaceName + ':' : '';
	if (namespace + attributeName === preset.children.keyName) {
		bodyReplacement = visitNode(expression);
		return bodyReplacement;
	}

	let prefix =
		customAttribute.do.removeNamespace || !customAttribute.when.namespace
			? ''
			: `${customAttribute.when.namespace}:`;

	if (customAttribute.do.addPrefix) {
		prefix = customAttribute.do.addPrefix;
	}

	if (
		!customAttribute.do.insertExpression?.inPlace &&
		!customAttribute.do.insertExpression?.inBody
	) {
		appendStaticToCurrentLiteral(
			` ${prefix}${customAttribute.do.renameTo ?? attributeName}=`,
		);
	} else if (customAttribute.do.insertExpression.inBody) {
		/* nothing */
	} else {
		appendStaticToCurrentLiteral(` `);
	}

	if (customAttribute.do.addImports) {
		for (const index of customAttribute.do.addImports)
			imports.set(index.as, index);
	}

	if (customAttribute.do.insertExpression?.valueFunctionWrapper) {
		const visited = visitNode(expression);

		const hasImport = customAttribute.do.addImports?.length;
		const callExpression = ts.factory.createCallExpression(
			ts.factory.createIdentifier(
				(hasImport ? (context.preset.antiCollisionImportPrefix ?? '') : '') +
					customAttribute.do.insertExpression.valueFunctionWrapper.name,
			),
			undefined,
			[visited],
		);

		const keyword = customAttribute.do.insertExpression.cast
			? customAttribute.do.insertExpression.cast + 'Keyword'
			: undefined;
		const finalExpression =
			keyword && ts.SyntaxKind[keyword as keyof typeof Ts.SyntaxKind]
				? ts.factory.createAsExpression(
						callExpression,
						ts.factory.createKeywordTypeNode(
							ts.SyntaxKind[
								keyword as keyof typeof Ts.SyntaxKind
							] as Ts.KeywordTypeSyntaxKind,
						),
					)
				: callExpression;

		if (
			customAttribute.do.renameTo ||
			customAttribute.do.insertExpression.inPlace
		)
			ts.addSyntheticLeadingComment(
				finalExpression,
				ts.SyntaxKind.MultiLineCommentTrivia,
				` ${prefix}${attributeName} `,
			);

		if (customAttribute.do.insertExpression.inBody)
			bodyReplacement = finalExpression;
		else {
			appendExpressionToCurrentLiteral(finalExpression);
		}
	} else {
		const visited = visitNode(expression);

		// -> visitNode
		appendExpressionToCurrentLiteral(visited);
	}
	return bodyReplacement;
}

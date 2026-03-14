import type { Ts, TsWithInternals } from '../types.js';

import type { Context, Preset } from './types.js';

export function handleForEachTagDirective(
	context: Pick<Context, 'preset' | 'ts' | 'visitNode'>,
	node: Ts.Node,
): Ts.Node | undefined {
	const { preset, ts, visitNode } = context;
	const { factory } = ts;

	// NOTE: Remaining body block statements
	if (
		ts.isJsxElement(node) &&
		node.openingElement.tagName.getText() === preset.forEach.tagName
	) {
		return ts.setTextRange(
			visitNode(
				factory.createJsxFragment(
					factory.createJsxOpeningFragment(),
					node.children,
					factory.createJsxJsxClosingFragment(),
				),
			),
			node,
		);
	}

	if (
		!ts.isCallExpression(node) ||
		!ts.isPropertyAccessExpression(node.expression)
	)
		return;

	const firstArgument = node.arguments.at(0);

	if (!firstArgument || !ts.isArrowFunction(firstArgument)) return;

	let element: Ts.JsxElement | undefined;
	let keyExpression: Ts.Expression | undefined;

	let updatedBody: Ts.Block | Ts.ConciseBody | undefined;

	if (ts.isBlock(firstArgument.body)) {
		const updatedStatements = firstArgument.body.statements.map((statement) => {
			const withReturn =
				ts.isReturnStatement(statement) && statement.expression;

			const withParentheses =
				withReturn &&
				ts.isParenthesizedExpression(statement.expression) &&
				ts.isJsxElement(statement.expression.expression);

			const withDirectElement =
				withReturn && ts.isJsxElement(statement.expression);

			if (withDirectElement) element = statement.expression;
			if (withParentheses) element = statement.expression.expression;

			if ((withParentheses || withDirectElement) && element) {
				const tagName = element.openingElement.tagName.getText();

				keyExpression = findForEachKeyExpression(element, ts, tagName, preset);

				return factory.updateReturnStatement(
					statement,
					factory.createJsxFragment(
						factory.createJsxOpeningFragment(),
						element.children,
						factory.createJsxJsxClosingFragment(),
					),
				);
			}

			return statement;
		});
		updatedBody = factory.updateBlock(firstArgument.body, updatedStatements);
	} else if (ts.isConciseBody(firstArgument.body)) {
		const withParentheses =
			ts.isParenthesizedExpression(firstArgument.body) &&
			ts.isJsxElement(firstArgument.body.expression);

		const withDirectElement = ts.isJsxElement(firstArgument.body);

		if (withDirectElement) element = firstArgument.body;
		if (withParentheses) element = firstArgument.body.expression;

		if (element) {
			const tagName = element.openingElement.tagName.getText();
			keyExpression = findForEachKeyExpression(element, ts, tagName, preset);

			if (keyExpression) {
				const expression = factory.createJsxFragment(
					factory.createJsxOpeningFragment(),
					element.children,

					factory.createJsxJsxClosingFragment(),
				);

				updatedBody = factory.createParenthesizedExpression(expression);
			}
		}
	}
	if (!updatedBody || !element || !keyExpression) return;

	const updatedAndVisitedBody = visitNode(updatedBody);

	const common = [
		firstArgument.modifiers,
		firstArgument.typeParameters,
		firstArgument.parameters,
		firstArgument.type,
		firstArgument.equalsGreaterThanToken,
	] as const;

	const arrowFunction = factory.updateArrowFunction(
		firstArgument,
		...common,
		updatedAndVisitedBody,
	);

	const arrowKeyFunction = factory.createArrowFunction(
		...common,
		factory.createParenthesizedExpression(keyExpression),
	);

	const callExpression = factory.createCallExpression(
		factory.createIdentifier(
			(preset.antiCollisionImportPrefix ?? '') +
				preset.forEach.addImports.at(0)!.as,
		),
		undefined,
		[node.expression.expression, arrowKeyFunction, arrowFunction],
	);

	ts.addSyntheticLeadingComment(
		callExpression,
		ts.SyntaxKind.MultiLineCommentTrivia,
		` <${preset.forEach.tagName}> `,
		true,
	);
	return ts.setTextRange(callExpression, node);
}

export function handleSpecialTagDirective(
	context: Pick<
		Context,
		| 'appendExpressionToCurrentLiteral'
		| 'imports'
		| 'preset'
		| 'ts'
		| 'visitNode'
	>,

	openingTagName: string,
	attributes: Ts.JsxAttributes,
): boolean {
	const { appendExpressionToCurrentLiteral, imports, preset, ts } = context;

	const { factory } = ts;

	for (const virtualElement of preset.virtualElements) {
		if (virtualElement.tagName === openingTagName) {
			const argumentsArray: Ts.Expression[] = [];
			for (const a of virtualElement.arguments) {
				attributes.forEachChild((jsxAttribute) => {
					if (
						ts.isJsxAttribute(jsxAttribute) &&
						jsxAttribute.initializer &&
						ts.isJsxExpression(jsxAttribute.initializer) &&
						jsxAttribute.initializer.expression &&
						ts.isIdentifier(jsxAttribute.name) &&
						jsxAttribute.name.text === a
					) {
						argumentsArray.push(jsxAttribute.initializer.expression);
					}
				});
			}

			for (const index of virtualElement.addImports)
				imports.set(index.as, index);

			const expressionToAppend = factory.createCallExpression(
				factory.createIdentifier(
					(context.preset.antiCollisionImportPrefix ?? '') +
						virtualElement.valueFunctionWrapper.name,
				),
				[],
				argumentsArray,
			);

			ts.addSyntheticLeadingComment(
				expressionToAppend,
				ts.SyntaxKind.MultiLineCommentTrivia,
				` <${virtualElement.tagName}> `,
				true,
			);

			appendExpressionToCurrentLiteral(expressionToAppend);

			return true;
		}
	}
	return false;
}

function findForEachKeyExpression(
	element: Ts.JsxElement,
	ts: TsWithInternals,
	tagName: string,
	preset: Preset,
): Ts.Expression | undefined {
	let keyExpression: Ts.Expression | undefined;
	element.openingElement.attributes.forEachChild((attributeNode) => {
		if (ts.isJsxAttribute(attributeNode)) {
			const attributeName = attributeNode.name.getText();
			if (
				((tagName === preset.forEach.tagName &&
					attributeName === preset.forEach.keyNameAttributeName) ||
					attributeName === preset.forEach.keyNameAttributeNameOnAnyElement) &&
				attributeNode.initializer &&
				ts.isJsxExpression(attributeNode.initializer) &&
				attributeNode.initializer.expression
			) {
				keyExpression = attributeNode.initializer.expression;
			}
		}
	});
	return keyExpression;
}

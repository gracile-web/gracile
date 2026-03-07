import type { Ts } from '../types.js';
import type { Context } from './types.js';

export function handlePascalCasedComponent(
	context: Context,
	node: Ts.JsxElement | Ts.JsxSelfClosingElement,
	tagName: Ts.Expression,
): void {
	const { appendExpressionToCurrentLiteral, ts, visitNode } = context;
	const { factory } = ts;

	const collectedAttributes: (Ts.PropertyAssignment | Ts.SpreadAssignment)[] =
		[];

	const attributes = ts.isJsxSelfClosingElement(node)
		? node.attributes
		: node.openingElement.attributes;

	for (const attributeNode of attributes.properties) {
		handlePascalCasedComponentAttribute(
			context,
			attributeNode,
			collectedAttributes,
		);
	}

	const hasChildren =
		!ts.isJsxSelfClosingElement(node) && node.children.length > 0;

	if (hasChildren) {
		const visited = visitNode(
			factory.createJsxFragment(
				factory.createJsxOpeningFragment(),
				node.children,
				factory.createJsxJsxClosingFragment(),
			),
		);

		collectedAttributes.push(
			factory.createPropertyAssignment(
				ts.isIdentifierText(context.preset.children.keyName)
					? factory.createIdentifier(context.preset.children.keyName)
					: factory.createStringLiteral(context.preset.children.keyName),
				visited,
			),
		);
	}

	appendExpressionToCurrentLiteral(
		factory.createCallExpression(
			tagName,
			undefined,
			collectedAttributes.length > 0
				? [factory.createObjectLiteralExpression(collectedAttributes, true)]
				: [factory.createNull()],
		),
	);
}

export function handlePascalCasedComponentAttribute(
	context: Context,
	attributeNode: Ts.JsxAttributeLike,
	collectedAttributes: (Ts.PropertyAssignment | Ts.SpreadAssignment)[],
): void {
	const { ts, visitNode } = context;
	const { factory } = ts;

	if (ts.isJsxSpreadAttribute(attributeNode)) {
		collectedAttributes.push(
			factory.createSpreadAssignment(attributeNode.expression),
		);
	} else if (ts.isJsxAttribute(attributeNode) && attributeNode.initializer) {
		if (
			ts.isStringLiteral(attributeNode.initializer) &&
			ts.isIdentifier(attributeNode.name)
		) {
			collectedAttributes.push(
				factory.createPropertyAssignment(
					attributeNode.name,
					attributeNode.initializer,
				),
			);
		}

		if (
			ts.isJsxExpression(attributeNode.initializer) &&
			attributeNode.initializer.expression &&
			(ts.isJsxElement(attributeNode.initializer.expression) ||
				ts.isJsxSelfClosingElement(attributeNode.initializer.expression) ||
				ts.isJsxFragment(attributeNode.initializer.expression)) &&
			ts.isIdentifier(attributeNode.name)
		) {
			const visited = visitNode(attributeNode.initializer.expression);

			collectedAttributes.push(
				factory.createPropertyAssignment(attributeNode.name, visited),
			);
		}
	}
}

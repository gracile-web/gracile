import type { Ts } from '../types.js';
import { HTML_VOID_ELEMENTS } from '../constants.js';

import type { Context } from './types.js';
import {
	appendAttribute,
	getCustomAttribute,
	handleCustomAttribute,
} from './html-attributes.js';
import { handleSpecialTagDirective } from './special.js';

export function handleTag(
	context: Context,
	openingTagName: string,
	attributes: Ts.JsxAttributes,
): {
	bodyReplacement: Ts.Expression | undefined;
	closingTag: () => void;
	skipBody?: boolean;
} {
	const {
		appendExpressionToCurrentLiteral,
		appendStaticToCurrentLiteral,
		preset,
		program,
		ts,
	} = context;

	const { factory } = ts;
	const found = handleSpecialTagDirective(context, openingTagName, attributes);
	if (found)
		return {
			bodyReplacement: undefined,
			closingTag() {
				return '';
			},
			skipBody: true,
		} as const;

	appendStaticToCurrentLiteral(`<${openingTagName}`);

	let bodyReplacement: Ts.Expression | undefined;

	attributes.forEachChild((childNode) => {
		if (ts.isJsxAttribute(childNode)) {
			bodyReplacement = appendAttribute(childNode, context);
		}
		if (ts.isJsxSpreadAttribute(childNode)) {
			const checker = program.getTypeChecker();

			const type = checker.getTypeAtLocation(childNode.expression);
			const properties = checker.getPropertiesOfType(type);

			console.log({ c: childNode.expression, type });

			for (const property of properties) {
				const declaration = property.declarations?.at(0);
				if (!declaration) continue;
				const type = checker.getTypeAtLocation(declaration);

				const [namespaceName, attributeName = property.name] =
					property.name.split(':');

				const customAttribute = getCustomAttribute(
					preset,
					namespaceName,
					attributeName,
					ts,
					checker,
					type,
				);

				const expression = factory.createElementAccessExpression(
					childNode.expression,
					factory.createStringLiteral(property.name),
				);

				if (customAttribute) {
					handleCustomAttribute(
						customAttribute,
						context,
						expression,
						attributeName,
					);
				} else {
					// FIXME:
					appendStaticToCurrentLiteral(` ${property.name}=`);

					appendExpressionToCurrentLiteral(expression);
				}
			}
		}
	});

	appendStaticToCurrentLiteral(`>`);

	return {
		bodyReplacement,
		closingTag: () => {
			if (!HTML_VOID_ELEMENTS.has(openingTagName))
				appendStaticToCurrentLiteral(`</${openingTagName}>`);
		},
	} as const;
}

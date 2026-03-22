// NOTE: Work in progress.

// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-nocheck ...........................

import type { TransformerPluginConfig, Ts } from '../types.js';

// interface TransformerOptions {
// 	framework: 'preact' | 'react' | 'vue';
// }

export function createMetaJsxTransformer(
	ts: typeof Ts,
	program: Ts.Program,
	pluginConfig: TransformerPluginConfig,
	// opts: TransformerOptions,
): Ts.TransformerFactory<Ts.SourceFile> {
	// const typeChecker = program.getTypeChecker();
	const { framework = 'react' } = pluginConfig;

	const factory = ts.factory;

	// Dummy event + prop maps
	const regularEventMap = {
		click: 'Click',
		focus: 'Focus',
	};
	const specialEventMap = {
		dblclick: { others: 'DblClick', react: 'DoubleClick' },
	};
	const attributesMap = {
		class: 'className',
		for: 'htmlFor',
	};

	return (context) => {
		const visitor: Ts.Visitor = (node): Ts.VisitResult<Ts.Node> => {
			// Strip `"use html-signal"` or `"use html-server"`
			if (ts.isSourceFile(node)) {
				node = factory.updateSourceFile(
					node,
					node.statements.filter((stmt) => {
						return !(
							ts.isExpressionStatement(stmt) &&
							ts.isStringLiteral(stmt.expression) &&
							['use html-server', 'use html-signal'].includes(
								stmt.expression.text,
							)
						);
					}),
				);
			}

			// JSX <For each={…}>{(item) => …}</For> → {items.map(item => …)}
			// if (
			// 	ts.isJsxElement(node) &&
			// 	ts.isIdentifier(node.openingElement.tagName) &&
			// 	node.openingElement.tagName.text === 'For'
			// ) {
			// 	const eachAttr = node.openingElement.attributes.properties.find(
			// 		(p): p is Ts.JsxAttribute =>
			// 			ts.isJsxAttribute(p) && p.name.text === 'each',
			// 	);
			// 	const expr =
			// 		eachAttr?.initializer && ts.isJsxExpression(eachAttr.initializer)
			// 			? eachAttr.initializer.expression
			// 			: undefined;
			// 	const arrow = node.children.find(
			// 		(child): child is Ts.JsxExpression =>
			// 			ts.isJsxExpression(child) && ts.isArrowFunction(child.expression),
			// 	)?.expression as Ts.ArrowFunction | undefined;

			// 	if (expr && arrow) {
			// 		return factory.createJsxExpression(
			// 			undefined,
			// 			factory.createCallExpression(
			// 				factory.createPropertyAccessExpression(expr, 'map'),
			// 				undefined,
			// 				[arrow],
			// 			),
			// 		);
			// 	}
			// }

			// Namespaced attributes: prop:xxx, on:click, etc.
			if (ts.isJsxAttribute(node)) {
				if (ts.isJsxNamespacedName(node.name)) {
					const { name, namespace } = node.name;

					let newName: string | undefined;

					switch (namespace.text) {
						case 'attr':
						case 'bool':
						case 'for':
						case 'if':
						case 'prop':
						case 'use': {
							newName = ['preact', 'react', 'solid'].includes(framework)
								? (attributesMap[name.text as keyof typeof attributesMap] ??
									name.text)
								: name.text;
							break;
						}
						case 'on': {
							const key = name.text;
							const event =
								specialEventMap[key as keyof typeof specialEventMap]?.[
									framework === 'react' ? 'react' : 'others'
								] ?? regularEventMap[key as keyof typeof regularEventMap];
							newName = event ? `on${event}` : `on${key}`;
							break;
						}
					}

					if (newName) {
						return factory.updateJsxAttribute(
							node,
							factory.createIdentifier(newName),
							node.initializer,
						);
					}
				} else if (ts.isIdentifier(node.name)) {
					const key = node.name.text;
					const updated = attributesMap[key as keyof typeof attributesMap];
					if (updated) {
						return factory.updateJsxAttribute(
							node,
							factory.createIdentifier(updated),
							node.initializer,
						);
					}
				}
			}

			// React controlled input fallback and noop onChange
			if (
				ts.isJsxSelfClosingElement(node) &&
				framework === 'react' &&
				ts.isIdentifier(node.tagName) &&
				['input', 'select', 'textarea'].includes(node.tagName.text)
			) {
				let hasValue = false;
				let hasOnChange = false;

				const newAttributes = node.attributes.properties.map((attribute) => {
					if (!ts.isJsxAttribute(attribute)) return attribute;

					if (
						attribute.name.text === 'value' &&
						ts.isJsxExpression(attribute.initializer)
					) {
						hasValue = true;
						return factory.updateJsxAttribute(
							attribute,
							attribute.name,
							factory.createJsxExpression(
								undefined,
								factory.createBinaryExpression(
									attribute.initializer.expression!,
									ts.SyntaxKind.QuestionQuestionToken,
									factory.createStringLiteral(''),
								),
							),
						);
					}
					if (attribute.name.text === 'onChange') {
						hasOnChange = true;
					}
					return attribute;
				});

				if (hasValue && !hasOnChange) {
					newAttributes.push(
						factory.createJsxAttribute(
							factory.createIdentifier('onChange'),
							factory.createJsxExpression(
								undefined,
								factory.createArrowFunction(
									undefined,
									undefined,
									[],
									undefined,
									factory.createToken(ts.SyntaxKind.EqualsGreaterThanToken),
									factory.createBlock([], true),
								),
							),
						),
					);
				}

				return factory.updateJsxSelfClosingElement(
					node,
					node.tagName,
					node.typeArguments,
					factory.createJsxAttributes(newAttributes),
				);
			}

			// Rewrite Fragment import
			if (
				ts.isImportDeclaration(node) &&
				node.importClause?.namedBindings &&
				ts.isNamedImports(node.importClause.namedBindings)
			) {
				for (const specifier of node.importClause.namedBindings.elements) {
					if (specifier.name.text === 'Fragment') {
						return factory.updateImportDeclaration(
							node,
							node.decorators,
							node.modifiers,
							node.importClause,
							factory.createStringLiteral(framework),
						);
					}
				}
			}

			return ts.visitEachChild(node, visitor, context);
		};

		return (sourceFile) => {
			const node = ts.visitNode(sourceFile, visitor);

			if (!node || !ts.isSourceFile(node)) return sourceFile;
			return node;
		};
	};
}

/* eslint-disable sonarjs/cognitive-complexity */

import type { Ts } from '../types.js';
import type { TsWithInternals } from '../types.js';
import type { Context, Import, Preset } from './types.js';

import { USE_HTML_FLAVOR_DIRECTIVE_PREFIX } from '../constants.js';
import { PRESETS } from '../presets/lit.js';
import { collectLiteralEntitiesInJsx } from './collect.js';
import { handleForEachTagDirective } from './special.js';

export function createJsxToLiteralsTransformer(
	ts: TsWithInternals,
	program: Ts.Program | undefined,
	_pluginConfig = {},
	preset: Preset = PRESETS.Default,
): Ts.TransformerFactory<Ts.SourceFile> {
	if (!program) throw new ReferenceError('Missing TS Program.');

	return (context) => {
		const imports = new Map<string, Import>();

		const { factory } = ts;

		let defaultHtml = preset.useLiteral.default.at(0)?.as ?? 'html';
		const globalFlags = { literalFlavor: defaultHtml };
		let useGlobalLiteralDirective = false;

		const visitNode: Context['visitNode'] = (expression) => {
			const visited = ts.visitNode(expression, visitor);

			if (!visited) throw new Error('Should be an expression after visit');
			return visited as typeof expression;
		};
		const baseContext = {
			globalFlags,
			imports,
			preset,
			program,
			ts,
			visitNode,
		};

		const visitor: Ts.Visitor = (node) => {
			const callExpression = handleForEachTagDirective(baseContext, node);
			if (callExpression) {
				for (const index of preset.forEach.addImports)
					imports.set(index.as, index);

				return callExpression;
			}

			if (
				ts.isExpressionStatement(node) &&
				ts.isStringLiteral(node.expression) &&
				ts.isSourceFile(node.parent)
			) {
				const directiveText = node.expression.text;

				// TODO: defaultHtml
				if (directiveText.startsWith(USE_HTML_FLAVOR_DIRECTIVE_PREFIX)) {
					const flavor = directiveText.slice(
						USE_HTML_FLAVOR_DIRECTIVE_PREFIX.length,
					);

					if (flavor in preset.useLiteral) {
						const flavorImport =
							preset.useLiteral[flavor as keyof typeof preset.useLiteral];
						const flavoredHtml = flavorImport?.at(0)?.as;
						if (flavoredHtml) {
							globalFlags.literalFlavor = flavoredHtml;

							for (const [index, index_] of flavorImport.entries())
								imports.set(`html:${flavor}:${index.toString()}`, index_);

							useGlobalLiteralDirective = true;
						}
					}

					const empty = factory.createEmptyStatement();
					ts.addSyntheticLeadingComment(
						empty,
						ts.SyntaxKind.MultiLineCommentTrivia,
						`* @${directiveText} `,
						true,
					);
					return ts.setTextRange(empty, node);
				}
			}

			if (ts.isImportDeclaration(node)) {
				const moduleSpecifierText = node.moduleSpecifier.getText().slice(1, -1);
				const remappedModuleSpecifierText =
					preset.importRemap?.[moduleSpecifierText];
				if (remappedModuleSpecifierText) {
					return ts.factory.updateImportDeclaration(
						node,
						[],
						node.importClause,
						ts.factory.createStringLiteral(remappedModuleSpecifierText),
						node.attributes,
					);
				}
			}

			if (
				ts.isJsxElement(node) ||
				ts.isJsxFragment(node) ||
				ts.isJsxSelfClosingElement(node) /*  &&
				!isJsx(node.parent) */
			) {
				if (!useGlobalLiteralDirective)
					for (const index of preset.useLiteral.default)
						imports.set(index.as, index);

				const strings: string[] = [''];
				const expressions: Ts.Expression[] = [];

				const localContext = {
					...baseContext,

					appendExpressionToCurrentLiteral(expression) {
						strings.push('');
						expressions.push(expression);
					},
					appendStaticToCurrentLiteral(text) {
						// eslint-disable-next-line unicorn/prefer-at
						strings[strings.length - 1]! += text;
					},
				} satisfies Context;

				collectLiteralEntitiesInJsx(node, localContext);

				const templateStrings = [...strings];
				const templateLiteral = factory.createTaggedTemplateExpression(
					factory.createIdentifier(globalFlags.literalFlavor),
					undefined,
					expressions.length > 0
						? factory.createTemplateExpression(
								factory.createTemplateHead(templateStrings.shift()!),
								templateStrings.map((string, index) => {
									const TailOrMiddle =
										index === templateStrings.length - 1
											? 'createTemplateTail'
											: 'createTemplateMiddle';

									return factory.createTemplateSpan(
										expressions[index - 0]!,
										factory[TailOrMiddle](string), // NOTE: No need to escape backticks
									);
								}),
							)
						: factory.createNoSubstitutionTemplateLiteral(
								templateStrings.shift()!,
							),
				);

				return ts.setTextRange(templateLiteral, node);
			}

			// IDEA: Add explicit annotations
			// if (
			// 	ts.isParameter(node) &&
			// 	ts.isJsxExpression(node.parent.parent) &&
			// 	ts.isJsxAttribute(node.parent.parent.parent)
			// ) {
			// 	const checker = program.getTypeChecker();

			// 	const type = checker.getTypeAtLocation(node);

			// 	const up = factory.updateParameterDeclaration(
			// 		node,
			// 		node.modifiers,
			// 		node.dotDotDotToken,
			// 		node.name,
			// 		node.questionToken,
			// 		node.type ??
			// 			factory.createTypeReferenceNode(checker.typeToString(type)),
			// 		node.initializer,
			// 	);
			// 	return ts.setTextRange(up, node);
			// }

			return ts.visitEachChild(node, visitor, context);
		};

		return (node) => {
			if (!ts.isSourceFile(node)) return node;
			const visited = ts.visitEachChild(node, visitor, context);

			if (imports.size > 0) {
				const importDeclarations: Ts.ImportDeclaration[] = [];

				for (const [, declaration] of imports) {
					const isLiteralImport = Object.values(preset.useLiteral)
						.flatMap((v) => v.map((v2) => v2.as))
						.includes(declaration.as);

					const importSpecifier = factory.createImportSpecifier(
						false,
						(declaration.name === declaration.as &&
							!preset.antiCollisionImportPrefix) ||
							isLiteralImport
							? undefined
							: factory.createIdentifier(declaration.name),
						factory.createIdentifier(
							(preset.antiCollisionImportPrefix && !isLiteralImport
								? preset.antiCollisionImportPrefix
								: '') + declaration.as,
						),
					);

					const importDeclaration = factory.createImportDeclaration(
						undefined,
						factory.createImportClause(
							false,
							undefined,
							factory.createNamedImports([importSpecifier]),
						),
						factory.createStringLiteral(declaration.path),
					);
					importDeclarations.push(importDeclaration);
				}

				return ts.factory.updateSourceFile(visited, [
					...importDeclarations,
					...visited.statements,
				]);
			}

			return visited;
		};
	};
}

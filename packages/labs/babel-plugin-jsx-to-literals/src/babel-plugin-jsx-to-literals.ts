import * as t from '@babel/types';
import type * as BabelCoreNamespace from '@babel/core';

import {
	DEFAULT_PLUGIN_OPTIONS,
	HTML_VOID_ELEMENTS,
	COMPONENTS,
	SUB_NAMESPACES,
	type ImportName,
	type LitHtmlFlavor,
	type PluginOptions,
	NAMESPACES,
	JsxToLiteralError,
} from './types.js';

// TODO: Properties spreading
// TODO: Preserve attribute current line

/**
 * @example `<some.deep.object.PascalCasedComponent…`
 */
function compoundComponentName(
	op: t.JSXIdentifier | t.JSXMemberExpression,
): string {
	if (op.type === 'JSXMemberExpression')
		return `${compoundComponentName(op.object)}${op.property ? `.${op.property.name}` : ''}`;

	return op.name;
}

function recurse(
	node: t.JSXElement | t.JSXFragment,
	quasis: string[],
	expressions: (t.Expression | t.TSType)[],
	htmlFlavor: LitHtmlFlavor,
	needImport: Set<ImportName>,
): void {
	let isComponent = false;

	let unsafeHtml: t.Expression | undefined;
	let unsafeSvg: t.Expression | undefined;

	if (node.type === 'JSXElement') {
		const openingName = node.openingElement.name;

		// MARK: Resolve self closing
		if (
			node.openingElement.selfClosing &&
			node.openingElement.name.type === 'JSXIdentifier'
		) {
			node.openingElement.selfClosing = false;
			if (HTML_VOID_ELEMENTS.has(node.openingElement.name.name) === false)
				node.closingElement = t.jsxClosingElement(node.openingElement.name);
		}
		// MARK: Special Components

		// MARK: <Fragment>
		if (
			openingName.type === 'JSXIdentifier' &&
			openingName.name === COMPONENTS.Fragment &&
			node.children
		) {
			/* Skip */
		} else if (
			// MARK: <For>
			openingName.type === 'JSXIdentifier' &&
			openingName.name === COMPONENTS.For
		) {
			isComponent = true;

			let each: t.Expression | undefined;
			let keyValue: t.Expression | undefined;
			let childToIterate: t.Expression | undefined;

			for (const attribute of node.openingElement.attributes)
				if (
					attribute.type === 'JSXAttribute' &&
					attribute.value?.type === 'JSXExpressionContainer' &&
					attribute.value.expression.type !== 'JSXEmptyExpression' &&
					attribute.name.name === 'each'
				)
					each = attribute.value.expression;
			if (!each)
				throw new JsxToLiteralError('<For>: Missing `each` attribute', node);

			const forChild = node.children.find(
				(c) => c.type === 'JSXExpressionContainer',
			);
			if (forChild?.expression.type !== 'ArrowFunctionExpression')
				throw new JsxToLiteralError('<For>: Need a child arrow function', node);

			/**
			 * <For each={["foo"]}>{(id) => <span for:key={id}>{id}</span>}</For>
			 */
			if (forChild.expression.body.type === 'JSXElement') {
				for (const attribute of forChild.expression.body.openingElement
					.attributes) {
					if (
						attribute.type === 'JSXAttribute' &&
						attribute.name.type === 'JSXNamespacedName' &&
						attribute.name.namespace.name === NAMESPACES.for &&
						attribute.name.name.name === SUB_NAMESPACES.key &&
						attribute.value?.type === 'JSXExpressionContainer' &&
						attribute.value?.expression.type !== 'JSXEmptyExpression'
					) {
						keyValue = t.arrowFunctionExpression(
							forChild.expression.params,
							attribute.value.expression,
						);
						childToIterate = forChild.expression;
					}
				}
				/**
				 * <For each={["foo"]}>{(id) => [id, <span>{id}</span>]}</For>
				 */
			} else if (
				forChild.expression.body.type === 'ArrayExpression' &&
				t.isExpression(forChild.expression.body.elements[0]) &&
				t.isExpression(forChild.expression.body.elements[1])
			) {
				keyValue = t.arrowFunctionExpression(
					forChild.expression.params,
					forChild.expression.body.elements[0],
				);
				childToIterate = t.arrowFunctionExpression(
					keyValue.params,
					forChild.expression.body.elements[1],
				);
			}
			if (!childToIterate || !keyValue)
				throw new JsxToLiteralError(
					'Illegal `<For>` construction. No child or key value found',
					node,
				);

			const _arguments = [each, keyValue, childToIterate];
			expressions.push(t.callExpression(t.identifier('repeat'), _arguments));
			quasis.push('');

			needImport.add('repeat');
		}

		// MARK: PascalCased Element
		else if (
			(openingName.type === 'JSXIdentifier' &&
				openingName.name.at(0) !== openingName.name.toLowerCase().at(0)) ||
			openingName.type === 'JSXMemberExpression'
		) {
			// MARK: SVG
			// TODO: SVG like `<Svg></Svg>` => `svg\`...\``

			isComponent = true;

			const attributes: (
				| t.ObjectMethod
				| t.ObjectProperty
				| t.SpreadElement
			)[] = [];

			for (const attribute of node.openingElement.attributes)
				if (
					attribute.type === 'JSXAttribute' &&
					typeof attribute.name.name === 'string' &&
					attribute.value
				) {
					let value: t.Expression | t.StringLiteral | null = null;
					if (
						attribute.value.type === 'JSXExpressionContainer' &&
						(attribute.value.expression.type === 'JSXEmptyExpression') === false
					) {
						value = attribute.value.expression;
					} else if (attribute.value.type === 'StringLiteral') {
						value = attribute.value;
					}
					if (value)
						attributes.push(
							t.objectProperty(
								t.identifier(attribute.name.name),
								value,
								false,
								true,
							),
						);
				} else if (
					attribute.type === 'JSXSpreadAttribute' &&
					attribute.argument.type === 'ObjectExpression'
				)
					for (const property of attribute.argument.properties)
						if (
							property.type === 'ObjectProperty' &&
							property.key.type === 'Identifier' &&
							property.value.type === 'Identifier'
						)
							attributes.push(
								t.objectProperty(
									t.identifier(property.key.name),
									property.value,
								),
							);

			// MARK: Component name

			let componentName: string | undefined;

			if (openingName.type === 'JSXIdentifier')
				componentName = openingName.name;

			if (openingName.type === 'JSXMemberExpression')
				componentName = compoundComponentName(openingName);

			if (componentName === undefined)
				throw new JsxToLiteralError('Invalid component name.', node);

			// MARK: Component children
			if (node.children.length > 0 && componentName !== COMPONENTS.For) {
				// TODO: support for children arrays OR single element
				const children: (t.Expression | t.JSXFragment | t.JSXElement)[] = [];
				for (const child of node.children) {
					// NOTE: Skip empty text nodes from array
					if (child.type === 'JSXText' && child.value.trim() === '') continue;

					if (child.type === 'JSXExpressionContainer') {
						if (t.isExpression(child.expression)) {
							children.push(child.expression);
							continue;
						}
					} else if (t.isJSX(child)) {
						if (child.type === 'JSXFragment' || child.type === 'JSXElement') {
							children.push(child);
							continue;
						}

						// NOTE: Wrap other JSX types in a fragment, which always holds an array.
						children.push(
							t.jsxFragment(t.jsxOpeningFragment(), t.jsxClosingFragment(), [
								child,
							]),
						);
						continue;
					}
					// IDEA: Maybe add a comment for incorrect child warning?
					// throw new ReferenceError('Incorrect child.');
				}

				attributes.push(
					t.objectProperty(
						t.identifier('children'),
						children.length === 1 && children[0]
							? children[0]
							: t.arrayExpression(children),
					),
				);
			}

			// NOTE: No arguments if the JSX element properties are empty.
			const _arguments = [];
			if (attributes.length > 0)
				_arguments.push(t.objectExpression(attributes));

			quasis.push('');
			expressions.push(
				t.callExpression(t.identifier(componentName), _arguments),
			);
		} else if (node.openingElement.name.type === 'JSXIdentifier') {
			// MARK: Open tag
			quasis[quasis.length - 1] += `<${node.openingElement.name.name}`;

			for (const attribute of node.openingElement.attributes) {
				if (
					attribute.type === 'JSXSpreadAttribute' &&
					attribute.argument.type === 'ObjectExpression'
				)
					for (const property of attribute.argument.properties)
						if (
							property.type === 'ObjectProperty' &&
							property.key.type === 'Identifier' &&
							t.isLiteral(property.value) &&
							'value' in property.value
						)
							quasis[quasis.length - 1] +=
								` ${property.key.name}="${property.value.value}"`;

				if ((attribute.type === 'JSXAttribute') === false) continue;

				if (attribute.name.type === 'JSXIdentifier') {
					// NOTE: Events binding

					if (
						attribute.name.name.startsWith(NAMESPACES.event) &&
						// NOTE: Ignore `onevent`, inline js events
						attribute.name.name.at(2) !==
							attribute.name.name.at(2)?.toLowerCase()
					)
						attribute.name.name = `@${attribute.name.name.toLowerCase().slice(NAMESPACES.event.length)}`;

					// NOTE: Attribute (as-is).
					quasis[quasis.length - 1] += `\n${attribute.name.name}`;

					if (attribute.value?.type === 'StringLiteral') {
						quasis[quasis.length - 1] += `="${attribute.value.value}"`;
					}
					if (
						attribute.value?.type === 'JSXExpressionContainer' &&
						t.isExpression(attribute.value.expression)
					) {
						quasis[quasis.length - 1] += `=`;
						quasis.push('');
						expressions.push(attribute.value.expression);
					}
				} else if (
					attribute.name.type === 'JSXNamespacedName' &&
					attribute.value?.type === 'JSXExpressionContainer' &&
					t.isExpression(attribute.value.expression)
				) {
					const prefix = attribute.name.namespace.name;
					const name = attribute.name.name.name;
					const expression = attribute.value.expression;

					// MARK: Reference directive
					if (
						attribute.name.namespace.name === NAMESPACES.useDirective &&
						attribute.name.name.name === SUB_NAMESPACES.reference
					) {
						quasis[quasis.length - 1] += `\n`;
						quasis.push('');
						expressions.push(
							t.callExpression(t.identifier(SUB_NAMESPACES.reference), [
								attribute.value.expression,
							]),
						);
						needImport.add('ref');
					}
					// MARK: style/class:map
					else if (
						(prefix === NAMESPACES.class || prefix === NAMESPACES.style) &&
						(name === SUB_NAMESPACES.map || name === SUB_NAMESPACES.list)
					) {
						quasis[quasis.length - 1] += `\n${prefix}=`;
						quasis.push('');
						const subNamespace = `${prefix}${name.slice(0, 1).toUpperCase() + name.slice(1)}`;
						const wrappedExpression = t.callExpression(
							t.identifier(subNamespace),
							[expression],
						);
						// IDEA: Injects `computed(() => expression)` for reactivity (not sure about that).
						/* if (litHtmlFlavor === 'signal')
							expressions.push(
								t.callExpression(t.identifier('computed'), [
									t.arrowFunctionExpression([], wrappedExpression),
								]),
							);
						else  */
						expressions.push(wrappedExpression);
						needImport.add(subNamespace as ImportName);
						// MARK: If defined condition
					} else if (prefix === NAMESPACES.ifDefined) {
						quasis[quasis.length - 1] += `\n${name}=`;
						quasis.push('');
						expressions.push(
							t.callExpression(t.identifier('ifDefined'), [expression]),
						);
						needImport.add('ifDefined');
						// MARK: Unsafe HTML/SVG
					} else if (
						prefix === NAMESPACES.unsafe &&
						name === SUB_NAMESPACES.html
					) {
						unsafeHtml = expression;
						needImport.add('unsafeHTML');
					} else if (prefix === NAMESPACES.unsafe && SUB_NAMESPACES.svg) {
						unsafeSvg = expression;
						needImport.add('unsafeSVG');
					} else
						switch (prefix) {
							// MARK: Event (binded)
							case NAMESPACES.event: {
								quasis[quasis.length - 1] += `\n@${name}=`;
								quasis.push('');
								expressions.push(expression);
								break;
							}
							// MARK: Property
							case NAMESPACES.property: {
								quasis[quasis.length - 1] += `\n.${name}=`;
								quasis.push('');
								expressions.push(expression);
								break;
							}
							// MARK: Attribute (JSON stringified).
							case NAMESPACES.attribute: {
								quasis[quasis.length - 1] += `\n${name}=`;
								quasis.push('');
								expressions.push(
									t.callExpression(
										t.memberExpression(
											t.identifier('JSON'),
											t.identifier('stringify'),
										),
										[expression],
									),
								);
								break;
							}
							// MARK: Boolean
							case NAMESPACES.boolean: {
								quasis[quasis.length - 1] += `\n?${name}=`;
								quasis.push('');
								expressions.push(
									t.callExpression(t.identifier('Boolean'), [expression]),
								);
								break;
							}
						}
				}
			}

			// MARK: Close tag
			quasis[quasis.length - 1] += `>`;
		}
	}

	if (isComponent === false && !unsafeHtml && !unsafeSvg)
		for (const child of node.children) {
			if (child.type === 'JSXText') {
				quasis[quasis.length - 1] += child.value;
			}
			if (
				child.type === 'JSXExpressionContainer' &&
				(child.expression.type === 'JSXEmptyExpression') === false
			) {
				expressions.push(child.expression);
				quasis.push('');
			}
			if (child.type === 'JSXElement')
				recurse(child, quasis, expressions, htmlFlavor, needImport);
		}
	else if (unsafeHtml) {
		expressions.push(
			t.callExpression(t.identifier('unsafeHTML'), [unsafeHtml]),
		);
		quasis.push('');
	} else if (unsafeSvg) {
		expressions.push(t.callExpression(t.identifier('unsafeSVG'), [unsafeSvg]));
		quasis.push('');
	}

	if (
		node.type === 'JSXElement' &&
		node.closingElement?.name.type === 'JSXIdentifier' &&
		isComponent === false &&
		node.closingElement.name.name !== COMPONENTS.For &&
		node.closingElement.name.name !== 'Fragment'
	)
		quasis[quasis.length - 1] += `</${node.closingElement.name.name}>`;
}

/**
 * @param _babel Babel instance, provided by the plugin loader.
 * @param options Plugin options.
 * @param options.autoImports Whether to auto import `html`, `ref`, `classMap` or `styleMap` if used.
 * @returns Babel plugin.
 */
export default function babelPluginJsxToLiterals(
	_babel?: typeof BabelCoreNamespace | undefined,
	options: PluginOptions = DEFAULT_PLUGIN_OPTIONS,
): BabelCoreNamespace.PluginObj {
	const alreadyImported = new Set<ImportName>();
	const needImport = new Set<ImportName>();

	let htmlFlavor: LitHtmlFlavor = 'default';

	// TODO: Refactor to object
	// const helpersImports = [
	// 	...(options?.additionalImports || []),
	// 	...DEFAULT_PLUGIN_OPTIONS.additionalImports,
	// ];
	const helpersImports =
		options?.additionalImports || DEFAULT_PLUGIN_OPTIONS.additionalImports;

	return {
		visitor: {
			// NOTE: Add default `classMap`,… if not already imported by user.
			ImportSpecifier: {
				enter(path) {
					if (options.autoImports === false) return;

					const name = path.node.local.name;
					for (const additionalImport of helpersImports)
						if (additionalImport.local === name) alreadyImported.add(name);
				},
			},

			DirectiveLiteral(path) {
				switch (path.node.value) {
					case 'use html-signal': {
						htmlFlavor = 'signal';
						path.node.value = '';
						break;
					}
					case 'use html-server': {
						htmlFlavor = 'server';
						path.node.value = '';
						break;
					}
				}
			},

			Program: {
				enter() {
					// NOTE: Resets.
					htmlFlavor = 'default';
					if (options.autoImports === false) return;
					alreadyImported.clear();
					needImport.clear();
					needImport.add('html');
				},
				exit(path) {
					if (options.autoImports === false) return;

					for (const toImport of helpersImports) {
						if (alreadyImported.has(toImport.local)) continue;
						if (needImport.has(toImport.local) === false) continue;

						const local = t.identifier(toImport.local);
						const imported = t.identifier(toImport.imported);
						const specifiers = [t.importSpecifier(local, imported)];
						const source = t.stringLiteral(
							toImport.local === 'html'
								? toImport.value[htmlFlavor]
								: toImport.value,
						);
						const nodes = t.importDeclaration(specifiers, source);

						path.unshiftContainer('body', nodes);
					}
				},
			},

			JSX(path) {
				// NOTE: Match root enclosing elements for further recursive processing.
				if (
					(path.node.type === 'JSXElement' ||
						path.node.type === 'JSXFragment') &&
					t.isJSX(path.parent) === false
				) {
					// NOTE: Need at least one quasi to match the number of expressions.
					const rawQuasis: string[] = [''];
					const expressions: (t.Expression | t.TSType)[] = [];

					try {
						// NOTE: Collect and transform JSX children to literals primitives.
						recurse(path.node, rawQuasis, expressions, htmlFlavor, needImport);
					} catch (error) {
						if (JsxToLiteralError.is(error)) {
							const childPath = path
								.get('children')
								.find((p) => p.node === error.node);
							throw (childPath || path).buildCodeFrameError(error.message);
						}
						throw path.buildCodeFrameError((error as Error).message);
					}

					// NOTE: Assemble quasis and expression into a template.
					const quasis: t.TemplateElement[] = [];
					for (const rawQuasi of rawQuasis)
						quasis.push(
							// NOTE: Literals breaks with backticks (`), we must escape them.
							t.templateElement({
								raw: rawQuasi.replaceAll('`', '\\`'),
							}),
						);

					// NOTE: Replace the JSX element with the root `html` tagged template.
					const tag = t.identifier('html');
					const quasi = t.templateLiteral(quasis, expressions);

					const replacementPath = t.taggedTemplateExpression(tag, quasi);
					// IDEA: Better for tree-shaking? Causes errors with Rollup for now.
					// t.addComment(replacementPath, 'leading', '#__PURE__');
					path.replaceWith(replacementPath);
				}
			},
		},
	};
}

export type { PluginOptions };

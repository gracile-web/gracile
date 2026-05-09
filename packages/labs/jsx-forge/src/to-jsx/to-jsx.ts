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
	const regularEventMap: Record<string, string> = {
		abort: 'Abort',
		animationend: 'AnimationEnd',
		animationiteration: 'AnimationIteration',
		animationstart: 'AnimationStart',
		blur: 'Blur',
		change: 'Change',
		click: 'Click',
		compositionend: 'CompositionEnd',
		compositionstart: 'CompositionStart',
		compositionupdate: 'CompositionUpdate',
		contextmenu: 'ContextMenu',
		copy: 'Copy',
		cut: 'Cut',
		drag: 'Drag',
		dragend: 'DragEnd',
		dragenter: 'DragEnter',
		dragexit: 'DragExit',
		dragleave: 'DragLeave',
		dragover: 'DragOver',
		dragstart: 'DragStart',
		drop: 'Drop',
		error: 'Error',
		focus: 'Focus',
		input: 'Input',
		invalid: 'Invalid',
		keydown: 'KeyDown',
		keypress: 'KeyPress',
		keyup: 'KeyUp',
		load: 'Load',
		mousedown: 'MouseDown',
		mouseenter: 'MouseEnter',
		mouseleave: 'MouseLeave',
		mousemove: 'MouseMove',
		mouseout: 'MouseOut',
		mouseover: 'MouseOver',
		mouseup: 'MouseUp',
		paste: 'Paste',
		pause: 'Pause',
		play: 'Play',
		playing: 'Playing',
		pointercancel: 'PointerCancel',
		pointerdown: 'PointerDown',
		pointerenter: 'PointerEnter',
		pointerleave: 'PointerLeave',
		pointermove: 'PointerMove',
		pointerout: 'PointerOut',
		pointerover: 'PointerOver',
		pointerup: 'PointerUp',
		reset: 'Reset',
		resize: 'Resize',
		scroll: 'Scroll',
		select: 'Select',
		submit: 'Submit',
		toggle: 'Toggle',
		touchcancel: 'TouchCancel',
		touchend: 'TouchEnd',
		touchmove: 'TouchMove',
		touchstart: 'TouchStart',
		transitionend: 'TransitionEnd',
		wheel: 'Wheel',
	};
	const specialEventMap: Record<string, { others: string; react: string }> = {
		dblclick: { others: 'DblClick', react: 'DoubleClick' },
		// React normalizes focus bubbling — onFocusIn/onFocusOut are not valid React events
		focusin: { others: 'FocusIn', react: 'Focus' },
		focusout: { others: 'FocusOut', react: 'Blur' },
	};
	const attributesMap: Record<string, string> = {
		// HTML → React attribute renames (applies for all frameworks)
		class: 'className',
		for: 'htmlFor',
		// Hyphenated HTML attributes
		'accept-charset': 'acceptCharset',
		// HTML case → React camelCase
		accesskey: 'accessKey',
		autocomplete: 'autoComplete',
		autofocus: 'autoFocus',
		autoplay: 'autoPlay',
		colspan: 'colSpan',
		contenteditable: 'contentEditable',
		crossorigin: 'crossOrigin',
		datetime: 'dateTime',
		enctype: 'encType',
		formaction: 'formAction',
		formenctype: 'formEncType',
		formmethod: 'formMethod',
		formnovalidate: 'formNoValidate',
		formtarget: 'formTarget',
		frameborder: 'frameBorder',
		inputmode: 'inputMode',
		maxlength: 'maxLength',
		minlength: 'minLength',
		novalidate: 'noValidate',
		readonly: 'readOnly',
		rowspan: 'rowSpan',
		spellcheck: 'spellCheck',
		srcdoc: 'srcDoc',
		srcset: 'srcSet',
		tabindex: 'tabIndex',
		usemap: 'useMap',
	};

	return (context) => {
		let needsFragmentImport = false;

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

			// <for:each key={expr}> … </for:each> → <Fragment key={expr}> … </Fragment>
			if (
				ts.isJsxElement(node) &&
				ts.isJsxNamespacedName(node.openingElement.tagName) &&
				node.openingElement.tagName.namespace.text === 'for' &&
				node.openingElement.tagName.name.text === 'each'
			) {
				if (framework === 'react' || framework === 'preact') {
					needsFragmentImport = true;
				}
				// Visit children first so nested transforms are applied
				const visited = ts.visitEachChild(
					node,
					visitor,
					context,
				) as Ts.JsxElement;
				const fragmentTag = factory.createIdentifier('Fragment');
				return factory.updateJsxElement(
					visited,
					factory.updateJsxOpeningElement(
						visited.openingElement,
						fragmentTag,
						visited.openingElement.typeArguments,
						visited.openingElement.attributes,
					),
					visited.children,
					factory.updateJsxClosingElement(visited.closingElement, fragmentTag),
				);
			}

			// Namespaced attributes: prop:xxx, on:click, etc.
			if (ts.isJsxAttribute(node)) {
				if (ts.isJsxNamespacedName(node.name)) {
					const { name, namespace } = node.name;

					let newName: string | undefined;

					switch (namespace.text) {
						case 'attr':
						case 'for':
						case 'if': {
							// Pass attribute name through; rename for React/Preact (className etc.)
							const mapped = ['react', 'preact'].includes(framework)
								? attributesMap[name.text as keyof typeof attributesMap]
								: undefined;
							newName = mapped ?? name.text;
							break;
						}
						case 'bool':
						case '_':
						case 'prop': {
							// Strip prefix; rename for React/Preact (className etc.).
							// Solid/Vue are HTML-native: class, for, tabindex stay as-is.
							const mapped = ['react', 'preact'].includes(framework)
								? attributesMap[name.text as keyof typeof attributesMap]
								: undefined;
							newName = mapped ?? name.text;
							break;
						}
						case 'use': {
							const mapped = ['react', 'preact'].includes(framework)
								? attributesMap[name.text as keyof typeof attributesMap]
								: undefined;
							newName = mapped ?? name.text;
							break;
						}
						case 'on': {
							const key = name.text;
							const specialEntry =
								specialEventMap[key as keyof typeof specialEventMap];
							const capitalized = specialEntry
								? specialEntry[framework === 'react' ? 'react' : 'others']
								: (regularEventMap[key] ??
									key.charAt(0).toUpperCase() + key.slice(1));
							newName = `on${capitalized}`;
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
					// Rename bare HTML attrs (e.g. class → className) only for React/Preact.
					// Solid and Vue are HTML-native and use the original attribute names.
					if (!['react', 'preact'].includes(framework))
						return ts.visitEachChild(node, visitor, context);
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
			// Handles both self-closing (<input />) and open/close (<select>, <textarea>).
			const isControlledTag =
				framework === 'react' &&
				((ts.isJsxSelfClosingElement(node) &&
					ts.isIdentifier(node.tagName) &&
					['input', 'select', 'textarea'].includes(node.tagName.text)) ||
					(ts.isJsxElement(node) &&
						ts.isIdentifier(node.openingElement.tagName) &&
						['select', 'textarea'].includes(node.openingElement.tagName.text)));

			if (isControlledTag) {
				const attrs = ts.isJsxSelfClosingElement(node)
					? node.attributes
					: (node as Ts.JsxElement).openingElement.attributes;

				let hasValue = false;
				let hasChecked = false;
				let hasOnChange = false;

				const newProperties = attrs.properties.map((attribute) => {
					// First: run namespace-rewriting visitor on this attribute
					const visited = ts.visitNode(
						attribute,
						visitor,
					) as Ts.JsxAttributeLike;
					if (!ts.isJsxAttribute(visited)) return visited;

					if (
						visited.name.text === 'value' &&
						ts.isJsxExpression(visited.initializer)
					) {
						hasValue = true;
						return factory.updateJsxAttribute(
							visited,
							visited.name,
							factory.createJsxExpression(
								undefined,
								factory.createBinaryExpression(
									visited.initializer.expression!,
									ts.SyntaxKind.QuestionQuestionToken,
									factory.createStringLiteral(''),
								),
							),
						);
					}
					if (visited.name.text === 'checked') {
						hasChecked = true;
					}
					if (visited.name.text === 'onChange') {
						hasOnChange = true;
					}
					return visited;
				});

				if ((hasValue || hasChecked) && !hasOnChange) {
					newProperties.push(
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

				const newAttrs = factory.createJsxAttributes(newProperties);

				if (ts.isJsxSelfClosingElement(node)) {
					return factory.updateJsxSelfClosingElement(
						node,
						node.tagName,
						node.typeArguments,
						newAttrs,
					);
				} else {
					const el = node as Ts.JsxElement;
					const visitedChildren = ts.visitNodes(el.children, visitor);
					return factory.updateJsxElement(
						el,
						factory.updateJsxOpeningElement(
							el.openingElement,
							el.openingElement.tagName,
							el.openingElement.typeArguments,
							newAttrs,
						),
						visitedChildren,
						el.closingElement,
					);
				}
			}

			// Rewrite '$:children' destructuring binding → 'children'
			// e.g. function Fieldset({ '$:children': children, options }) {}
			// React passes children as props.children (key = 'children'), not '$:children'.
			if (
				ts.isBindingElement(node) &&
				['preact', 'react', 'solid'].includes(framework) &&
				node.propertyName &&
				ts.isStringLiteral(node.propertyName) &&
				node.propertyName.text === '$:children'
			) {
				return factory.updateBindingElement(
					node,
					node.dotDotDotToken,
					undefined, // drop the '$:children' key alias — key is now the local name
					factory.createIdentifier('children'),
					node.initializer,
				);
			}

			// Rewrite '$:children' in type-literal property signatures → children
			// e.g. { '$:children': TemplateResult } → { children: ReactNode }
			if (
				ts.isPropertySignature(node) &&
				['preact', 'react', 'solid'].includes(framework) &&
				ts.isStringLiteral(node.name) &&
				node.name.text === '$:children'
			) {
				return factory.updatePropertySignature(
					node,
					node.modifiers,
					factory.createIdentifier('children'),
					node.questionToken,
					node.type,
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
			// Reset per-file flag
			needsFragmentImport = false;

			const visited = ts.visitNode(sourceFile, visitor);
			if (!visited || !ts.isSourceFile(visited)) return sourceFile;

			// Inject `import { Fragment } from 'react'` (or 'preact') when
			// a for:each was rewritten to <Fragment> and no import exists yet.
			if (
				needsFragmentImport &&
				(framework === 'react' || framework === 'preact')
			) {
				// Check whether 'Fragment' is already imported from the target framework
				const alreadyImported = visited.statements.some(
					(stmt) =>
						ts.isImportDeclaration(stmt) &&
						ts.isStringLiteral(stmt.moduleSpecifier) &&
						stmt.moduleSpecifier.text === framework &&
						stmt.importClause?.namedBindings &&
						ts.isNamedImports(stmt.importClause.namedBindings) &&
						stmt.importClause.namedBindings.elements.some(
							(el) => el.name.text === 'Fragment',
						),
				);

				if (!alreadyImported) {
					const fragmentImport = factory.createImportDeclaration(
						undefined, // modifiers
						factory.createImportClause(
							false,
							undefined,
							factory.createNamedImports([
								factory.createImportSpecifier(
									false,
									undefined,
									factory.createIdentifier('Fragment'),
								),
							]),
						),
						factory.createStringLiteral(framework),
					);
					return factory.updateSourceFile(visited, [
						fragmentImport,
						...visited.statements,
					]);
				}
			}

			return visited;
		};
	};
}

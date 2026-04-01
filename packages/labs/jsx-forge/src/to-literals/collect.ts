import type { Ts } from '../types.js';

import type { Context, RecurseFlags } from './types.js';
import { handlePascalCasedComponent } from './component.js';
import { handleTag } from './html-tag.js';

export function collectLiteralEntitiesInJsx(
	node: Ts.JsxElement | Ts.JsxFragment | Ts.JsxSelfClosingElement,
	context: Context,
): void {
	const { appendExpressionToCurrentLiteral, ts } = context;

	const isJsxElementLike =
		ts.isJsxElement(node) || ts.isJsxSelfClosingElement(node);

	const flags: RecurseFlags = {
		bodyReplacement: undefined,
		closingTag: undefined,
		isComponent: false,
		isLiteralSelector: false,
		skipBody: false,
	};

	if (isJsxElementLike) handleJsxElement(context, node, flags);

	const {
		bodyReplacement,
		closingTag,
		isComponent,
		isLiteralSelector,
		skipBody,
	} = flags;

	if (bodyReplacement) {
		appendExpressionToCurrentLiteral(bodyReplacement);
	} else if (!isComponent && !isLiteralSelector && !skipBody) {
		node.forEachChild((childNode) => handleChild(context, childNode));
	}

	if (isJsxElementLike && !isLiteralSelector && !isComponent && closingTag)
		closingTag();
}

function handleChild(context: Context, childNode: Ts.Node): void {
	const {
		appendExpressionToCurrentLiteral,
		appendStaticToCurrentLiteral,
		ts,
		visitNode,
	} = context;
	const isEmptyChildrenExpression =
		ts.isJsxExpression(childNode) && !childNode.expression;

	const isElementLike =
		ts.isJsxElement(childNode) || ts.isJsxSelfClosingElement(childNode);

	const isExpression = ts.isJsxExpression(childNode) && childNode.expression;

	const isText = ts.isJsxText(childNode);

	if (isExpression) {
		const isElementOrFragmentLike =
			ts.isJsxElement(childNode.expression) ||
			ts.isJsxFragment(childNode.expression) ||
			ts.isJsxSelfClosingElement(childNode.expression);

		if (isElementOrFragmentLike) {
			collectLiteralEntitiesInJsx(childNode.expression, context);
		} else {
			const visited = visitNode(childNode.expression);

			appendExpressionToCurrentLiteral(visited);
		}
	} else if (isElementLike) {
		collectLiteralEntitiesInJsx(childNode, context);
	} else if (isText) {
		const text = cleanJsxText(childNode.text);
		if (text.length > 0) appendStaticToCurrentLiteral(text);
	} else if (isEmptyChildrenExpression) {
		handleHtmlComment(context, childNode);
	}
}

function handleHtmlComment(
	context: Context,
	childNode: Ts.JsxExpression,
): void {
	const { appendStaticToCurrentLiteral } = context;
	const match = /^{\s*\/\*\s*<!--([\S\s]*?)-->\s*\*\/\s*}$/.exec(
		childNode.getText(),
	);
	const htmlComment = match?.[1];

	if (htmlComment)
		// FIXME:
		appendStaticToCurrentLiteral(`<!--${htmlComment}-->`);
}

function handleJsxElement(
	context: Context,
	node: Ts.JsxElement | Ts.JsxSelfClosingElement,
	flags: RecurseFlags,
): void {
	const {
		appendExpressionToCurrentLiteral,
		globalFlags: flavor,
		preset,
		ts,
		visitNode,
	} = context;
	const { factory } = ts;

	const jsxElement = ts.isJsxSelfClosingElement(node)
		? node
		: node.openingElement;
	const openingTagName = jsxElement.tagName.getText();

	const lastPartOfCompoundName =
		openingTagName.split('.').at(-1) ?? openingTagName;

	const customLiteralTagDirective =
		openingTagName.startsWith('use:') &&
		ts.isJsxElement(node) &&
		openingTagName.split(':').at(1);

	const isPascalCasedComponent =
		lastPartOfCompoundName.at(0) !==
			lastPartOfCompoundName.toLowerCase().at(0) &&
		ts.isExpression(jsxElement.tagName);

	if (
		customLiteralTagDirective &&
		customLiteralTagDirective in preset.useLiteral
	) {
		flags.isLiteralSelector = true;
		const previousFlavorType = flavor.literalFlavor;
		flavor.literalFlavor = customLiteralTagDirective;

		const visited = visitNode(
			factory.createJsxFragment(
				factory.createJsxOpeningFragment(),
				node.children,
				factory.createJsxJsxClosingFragment(),
			),
		);
		appendExpressionToCurrentLiteral(visited);

		flavor.literalFlavor = previousFlavorType;
	} else if (isPascalCasedComponent) {
		flags.isComponent = true;

		handlePascalCasedComponent(context, node, jsxElement.tagName);
	} else {
		const tag = handleTag(context, openingTagName, jsxElement.attributes);
		flags.bodyReplacement = tag.bodyReplacement;
		flags.closingTag = tag.closingTag;
		flags.skipBody = tag.skipBody ?? false;
	}
}

/**
 * Replicate the standard JSX text whitespace cleanup algorithm.
 *
 * - Each line's indentation is collapsed, but significant spaces adjacent
 *   to sibling inline elements are preserved (e.g. `"in "` before `<strong>`).
 * - Whitespace-only text nodes become empty strings (caller skips them).
 */
function cleanJsxText(raw: string): string {
	const lines = raw.split(/\r\n|\n|\r/);

	let result = '';

	for (let i = 0; i < lines.length; i++) {
		const isFirstLine = i === 0;
		const isLastLine = i === lines.length - 1;

		// Normalize tabs → spaces (same as Babel)
		let line = lines[i]!.replaceAll('\t', ' ');

		// Trim leading whitespace on every line except the first
		// (the first line's leading content may be glued to a preceding sibling).
		if (!isFirstLine) line = line.trimStart();

		// Trim trailing whitespace on every line except the last
		// (the last line's trailing content may be glued to a following sibling).
		if (!isLastLine) line = line.trimEnd();

		if (line) {
			// Lines after the first non-empty line are separated by a single space
			// (replaces the newline that was between them).
			if (!isFirstLine) result += ' ';
			result += line;
		}
	}

	return result;
}

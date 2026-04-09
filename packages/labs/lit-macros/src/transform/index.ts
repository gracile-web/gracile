import MagicString from 'magic-string';

import type { ParseSync, VisitorClass } from '../resolve-deps.js';

import {
	HANDLED_DECORATORS,
	LIT_DECORATORS_RE,
	QUERY_DECORATORS,
	QUICK_CHECK_RE,
} from './constants.js';
import { buildQueryGetter } from './query-builders.js';
import {
	detectMemberIndent,
	firstDecoratorStart,
	removeDecoratorRange,
	removeFieldMember,
	removeFullLine,
	replaceFullMember,
} from './source-edits.js';
import type {
	ClassEdit,
	ImportRecord,
	TransformOptions,
	TransformResult,
} from './types.js';

export type { TransformOptions, TransformResult } from './types.js';

// ---------------------------------------------------------------------------
// Core transform
// ---------------------------------------------------------------------------

/* eslint-disable @typescript-eslint/no-explicit-any */

export function transformLitMacros(
	source: string,
	parseSync: ParseSync,
	Visitor: VisitorClass,
	options: TransformOptions = {},
): TransformResult | null {
	if (!QUICK_CHECK_RE.test(source)) return null;

	const result = parseSync(options.sourceFileName ?? 'file.ts', source);
	const s = new MagicString(source);
	let changed = false;

	// ── Import tracking ───────────────────────────────────────────────

	/** local binding name → imported name (e.g. 'prop' → 'property') */
	const litBindings = new Map<string, string>();
	const consumedBindings = new Set<string>();
	const litImportDecls: ImportRecord[] = [];

	// ── Per-class collected edits ─────────────────────────────────────

	const classEdits: ClassEdit[] = [];

	// ── Visitor ───────────────────────────────────────────────────────

	function processClass(node: any): void {
		const className: string | undefined = node.id?.name;
		if (!className) return;

		const edit: ClassEdit = {
			className,
			classEnd: node.end,
			bodyStart: node.body.start,
			bodyMembers: node.body?.body ?? [],
			properties: [],
			decoratorsToRemove: [],
			fieldRemovals: [],
			constructorInits: [],
			getterReplacements: [],
		};

		// ── Class-level decorators (@customElement) ───────────────────
		for (const dec of node.decorators ?? []) {
			const info = resolveDecorator(dec);
			if (info.importedName !== 'customElement') continue;

			if (info.callExpression) {
				const argument = info.callExpression.arguments?.[0];
				if (argument && typeof argument.value === 'string' && argument.value) {
					edit.defineTag = argument.value;
					edit.decoratorsToRemove.push({
						start: dec.start,
						end: dec.end,
					});
					if (info.localName) consumedBindings.add(info.localName);
				}
			}
		}

		// ── Member-level decorators (@property, @state, queries) ──────
		for (const member of edit.bodyMembers) {
			const isAccessor = member.type === 'AccessorProperty';
			const isPropertyDef = member.type === 'PropertyDefinition';
			if (!isAccessor && !isPropertyDef) continue;
			if (member.computed || member.static) continue;

			const fieldName: string | undefined = member.key?.name;
			if (!fieldName) continue;

			let handledDecorator = false;

			for (const dec of member.decorators ?? []) {
				const info = resolveDecorator(dec);
				if (!info.importedName) continue;

				if (info.importedName === 'property') {
					let optionsText = '{}';
					if (info.callExpression) {
						const argument = info.callExpression.arguments?.[0];
						optionsText = argument
							? source.slice(argument.start, argument.end)
							: '{}';
					}

					edit.properties.push({ name: fieldName, options: optionsText });
					if (info.localName) consumedBindings.add(info.localName);
					handledDecorator = true;
				} else if (info.importedName === 'state') {
					let optionsText = '{state: true}';
					if (info.callExpression) {
						const argument = info.callExpression.arguments?.[0];
						if (argument && argument.type === 'ObjectExpression') {
							// Filter out any user-supplied `state` key, then force state: true
							const otherProps = (argument.properties ?? [])
								.filter(
									(p: any) =>
										!(p.key?.name === 'state' || p.key?.value === 'state'),
								)
								.map((p: any) => source.slice(p.start, p.end));
							optionsText =
								otherProps.length > 0
									? `{state: true, ${otherProps.join(', ')}}`
									: '{state: true}';
						}
					}

					edit.properties.push({ name: fieldName, options: optionsText });
					if (info.localName) consumedBindings.add(info.localName);
					handledDecorator = true;
				}
			}

			// Remove the entire field and relocate initializer to constructor.
			if (handledDecorator) {
				const memberStart = firstDecoratorStart(member);
				edit.fieldRemovals.push({ start: memberStart, end: member.end });
				if (member.value) {
					edit.constructorInits.push({
						name: fieldName,
						initText: source.slice(member.value.start, member.value.end),
					});
				}
			}

			// ── Query decorators → getter replacement ─────────────────
			if (!handledDecorator) {
				for (const dec of member.decorators ?? []) {
					const info = resolveDecorator(dec);
					if (!info.importedName || !QUERY_DECORATORS.has(info.importedName))
						continue;

					const indent = detectMemberIndent(
						source,
						edit.bodyStart,
						edit.bodyMembers,
					);
					const getter = buildQueryGetter(
						info.importedName,
						fieldName,
						info.callExpression,
						indent,
					);
					if (!getter) continue;

					const memberStart = firstDecoratorStart(member);
					edit.getterReplacements.push({
						memberStart,
						memberEnd: member.end,
						getterCode: getter,
					});
					if (info.localName) consumedBindings.add(info.localName);
				}
			}
		}

		// ── Find existing constructor for initializer insertion ────────
		if (edit.constructorInits.length > 0) {
			for (const member of edit.bodyMembers) {
				if (
					member.type === 'MethodDefinition' &&
					member.kind === 'constructor'
				) {
					const body = member.value?.body;
					for (const stmt of body?.body ?? []) {
						if (
							stmt.type === 'ExpressionStatement' &&
							stmt.expression?.type === 'CallExpression' &&
							stmt.expression?.callee?.type === 'Super'
						) {
							edit.constructorInfo = { superCallEnd: stmt.end };
							break;
						}
					}
					break;
				}
			}
		}

		if (
			edit.defineTag ||
			edit.properties.length > 0 ||
			edit.getterReplacements.length > 0
		) {
			classEdits.push(edit);
		}
	}

	function resolveDecorator(dec: any): {
		callExpression: any | null;
		importedName: string | null;
		localName: string | null;
	} {
		const expression = dec.expression;
		if (!expression)
			return { callExpression: null, importedName: null, localName: null };

		// @decorator() — CallExpression wrapping an Identifier
		if (expression.type === 'CallExpression') {
			const name: string | undefined = expression.callee?.name;
			const imported = name ? (litBindings.get(name) ?? null) : null;
			return {
				callExpression: expression,
				importedName: imported,
				localName: name ?? null,
			};
		}

		// @decorator — bare Identifier (no call)
		if (expression.type === 'Identifier') {
			const imported = litBindings.get(expression.name) ?? null;
			return {
				callExpression: null,
				importedName: imported,
				localName: expression.name ?? null,
			};
		}

		return { callExpression: null, importedName: null, localName: null };
	}

	const visitor = new Visitor({
		ImportDeclaration(node: any): void {
			const source_: string | undefined = node.source?.value;
			if (!source_ || !LIT_DECORATORS_RE.test(source_)) return;

			litImportDecls.push({
				start: node.start,
				end: node.end,
				specifiers: node.specifiers ?? [],
			});

			for (const spec of node.specifiers ?? []) {
				if (spec.type !== 'ImportSpecifier') continue;
				const imported: string | undefined =
					spec.imported?.name ?? spec.local?.name;
				const local: string | undefined = spec.local?.name;
				if (imported && local && HANDLED_DECORATORS.has(imported)) {
					litBindings.set(local, imported);
				}
			}
		},

		ClassDeclaration(node: any): void {
			processClass(node);
		},
		ClassExpression(node: any): void {
			processClass(node);
		},
	});

	visitor.visit(result.program);

	// ── Apply edits ───────────────────────────────────────────────────

	for (const edit of classEdits) {
		for (const range of edit.decoratorsToRemove) {
			removeDecoratorRange(s, source, range.start, range.end);
			changed = true;
		}

		for (const field of edit.fieldRemovals) {
			removeFieldMember(s, source, field.start, field.end);
			changed = true;
		}

		for (const rep of edit.getterReplacements) {
			replaceFullMember(
				s,
				source,
				rep.memberStart,
				rep.memberEnd,
				rep.getterCode,
			);
			changed = true;
		}

		if (edit.properties.length > 0) {
			const indent = detectMemberIndent(
				source,
				edit.bodyStart,
				edit.bodyMembers,
			);
			const entryIndent = indent + indent;

			const entries = edit.properties
				.map((p) => `${entryIndent}${p.name}: ${p.options},`)
				.join('\n');

			s.appendRight(
				edit.bodyStart + 1,
				`\n${indent}static properties = {\n${entries}\n${indent}};\n`,
			);
			changed = true;
		}

		if (edit.constructorInits.length > 0) {
			const indent = detectMemberIndent(
				source,
				edit.bodyStart,
				edit.bodyMembers,
			);
			const innerIndent = indent + indent;
			const assignments = edit.constructorInits
				.map((init) => `${innerIndent}this.${init.name} = ${init.initText};`)
				.join('\n');

			if (edit.constructorInfo) {
				s.appendRight(edit.constructorInfo.superCallEnd, '\n' + assignments);
			} else {
				const hasConstructor = edit.bodyMembers.some(
					(m: any) => m.type === 'MethodDefinition' && m.kind === 'constructor',
				);
				if (!hasConstructor) {
					s.appendRight(
						edit.bodyStart + 1,
						`\n${indent}constructor() {\n${innerIndent}super();\n${assignments}\n${indent}}\n`,
					);
				}
			}
			changed = true;
		}

		if (edit.defineTag) {
			s.appendRight(
				edit.classEnd,
				`\ncustomElements.define('${edit.defineTag}', ${edit.className});\n`,
			);
			changed = true;
		}
	}

	// ── Remove fully-consumed imports ─────────────────────────────────

	for (const decl of litImportDecls) {
		if (decl.specifiers.length === 0) continue;
		const allConsumed = decl.specifiers.every((sp: any) => {
			if (sp.type !== 'ImportSpecifier') return false;
			return consumedBindings.has(sp.local?.name ?? '');
		});
		if (allConsumed) {
			removeFullLine(s, source, decl.start, decl.end);
			changed = true;
		}
	}

	if (!changed) return null;

	return {
		code: s.toString(),
		map: s.generateMap({
			hires: true,
			...(options.sourceFileName ? { source: options.sourceFileName } : {}),
		}),
	};
}

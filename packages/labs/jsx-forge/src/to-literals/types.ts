import type { PluginConfig } from 'ts-patch';

import type { Ts, TsWithInternals } from '../types.js';

export type BuiltinTypeKind =
	| 'any'
	| 'bigint'
	| 'boolean'
	// | 'unknown'
	| 'never'
	| 'nonNullable'
	| 'null'
	| 'number'
	| 'string'
	| 'symbol'
	| 'undefined'
	// | 'nullable'
	| 'void';

export interface Context {
	appendExpressionToCurrentLiteral: (expression: Ts.Expression) => void;
	appendStaticToCurrentLiteral: (text: string) => void;
	globalFlags: { literalFlavor: string };
	imports: Map<string, Import>;
	preset: Preset;
	program: Ts.Program;
	ts: TsWithInternals;
	visitNode: <T extends Ts.Node>(expression: T) => T;
}

export interface Import {
	as: string;
	name: string;
	path: string;
}

export interface Preset {
	antiCollisionImportPrefix?: string | undefined;
	attributes: PresetAttribute[];

	children: {
		keyName: string;
	};

	forEach: {
		addImports: Import[];
		keyNameAttributeName: string;
		keyNameAttributeNameOnAnyElement: string;
		tagName: string;
	};

	importRemap?: Record<string, string>;

	useLiteral: {
		default: Import[];
		server?: Import[];
		signal?: Import[];
		svg?: Import[];
	};

	virtualElements: {
		addImports: Import[];

		arguments: string[];
		tagName: string;
		valueFunctionWrapper: {
			name: string;
		};
	}[];
}

export interface PresetAttribute {
	do: {
		addImports?: Import[];
		addPrefix?: string;
		insertExpression?: {
			cast?: string;
			inBody?: boolean;
			inPlace?: boolean;
			valueFunctionWrapper: {
				name: string;
			};
		};
		removeNamespace?: boolean;

		renameTo?: string;
	};

	when: {
		name?: string;
		namespace?: null | string;
		type?: {
			isAssignableTo: BuiltinTypeKind;
			// {
			// 	anyOf: (
			// 	)[];
			// };
		};
	};
}

export interface RecurseFlags {
	bodyReplacement: Ts.Expression | undefined;
	closingTag: (() => void) | undefined;
	isComponent: boolean;
	isLiteralSelector: boolean;
	skipBody: boolean;
}

import type { PluginConfig } from 'ts-patch';
import type * as Ts from 'typescript';

export type TransformerPluginConfig = PluginConfig & {
	transformOptions?: { target: 'lit' | 'preact' | 'react' | 'vue' };
};

// @ts-expect-error It's fine.
export type * as Ts from 'typescript';

export type TsWithInternals = typeof Ts & {
	isIdentifierText: (
		name: string,
		languageVersion?: Ts.ScriptTarget,
		identifierVariant?: Ts.LanguageVariant,
	) => boolean;
};

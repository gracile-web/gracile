import type { TransformerExtras } from 'ts-patch';
import type * as Ts from 'typescript';

import type { TransformerPluginConfig, TsWithInternals } from './types.js';
import { createMetaJsxTransformer } from './to-jsx/to-jsx.js';
import {
	createJsxToLiteralsTransformer,
	type TransformerOptions,
} from './to-literals/to-literals.js';

export default function transformTest(
	program: Ts.Program,
	pluginConfig: TransformerPluginConfig & TransformerOptions,
	{ ts: tsInstance }: TransformerExtras,
): Ts.TransformerFactory<Ts.SourceFile> {
	const target = pluginConfig.target ?? pluginConfig.transformOptions?.target;

	if (!target || target === 'lit') {
		return createJsxToLiteralsTransformer(
			tsInstance as unknown as TsWithInternals,
			program,
			pluginConfig,
		);
	}
	return createMetaJsxTransformer(
		tsInstance as unknown as typeof Ts,
		program,
		pluginConfig,
	);
}

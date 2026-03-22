import type { PluginConfig } from 'ts-patch';
import type * as Ts from 'typescript';
import { compileLitTemplates } from '@lit-labs/compiler';

export default function transformTest(
	// eslint-disable-next-line @typescript-eslint/no-unused-vars
	_program: Ts.Program,
	// eslint-disable-next-line @typescript-eslint/no-unused-vars
	_pluginConfig: PluginConfig,
) {
	return compileLitTemplates();
}

import type { PluginConfig } from 'ts-patch';
import type * as Ts from 'typescript';
import { compileLitTemplates } from '@lit-labs/compiler';

export default function transformTest(
	_program: Ts.Program,
	_pluginConfig: PluginConfig,
) {
	return compileLitTemplates();
}

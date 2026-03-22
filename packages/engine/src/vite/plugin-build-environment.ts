/**
 * Vite plugin: build environment configuration.
 *
 * Owns all Environment API concerns for builds:
 * - Top-level config: `builder.sharedConfigBuild`, `ssr.external` (server mode)
 * - `configEnvironment('client')`: rollupOptions.input, outDir
 * - `configEnvironment('ssr')`: outDir, SSR-specific build options, rollupOptions
 * - `buildApp()`: orchestrates build order (client-only or client → SSR)
 *
 * `rollupOptions.input` must be set via `configEnvironment` (not the
 * top-level `config` hook) because `builder.build(env)` uses
 * environment-resolved config, not the top-level config.
 *
 * @internal
 */

import { join } from 'node:path';

import type { PluginOption, ViteBuilder } from 'vite';

import type { PluginSharedState } from './plugin-shared-state.js';

export function gracileBuildEnvironmentPlugin({
	state,
}: {
	state: PluginSharedState;
}): PluginOption {
	const isServerMode = state.outputMode === 'server';

	return {
		name: 'vite-plugin-gracile-build-env',
		apply: 'build',

		config() {
			return {
				...(isServerMode ? { ssr: { external: ['@gracile/gracile'] } } : {}),
				builder: { sharedConfigBuild: true },
			};
		},

		configEnvironment(name, config) {
			if (name === 'client') {
				if (!state.clientBuildInputList) return null;

				return {
					build: {
						rollupOptions: {
							input: state.clientBuildInputList,
						},
						outDir: join(
							config.build?.outDir || 'dist',
							isServerMode ? 'client' : '',
						),
					},
				};
			}

			if (name === 'ssr' && isServerMode) {
				return {
					build: {
						outDir: 'dist/server',
						copyPublicDir: false,
						ssrEmitAssets: true,
						cssMinify: true,
						cssCodeSplit: true,

						rollupOptions: {
							input: 'entrypoint.js',

							output: {
								entryFileNames: '[name].js',
								assetFileNames: (chunkInfo) => {
									if (chunkInfo.name) {
										const fileName = state.clientAssets[chunkInfo.name];
										if (fileName) return fileName;
										return `assets/${chunkInfo.name.replace(/\.(.*)$/, '')}-[hash].[ext]`;
									}
									return 'assets/[name]-[hash].[ext]';
								},
								chunkFileNames: 'chunk/[name].js',
							},
						},
					},
				};
			}

			return null;
		},

		async buildApp(builder: ViteBuilder) {
			const client = builder.environments['client'];
			if (!client) throw new Error('Missing client build environment.');

			await builder.build(client);

			if (isServerMode) {
				const ssr = builder.environments['ssr'];
				if (!ssr) throw new Error('Missing ssr build environment.');
				await builder.build(ssr);
			}
		},
	};
}

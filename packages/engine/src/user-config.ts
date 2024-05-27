import type { UserConfig } from 'vite';

export class GracileConfig {
	port?: number;

	/**
	 * Root directory for the project
	 */
	root?: string;

	/**
	 * @defaultValue 'static'
	 */
	output?: 'static' | 'server';

	vite?: UserConfig;

	server?: {
		entrypoint?: string;
	};

	constructor(options: GracileConfig) {
		Object.assign(this, options);
	}
}

export function defineConfig(
	options: GracileConfig,
): (ConfigClass: typeof GracileConfig) => GracileConfig {
	return (ConfigClass: typeof GracileConfig) => new ConfigClass(options);
}

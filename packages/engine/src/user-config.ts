import type { UserConfig } from 'vite';

export class GracileConfig {
	port?: number;

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

export function defineConfig(options: GracileConfig) {
	return (ConfigClass: typeof GracileConfig) => new ConfigClass(options);
}

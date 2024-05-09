import type { UserConfig } from 'vite';

export class GracileConfig {
	port?: number;

	vite?: UserConfig;

	constructor(options: GracileConfig) {
		Object.assign(this, options);
	}
}

export function defineConfig(options: GracileConfig) {
	return (ConfigClass: typeof GracileConfig) => new ConfigClass(options);
}

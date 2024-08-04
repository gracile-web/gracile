import type { Connect } from 'vite';

export interface GracileConfig {
	/**
	 * @defaultValue 'static'
	 */
	output?: 'static' | 'server';

	dev?: {
		locals?: (context: { nodeRequest: Connect.IncomingMessage }) => unknown;
	};

	routes?: {
		exclude?: string[];
	};
}

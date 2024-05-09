import { createServer, preview } from 'vite';

import { getConfigs } from './config.js';

// NOTE: Can be used for dev. and for assisting build
export async function createViteServer(root: string, mode: 'dev' | 'build') {
	const { finalCommonConfigVite } = await getConfigs(root, mode);

	const vite = await createServer(finalCommonConfigVite);

	// TODO: print url even if in middleware mode
	// if (mode === 'dev') vite.printUrls();
	return vite;
}

export async function vitePreview(
	/* _root: string, */ port = 9091,
	expose?: boolean | undefined,
) {
	const previewer = await preview({
		appType: 'mpa',
		preview: { port, host: expose || false },
	});

	previewer.printUrls();
}

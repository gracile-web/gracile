import { gracile } from '@gracile/gracile/plugin';
import { standardCssModules } from 'vite-plugin-standard-css-modules';
import { defineConfig } from 'vite';

export default defineConfig({
	server: { port: 3035 },
	preview: { port: 3035 },

	plugins: [standardCssModules(), gracile()],
});

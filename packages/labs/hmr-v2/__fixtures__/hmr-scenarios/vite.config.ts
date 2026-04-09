import { defineConfig } from 'vite';
import { gracile } from '@gracile/gracile/plugin';
// import { standardCssModules } from 'vite-plugin-standard-css-modules';

export default defineConfig({
	server: { port: 5190 },

	plugins: [
		gracile(),

		// TODO: Enable when testing CSS modules HMR scenarios.
		// standardCssModules(),
	],
});

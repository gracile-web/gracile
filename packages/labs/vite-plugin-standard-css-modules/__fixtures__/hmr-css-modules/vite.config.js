import { standardCssModules } from 'vite-plugin-standard-css-modules';
import { defineConfig } from 'vite';

export default defineConfig({
	plugins: [standardCssModules({ log: true })],
});

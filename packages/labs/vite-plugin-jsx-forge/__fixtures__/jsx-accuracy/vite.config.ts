import { gracile } from '@gracile/gracile/plugin';
import { gracileJsxToLiterals } from '@gracile-labs/vite-plugin-jsx-forge/to-literals';
import { defineConfig } from 'vite';

export default defineConfig({
	plugins: [gracileJsxToLiterals(), gracile()],
});

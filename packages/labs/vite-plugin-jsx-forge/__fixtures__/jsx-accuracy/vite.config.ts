import { gracile } from '@gracile/gracile/plugin';
import { jsxToLiterals } from '@gracile-labs/vite-plugin-jsx-forge/to-literals';
import { defineConfig } from 'vite';

export default defineConfig({
	plugins: [jsxToLiterals(), gracile()],
});

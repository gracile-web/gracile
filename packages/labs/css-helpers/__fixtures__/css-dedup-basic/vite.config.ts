import { gracile } from '@gracile/gracile/plugin';
import { dsdStyleDedup } from '@gracile-labs/css-helpers/plugin';
import { defineConfig } from 'vite';

export default defineConfig({
	server: { port: 3030 },
	plugins: [gracile(), dsdStyleDedup()],
});

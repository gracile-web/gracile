import { gracile } from '@gracile/gracile/plugin';
import { dsdStyleDedup } from '@gracile-labs/css-helpers/shared/vite';
import { defineConfig } from 'vite';

export default defineConfig({
	server: { port: 3030 },
	plugins: [gracile(), dsdStyleDedup()],
});

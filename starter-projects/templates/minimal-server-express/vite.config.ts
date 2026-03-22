import { gracile } from '@gracile/gracile/plugin';
import { defineConfig } from 'vite';

export default defineConfig({
	server: {
		port: 3030,
	},

	plugins: [
		gracile({
			output: 'server',

			dev: {
				locals: (_context) => {
					return {
						requestId: crypto.randomUUID(),
						userEmail: 'admin@admin.home.arpa',
					};
				},
			},
		}),
	],
});

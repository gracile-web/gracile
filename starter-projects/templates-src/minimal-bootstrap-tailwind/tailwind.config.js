import tailwindTypography from '@tailwindcss/typography';

/** @type {import('tailwindcss').Config} */
export default {
	content: ['./src/**/*.{js,ts}'],
	theme: {
		extend: {},
	},
	plugins: [tailwindTypography()],
};

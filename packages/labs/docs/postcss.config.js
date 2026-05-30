export default {
	plugins: {
		'postcss-env-function': {
			disableDeprecationNotice: true,
			importFrom: [
				{
					environmentVariables: {
						'--breakpoint-xs': '320px',
						'--breakpoint-sm': '576px',
						'--breakpoint-md': '768px',
						'--breakpoint-lg': '992px',
						'--breakpoint-xl': '1200px',
						'--breakpoint-xxl': '1840px',
					},
				},
			],
		},
	},
};

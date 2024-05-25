export function removeLocalPathsInDevAssets(input: string) {
	return input
		.replaceAll(process.cwd(), '__REPLACED_FOR_TESTS__')
		.replaceAll(
			/\/\*# sourceMappingURL=(.*) \*\//g,
			'/* __REPLACED_FOR_TESTS__ */',
		)
		.replaceAll(/.js\?v=(.*)";/g, '.js?v=__REPLACED_FOR_TESTS__";')
		.replaceAll(/\/\/# sourceMappingURL=(.*)/g, '// __REPLACED_FOR_TESTS__');
}

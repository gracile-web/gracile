export function removeLocalPathsInDevAssets(input: string) {
	return input
		.replaceAll(
			/"(.*)\/integration\/(.*)\/src\//g,
			'"__REPLACED_FOR_TESTS__/src/',
		)
		.replaceAll(/>file:\/\/(.*)</g, '>__REPLACED_FOR_TESTS__<')
		.replaceAll(
			/\((.*)\/packages\/@gracile\/gracile\/packages\/(.*)\)/g,
			'(__REPLACED_FOR_TESTS__)',
		)
		.replaceAll(process.cwd(), '__REPLACED_FOR_TESTS__')
		.replaceAll(
			/\/\*# sourceMappingURL=(.*) \*\//g,
			'/* __REPLACED_FOR_TESTS__ */',
		)
		.replaceAll(/.js\?v=(.*)";/g, '.js?v=__REPLACED_FOR_TESTS__";')
		.replaceAll(/\/\/# sourceMappingURL=(.*)/g, '// __REPLACED_FOR_TESTS__');
}

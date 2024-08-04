export function removeLocalPathsInDevAssets(input: string) {
	return (
		input
			.replaceAll(/>file:\/\/(.*)</g, '>__REPLACED_FOR_TESTS__<')
			.replaceAll(/\(file:\/\/\/(.*)\)/g, '(__REPLACED_FOR_TESTS__)')
			// .replaceAll(
			// 	/\((.*)\/gracile\/packages\/(.*)\)/g,
			// 	'(__REPLACED_FOR_TESTS__)',
			// )

			// Link tag stylesheets
			.replaceAll(/"(.*)\/(.*)\/(dist|src)\//g, '"__REPLACED_FOR_TESTS__/')

			.replaceAll(
				/from "\/@fs\/(.*)\/gracile\//g,
				'from "/@fs/__REPLACED_FOR_TESTS__/',
			)
			.replaceAll(
				/\((.*)\/@?gracile\/gracile\/(.*)\)/g,
				'(__REPLACED_FOR_TESTS__)',
			)

			// SOURCEMAPS
			.replaceAll(
				/\/\*# sourceMappingURL=(.*) \*\//g,
				'/* __REPLACED_FOR_TESTS__ */',
			)
			.replaceAll(/.js\?v=(.*)";/g, '.js?v=__REPLACED_FOR_TESTS__";')
			.replaceAll(/\/\/# sourceMappingURL=(.*)/g, '// __REPLACED_FOR_TESTS__')
	);
}

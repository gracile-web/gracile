import assert from 'node:assert';
import { cp, readFile, rm, writeFile } from 'node:fs/promises';
import { join } from 'node:path';

import { logger } from '@gracile/internal-utils/logger';
import fastGlob from 'fast-glob';
import { format } from 'prettier';
import { assertEqual } from 'snapshot-fixtures';

export async function snapshotAssertEqual(options: {
	expectedPath: string[];
	actualContent: string;
	writeActual?: boolean;
	prettier?: boolean;
	lang?: 'ts';
}) {
	const dest = join(
		// process.cwd(),
		'__fixtures__',
		join(...options.expectedPath),
	);
	const resultFormatted =
		options.prettier === false
			? options.actualContent
			: await format(options.actualContent, { parser: 'html' });

	if (options.writeActual) {
		await writeFile(dest, resultFormatted);
		return;
	}
	const expectedContent = await readFile(dest, 'utf8');
	const expectedContentFormatted =
		options.prettier === false
			? expectedContent
			: await format(expectedContent, { parser: options.lang ?? 'html' });

	try {
		assertEqual(resultFormatted, expectedContentFormatted);
	} catch (e) {
		if (e instanceof Error) throw Error(e.message);
		throw Error(e as string);
	}
}

async function getFiles(path: string) {
	const projectGlob = join('__fixtures__', path, '**/*');
	const fileList = (await fastGlob(projectGlob))
		.sort()
		.map(async (filePath) => {
			const fileContent = await readFile(filePath, 'utf8');
			return {
				path: filePath,
				content: fileContent,
			};
		});
	return fileList;
}

export async function compareFolder(options: {
	expectedPath: string;
	actualPath: string;
	writeActual?: boolean;
}) {
	if (options.writeActual) {
		logger.warn(`WRITING ACTUAL TO EXPECTED! Don't forget to remove it after.`);
		const destination = join(
			process.cwd(),
			'__fixtures__',
			options.expectedPath,
		);
		const source = join(process.cwd(), '__fixtures__', options.actualPath);

		await rm(destination, { force: true, recursive: true });
		await cp(source, destination, { recursive: true });
		return;
	}

	const [actualFiles, expectedFiles] = await Promise.all([
		Promise.all(await getFiles(options.actualPath)),
		Promise.all(await getFiles(options.expectedPath)),
	]);

	for (let index = 0; index < expectedFiles.length; index += 1) {
		const actual = actualFiles[index];
		const expected = expectedFiles[index];
		if (!expected || !actual) throw Error();

		try {
			assert.equal(actual.path, expected.path.replace('_expected', ''));
		} catch (e) {
			// console.log(e);
			throw Error('[ERR_ASSERTION]: Invalid file path', { cause: e });
		}

		try {
			assertEqual(actual.content, expected.content);
		} catch (e) {
			// console.log(e);
			throw e as Error;
		}
	}
}

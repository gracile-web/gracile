/**
 * Copies each package README.md (canonical source) into its corresponding
 * docs website content path, as defined in readme-manifest.ts.
 *
 * Run as part of `docs:generate` — the output files are git-ignored.
 */

import { copyFile, mkdir } from 'node:fs/promises';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

import { README_MAP } from './readme-manifest.js';

const SCRIPTS_DIR = dirname(fileURLToPath(import.meta.url));
const DOCS_WEBSITE_DIR = join(SCRIPTS_DIR, '..');
const ROOT_DIR = join(SCRIPTS_DIR, '../../..');

await Promise.all(
	README_MAP.map(async ({ src, dest }) => {
		const srcPath = join(ROOT_DIR, src, 'README.md');
		const destPath = join(DOCS_WEBSITE_DIR, dest);

		await mkdir(dirname(destPath), { recursive: true });
		await copyFile(srcPath, destPath);

		console.log(`  ✓ ${src}/README.md → ${dest}`);
	}),
);

console.log(
	`\nCollected ${README_MAP.length} package READMEs into docs content.`,
);

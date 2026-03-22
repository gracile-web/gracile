import { exec } from 'node:child_process';
import { mkdir, readFile, writeFile } from 'node:fs/promises';
import { join } from 'node:path';
import { promisify } from 'node:util';

import latestVersion from 'latest-version';
import { parse as parseYaml } from 'yaml';

import type pjsonType from '../../package.json';
import { partials } from '../config/partials.js';
import { templates } from '../config/templates.js';

// MARK: Config

/** Control release channel via env: `GRACILE_RELEASE_CHANNEL=latest|next` */
const releaseChannel =
	process.env['GRACILE_RELEASE_CHANNEL'] === 'latest' ? 'latest' : 'next';

/**
 * CI mode: install deps + bump @gracile/* versions from npm.
 * Local dev (default): skip both (keeps workspace `link:` deps intact).
 */
const isCi = process.env['CI'] === 'true';

const e = promisify(exec);

// MARK: Catalog resolution

/** Parse `catalog:` entries from pnpm-workspace.yaml */
async function loadCatalog(): Promise<Map<string, string>> {
	const wsYaml = await readFile(
		join(process.cwd(), '..', 'pnpm-workspace.yaml'),
		'utf8',
	);
	const parsed = parseYaml(wsYaml) as { catalog?: Record<string, string> };
	return new Map(Object.entries(parsed.catalog ?? {}));
}

/** Replace `"catalog:"` version references in a parsed package.json. */
function resolveCatalogRefs(
	deps: Record<string, string>,
	catalog: Map<string, string>,
): void {
	for (const [k, v] of Object.entries(deps)) {
		if (v === 'catalog:') {
			const resolved = catalog.get(k);
			if (resolved) {
				deps[k] = resolved;
			} else {
				console.warn(`  ⚠ catalog entry not found for "${k}"`);
			}
		}
	}
}

console.log(
	`Generating templates (channel=${releaseChannel}, ci=${String(isCi)})`,
);

const catalog = isCi ? await loadCatalog() : null;

await Promise.all(
	// MARK: COPY/MERGE
	[...templates].map(async (template) => {
		await mkdir(`templates/${template.name}`, { recursive: true });

		// eslint-disable-next-line no-restricted-syntax
		for (const merge of template.merge) {
			console.log(
				// eslint-disable-next-line no-await-in-loop
				await e(
					`rsync -av ${merge}/ templates/${template.name} --exclude="node_modules"`,
				),
			);
		}

		// MARK: README
		const rdme = join(process.cwd(), 'templates', template.name, 'README.md');
		await writeFile(rdme, '…'); // NOTE: DUMMY
		const readme = await partials.readme(template);
		await writeFile(rdme, readme);

		const dest = `templates/${template.name}`;

		// MARK: PJSON — resolve catalog + bump @gracile/* versions (CI only)
		if (isCi && catalog) {
			const pjsonDest = join(dest, 'package.json');
			// eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
			const pjson = JSON.parse(
				await readFile(pjsonDest, 'utf8'),
			) as unknown as typeof pjsonType;

			// Resolve catalog: references to concrete versions
			resolveCatalogRefs(
				pjson.dependencies as unknown as Record<string, string>,
				catalog,
			);
			if ('devDependencies' in pjson) {
				resolveCatalogRefs(
					pjson.devDependencies as unknown as Record<string, string>,
					catalog,
				);
			}

			// Resolve workspace:^ to latest published versions
			const resolveWorkspaceRefs = async (
				deps: Record<string, string>,
			): Promise<void> => {
				await Promise.all(
					Object.entries(deps).map(async ([k, v]) => {
						if (v.startsWith('workspace:')) {
							const version = await latestVersion(k, {
								version: releaseChannel,
							});
							deps[k] = `^${version}`;
						}
					}),
				);
			};
			await resolveWorkspaceRefs(
				pjson.dependencies as unknown as Record<string, string>,
			);
			if ('devDependencies' in pjson) {
				await resolveWorkspaceRefs(
					pjson.devDependencies as unknown as Record<string, string>,
				);
			}
			await writeFile(pjsonDest, `${JSON.stringify(pjson, null, 2)}\n`);
		}

		// MARK: Install (CI only)
		if (isCi) {
			await e(
				`pnpm install --no-frozen-lockfile --prefix templates/${template.name}`,
			);
		}
	}),
);

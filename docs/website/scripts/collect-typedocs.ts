import { readFile, writeFile } from 'fs/promises';
import { join } from 'path';
import { exec as e } from 'child_process';
import { promisify } from 'util';
import { slug } from 'github-slugger';

const exec = promisify(e);

const sections = new Map<string, Set<string> | string>([
  // ['README', new Set(['packages.md'])],

  [
    'Gracile/Vite configuration',
    new Set([
      //
      '@gracile.gracile.Interface.GracileConfig.md',
      '@gracile.gracile.Function.gracile.md',
    ]),
  ],
  [
    'Routes and documents',
    new Set([
      '@gracile.gracile.Function.defineRoute.md',
      '@gracile.gracile.Function.html.md',
      '@gracile.gracile.Function.pageAssetsCustomLocation.md',
    ]),
  ],

  [
    'Server runtime',
    new Set([
      '@gracile.gracile.Function.nodeAdapter.md',
      '@gracile.gracile.Function.honoAdapter.md',

      '@gracile.gracile.Function.getClientBuildPath.md',
      '@gracile.gracile.Function.printUrls.md',

      '@gracile.gracile.Variable.server.md',
      '@gracile.gracile.Variable.nodeCondition.md',

      '@gracile.gracile.TypeAlias.GracileHandler.md',
      '@gracile.gracile.TypeAlias.GracileNodeHandler.md',
      '@gracile.gracile.TypeAlias.GracileHonoHandler.md',
    ]),
  ],

  [
    'Client router',
    new Set([
      //
      '@gracile-labs.client-router.Function.createRouter.md',
      // '@gracile-labs.client-router.TypeAlias.GracileRouterConfig.md',
    ]),
  ],
]);

await Promise.all(
  [...sections].map(async ([k, f]) => {
    let result = `# ${k === 'README' ? 'Gracile public API' : k}\n\n

API references extracted from the Gracile code base.  
Examples, functions, classes, constants, type declarations…
`;

    await Promise.all(
      [...f].map(async (s) => {
        const c = await readFile(join('../gracile/docs/', s), 'utf8');
        result +=
          c
            .replaceAll(/###? Properties/g, '**Properties**')
            .replaceAll(/###? Parameters/g, '**Parameters**')
            .replaceAll(/###? Returns/g, '**Returns**')
            .replaceAll(/###? Example/g, '**Example**')
            .replaceAll(/###? Type declaration/g, '**Type declaration**')
            .replaceAll(/###? Type Parameters/g, '**Type parameters**')
            .replaceAll(/###? Defined in/g, '**Defined in**')
            .replaceAll('**See**\n\n', '**See** ')
            .replaceAll('## See\n\n', '**See** ')
            .replaceAll('<table>', '<div class="typedoc-table"><table>')
            .replaceAll('</table>', '</table></div>')
            .replaceAll(
              /\[`(.*)`\]\((.*)\.md\)/g,
              (_, b, b2) =>
                `[\`${b}\`](#doc_${slug(
                  b2
                    .replaceAll('TypeAlias', 'type-alias-')
                    .replaceAll('Interface', 'interface-')
                    .replaceAll('Variable', 'variable-')
                    .replaceAll('Function', 'function-'),
                )})`,
            ) // #doc_type-alias-gracilehandler
            .replaceAll(/^# /g, '## ')
            .replaceAll('https://gracile.js.org', '') + '\n';
      }),
    );
    sections.set(k, result);
  }),
);

const base = './src/content/docs/25-references/01-api/';
await Promise.all(
  [...sections].map(async ([k, f], i) => {
    const dest = `${base}${i}-${k === 'README' ? k : slug(k)}.md`;
    await writeFile(dest, f);
    console.log(dest);
  }),
);

await exec('pnpm prettier --write ' + base);

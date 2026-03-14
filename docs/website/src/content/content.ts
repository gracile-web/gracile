import type { MarkdownModule } from '../../lib/markdown/md-module.js';
import { PathsHandlers } from '../lib/content/paths-handlers.js';
import { buildTree } from '../lib/content/file-tree-builder.js';
import { type } from 'arktype';

export const pathsHandlers = new PathsHandlers();

export const docsMetaImportsGlob = import.meta.glob<MarkdownModule>(
  ['/src/content/docs/**/*.md', '!/**/_*'],
  { eager: true, query: 'meta' },
);
export const docsContentImportsGlob = import.meta.glob<MarkdownModule>([
  '/src/content/docs/**/*.md',
  '!/**/_*',
]);

// TODO: externalize to method?
export const docsMetaImports = Object.entries(docsMetaImportsGlob).map(
  ([path, module]) =>
    ({
      pathParams: pathsHandlers.filePathToDocsPathParam(path),
      href: pathsHandlers.pathToHref(path),
      module,
    }) satisfies MarkdownModuleConsumable,
);

export type MarkdownModuleConsumable = {
  pathParams: string | undefined;
  href: string;
  module: MarkdownModule;
};

const markdownTreeNodes =
  pathsHandlers.markdownModulesToTreeNode(docsMetaImportsGlob);

// TODO: merge buildTree with class?
export const markdownTree = buildTree(markdownTreeNodes);

// ---

const blogMetaImportsGlob = import.meta.glob<MarkdownModule>(
  ['/src/content/blog/**/*.md', '!/**/_*'],
  { eager: true, query: 'meta' },
);
export const blogContentImportsGlob = import.meta.glob<MarkdownModule>([
  '/src/content/blog/**/*.md',
  '!/**/_*',
]);

const blogPost = type({
  // 'title': "string",
  // 'description?': "string",
  'publishedAt?': type('string | null').pipe.try((a) => {
    if (a && Date.parse(a)) return new Date(a);
    throw new Error('Incorrect date');
  }),
  'updatedAt?': type('string | null').pipe.try((a) => {
    if (a && Date.parse(a)) return new Date(a);
    return null;
  }),
  'author?': "'Julian Cataldo' | 'Foo Bar'",
});

export const blogMetaImports = Object.entries(blogMetaImportsGlob).map(
  ([path, module]) =>
    ({
      pathParams: pathsHandlers.filePathToDocsPathParam(path),
      href: pathsHandlers.pathToHref(path),
      module: {
        ...module,
        frontmatter: (() => {
          const fm = blogPost(module.frontmatter);
          if (fm instanceof type.errors) throw fm;
          return fm;
        })(),
      },
    }) satisfies MarkdownModuleConsumable,
);

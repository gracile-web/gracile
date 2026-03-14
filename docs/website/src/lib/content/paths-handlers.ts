import type { MarkdownModule } from '@gracile/markdown/md-module';

import type { TreeNodeData } from './file-tree-builder.js';

export class PathsHandlers {
	static readonly DEFAULT_CONTENT_FOLDER_PATH: string = '/src/content/';
	static readonly DEFAULT_PATHNAME_PREFIX: RegExp = /\/(docs|blog)\//;

	public readonly CONTENT_FOLDER_PATH: string;
	public readonly PATHNAME_PREFIX: string;

	constructor(options?: {
		contentFolderPath?: string /*  docsPathName?: string  */;
	}) {
		this.CONTENT_FOLDER_PATH =
			options?.contentFolderPath ?? PathsHandlers.DEFAULT_CONTENT_FOLDER_PATH;
		this.PATHNAME_PREFIX =
			/* 
      options?.docsPathName ??  */ PathsHandlers.DEFAULT_PATHNAME_PREFIX;
	}

	public stripContentPath(p: string): string {
		return p.replace(this.CONTENT_FOLDER_PATH, '/');
	}

	public pathToHref(p: string): string {
		return (
			this.stripContentPath(p)
				.replaceAll(/\/\d+-/g, '/')
				.replace(/\.md$/, '')
				.replace(/\/README$/, '') + '/'
		);
	}

	public filePathToDocsPath(p: string): string {
		const path = this.pathToHref(p).replace(this.PATHNAME_PREFIX, '');
		// .replace(/\/$/, '');
		return path;
		// return path === '/docs/' ? '/docs' : path;
	}

	public filePathToDocsPathParam(p: string): string | undefined {
		const result = this.filePathToDocsPath(p).slice(0, -1);
		return result === '' ? undefined : result;
	}

	public markdownModulesToTreeNode(
		markdownImports: Record<string, MarkdownModule>,
	): TreeNodeData[] {
		return Object.entries(markdownImports)

			.map(
				([mdPath, mdModule]) =>
					({
						originalPath: this.stripContentPath(mdPath).slice(1),
						path: this.filePathToDocsPath(mdPath),
						href: this.pathToHref(mdPath),
						title: mdModule.toc.at(0)?.value,
						titleHtml: mdModule.toc.at(0)?.html,
					}) satisfies TreeNodeData,
			);
	}
}

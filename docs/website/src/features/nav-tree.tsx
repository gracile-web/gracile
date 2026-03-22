import type { TemplateResult } from 'lit';
import { ifDefined } from 'lit/directives/if-defined.js';
import { unsafeHTML } from 'lit/directives/unsafe-html.js';

import { type FileTree } from '../lib/content/file-tree-builder.js';
import chevronRight from '../assets/icons/chevron-right.svg' with {
	type: 'svg',
	format: 'lit',
};

const recurse = (
	pathname: string,
	topLevel: FileTree,
	depth = 0,
): (TemplateResult<1> | null)[] =>
	Object.entries(topLevel).map(([name, value]) => {
		const link =
			'directory' in value
				? value.directory['README.md']?.metadata.href
				: value.metadata?.href;

		const title =
			'directory' in value
				? value.directory['README.md']?.metadata.titleHtml
				: value.metadata?.titleHtml;

		return name === 'README.md' ? null : (
			<div
				class:map={{
					[`depth-${depth}`]: true,
					group: true,
				}}
			>
				<a
					href={ifDefined(link) as typeof link}
					class:list={[
						'tree-level',
						'unstyled',
						`depth-${depth}`,
						pathname === link && 'current',
					]}
					data-prefetch
				>
					{unsafeHTML(title)}

					<span class="chevron">{chevronRight}</span>
				</a>

				<div>
					{'directory' in value
						? recurse(pathname, value.directory, depth + 1)
						: null}
				</div>
			</div>
		);
	});

export const NavTree = ({
	pathname,
	topLevel,
}: {
	pathname: string;
	topLevel: FileTree;
}) => {
	return (
		<div class="m-nav-tree" data-keep-scroll-name="nav-tree">
			{recurse(pathname, topLevel)}
		</div>
	);
};

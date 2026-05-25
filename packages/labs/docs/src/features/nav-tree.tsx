import type { TemplateResult } from 'lit';
import { unsafeHTML } from 'lit/directives/unsafe-html.js';

import {
	type DirectoryNode,
	type FileTree,
} from '../lib/content/file-tree-builder.js';
import chevronRight from '../assets/icons/chevron-right.svg' with {
	type: 'svg',
	format: 'lit',
};

const normPath = (p: string) => (p.length > 1 ? p.replace(/\/$/, '') : p);

const urlMatches = (pathname: string, href?: string) =>
	!!href && normPath(pathname) === normPath(href);

// Recursively check whether any page inside a subtree is the current page.
const subtreeIsActive = (pathname: string, tree: FileTree): boolean =>
	Object.values(tree).some((node) => {
		if (urlMatches(pathname, node.metadata?.href)) return true;
		return 'directory' in node
			? subtreeIsActive(pathname, node.directory)
			: false;
	});

const recurse = (
	pathname: string,
	topLevel: FileTree,
	depth = 0,
	// True when a depth-1 ancestor has any active page — used so all depth-2
	// siblings unfold together whenever the user is inside the same section.
	sectionActive = false,
): (TemplateResult<1> | null)[] =>
	Object.entries(topLevel).map(([name, node]) => {
		if (name === 'README.md') return null;

		const link =
			'directory' in node
				? node.directory['README.md']?.metadata.href
				: node.metadata?.href;

		const title =
			'directory' in node
				? node.directory['README.md']?.metadata.titleHtml
				: node.metadata?.titleHtml;

		const isCurrent = urlMatches(pathname, link);

		// depth-2 directories are the L2 parent rows (Getting Started, Usage, JSX…).
		// Their depth-3 children are the fold region.
		// A section is open when:
		//   • it is the current page, OR
		//   • one of its descendants is current, OR
		//   • a same-level sibling is active (sectionActive from the depth-1 parent).
		const isCollapsible =
			depth === 2 &&
			'directory' in node &&
			Object.keys(node.directory).some((k) => k !== 'README.md');

		const isOpen =
			isCollapsible &&
			(isCurrent ||
				subtreeIsActive(pathname, (node as DirectoryNode).directory) ||
				sectionActive);

		// When descending from depth 1 into depth 2, tell all siblings whether
		// the enclosing depth-1 section is currently active.
		const childSectionActive =
			depth === 1 && 'directory' in node
				? isCurrent ||
					subtreeIsActive(pathname, (node as DirectoryNode).directory)
				: false;

		const childRows =
			'directory' in node
				? recurse(pathname, node.directory, depth + 1, childSectionActive)
				: null;

		return (
			<div
				class:map={{
					[`depth-${depth}`]: true,
					group: true,
				}}
			>
				<a
					if:href={link}
					class:list={[
						'tree-level',
						'unstyled',
						`depth-${depth}`,
						isCurrent && 'current',
					]}
					data-prefetch
				>
					{unsafeHTML(title)}

					<span class="chevron">{chevronRight}</span>
				</a>

				{isCollapsible ? (
					isOpen ? (
						<div>{childRows}</div>
					) : null
				) : (
					<div>{childRows}</div>
				)}
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

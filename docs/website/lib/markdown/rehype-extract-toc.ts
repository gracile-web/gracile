// @ts-nocheck
// Vendored from https://github.com/stefanprobst/rehype-extract-toc
// Original license: MIT

import { headingRank as rank } from 'hast-util-heading-rank';
import { toString } from 'hast-util-to-string';
import { visit } from 'unist-util-visit';
import { toHtml } from 'hast-util-to-html';

function attacher() {
	return transformer;

	function transformer(tree, vfile) {
		const headings = [];

		visit(tree, 'element', onHeading);

		vfile.data.toc = createTree(headings) || [];

		function onHeading(node) {
			const level = rank(node);

			if (level != null) {
				const heading = {
					depth: level,
					value: toString(node),
					html: toHtml(node.children, {
						allowDangerousHtml: true,
						allowDangerousCharacters: false,
					}),
				};
				if (node.properties !== undefined && node.properties.id != null) {
					heading.id = node.properties.id;
				}
				headings.push(heading);
			}
		}

		function createTree(headings) {
			const root = { depth: 0, children: [] };
			const parents = [];
			let previous = root;

			headings.forEach((heading) => {
				if (heading.depth > previous.depth) {
					if (previous.children === undefined) {
						previous.children = [];
					}
					parents.push(previous);
				} else if (heading.depth < previous.depth) {
					while (parents[parents.length - 1].depth >= heading.depth) {
						parents.pop();
					}
				}

				parents[parents.length - 1].children.push(heading);
				previous = heading;
			});

			return root.children;
		}
	}
}

export default attacher;

// Based on: https://github.com/pthm/node-path-list-to-tree

import get from 'lodash.get';
import set from 'lodash.set';

import { PathsHandlers } from './paths-handlers.js';

// FIXME: Not hoisting top level README

export type TreeNodeData = {
	href: string;
	titleHtml?: string;
};

export interface TreeNode {
	name: string;
	children: TreeNode[];

	parts: string[];

	data: TreeNodeData;
}

export interface FileTree {
	[name: string]: DirectoryNode | FileNode;
}

export interface DirectoryNode {
	directory: FileTree;

	metadata: TreeNodeData;
}

export interface FileNode {
	metadata: TreeNodeData;
}

export function buildTree(mdModules: TreeNodeData[]): FileTree {
	const tree: FileTree = {};

	const dirs = [];

	for (let i = 0; i < mdModules.length; i++) {
		const mdModule = mdModules[i];

		const path = [
			...mdModule.originalPath.replaceAll('/', '/directory/').split('/'),
		];

		set(tree, path, { metadata: mdModule, file: {} });

		const enclosingDir = get(tree, [...path.slice(0, -1)]);

		let singleton = false;
		if (
			enclosingDir?.['README.md'] &&
			Object.values(enclosingDir).length === 1
		) {
			singleton = true;
		}
	}

	return tree;
}

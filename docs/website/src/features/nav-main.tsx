import gracileLogo from '../assets/gracile-logo.svg' with {
	type: 'svg',
	format: 'lit',
};
import { MenuToggle } from './menu-toggle.jsx';
import { NavTree } from './nav-tree.jsx';
import type { FileTree } from '../lib/content/file-tree-builder.js';

export const NavMain = ({
	name,
	pathname,
	tree,
}: {
	name: string | null;
	pathname?: string | null;
	tree?: FileTree;
}) => (
	<>
		<MenuToggle position="left" />

		<aside class="m-nav-main">
			<a class="home unstyled" href="/">
				<div>
					<span class="logo">{gracileLogo}</span>
					&nbsp;/&nbsp;
					{name ? <small>{name}</small> : <>Home</>}
				</div>
			</a>

			{tree && pathname ? (
				<nav>
					<NavTree pathname={pathname} topLevel={tree} />
				</nav>
			) : null}
		</aside>
	</>
);

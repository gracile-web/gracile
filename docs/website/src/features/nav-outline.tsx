import { For } from '@gracile-labs/vite-plugin-babel-jsx-to-literals/components/for';
import type { MarkdownModule, TocLevel } from '../../lib/markdown/md-module.js';
import type { TemplateResult } from 'lit';
import { nothing } from 'lit';

const recurse = (toc: TocLevel[]): TemplateResult<1> => (
	<For each={toc}>
		{(level) => (
			<li for:key={level.id}>
				<a
					data-close-menu
					data-menu-close-all
					data-toc-selector
					href={`#doc_${level.id}`}
					class:map={{
						unstyled: true,
						[`l-${level.depth}`]: true,
					}}
					unsafe:html={level.html}
				/>

				<ul>
					{level.children?.length > 0 ? recurse(level.children) : nothing}
				</ul>
			</li>
		)}
	</For>
);

export const NavOutline = (options: { toc: MarkdownModule['toc'] }) => (
	<nav class="m-nav-outline">
		<ul>{recurse(options.toc)}</ul>
	</nav>
);

import type { TocLevel } from '@gracile/markdown/module';
import { html, type TemplateResult } from 'lit';
import { classMap } from 'lit/directives/class-map.js';
import { ifDefined } from 'lit/directives/if-defined.js';

export interface TreeLevel extends Partial<TocLevel> {
	path?: string;
}

const recurse = (
	level: TreeLevel[],
	currentPath?: string,
): TemplateResult<1> => html`
	<ul>
		${level?.map(
			(item) => html`
				<li
					class=${classMap({
						current: currentPath === item.path,
					})}
				>
					<a
						href=${ifDefined(
							item.path || (item.slug ? `#${item.slug}` : undefined),
						)}
						>${item.text}</a
					>

					${item.children?.length ? recurse(item.children, currentPath) : null}
				</li>
			`,
		)}
	</ul>
`;

export const tree = (props: {
	currentPath?: string;
	tree: TreeLevel[] | undefined;
}) =>
	props.tree
		? html` <nav class="tree">${recurse(props.tree, props.currentPath)}</nav> `
		: null;

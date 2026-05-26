import type { MarkdownModuleConsumable } from '@gracile-docs/content';

export const LinksIndex = ({
	index,
}: {
	index: MarkdownModuleConsumable[];
}) => (
	<div class="m-links-index">
		{index.map((page) => (
			<for:each key={page.href}>
				<a href={page.href} class="unstyled">
					<div class="title" $:html={page.module.titleHtml} />

					<p>{page.module.excerpt}</p>
				</a>
			</for:each>
		))}
	</div>
);

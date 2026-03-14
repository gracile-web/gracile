import { For } from '@gracile-labs/vite-plugin-babel-jsx-to-literals/components/for';
import type { MarkdownModuleConsumable } from '../content/content.js';

export const LinksIndex = ({
  index,
}: {
  index: MarkdownModuleConsumable[];
}) => (
  <div class="m-links-index">
    <For each={index}>
      {(page) => (
        <a href={page.href} class="unstyled" for:key={page.href}>
          <div class="title" unsafe:html={page.module.titleHtml} />

          <p>{page.module.excerpt}</p>
        </a>
      )}
    </For>
  </div>
);

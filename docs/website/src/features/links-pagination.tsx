import type { MarkdownModuleConsumable } from '../content/content.js';

export const LinksPagination = ({
  prev,
  next,
}: {
  prev: MarkdownModuleConsumable | null;
  next: MarkdownModuleConsumable | null;
}) => (
  <nav class="m-pagination-links">
    {prev?.pathParams ? (
      <a href={prev?.href} class="prev link unstyled">
        <header>
          <i-c o="ph:skip-back-duotone"></i-c>
          <span>Previous</span>
        </header>
        <div class="title" unsafe:html={prev?.module.titleHtml} />
      </a>
    ) : (
      <div>{/* flex placeholder */}</div>
    )}

    {next?.pathParams ? (
      <a href={next?.href} class="next link unstyled">
        <header>
          <span>Next</span>

          <i-c o="ph:skip-forward-duotone"></i-c>
        </header>

        <div class="title" unsafe:html={next?.module.titleHtml} />
      </a>
    ) : (
      <div>{/* flex placeholder */}</div>
    )}
  </nav>
);

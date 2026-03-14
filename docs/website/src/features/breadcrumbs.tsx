import chevronDoubleRight from '../assets/icons/chevron-double-right.svg' with {
  type: 'svg',
  format: 'lit',
};
import chevronRight from '../assets/icons/chevron-right.svg' with {
  type: 'svg',
  format: 'lit',
};
import { For } from '@gracile-labs/vite-plugin-babel-jsx-to-literals/components/for';

export type BreadCrumbsList = { title: string; url: string }[];

export function BreadCrumbs({
  breadCrumbs,
  homeUrl,
}: {
  breadCrumbs: BreadCrumbsList;
  homeUrl?: string;
}) {
  return (
    <nav class="m-bread-crumbs">
      <div class="part">
        <a href={homeUrl ?? '/'} title="Back to Home">
          <i-c o="ph:house-duotone"></i-c>
        </a>

        {chevronDoubleRight}
      </div>

      <For each={breadCrumbs}>
        {(b) => [
          b.url,
          b.title ? (
            <div class="part" for:key={b.url}>
              {b.url ? (
                <a href={b.url} unsafe:html={b.title} />
              ) : (
                <span unsafe:html={b.title} />
              )}

              {chevronRight}
            </div>
          ) : null,
        ]}
      </For>
    </nav>
  );
}

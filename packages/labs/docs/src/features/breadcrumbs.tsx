import chevronDoubleRight from '../assets/icons/chevron-double-right.svg' with {
	type: 'svg',
	format: 'lit',
};
import chevronRight from '../assets/icons/chevron-right.svg' with {
	type: 'svg',
	format: 'lit',
};

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

			{breadCrumbs.map((b) => (
				<for:each key={b.url}>
					{b.title ? (
						<div class="part">
							{b.url ? (
								<a href={b.url} $:html={b.title} />
							) : (
								<span $:html={b.title} />
							)}

							{chevronRight}
						</div>
					) : null}
				</for:each>
			))}
		</nav>
	);
}

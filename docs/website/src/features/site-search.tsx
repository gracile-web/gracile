export function SiteSearch() {
	return (
		<>
			<div class="m-site-search">
				<search-popup>
					<button>
						<i-c o="ph:magnifying-glass-duotone"></i-c> Search… <kbd>⌘ + K</kbd>
						{/*  */}
						<some-foo contentEditable></some-foo>
						{/*  */}
					</button>
				</search-popup>

				<noscript>
					<br />
					<small>
						<strong>Enable JavaScript</strong> for site-wide search.
					</small>
				</noscript>
			</div>
		</>
	);
}

declare global {
	interface HTMLElementTagNameMap {
		'some-foo': {};
	}
}

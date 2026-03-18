import {
	DISCORD_INVITE_PATH,
	DOCS_REPO_URL,
	ISSUES_URL,
	PKG_LICENSE,
	PKG_VERSION,
	PLAYGROUND_URL,
	REPO_URL,
	SITE_TITLE,
	SITE_URL,
} from '../content/global.js';

export const FooterMain = (options: { url: URL; filename?: string }) => (
	<footer class="m-footer-main">
		<div class="m-footer-main-container">
			<a href={ISSUES_URL} target="_blank" rel="noopener noreferrer nofollow">
				<i-c o="lightbulb-duotone"></i-c>
				Give feedback
			</a>

			{options.filename ? (
				<>
					<div class="sep">—</div>
					<a
						href={`${DOCS_REPO_URL}edit/main${options.filename}`}
						target="_blank"
						rel="noopener noreferrer nofollow"
					>
						<i-c o="note-pencil-duotone"></i-c>
						Edit this page
					</a>
				</>
			) : null}
			<div class="sep">—</div>
			<a
				href={`https://github.com/sponsors/JulianCataldo`}
				target="_blank"
				rel="noopener noreferrer nofollow"
			>
				<i-c o="heartbeat-duotone"></i-c>
				Support this project
			</a>
			{/* <div class="sep">—</div>
			<a href={`/blog/`}>
				<i-c o="article-duotone"></i-c>
				Blog
			</a> */}
			<div class="sep">—</div>
			<a href={SITE_URL}>
				<i-c o="house-duotone"></i-c>
				{SITE_TITLE}
			</a>
			<div class="sep">—</div>
			<a href={PLAYGROUND_URL}>
				<i-c o="app-window-duotone"></i-c>
				Playground
			</a>
			<div class="sep">—</div>
			<a href={REPO_URL} target="_blank" rel="noopener noreferrer nofollow">
				<i-c o="github-logo-duotone"></i-c>
				Repository
			</a>
			<div class="sep">—</div>
			<a
				href={`/${DISCORD_INVITE_PATH}`}
				target="_blank"
				rel="noopener noreferrer nofollow"
			>
				<i-c o="discord-logo-duotone"></i-c>
				Discord
			</a>
			<div class="sep">—</div>
			{import.meta.env.VITE_DOCS_IS_NEXT === 'true' ? (
				<>
					<small>
						Next docs v{PKG_VERSION} •
						<a href="https://gracile.js.org/">Go to Main</a>
					</small>
				</>
			) : (
				<>
					<small>
						Main docs v{PKG_VERSION} •
						<a href="https://next--gracile.js.org/">Go to Next</a>
					</small>
				</>
			)}
			<div class="sep">—</div>
			{/*  */}
			<small class="copyright">
				© {new Date().getFullYear()} • License {PKG_LICENSE}
			</small>
		</div>
	</footer>
);

import { docsConfig } from '@gracile-docs/content';

const { site } = docsConfig;

export const FooterMain = (options: { url: URL; filename?: string }) => (
	<footer class="m-footer-main">
		<div class="m-footer-main-container">
			<a
				href={site.issuesUrl}
				target="_blank"
				rel="noopener noreferrer nofollow"
			>
				<i-c o="lightbulb-duotone"></i-c>
				Give feedback
			</a>

			{options.filename ? (
				<>
					<div class="sep">—</div>
					<a
						href={`${site.docsRepoUrl}${options.filename}`}
						target="_blank"
						rel="noopener noreferrer nofollow"
					>
						<i-c o="note-pencil-duotone"></i-c>
						Edit this page
					</a>
				</>
			) : null}
			{site.sponsorUrl ? (
				<>
					<div class="sep">—</div>
					<a
						href={site.sponsorUrl}
						target="_blank"
						rel="noopener noreferrer nofollow"
					>
						<i-c o="heartbeat-duotone"></i-c>
						Support this project
					</a>
				</>
			) : null}
			{/* <div class="sep">—</div>
			<a href={`/blog/`}>
				<i-c o="article-duotone"></i-c>
				Blog
			</a> */}
			<div class="sep">—</div>
			<a href={site.url}>
				<i-c o="house-duotone"></i-c>
				{site.title}
			</a>
			<div class="sep">—</div>
			<a href={site.playgroundUrl}>
				<i-c o="app-window-duotone"></i-c>
				Playground
			</a>
			<div class="sep">—</div>
			<a href={site.repoUrl} target="_blank" rel="noopener noreferrer nofollow">
				<i-c o="github-logo-duotone"></i-c>
				Repository
			</a>
			<div class="sep">—</div>
			<a
				href={`/${site.discordInvitePath}`}
				target="_blank"
				rel="noopener noreferrer nofollow"
			>
				<i-c o="discord-logo-duotone"></i-c>
				Discord
			</a>
			<div class="sep">—</div>
			{site.mainSiteUrl || site.nextSiteUrl ? (
				import.meta.env.VITE_DOCS_IS_NEXT === 'true' ? (
					<small>
						Next docs v{site.version} •{' '}
						{site.mainSiteUrl ? (
							<a href={site.mainSiteUrl}>Go to Main</a>
						) : null}
					</small>
				) : (
					<small>
						Main docs v{site.version} •{' '}
						{site.nextSiteUrl ? (
							<a href={site.nextSiteUrl}>Go to Next</a>
						) : null}
					</small>
				)
			) : (
				<small>v{site.version}</small>
			)}
			<div class="sep">—</div>
			{/*  */}
			<small class="copyright">
				© {new Date().getFullYear()} • License {site.license}
			</small>
		</div>
	</footer>
);

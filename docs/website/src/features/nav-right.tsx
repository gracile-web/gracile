import type { MarkdownModule } from '@gracile/markdown/md-module';
import { NavOutline } from './nav-outline.jsx';
import { ColorModeToggle } from './color-mode-toggle.jsx';
import { SiteSearch } from './site-search.jsx';
import { DISCORD_INVITE_PATH, REPO_URL } from '../content/global.js';
import { MenuToggle } from './menu-toggle.jsx';
// import { asideMenuState } from '../lib/app-state.js';

const githubLabel = 'Source code (GitHub)';

export function NavRight(options: { markdownModule: MarkdownModule | null }) {
	return (
		<>
			<MenuToggle position="right" label="go to" />

			<aside
				class="m-nav-right"
				/* data-state={asideMenuState} */
			>
				<div class="app-links">
					<a
						title={githubLabel}
						class="unstyled sources"
						href={REPO_URL}
						target="_blank"
						aria-label={githubLabel}
						rel="noopener noreferrer nofollow"
					>
						<i-c o="github-logo-duotone" s="1.5rem"></i-c>

						<span>Sources</span>
					</a>

					<a
						class="unstyled"
						href={'/' + DISCORD_INVITE_PATH}
						target="_blank"
						rel="noopener noreferrer nofollow"
					>
						<i-c o="discord-logo-duotone" s="1.5rem"></i-c>
						<span>Chat</span>
					</a>

					<ColorModeToggle />
				</div>

				<SiteSearch />

				{options.markdownModule?.toc ? (
					<div class="toc">
						<span class="current-page-header">
							<i-c o="queue-duotone" s="1.2rem"></i-c>
							On this page
						</span>

						<NavOutline toc={options.markdownModule.toc} />
					</div>
				) : null}
			</aside>
		</>
	);
}

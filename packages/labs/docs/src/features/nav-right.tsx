import type { MarkdownModule } from '../lib/markdown/md-module.js';

import { docsConfig } from '@gracile-docs/content';

import { NavOutline } from './nav-outline.js';
import { ColorModeToggle } from './color-mode-toggle.js';
import { SiteSearch } from './site-search.js';
import { MenuToggle } from './menu-toggle.js';
// import { asideMenuState } from '../lib/app-state.js';

const githubLabel = 'Source code (GitHub)';
const { site } = docsConfig;

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
						href={site.repoUrl}
						target="_blank"
						aria-label={githubLabel}
						rel="noopener noreferrer nofollow"
					>
						<i-c o="github-logo-duotone" s="1.5rem"></i-c>

						<span>Sources</span>
					</a>

					<a
						class="unstyled"
						href={'/' + site.discordInvitePath}
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

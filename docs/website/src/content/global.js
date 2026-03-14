import packageJson from '../../package.json' with { type: 'json' };

export const SITE_TITLE = 'Gracile';
export const SITE_SUBTITLE = 'Web framework';
export const SITE_URL = 'https://gracile.js.org/';
export const ISSUES_URL = 'https://github.com/gracile-web/gracile/issues/';
export const REPO_URL = 'https://github.com/gracile-web/gracile/';
export const DOCS_REPO_URL = 'https://github.com/gracile-web/website/';

export const DISCORD_INVITE_PATH = 'chat/';
export const DISCORD_INVITE_ALIAS = SITE_URL + DISCORD_INVITE_PATH;
export const DISCORD_INVITE_URL = 'https://discord.gg/Q8nTZKZ9H4';

export const SITE_DESCRIPTION = `A thin, full-stack, web framework`;

export const PLAYGROUND_URL = '/playground/';

export const PKG_LICENSE = packageJson.license;
export const PROJECT_AUTHORS = packageJson.author.name;

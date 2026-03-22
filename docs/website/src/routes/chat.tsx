import { defineRoute } from '@gracile/gracile/route';
import { html } from '@gracile/gracile/server-html';

import discordLogo from '../assets/icons/discord.svg';
import { DISCORD_INVITE_URL } from '../content/global.js';
import { googleAnalytics } from '../document/document-helpers.js';

const waitTime = 1;

export default defineRoute({
	document: () => (
		<html lang="en">
			<head>
				<meta charset="utf-8" />
				<meta name="viewport" content="width=device-width, initial-scale=1.0" />

				{googleAnalytics}

				{html`<style>
					& {
						margin: calc(10dvh + 10dvw);
						font-family: system-ui;
						font-size: 2rem;
						text-align: center;
						color-scheme: dark light;
					}

					svg {
						height: 3rem;
						width: 3rem;
					}
				</style>`}

				<title>Gracile - Discord Server (redirecting…)</title>

				<meta
					http-equiv="refresh"
					content={`${waitTime};URL=${DISCORD_INVITE_URL}`}
				/>
			</head>

			<body>
				{discordLogo}

				<p>Redirecting to the Discord invitation link…</p>
			</body>
		</html>
	),
});

import c from 'picocolors';

export function emptyRoutes() {
	const message =
		c.yellow(`No route were found in the \`src/routes/\` folder.\n\n`) +
		c.magenta(
			`▶ See https://gracile.js.org/docs/learn/usage/defining-routes/.`,
		);
	return `${message}\n`;
}

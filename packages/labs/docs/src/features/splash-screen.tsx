import { unsafeHTML } from 'lit/directives/unsafe-html.js';

import graphPaper from '../assets/icons/graph-paper.svg' with {
	type: 'svg',
	format: 'lit',
};

export const SplashScreen = ({
	descriptionHtml,
	installCommand,
	logoHtml,
	splashLinks,
}: {
	descriptionHtml: string;
	installCommand: string;
	logoHtml: string;
	splashLinks: ReadonlyArray<{ label: string; href: string; icon: string }>;
}) => (
	<header class="m-splash-screen">
		{Array.from({ length: 8 }).map((_, index) => (
			<for:each key={index}>
				<div class={`bg bg-${index + 1}`}></div>
			</for:each>
		))}

		<svg width="100%" height="100%" class="bg bg-noise">
			<filter id="noiseFilter">
				<feTurbulence
					type="fractalNoise"
					baseFrequency="0.65"
					numOctaves="3"
					stitchTiles="stitch"
				></feTurbulence>
			</filter>
			<rect
				x="0"
				y="0"
				width="100%"
				height="100%"
				filter="url(#noiseFilter)"
				fill="url(#graph)"
			></rect>
		</svg>
		<svg width="100%" height="100%" class="bg bg-grid">
			<defs>
				<pattern
					id="graph"
					x="0"
					y="0"
					width="100"
					height="100"
					patternUnits="userSpaceOnUse"
				>
					{graphPaper}
				</pattern>
			</defs>
			<rect x="0" y="0" width="100%" height="100%" fill="url(#graph)"></rect>
		</svg>

		<div class="logo">{unsafeHTML(logoHtml)}</div>

		<p class="description">{unsafeHTML(descriptionHtml)}</p>

		<div class="ctas">
			{[...splashLinks].map((link) => (
				<for:each key={link.href}>
					<a class="unstyled" href={link.href} data-prefetch="load">
						{unsafeHTML(`<i-c o="${link.icon}"></i-c>`)}
						{link.label}
					</a>
				</for:each>
			))}
		</div>

		<div class="create-gracile-command">
			<div class="command-text">
				{installCommand.split(' ').map((part) => (
					<span>{part}</span>
				))}
			</div>

			{unsafeHTML(`<copy-button text="${installCommand}"></copy-button>`)}
		</div>
	</header>
);

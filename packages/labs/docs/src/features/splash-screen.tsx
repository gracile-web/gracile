import { For } from '@gracile-labs/vite-plugin-babel-jsx-to-literals/components/for';

import graphPaper from '../assets/icons/graph-paper.svg' with {
	type: 'svg',
	format: 'lit',
};
import { unsafeHTML } from 'lit/directives/unsafe-html.js';

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
		<For each={Array.from({ length: 8 }).fill(null)}>
			{(_, index) => <div for:key={index} class={`bg bg-${index + 1}`}></div>}
		</For>

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
			<For each={[...splashLinks]}>
				{(link) => (
					<a
						class="unstyled"
						href={link.href}
						data-prefetch="load"
						for:key={link.href}
					>
						{unsafeHTML(`<i-c o="${link.icon}"></i-c>`)}
						{link.label}
					</a>
				)}
			</For>
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

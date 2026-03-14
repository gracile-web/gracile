import graphPaper from '../assets/icons/graph-paper.svg' with {
	type: 'svg',
	format: 'lit',
};
import gracileLogo from '../assets/gracile-logo.svg' with {
	type: 'svg',
	format: 'lit',
};
import { For } from '@gracile-labs/vite-plugin-babel-jsx-to-literals/components/for';

export const SplashScreen = () => (
	<header class="m-splash-screen">
		<For each={Array.from({ length: 8 }).fill(null)}>
			{(_, i) => <div for:key={i} class={`bg bg-${i}`}></div>}
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

		<div class="logo">{gracileLogo}</div>

		<p class="description">
			A thin, full-stack,
			<strong>web</strong> framework
		</p>

		<div class="ctas">
			<a class="unstyled" href={`/docs/references/`} data-prefetch="load">
				<i-c o="books-duotone"></i-c>
				References
			</a>

			<a
				class="unstyled"
				href={`/docs/learn/getting-started/`}
				data-prefetch="load"
			>
				<i-c o="play-duotone"></i-c>
				Get started
			</a>

			<a
				class="unstyled"
				href={
					'/docs/playground/' /* NOTE: When finished, use `/playground/`, not the placeholder */
				}
				data-prefetch="load"
			>
				<i-c o="app-window-duotone"></i-c>
				Playground
			</a>
		</div>

		<div class="create-gracile-command">
			<div class="command-text">
				<span>npm</span> <span>create</span> <span>gracile@latest</span>
			</div>

			<copy-button text="npm create gracile@latest"></copy-button>
		</div>
	</header>
);

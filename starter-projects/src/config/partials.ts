// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-nocheck ...
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { exec } from '../utils.js';

const filesEmojis = {
	scss: '🟪',
	css: '🔷',
	js: '🟨',
	ts: '🟦',
	json: '🟠',
	svg: '🔶',
	md: '⬛️',
	'/': '📂',
};

// [🕹️ Try it online](${opt.tryout})

export function containers(name: string, center = true) {
	return `
<div${center ? ' align="center"' : ''}>

[![Edit in CodeSandbox](https://codesandbox.io/static/img/play-codesandbox.svg)](https://codesandbox.io/s/github/gracile-web/starter-projects/tree/main/templates/${name}?embed=1)
&nbsp;&nbsp;&nbsp;&nbsp;
[![Open in StackBlitz](https://developer.stackblitz.com/img/open_in_stackblitz.svg)](https://stackblitz.com/github/gracile-web/starter-projects/tree/main/templates/${name})

</div>
`;
}

export const partials = {
	readme: async (opt: {
		name: string;
		title: string;
		features?: string | undefined;
		description?: string | undefined;
		tryout?: string | undefined;
	}) => /* md */ `# Gracile Starter Project: ${opt.title}
${opt.description ? `\n${opt.description}\n` : ''}
\`\`\`sh
npm create gracile@latest -t ${opt.name}
\`\`\`
${
	opt.features
		? `
Features:

${opt.features}
`
		: ''
}${opt.containers ? containers(opt.name) : ''}
<div class="git-only">

> 🧚 **Already a Gracile pro?** Delete this file. Have fun!

</div>

## 🏗️ Project Structure

\`\`\`text
${(
	await exec(
		`tree -F -I 'node_modules|dist|*-lock.yaml' templates/${opt.name}/`,
	)
).stdout
	.split('\n')
	.slice(1, -3)
	.join('\n')
	//
	.replaceAll(/─ (.*)\.(.*)/g, (_, s, s2) => ` ${filesEmojis[s2]} ${s}.${s2}`)
	.replaceAll(/─ (.*)\//g, (_, s) => ` ${filesEmojis['/']} ${s}/`)}
\`\`\`

## 🪄 Commands

All commands are run from the root of the project, from a terminal:

| Command              | Action                                       |
| :------------------- | :------------------------------------------- |
| \`npm install\`        | Installs dependencies                        |
| \`node --run dev\`     | Starts local dev server at \`localhost:4567\`  |
| \`node --run check\`   | Type-check your project sources              |
| \`node --run build\`   | Build your production site to \`./dist/\`      |
| \`node --run preview\` | Preview your build locally, before deploying |

## 🛠️ Tooling

Enhance your developer experience with the **Lit Analyzer** toolset and
**Prettier**.

For syntax highlight, **HTML** and **CSS** MDN references, **custom elements**
attributes/properties **hints**, **validation** etc., checkout:

The VS Code extension:

\`\`\`sh
code --install-extension runem.lit-plugin
\`\`\`

Or the [TypeScript Language Server plugin](https://github.com/runem/lit-analyzer/tree/master/packages/ts-lit-plugin#-installation)
for NeoVim, Zed, etc.

---

For general **formatting**,
with support for HTML and CSS **template tag literals** in JavaScript:

\`\`\`sh
npm i prettier
\`\`\`

## 🧠 Want to learn more?

Check out the [Gracile documentation](https://gracile.js.org) or
jump into the [Discord server](https://gracile.js.org/chat/).
`,
};

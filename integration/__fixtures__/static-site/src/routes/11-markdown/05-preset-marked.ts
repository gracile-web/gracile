import { defineRoute } from '@gracile/server/route';
import { html } from 'lit';

import { document } from '../../documents/document-with-assets.js';
import typographyMd from './_assets/typography.md' with { type: 'md-lit' };

export default defineRoute({
	document: (context) => document(context),

	template: (context) => html`
		<h1>Hello Markown - Marked</h1>
		<hr />
		<code>${context.url.pathname}</code>
		<hr />

		1
		<details>
			<summary>body.lit</summary>
			<div>${typographyMd.body.lit}</div>
		</details>
		<hr />

		2
		<details>
			<summary>path.absolute</summary>
			<code>${typographyMd.path.absolute.at(-1)}</code>
		</details>
		<hr />

		3
		<details>
			<summary>path.relative</summary>
			<code>${typographyMd.path.relative}</code>
		</details>
		<hr />

		4
		<details>
			<summary>source.file</summary>
			<pre>${typographyMd.source.file}</pre>
		</details>
		<hr />

		5
		<details>
			<summary>source.markdown</summary>
			<pre>${typographyMd.source.markdown}</pre>
		</details>
		<hr />

		6
		<details>
			<summary>source.yaml</summary>
			<pre>${typographyMd.source.yaml}</pre>
		</details>
		<hr />

		7
		<details>
			<summary>body.html</summary>
			<pre>${typographyMd.body.html}</pre>
		</details>
		<hr />

		8
		<details>
			<summary>meta.frontmatter</summary>
			<pre>${JSON.stringify(typographyMd.meta.frontmatter, null, 2)}</pre>
		</details>
		<hr />

		9
		<details>
			<summary>meta.tableOfContents</summary>
			<pre>${JSON.stringify(typographyMd.meta.tableOfContents, null, 2)}</pre>
		</details>
		<hr />

		10
		<details>
			<summary>meta.tableOfContentsFlat</summary>
			<pre>
${JSON.stringify(typographyMd.meta.tableOfContentsFlat, null, 2)}</pre
			>
		</details>
		<hr />

		11
		<details>
			<summary>meta.title</summary>
			<code>${typographyMd.meta.title}</code>
		</details>
		<hr />
	`,
});

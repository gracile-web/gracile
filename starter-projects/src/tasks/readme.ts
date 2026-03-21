import { writeFile } from 'node:fs/promises';
import { join } from 'node:path';

import { templates } from '../config/templates.js';
import { containers } from '../config/partials.js';
import { slug } from 'github-slugger';

let readme = `# 🎇 Starter projects

<div class="git-only">

_Gracile_.  
A thin, full-stack, **web** framework.

**Features**:

- Portable **HTML**, **CSS** and **JS**, thanks to **Lit (SSR)**.
- Highly responsive during dev. and build, thanks to **Vite**.
- **Minimal dependency footprint** for its **runtime** and your **distributable**.
- Embrace web standards like **Custom Elements** (aka Web Components) or the **WhatWG Fetch** API.
- A streamlined **D**eveloper e**X**perience for building, instead of fiddling around.

---

**Starters**:
${templates
	.map((template) => {
		return `
- [${template.title}](#${slug(template.title)})`;
	})
	.join('')}

</div>

<section class="cards tiles">
`;

templates.forEach(async (template) => {
	readme += `
<div class="card"><div class="card-content">

## ${template.title}

${template.description}
${template.features ? '\n' + template.features + '\n\n---' : ''}

📥 **CLI**:

\`\`\`sh
npm create gracile@latest -t ${template.name}
\`\`\`
${containers(template.name, false)}
⏬ **Download**:

\`\`\`sh
npx degit gracile-web/starter-projects/templates/${template.name} my-project
\`\`\`

📑 **Sources**: [${template.name}](https://github.com/gracile-web/gracile/tree/main/starter-projects/templates/${template.name})

</div></div>
`;
});

readme += `
</section>

<div class="git-only">

---

- [Documentation website (gracile.js.org)](https://gracile.js.org/)
- [Documentation website repository](https://github.com/gracile-web/website)

---

> “Perfection is achieved, not when there is nothing more to add,
> but when there is nothing left to take away.”
>
> ― [Antoine de Saint-Exupéry](https://en.wikipedia.org/wiki/Antoine_de_Saint-Exup%C3%A9ry), _Airman's Odyssey_

</div>
`;

const rdme = join(process.cwd(), 'README.md');
await writeFile(rdme, readme); // NOTE: DUMMY

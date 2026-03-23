/* eslint-disable @typescript-eslint/no-explicit-any */
import type { Template, Strategy } from './models.js';
import typescript from './strategies/typescript.js';

export interface ParseLiteralsOptions {
	fileName?: string | undefined;
	strategy?: Partial<Strategy<any>> | undefined;
}

export function parseLiterals(
	source: string,
	options: ParseLiteralsOptions = {},
): Template[] {
	const strategy = {
		...(<Strategy<any>>typescript),
		...options.strategy,
	};

	const literals: Template[] = [];
	const visitedTemplates: any[] = [];
	strategy.walkNodes(strategy.getRootNode(source, options.fileName), (node) => {
		if (strategy.isTaggedTemplate(node)) {
			const template = strategy.getTaggedTemplateTemplate(node);
			visitedTemplates.push(template);
			literals.push({
				tag: strategy.getTagText(node),
				parts: strategy.getTemplateParts(template),
			});
		} else if (strategy.isTemplate(node) && !visitedTemplates.includes(node)) {
			literals.push({
				parts: strategy.getTemplateParts(node),
			});
		}
	});

	return literals;
}

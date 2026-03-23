import * as ts from 'typescript';

/**
 * Represents a `<script>` block with a `lang="ts|typescript"` attribute,
 * extracted by the HTML-aware parser.
 */
interface TypeScriptScriptBlock {
	/** Full outer match: `<script lang="ts" ...>content</script>` */
	outerStart: number;
	outerEnd: number;
	/** The script content (between `>` and `</script>`) */
	content: string;
	/** The opening tag's attributes string (e.g., ` lang="ts" type="module"`) */
	attributes: string;
}

/**
 * Extracts `<script lang="ts|typescript">` blocks from HTML using a simple
 * state-machine parser. This avoids regex pitfalls such as:
 * - `</script>` appearing inside string literals within the script
 * - Attributes spanning multiple lines or with irregular spacing
 * - Quoted attribute values containing `>`
 */
export function extractTypeScriptScripts(
	html: string,
): TypeScriptScriptBlock[] {
	const blocks: TypeScriptScriptBlock[] = [];
	let pos = 0;

	while (pos < html.length) {
		// Find next <script (case-insensitive)
		const tagStart = html.toLowerCase().indexOf('<script', pos);
		if (tagStart === -1) break;

		// Ensure it's followed by whitespace or > (not e.g. <scripting>)
		const afterTag = html[tagStart + 7];
		if (afterTag !== undefined && afterTag !== '>' && !/\s/.test(afterTag)) {
			pos = tagStart + 7;
			continue;
		}

		// Parse through attributes to find the closing >
		const attrsEnd = findTagEnd(html, tagStart + 7);
		if (attrsEnd === -1) break;

		const attributes = html.slice(tagStart + 7, attrsEnd);

		// Check if this script has lang="ts" or lang="typescript"
		if (!isTypeScriptLang(attributes)) {
			pos = attrsEnd + 1;
			continue;
		}

		// Find the closing </script> — must handle nested quotes in content
		const contentStart = attrsEnd + 1;
		const closingTag = findClosingScriptTag(html, contentStart);
		if (closingTag === -1) break;

		const content = html.slice(contentStart, closingTag);
		const outerEnd = html.indexOf('>', closingTag) + 1;

		blocks.push({
			outerStart: tagStart,
			outerEnd,
			content,
			attributes,
		});

		pos = outerEnd;
	}

	return blocks;
}

/**
 * Finds the index of the closing `>` of an opening tag, correctly skipping
 * over quoted attribute values that may contain `>`.
 */
function findTagEnd(html: string, start: number): number {
	let pos = start;
	while (pos < html.length) {
		const ch = html[pos];
		if (ch === '>') return pos;
		if (ch === '"' || ch === "'") {
			// Skip quoted value
			const closeQuote = html.indexOf(ch, pos + 1);
			if (closeQuote === -1) return -1;
			pos = closeQuote + 1;
			continue;
		}
		pos++;
	}
	return -1;
}

/**
 * Checks whether an attributes string contains `lang="ts"` or
 * `lang="typescript"` (case-insensitive, tolerant of spacing around `=`).
 */
function isTypeScriptLang(attributes: string): boolean {
	return /\blang\s*=\s*('|")(?:ts|typescript)\1/i.test(attributes);
}

/**
 * Finds the start index of the `</script>` closing tag from a given position,
 * case-insensitively.
 */
function findClosingScriptTag(html: string, start: number): number {
	const lower = html.toLowerCase();
	let pos = start;
	while (pos < lower.length) {
		const idx = lower.indexOf('</script', pos);
		if (idx === -1) return -1;
		// Verify the next char is > or whitespace (not e.g. </scripting>)
		const after = lower[idx + 8];
		if (after === '>' || after === undefined || /\s/.test(after)) {
			return idx;
		}
		pos = idx + 8;
	}
	return -1;
}

/**
 * Strips TypeScript types from all `<script lang="ts|typescript">` blocks
 * in the given HTML string. Returns the HTML with script contents transpiled
 * to plain JS (types erased, no syntax downleveling) and `lang` attributes
 * removed.
 */
export function stripTypeScriptInScripts(html: string): string {
	const blocks = extractTypeScriptScripts(html);
	if (blocks.length === 0) return html;

	// Process in reverse order to preserve indices
	let result = html;
	for (let i = blocks.length - 1; i >= 0; i--) {
		const block = blocks[i];

		const stripped = ts.transpileModule(block!.content, {
			compilerOptions: {
				target: ts.ScriptTarget.ESNext,
				module: ts.ModuleKind.ESNext,
			},
		}).outputText;

		const cleanedAttrs = block!.attributes.replace(
			/\s*\blang\s*=\s*('|")(?:ts|typescript)\1/i,
			'',
		);

		const replacement = `<script${cleanedAttrs}>${stripped}</script>`;
		result =
			result.slice(0, block!.outerStart) +
			replacement +
			result.slice(block!.outerEnd);
	}

	return result;
}

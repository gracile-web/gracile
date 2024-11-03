import type { ErrorLocation } from '../errors.js';

export function normalizeLF(code: string) {
	return code.replaceAll(/\r\n|\r(?!\n)|\n/g, '\n');
}

/** Generate a code frame from string and an error location */
export function codeFrame(source: string, loc: ErrorLocation): string {
	if (!loc || loc.line === undefined || loc.column === undefined) {
		return '';
	}
	const lines = normalizeLF(source)
		.split('\n')
		.map((ln) => ln.replaceAll('\t', '  '));
	// grab 2 lines before, and 3 lines after focused line
	const visibleLines = [];
	for (let n = -2; n <= 2; n += 1) {
		if (lines[loc.line + n]) visibleLines.push(loc.line + n);
	}
	// figure out gutter width
	let gutterWidth = 0;
	for (const lineNo of visibleLines) {
		const w = `> ${lineNo}`;
		if (w.length > gutterWidth) gutterWidth = w.length;
	}
	// print lines
	let output = '';
	for (const lineNo of visibleLines) {
		const isFocusedLine = lineNo === loc.line - 1;
		output += isFocusedLine ? '> ' : '  ';
		output += `${lineNo + 1} | ${lines[lineNo]}\n`;
		if (isFocusedLine)
			output += `${Array.from({ length: gutterWidth }).join(' ')}  | ${Array.from(
				{
					length: loc.column,
				},
			).join(' ')}^\n`;
	}
	return output;
}

import type MagicString from 'magic-string';

// ---------------------------------------------------------------------------
// MagicString source-edit helpers
// ---------------------------------------------------------------------------

/**
 * Remove a decorator from the source. If it occupies its own line,
 * the entire line (including newline) is removed. Otherwise only the
 * decorator text and trailing spaces are stripped.
 */
export function removeDecoratorRange(
	s: MagicString,
	source: string,
	start: number,
	end: number,
): void {
	let lineStart = start;
	while (lineStart > 0 && source[lineStart - 1] !== '\n') lineStart--;

	const beforeOnLine = source.slice(lineStart, start);

	let eol = end;
	while (eol < source.length && source[eol] !== '\n') eol++;
	const afterOnLine = source.slice(end, eol);

	if (/^\s*$/.test(beforeOnLine) && /^\s*$/.test(afterOnLine)) {
		if (eol < source.length && source[eol] === '\n') eol++;
		s.remove(lineStart, eol);
	} else {
		let cleanEnd = end;
		while (cleanEnd < source.length && source[cleanEnd] === ' ') cleanEnd++;
		s.remove(start, cleanEnd);
	}
}

/** Remove an entire class member (decorators + field declaration) and its line. */
export function removeFieldMember(
	s: MagicString,
	source: string,
	start: number,
	end: number,
): void {
	let lineStart = start;
	while (lineStart > 0 && source[lineStart - 1] !== '\n') lineStart--;
	let lineEnd = end;
	while (
		lineEnd < source.length &&
		/[\s;]/.test(source[lineEnd]!) &&
		source[lineEnd] !== '\n'
	)
		lineEnd++;
	if (lineEnd < source.length && source[lineEnd] === '\n') lineEnd++;
	s.remove(lineStart, lineEnd);
}

/** Remove an entire line spanning [start, end]. */
export function removeFullLine(
	s: MagicString,
	source: string,
	start: number,
	end: number,
): void {
	let lineStart = start;
	while (lineStart > 0 && source[lineStart - 1] !== '\n') lineStart--;
	let lineEnd = end;
	while (lineEnd < source.length && source[lineEnd] !== '\n') lineEnd++;
	if (lineEnd < source.length && source[lineEnd] === '\n') lineEnd++;
	s.remove(lineStart, lineEnd);
}

/**
 * Replace a full class member (from decorator start to member end),
 * consuming the preceding whitespace/newline so the getter sits cleanly.
 */
export function replaceFullMember(
	s: MagicString,
	source: string,
	start: number,
	end: number,
	replacement: string,
): void {
	let lineStart = start;
	while (lineStart > 0 && source[lineStart - 1] !== '\n') lineStart--;

	let lineEnd = end;
	while (
		lineEnd < source.length &&
		/[\s;]/.test(source[lineEnd]!) &&
		source[lineEnd] !== '\n'
	)
		lineEnd++;
	if (lineEnd < source.length && source[lineEnd] === '\n') lineEnd++;

	s.overwrite(lineStart, lineEnd, replacement + '\n');
}

/**
 * Detect the indentation used for class members by looking at the
 * whitespace preceding the first member in the class body.
 */
export function detectMemberIndent(
	source: string,
	bodyStart: number,
	/* eslint-disable-next-line @typescript-eslint/no-explicit-any */
	members: any[],
): string {
	if (members.length === 0) return '\t';

	const first = members[0];
	let position = first.start as number;
	while (position > bodyStart && source[position - 1] !== '\n') position--;
	const leading = source.slice(position, first.start);
	const match = /^(\s*)/.exec(leading);
	return match?.[1] || '\t';
}

/**
 * Derive a single indent unit from member indentation.
 * E.g. if members are at `\t\t`, unit is `\t`; if at `    `, unit is `  ` (or `    `).
 */
export function indentUnit(memberIndent: string): string {
	if (memberIndent.includes('\t')) return '\t';
	// Guess the smallest repeating space unit (2 or 4)
	if (memberIndent.length >= 4 && memberIndent.length % 4 === 0) return '    ';
	if (memberIndent.length >= 2 && memberIndent.length % 2 === 0) return '  ';
	return memberIndent || '\t';
}

/** Get the start of a member including its decorators. */
/* eslint-disable-next-line @typescript-eslint/no-explicit-any */
export function firstDecoratorStart(member: any): number {
	if (member.decorators?.length > 0) return member.decorators[0].start;
	return member.start;
}

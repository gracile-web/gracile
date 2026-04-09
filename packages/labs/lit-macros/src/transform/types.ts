import type MagicString from 'magic-string';

/* eslint-disable @typescript-eslint/no-explicit-any */

export interface TransformResult {
	code: string;
	map: ReturnType<MagicString['generateMap']>;
}

export interface TransformOptions {
	sourceFileName?: string | undefined;
}

export interface ImportRecord {
	start: number;
	end: number;
	specifiers: any[];
}

export interface PropertyEntry {
	name: string;
	options: string;
}

export interface GetterReplacement {
	/** Full range of the member to replace (decorator + field). */
	memberStart: number;
	memberEnd: number;
	/** The getter source that replaces the member. */
	getterCode: string;
}

export interface ClassEdit {
	defineTag?: string | undefined;
	className: string;
	classEnd: number;
	bodyStart: number;
	bodyMembers: any[];
	properties: PropertyEntry[];
	decoratorsToRemove: Array<{ start: number; end: number }>;
	fieldRemovals: Array<{ start: number; end: number }>;
	constructorInits: Array<{ name: string; initText: string }>;
	constructorInfo?: { superCallEnd: number } | undefined;
	getterReplacements: GetterReplacement[];
}

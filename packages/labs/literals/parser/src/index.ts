import typescript, { TypescriptStrategy } from './strategies/typescript.js';

export * from './models.js';
export * from './parse-literals.js';
export const strategies = {
	typescript: <TypescriptStrategy>typescript,
};

// Hand-written. DO NOT REMOVE.

declare module '*.md' {
	const markdownModule: import('./dist/module.js').MarkdownModule;

	export default markdownModule;
}

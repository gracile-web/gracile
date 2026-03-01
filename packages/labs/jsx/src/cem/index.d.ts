import * as schema from 'custom-elements-manifest';

/**
 * CEM TYPES
 */

interface CssProperty extends schema.CssCustomProperty {
	type?: {
		text?: string;
	};
}

interface Component extends schema.CustomElementDeclaration {
	cssProperties?: CssProperty[];
	members?: Array<schema.ClassMember>;
	superclass?: {
		name?: string;
		package?: string;
		module?: string;
	};
}

interface CustomModule extends schema.JavaScriptModule {
	/**
	 * The declarations of a module.
	 *
	 * For documentation purposes, all declarations that are reachable from
	 * exports should be described here. Ie, functions and objects that may be
	 * properties of exported objects, or passed as arguments to functions.
	 */
	declarations?: Array<Component>;
}

interface CEM extends schema.Package {
	/**
	 * An array of the modules this package contains.
	 */
	modules: Array<CustomModule>;
}

type LooseString<T extends string> = T | Omit<string, T>;

interface BaseOptions {
	/** Path to output directory */
	outdir?: string;
	/** Class names of any components you would like to exclude from the custom data */
	exclude?: string[];
	/** The property name from the component object that you would like to use for the description of your component */
	descriptionSrc?: LooseString<'description' | 'summary'>;
	/** Displays the slot section of the element description */
	hideSlotDocs?: boolean;
	/** Displays the event section of the element description */
	hideEventDocs?: boolean;
	/** Displays the CSS custom properties section of the element description */
	hideCssPropertiesDocs?: boolean;
	/** Displays the CSS parts section of the element description */
	hideCssPartsDocs?: boolean;
	/** Displays the methods section of the element description */
	hideMethodDocs?: boolean;
	/** Overrides the default section labels in the component description */
	labels?: DescriptionLabels;
	/** The property form your CEM component object to display your types */
	typesSrc?: string;
	/** Hides logs produced by the plugin */
	hideLogs?: boolean;
	/** Prevents plugin from executing */
	skip?: boolean;
}
interface DescriptionLabels {
	slots?: string;
	events?: string;
	cssProperties?: string;
	cssParts?: string;
	methods?: string;
}

interface Options extends BaseOptions {
	/** Name of the file generated */
	fileName?: string;
	/** Component names to exclude form process */
	exclude?: string[];
	/** Used to get global type reference for components */
	globalTypePath?: string;
	/** Used to get a specific path for a given component */
	componentTypePath?: (name: string, tag?: string) => string;
	/** Indicates if the component classes are a default export rather than a named export */
	defaultExport?: boolean;
	/** The property form your CEM component object to display your types */
	typesSrc?: string;
	/** Used to add global element props to all component types */
	globalEvents?: string;
	/** Adds a prefix to tag references */
	prefix?: string;
	/** Adds a suffix to tag references */
	suffix?: string;
}

interface Parameters_ {
	customElementsManifest: CEM;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
declare function generateLitTypes(manifest: any, options: Options): void;

declare function customElementLitPlugin(options?: Options): {
	name: string;
	packageLinkPhase({ customElementsManifest }: Parameters_): void;
};

export { customElementLitPlugin, generateLitTypes };

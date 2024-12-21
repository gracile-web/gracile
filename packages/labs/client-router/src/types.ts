import type { URLPattern } from 'urlpattern-polyfill';

export interface Config {
	fallback?: string | undefined;
	plugins?: Plugin[] | undefined;
	routes: RouteDefinition[];
	signalHost?: boolean | undefined;
}

export interface Plugin {
	name: string;
	shouldNavigate?: (context: Context) => {
		redirect: string;
		condition: () => boolean | (() => Promise<boolean>);
	};
	beforeNavigation?: (context: Context) => Promise<void> | void;
	afterNavigation?: (context: Context) => Promise<void> | void;
}

export interface Context {
	title?: string | undefined;
	query: Record<string, string>;
	parameters: Partial<Record<string, string>>;
	url: URL;
	[key: string]: unknown;
}

export type Render<RenderResult> = (
	context: Context,
) => Promise<RenderResult> | RenderResult;

export interface RouteDefinition<RenderResult = unknown> {
	path: string;
	title: string | ((context: Partial<Context>) => string);
	render?: Render<RenderResult> | undefined;
	plugins?: Plugin[] | undefined;
}

export type Route = RouteDefinition & {
	urlPattern?: URLPattern | undefined;
};

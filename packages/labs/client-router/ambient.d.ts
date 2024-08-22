declare module 'gracile:client:routes' {
	export const enabled: boolean;

	export const mode: 'static' | 'server';

	export const routeImports: Map<
		string,
		() => Promise<{
			default: (
				routeModule: typeof import('@gracile/engine/routes/route').RouteModule,
			) => import('@gracile/engine/routes/route').RouteModule;
		}>
	>;
}

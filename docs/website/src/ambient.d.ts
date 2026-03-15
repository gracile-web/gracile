/// <reference types="@gracile/gracile/ambient" />
/// <reference types="@gracile/markdown/ambient" />

declare module 'iconify:loader' {
	export const iconSet: {
		prefix: string;
		icons: Record<string, { body: string }>;
	};
}

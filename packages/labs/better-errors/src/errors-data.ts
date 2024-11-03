/* eslint-disable @typescript-eslint/no-explicit-any */

// Built-ins

export interface BetterErrorData {
	name: string;
	title: string;
	message?: string | ((...parameters: any) => string) | undefined;
	hint?: string | ((...parameters: any) => string) | undefined;
}

/**
 *
 */
export const FailedToLoadModuleSSR = {
	name: 'FailedToLoadModuleSSR',
	title: 'Could not import file.',
	message: (importName: string) => `Could not import \`${importName}\`.`,
	hint: 'This is often caused by a typo in the import path. Please make sure the file exists.',
} satisfies BetterErrorData;

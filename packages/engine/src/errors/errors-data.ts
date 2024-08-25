/* eslint-disable @typescript-eslint/no-explicit-any */

export interface ErrorData {
	name: string;
	title: string;
	message?: string | ((...params: any) => string) | undefined;
	hint?: string | ((...params: any) => string) | undefined;
}

/**
 * @docs
 * @kind heading
 * @name Gracile Errors
 */
// Gracile Errors, most errors will go here!

/**
 *
 */
export const FailedToLoadModuleSSR = {
	name: 'FailedToLoadModuleSSR',
	title: 'Could not import file.',
	message: (importName: string) => `Could not import \`${importName}\`.`,
	hint: 'This is often caused by a typo in the import path. Please make sure the file exists.',
} as const satisfies ErrorData;
/**
 *
 */
// export const FailedToGlobalLogger = {
// 	name: 'FailedToGlobalLogger',
// 	title: 'Could not get the global logger.',
// 	message: undefined,
// 	hint: 'This a Gracile internal fault.',
// };
// /**
//  *
//  */
// export const FailedToGetGracileVersion = {
// 	name: 'FailedToGetGracileVersion',
// 	title: 'Version must be set before.',
// 	message: undefined,
// 	hint: 'This a Gracile internal fault.',
// } as const satisfies ErrorData;
/**
 *
 */
export const InvalidRequestInAdapter = {
	name: 'InvalidRequestInAdapter',
	title: 'Invalid request in adapter.',
	message: (adapterName: string) =>
		`Invalid request for adapter name: \`${adapterName}\`.`,
	hint: 'Check that you have configured the adapter correctly.',
} as const satisfies ErrorData;
/**
 *
 */
export const InvalidResponseInAdapter = {
	name: 'InvalidResponseInAdapter',
	title: 'Invalid response in adapter.',
	message: (adapterName: string) =>
		`Invalid response for adapter name: \`${adapterName}\`.`,
	hint: undefined,
} as const satisfies ErrorData;
/**
 *
 */
export const InvalidRouteDocument = {
	name: 'RoutePageRender',
	title: 'Invalid route document configuration.',
	message: (routePath: string) =>
		`Route document must be a function for: \`${routePath}\`.`,
	hint: undefined,
} as const satisfies ErrorData;
/**
 *
 */
export const InvalidRouteDocumentResult = {
	name: 'RoutePageRender',
	title: 'Incorrect document template result.',
	message: (routePath: string) =>
		`Incorrect document template result for: \`${routePath}\`.`,
	hint: undefined,
} as const satisfies ErrorData;
/**
 *
 */
export const InvalidRouteExport = {
	name: 'InvalidRouteExport',
	title: 'Invalid route export.',
	message: (routePath: string) => `Incorrect route module: \`${routePath}\`.`,
	hint: `Should export a default \`defineRoute\` function.`,
} as const satisfies ErrorData;
/**
 *
 */
export const CouldNotRenderRouteDocument = {
	name: 'CouldNotRenderRouteDocument',
	title: 'Could not render the route document.',
	message: (routePath: string) =>
		`Could not render the route document for: \`${routePath}\`.`,
	hint: undefined,
} as const satisfies ErrorData;
/**
 *
 */
// export const NoRoutesFound = {
// 	name: 'NoRoutesFound',
// 	title: 'Could not find any routes.',
// 	message: `Could not find any routes for your project.`,
// 	hint: 'You have to populate the `src/routes` folder.',
// };

// `Wrong template result for fragment template ${routeInfos.foundRoute.filePath}.`,

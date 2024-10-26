import { pathToFileURL } from 'node:url';

import { getLogger } from '@gracile/internal-utils/logger/helpers';
import { formatErrorMessage } from '@gracile-labs/better-errors/dev/logger';
import { collectErrorMetadata } from '@gracile-labs/better-errors/dev/utils';
import { getViteErrorPayload } from '@gracile-labs/better-errors/dev/vite';
import type { ErrorPayload, ViteDevServer } from 'vite';

import { renderLitTemplate } from '../render/utils.js';

import { GRACILE_JS_ERRORS_DOCS_BASE, GracileErrorData } from './errors.js';
import { builtInErrorPage } from './pages.js';

const logger = getLogger();

export async function emitViteBetterError({
	error,
	vite,
}: {
	error: Error;
	vite: ViteDevServer;
}) {
	const errorWithMetadata = collectErrorMetadata(
		error,
		pathToFileURL(vite.config.root),
	);
	logger.error(
		formatErrorMessage(
			errorWithMetadata,
			false,
			GracileErrorData,
			GRACILE_JS_ERRORS_DOCS_BASE,
		),
		{ timestamp: true },
	);
	const payload = await getViteErrorPayload({
		docsBaseUrl: GRACILE_JS_ERRORS_DOCS_BASE,
		errorsData: GracileErrorData,
		err: errorWithMetadata,
	});
	setTimeout(() => {
		vite.hot.send(payload as ErrorPayload);
		// NOTE: Arbitrary value. Lower seems to be too fast, higher is not guaranteed to work.
	}, 200);
	const errorPage = builtInErrorPage(error.name ?? 'Error', true);

	const renderedErrorPage = await renderLitTemplate(errorPage);
	return renderedErrorPage;
}

/**
 * Shared integration-test helpers for the Gracile monorepo.
 *
 * Re-exports all helpers in a single module for convenience.
 */

// Server lifecycle
export { createTestServer, buildFixture, type TestServer } from './server.js';

// HTTP fetch
export { get, getText, urlPath } from './fetch.js';

// HTML assertions (cheerio)
export {
	parseHtml,
	assertTitle,
	assertTitleIncludes,
	assertH1,
	assertText,
	assertExists,
	assertTextIncludes,
	assertBodyIncludes,
	assertBodyExcludes,
	assertAttribute as assertAttr,
	assertStatus,
	assertContentType,
	assertHeader,
	assertRedirected,
	type Document_ as Doc,
} from './html.js';

// Build assertions
export {
	assertFileExists,
	listDirectory as listDir,
	readFixtureFile,
	assertBuildContains,
	assertHtmlFile,
} from './build.js';

// Process management
export { launchServer, type ServerProcess } from './process.js';

// Fixtures
export { resolveFixtures } from './fixtures.js';

// Utilities
export { noop } from './noop.js';

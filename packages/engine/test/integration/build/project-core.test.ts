/**
 * Static-site build verification.
 *
 * Instead of byte-for-byte tree comparison, verify that the build produces
 * the expected file structure and that key HTML files have correct content.
 */

/* eslint-disable @typescript-eslint/no-floating-promises */
import { describe, it, before } from 'node:test';

import {
	assertBuildContains,
	assertHtmlFile,
} from '@gracile/internal-test-utils/build';
import { buildFixture } from '@gracile/internal-test-utils/server';

describe('static-site build', () => {
	before(async () => {
		await buildFixture('static-site');
	});

	it('produces core output files', async () => {
		await assertBuildContains('static-site', 'dist', [
			'index.html',
			'404.html',
			'favicon.svg',
		]);
	});

	it('generates all route pages', async () => {
		await assertBuildContains('static-site', 'dist', [
			'00-routes/00-basic/index.html',
			'00-routes/01-doc-only/index.html',
			'00-routes/02-top-handler/index.html',
			'00-routes/03-get-handler/index.html',
			'00-routes/01-param/jupiter/index.html',
			'00-routes/01-param/omega/index.html',
		]);
	});

	it('generates torture-test route pages', async () => {
		await assertBuildContains('static-site', 'dist', [
			'05-torture-test/index.html',
			'05-torture-test/shoot-or/index.html',
			'05-torture-test/formal/index.html',
			'05-torture-test/popular/index.html',
			'05-torture-test/car/bike/boat/index.html',
			'05-torture-test/car/bike/boat/train/index.html',
			'05-torture-test/car/bike/boat/zeppelin/index.html',
		]);
	});

	it('generates addon route pages', async () => {
		await assertBuildContains('static-site', 'dist', [
			'01-assets/00-siblings/index.html',
			'01-assets/02-import-with-query-css-inline/index.html',
			'03-custom-elements/00-lit-full/index.html',
			'09-metadata/00-metadata/index.html',
			'10-svg/00-svg/index.html',
			'11-markdown/05-preset-marked/index.html',
		]);
	});

	it('generates route-premises pages with endpoints', async () => {
		await assertBuildContains('static-site', 'dist', [
			'12-route-premises/01-page-zebra/index.html',
			'12-route-premises/01-page-zebra/__index.props.json',
			'12-route-premises/01-page-zebra/__index.doc.html',
			'12-route-premises/02-page-lion/index.html',
			'12-route-premises/02-page-lion/__index.props.json',
			'12-route-premises/02-page-lion/__index.doc.html',
		]);
	});

	it('generates hashed asset bundles', async () => {
		await assertBuildContains('static-site', 'dist/assets', ['.js', '.css']);
	});

	it('home page contains expected content', async () => {
		await assertHtmlFile('static-site', 'dist/index.html', {
			bodyIncludes: ['Home !!'],
		});
	});

	it('404 page contains expected content', async () => {
		await assertHtmlFile('static-site', 'dist/404.html', {
			titleIncludes: 'Gracile - 404',
			bodyIncludes: ['404 not found'],
		});
	});

	it('basic route page contains expected content', async () => {
		await assertHtmlFile('static-site', 'dist/00-routes/00-basic/index.html', {
			bodyIncludes: ['Hello world'],
		});
	});

	it('param route pages contain expected content', async () => {
		await assertHtmlFile(
			'static-site',
			'dist/00-routes/01-param/jupiter/index.html',
			{ bodyIncludes: ['One param (static route) - Jupiter'] },
		);
		await assertHtmlFile(
			'static-site',
			'dist/00-routes/01-param/omega/index.html',
			{ bodyIncludes: ['One param (static route) - Omega'] },
		);
	});

	it('doc-only route contains expected content', async () => {
		await assertHtmlFile(
			'static-site',
			'dist/00-routes/01-doc-only/index.html',
			{ bodyIncludes: ['Only a bare doc!'] },
		);
	});
});

/* eslint-disable @typescript-eslint/no-floating-promises */

import assert from 'node:assert';
import { describe, test } from 'node:test';

import * as metadata from '@gracile/metadata';
import * as metadataOptions from '@gracile/metadata/config-options';

import { noop } from '@gracile/internal-test-utils/noop';

describe('@gracile/metadata exports', () => {
	test('createMetadata', () => {
		assert.equal(typeof metadata.createMetadata, 'function');
	});

	test('types', () => {
		const t1: metadataOptions.Breadcrumbs = [{ name: 'a' }];
		const t2: metadataOptions.MetadataConfig = { author: 'a' };

		noop(t1, t2);
	});
});

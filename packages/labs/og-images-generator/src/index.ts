/**
 * @license
 * Julian Cataldo
 * SPDX-License-Identifier: ISC
 */

export type { Metadata, PathsOptions, Page } from './collect.js';

export { fetchFont, OG_SIZE, FONTS } from './render.js';
export type { RenderOptions } from './render.js';

export { styled } from './dummy-literals.js';

export type { ServerRenderedTemplate as LitServerTemplate } from '@lit-labs/ssr';
export type { TemplateOptions, Template } from './generate.js';

export { html } from '@lit-labs/ssr';

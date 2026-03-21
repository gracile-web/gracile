/**
 * @license
 * Julian Cataldo
 * SPDX-License-Identifier: ISC
 */

export * from './generate.js';
export * from './collect.js';
export * from './render.js';
export * from './paths.js';

export { html } from '@lit-labs/ssr';
export { styled } from './dummy-literals.js';

export type { ServerRenderedTemplate as LitServerTemplate } from '@lit-labs/ssr';

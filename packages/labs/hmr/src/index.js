export { gracileHmr } from './hmr-plugin.js';
export { WC_HMR_MODULE_RUNTIME } from './constants.js';

import { litElement } from './presets/lit-element.js';
import { lit } from './presets/lit.js';
import { fastElement } from './presets/fast-element.js';
import { haunted } from './presets/haunted.js';

export const presets = { litElement, lit, fastElement, haunted };

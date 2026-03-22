import { isAbsolute, posix, sep } from 'node:path';

import picoMatch from 'picomatch';

/** @typedef {(path: string) => boolean} Matcher */
/** @typedef {import('./hmr-plugin.js').WcHmrPluginConfig} WcHmrPluginConfig */

/**
 * @param {string} message
 */
export function createErrorMessage(message) {
	return `[@gracile-labs/hmr] ${message}`;
}

/**
 * @param {string} message
 */
export function createError(message) {
	return new Error(createErrorMessage(message));
}

/**
 * @param {WcHmrPluginConfig} config
 * @param {keyof WcHmrPluginConfig} property
 */
function assertOptionalArray(config, property) {
	if (config[property] != null && !Array.isArray(config[property])) {
		throw createError(`Option ${property} must be an array`);
	}
}

/**
 * @param {WcHmrPluginConfig} config
 */
export function parseConfig(config) {
	if (!Array.isArray(config.include) && !Array.isArray(config.exclude)) {
		throw createError(
			'Must provide either an "include" or "exclude" pattern in config.',
		);
	}
	assertOptionalArray(config, 'include');
	assertOptionalArray(config, 'exclude');
	assertOptionalArray(config, 'patches');
	assertOptionalArray(config, 'baseClasses');
	assertOptionalArray(config, 'decorators');
	assertOptionalArray(config, 'functions');
	assertOptionalArray(config, 'presets');

	config.baseClasses = config.baseClasses || [];
	config.baseClasses.push({ name: 'HTMLElement' });

	if (config.presets) {
		for (const preset of config.presets) {
			if (preset.patch) {
				config.patches = config.patches || [];
				config.patches.push(preset.patch);
			}
			if (preset.baseClasses) {
				config.baseClasses.push(...preset.baseClasses);
			}
			if (preset.decorators) {
				config.decorators = config.decorators || [];
				config.decorators.push(...preset.decorators);
			}
		}
	}

	return { ...config };
}

/**
 * @param {string} rootDir
 * @param {string} pattern
 * @returns {Matcher}
 */
function createMatcher(rootDir, pattern) {
	const matcherRootDir = rootDir.split(sep).join('/');
	const resolvedPattern =
		!isAbsolute(pattern) && !pattern.startsWith('*')
			? posix.join(matcherRootDir, pattern)
			: pattern;
	return picoMatch(resolvedPattern);
}

/**
 * @param {string} rootDir
 * @param {string[]} patterns
 * @returns {Matcher}
 */
export function createMatchers(rootDir, patterns) {
	const matchers = patterns.map((p) => createMatcher(rootDir, p));
	return function matcher(path) {
		return matchers.some((m) => m(path));
	};
}

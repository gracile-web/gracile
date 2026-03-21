/*! (c) Andrea Giammarchi - ISC */

/**
 * A value wrap/placeholder to easily find "bound" properties.
 * The `bind(any)` export will result into `.name=${value}` in the template.
 */
export class Bound {
	/**
	 * @param {any} _ a "protected" value to carry along for further `instanceof` checks.
	 */
	constructor(_) {
		this._ = _;
	}
}

const empty =
	/^(?:area|base|br|col|embed|hr|img|input|keygen|link|menuitem|meta|param|source|track|wbr)$/i;
const er = '\x01';
const re = /^on([A-Z])/;
const place = (_, $) => '@' + $.toLowerCase();
const fragment = ['', ''];

/**
 * @typedef {object} attr - a DOM attribute facade with a `name` and a `value`.
 * @property {string} name - the attribute name as shown in the template literal.
 * @property {any} value - the attribute value to pass along to the attribute.
 */

/**
 * Return the `name` and `value` to use with an attribute.
 *  * boolean values transform the `name` as `"?" + name`.
 *  * bound values transform the `name` as `"." + name`
 *  * events like `onX` transform the `name` as `"@" + name`
 *  * strings, numbers, `null`, or `undefined` values don't change the `name`
 * @param {string} name the attribute name.
 * @param {any} value the attribute value.
 * @returns {attr} the attribute facade to use in the template as `name=${value}`.
 */
export const defaultAttribute = (name, value) => {
	console.log({ name, value });

	if (name.startsWith('prop:'))
		return { name: '.' + name.replace('prop:', ''), value: new Bound(value)._ };

	switch (typeof value) {
		case 'string':
		case 'number':
			return { name, value };
		case 'boolean':
			return { name: '?' + name, value };
		case 'object':
		case 'undefined':
			if (value == null) return { name, value };
			if (value instanceof Bound) return { name: '.' + name, value: value._ };
	}
	return { name: name.replace(re, place), value };
};

/**
 * Allow binding values directly to nodes via `name={bind(value)}`.
 * @param {any} value the value expected, in the template, as `.name=${value}`.
 * @returns
 */
export const bind = (value) => new Bound(value);

/**
 * @typedef {object} config - optionally configure the pragma function
 * @property {function} [attribute=defaultAttribute] - a `callback(name, value)` to return a `{name, value}` literal.
 *  If `null` or `undefined` is returned, the attribute is skipped all along.
 * @property {function} [keyed=()=>tag] - a `callback(entry, props)` to return a keyed version of the `tag`.
 * @property {Map<string,string[]>} [cache=new Map()] - a cache for already known/parsed templates.
 * @property {boolean} [xml=false] - treat nodes as XML with self-closing tags.
 */

/**
 * Return an `h` / pragma function usable with JSX transformation.
 * @param {function} tag a template literal tag function to invoke.
 * @param {config} [config={}] an optional configuration object.
 * @returns {function} the `h` / `React.createElement` like pragma function to use with JSX.
 */
export const createPragma = (
	tag,
	{
		attribute = defaultAttribute,
		keyed = () => tag,
		cache = new Map(),
		xml = false,
	} = {},
) =>
	function h(entry, attributes, ...children) {
		const component = typeof entry === 'function';

		// handle fragments as tag array
		if (component && entry === h) return tag.call(this, fragment, children);

		// handle classes and component callbacks (keep µbe classes around)
		if (component && !('tagName' in entry)) {
			// pass {...props, children} to the component
			(attributes || (attributes = {})).children = children;
			return 'prototype' in entry ? new entry(attributes) : entry(attributes);
		}

		// handler µbe classes or regular HTML/SVG/XML cases
		const template = ['<'];
		const args = [template];
		let isKeyed = false;
		let i = 0;
		if (component) {
			args.push(entry);
			i = template.push('') - 1;
		} else template[i] += entry;
		for (const key in attributes) {
			if (key.length) {
				if (key[0] === er)
					template[i] += ` ${key.slice(1)}="${attributes[key]}"`;
				else if (key === 'key') isKeyed = !isKeyed;
				else {
					const attr = attribute(key, attributes[key]);
					if (attr != null) {
						template[i] += ` ${attr.name}="`;
						args.push(attr.value);
						i = template.push('"') - 1;
					}
				}
			}
		}

		// handle children or self-closing XML tags
		const { length } = (children = children.flat());
		template[i] += length || !xml ? '>' : ' />';
		for (let child, j = 0; j < length; j++) {
			child = children[j];
			if (typeof child === 'string') template[i] += child;
			else {
				args.push(child);
				i = template.push('') - 1;
			}
		}

		// handle closing tag
		if (
			length ||
			(!xml &&
				((component && !empty.test(component.tagName)) || !empty.test(entry)))
		) {
			if (component) {
				template[i] += '</';
				args.push(entry);
				template.push('>');
			} else template[i] += `</${entry}>`;
		}

		// be sure the template argument is always the same
		const whole = template.join(er);
		args[0] = cache.get(whole) || template;
		if (args[0] === template) cache.set(whole, template);

		const result = (isKeyed ? keyed(entry, attributes) : tag).apply(this, args);
		// const hasOwn = result.strings.hasOwnProperty;
		// result.strings.hasOwnProperty = (key: string) => key === 'raw';
		// God forbid me for my sins

		return result;
	};

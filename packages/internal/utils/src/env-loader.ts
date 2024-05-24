type Primitive = typeof Boolean | typeof Number | typeof String;

interface ImportMeta {
	env?: unknown;
}
const importMetaEnv = (import.meta as ImportMeta).env;

/**
 * Agnostic (browser, node), type-safe utility to safely ingest environment
 * variables.
 *
 * @param vars Env. variables to fetch from `process.env`/`import.meta.env`.
 * @returns Record with typed/validated variables.
 * @example
 *
 * ```ts
 * const myEnv = safeEnvLoader({
 *  IS_DEV: { type: Boolean },
 *  SITE_URL: { type: String, optional: true },
 *  FOO_API_URL: { type: String, optional: true, fallback: '…' },
 * });
 * ```
 */
export function safeEnvLoader<
	VariablesDefinition extends Record<
		string,
		{
			type: Primitive;
			optional?: boolean | undefined;
			fallback?: ReturnType<Primitive>;
		}
	>,
	VariablesResult = {
		[key in keyof VariablesDefinition]: VariablesDefinition[key]['optional'] extends true
			? VariablesDefinition[key]['fallback'] extends ReturnType<Primitive>
				? ReturnType<VariablesDefinition[key]['type']>
				: ReturnType<VariablesDefinition[key]['type']> | null
			: ReturnType<VariablesDefinition[key]['type']>;
	},
>(vars: VariablesDefinition): Readonly<VariablesResult> {
	const fullEnv = {} as Record<string, unknown>;

	if (typeof process.env === 'object' && process.env)
		Object.assign(fullEnv, process.env);

	if (typeof importMetaEnv === 'object' && importMetaEnv)
		Object.assign(fullEnv, importMetaEnv);

	const resultingEnv = Object.fromEntries(
		Object.entries(vars).map(([variable, value]) => {
			let coercedValue: ReturnType<Primitive> | null = null;

			// MARK: Coercition
			if (variable in fullEnv)
				switch (value.type) {
					case Boolean: {
						const v = String(fullEnv[variable]);
						if (v === 'true') coercedValue = true;
						else if (v === 'false') coercedValue = false;
						else throw new Error('Should be a boolean.');
						break;
					}

					case Number:
						if (Number.isNaN(fullEnv[variable]) === false)
							coercedValue = Number(fullEnv[variable]);
						else throw new Error('Should be a number.');
						break;

					case String:
						{
							const v = String(fullEnv[variable]);
							if (v.length > 0) coercedValue = v;
							else throw new Error('String should not be empty.');
						}
						break;

					default:
				}

			// MARK: Throws if missing
			if (
				Boolean(value.optional) === false &&
				coercedValue === null &&
				Boolean(value.fallback) === false
			)
				throw new Error(
					`Environment variable \`${variable}\` must be defined!`,
				);

			// MARK: Fallback
			if (coercedValue === null && value.fallback)
				coercedValue = value.fallback;

			return [variable, coercedValue];
		}),
	);

	return Object.freeze(resultingEnv as Readonly<VariablesResult>);
}
